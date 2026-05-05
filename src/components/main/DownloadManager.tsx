import { memo, useEffect } from '../../lib/teact/teact';
import { getActions, getGlobal, withGlobal } from '../../global';

import type { TabState } from '../../global/types';
import { ApiMediaFormat } from '../../api/types';

import { selectTabState } from '../../global/selectors';
import { IS_OPFS_SUPPORTED, IS_SERVICE_WORKER_SUPPORTED, MAX_BUFFER_SIZE } from '../../util/browser/windowEnvironment';
import download from '../../util/download';
import generateUniqueId from '../../util/generateUniqueId';
import * as mediaLoader from '../../util/mediaLoader';

import useLastCallback from '../../hooks/useLastCallback';
import useRunDebounced from '../../hooks/useRunDebounced';

type StateProps = {
  activeDownloads: TabState['activeDownloads'];
};

const GLOBAL_UPDATE_DEBOUNCE = 1000;

const processedHashes = new Set<string>();
const downloadedHashes = new Set<string>();

const DownloadManager = ({
  activeDownloads,
}: StateProps) => {
  const { cancelMediaHashDownloads, showNotification } = getActions();

  const runDebounced = useRunDebounced(GLOBAL_UPDATE_DEBOUNCE, true);

  const handleMediaDownloaded = useLastCallback((hash: string) => {
    downloadedHashes.add(hash);
    runDebounced(() => {
      if (downloadedHashes.size) {
        cancelMediaHashDownloads({ mediaHashes: Array.from(downloadedHashes) });
        downloadedHashes.clear();
      }
    });
  });

  /**
   * Decrypt downloaded media if the chat has TeleBridge encryption.
   *
   * V1 Bug #4 guard: Uses explicit originChatId from download metadata,
   * NOT selectCurrentChat().
   */
  const decryptMediaIfNeeded = useLastCallback(async (
    result: string, mediaHash: string, metadata: { originChatId?: string; filename: string },
  ): Promise<string> => {
    const { originChatId } = metadata;
    if (!originChatId) {
      return result;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mediaPipe = require('../../telebridge/mediaPipeline') as typeof import('../../telebridge/mediaPipeline');

      if (!mediaPipe.shouldDecryptForChat(originChatId)) {
        return result;
      }

      // Fetch the blob data from the blob URL
      const response = await fetch(result);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      // Check if the data looks like encrypted TeleBridge media (version byte 0x01 or 0x02)
      if (data.length > 0 && (data[0] === 0x01 || data[0] === 0x02)) {
        const mediaId = mediaPipe.getMediaIdFromHash(mediaHash);
        const decryptedBlob = await mediaPipe.decryptDownloadedMedia(blob, originChatId, mediaId);

        if (decryptedBlob instanceof Blob && decryptedBlob !== blob) {
          URL.revokeObjectURL(result);
          return URL.createObjectURL(decryptedBlob);
        }
      }
    } catch {
      // Decryption failed — return original result
    }

    return result;
  });

  useEffect(() => {
    if (!Object.keys(activeDownloads).length) {
      processedHashes.clear();
      return;
    }

    Object.entries(activeDownloads).forEach(([mediaHash, metadata]) => {
      if (processedHashes.has(mediaHash)) {
        return;
      }
      processedHashes.add(mediaHash);

      const { size, filename, format: mediaFormat } = metadata;

      const mediaData = mediaLoader.getFromMemory(mediaHash);

      if (mediaData) {
        download(mediaData, filename);
        handleMediaDownloaded(mediaHash);
        return;
      }

      if (size > MAX_BUFFER_SIZE && !IS_OPFS_SUPPORTED && !IS_SERVICE_WORKER_SUPPORTED) {
        showNotification({
          message: 'Downloading files bigger than 2GB is not supported in your browser.',
        });
        handleMediaDownloaded(mediaHash);
        return;
      }

      const handleProgress = () => {
        const currentDownloads = selectTabState(getGlobal()).activeDownloads;
        if (!currentDownloads[mediaHash]) {
          mediaLoader.cancelProgress(handleProgress);
        }
      };

      mediaLoader.fetch(mediaHash, mediaFormat, true, handleProgress, generateUniqueId()).then(async (result) => {
        if (mediaFormat === ApiMediaFormat.DownloadUrl) {
          const url = new URL(result, window.document.baseURI);
          url.searchParams.set('filename', encodeURIComponent(filename));
          const downloadWindow = window.open(url.toString());
          // eslint-disable-next-line @eslint-react/web-api/no-leaked-event-listener
          downloadWindow?.addEventListener('beforeunload', () => {
            showNotification({
              message: 'Download started. Please, do not close the app before it is finished.',
            });
          }, { once: true });
        } else if (result) {
          // Try TeleBridge decryption if the chat has encryption
          const decryptedResult = await decryptMediaIfNeeded(result, mediaHash, metadata);
          download(decryptedResult, filename);
        }

        handleMediaDownloaded(mediaHash);
      });
    });
  }, [activeDownloads]);

  return undefined;
};

export default memo(withGlobal(
  (global): Complete<StateProps> => {
    const activeDownloads = selectTabState(global).activeDownloads;

    return {
      activeDownloads,
    };
  },
)(DownloadManager));
