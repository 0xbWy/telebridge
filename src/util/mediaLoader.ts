import type {
  ApiOnProgress,
  ApiParsedMedia,
  ApiPreparedMedia,
} from '../api/types';
import {
  ApiMediaFormat,
} from '../api/types';

import {
  DEBUG, MEDIA_CACHE_DISABLED, MEDIA_CACHE_NAME,
  MEDIA_CACHE_NAME_AVATARS,
} from '../config';
import { callApi, cancelApiProgress } from '../api/gramjs';
import {
  IS_OPUS_SUPPORTED, IS_PROGRESSIVE_SUPPORTED,
} from './browser/windowEnvironment';
import * as cacheApi from './cacheApi';
import { fetchBlob } from './files';
import { ACCOUNT_SLOT } from './multiaccount';
import { oggToWav } from './oggToWav';

const asCacheApiType = {
  [ApiMediaFormat.BlobUrl]: cacheApi.Type.Blob,
  [ApiMediaFormat.Text]: cacheApi.Type.Text,
  [ApiMediaFormat.DownloadUrl]: undefined,
  [ApiMediaFormat.Progressive]: undefined,
};

const PROGRESSIVE_URL_PREFIX = './progressive/';
const DOWNLOAD_URL_PREFIX = './download/';
const MAX_MEDIA_RETRIES = 5;

const memoryCache = new Map<string, ApiPreparedMedia>();
const fetchPromises = new Map<string, Promise<ApiPreparedMedia | undefined>>();
const progressCallbacks = new Map<string, Map<string, ApiOnProgress>>();
const cancellableCallbacks = new Map<string, ApiOnProgress>();

export function fetch<T extends ApiMediaFormat>(
  url: string,
  mediaFormat: T,
  isHtmlAllowed = false,
  onProgress?: ApiOnProgress,
  callbackUniqueId?: string,
): Promise<ApiPreparedMedia> {
  if (mediaFormat === ApiMediaFormat.Progressive) {
    return (
      IS_PROGRESSIVE_SUPPORTED
        ? Promise.resolve(getProgressiveUrl(url))
        : fetch(url, ApiMediaFormat.BlobUrl, isHtmlAllowed, onProgress, callbackUniqueId)
    );
  }

  if (mediaFormat === ApiMediaFormat.DownloadUrl) {
    return (
      IS_PROGRESSIVE_SUPPORTED
        ? Promise.resolve(getDownloadUrl(url))
        : fetch(url, ApiMediaFormat.BlobUrl, isHtmlAllowed, onProgress, callbackUniqueId)
    );
  }

  if (!fetchPromises.has(url)) {
    const promise = fetchFromCacheOrRemote(url, mediaFormat, isHtmlAllowed)
      .catch((err) => {
        if (DEBUG) {
          // eslint-disable-next-line no-console
          console.warn(err);
        }

        return undefined;
      })
      .finally(() => {
        fetchPromises.delete(url);
        progressCallbacks.delete(url);
        cancellableCallbacks.delete(url);
      });

    fetchPromises.set(url, promise);
  }

  if (onProgress && callbackUniqueId) {
    let activeCallbacks = progressCallbacks.get(url);
    if (!activeCallbacks) {
      activeCallbacks = new Map<string, ApiOnProgress>();
      progressCallbacks.set(url, activeCallbacks);
    }
    activeCallbacks.set(callbackUniqueId, onProgress);
  }

  return fetchPromises.get(url) as Promise<ApiPreparedMedia>;
}

export function getFromMemory(url: string) {
  return memoryCache.get(url) as ApiPreparedMedia;
}

export function cancelProgress(progressCallback: ApiOnProgress) {
  progressCallbacks.forEach((map, url) => {
    map.forEach((callback) => {
      if (callback === progressCallback) {
        const parentCallback = cancellableCallbacks.get(url);
        if (!parentCallback) return;

        cancelApiProgress(parentCallback);
        cancellableCallbacks.delete(url);
        progressCallbacks.delete(url);
        return;
      }
    });
  });
}

export function removeCallback(url: string, callbackUniqueId: string) {
  const callbacks = progressCallbacks.get(url);
  if (!callbacks) return;
  callbacks.delete(callbackUniqueId);
}

export function getProgressiveUrl(url: string) {
  const base = new URL(`${PROGRESSIVE_URL_PREFIX}${url}`, window.location.href);
  if (ACCOUNT_SLOT) base.searchParams.set('account', ACCOUNT_SLOT.toString());
  return base.href;
}

function getDownloadUrl(url: string) {
  const base = new URL(`${DOWNLOAD_URL_PREFIX}${url}`, window.location.href);
  if (ACCOUNT_SLOT) base.searchParams.set('account', ACCOUNT_SLOT.toString());
  return base.href;
}

async function fetchFromCacheOrRemote(
  url: string, mediaFormat: ApiMediaFormat, isHtmlAllowed: boolean, retryNumber = 0,
): Promise<string> {
  if (!MEDIA_CACHE_DISABLED) {
    const cacheName = url.startsWith('avatar') ? MEDIA_CACHE_NAME_AVATARS : MEDIA_CACHE_NAME;
    const cached = await cacheApi.fetch(cacheName, url, asCacheApiType[mediaFormat]!, isHtmlAllowed);

    if (cached) {
      let media = cached;

      if (cached.type === 'audio/ogg' && !IS_OPUS_SUPPORTED) {
        media = await oggToWav(media);
      }

      const prepared = prepareMedia(media);

      memoryCache.set(url, prepared);

      return prepared;
    }
  }

  const onProgress = makeOnProgress(url);
  cancellableCallbacks.set(url, onProgress);

  const remote = await callApi('downloadMedia', { url, mediaFormat, isHtmlAllowed }, onProgress);
  if (!remote) {
    if (retryNumber >= MAX_MEDIA_RETRIES) {
      throw new Error(`Failed to fetch media ${url}`);
    }
    await new Promise((resolve) => {
      setTimeout(resolve, getRetryTimeout(retryNumber));
    });
    // eslint-disable-next-line no-console
    if (DEBUG) console.debug(`Retrying to fetch media ${url}`);
    return fetchFromCacheOrRemote(url, mediaFormat, isHtmlAllowed, retryNumber + 1);
  }

  const { mimeType } = remote;
  let prepared = prepareMedia(remote.dataBlob);

  if (mimeType === 'audio/ogg' && !IS_OPUS_SUPPORTED) {
    const blob = await fetchBlob(prepared);
    URL.revokeObjectURL(prepared);
    const media = await oggToWav(blob);
    prepared = prepareMedia(media);
  }

  memoryCache.set(url, prepared);

  return prepared;
}

export async function unload(url: string) {
  memoryCache.delete(url);
  if (!MEDIA_CACHE_DISABLED) {
    const cacheName = url.startsWith('avatar') ? MEDIA_CACHE_NAME_AVATARS : MEDIA_CACHE_NAME;
    await cacheApi.remove(cacheName, url);
  }
}

function makeOnProgress(url: string) {
  const onProgress: ApiOnProgress = (progress: number) => {
    progressCallbacks.get(url)?.forEach((callback) => {
      callback(progress);
      if (callback.isCanceled) {
        onProgress.isCanceled = true;
        memoryCache.delete(url);
      }
    });
  };

  return onProgress;
}

function prepareMedia(mediaData: Exclude<ApiParsedMedia, ArrayBuffer>): ApiPreparedMedia {
  if (mediaData instanceof Blob) {
    return URL.createObjectURL(mediaData);
  }

  return mediaData;
}

if (IS_PROGRESSIVE_SUPPORTED) {
  navigator.serviceWorker.addEventListener('message', async (e) => {
    const { type, messageId, params } = e.data as {
      type: string;
      messageId: string;
      params: { url: string; start: number; end: number };
    };

    if (type !== 'requestPart') {
      return;
    }

    async function downloadWithRetry(retryNumber = 0) {
      const result = await callApi('downloadMedia', { mediaFormat: ApiMediaFormat.Progressive, ...params });
      if (!result) {
        if (retryNumber >= MAX_MEDIA_RETRIES) {
          if (DEBUG) {
            // eslint-disable-next-line no-console
            console.warn(`Failed to download media part after ${MAX_MEDIA_RETRIES} retries:`, params.url);
          }
          return undefined;
        }
        await new Promise((resolve) => {
          setTimeout(resolve, getRetryTimeout(retryNumber));
        });
        if (DEBUG) {
          // eslint-disable-next-line no-console
          console.debug(`Retrying to download media part ${params.url}, attempt ${retryNumber + 1}`);
        }
        return downloadWithRetry(retryNumber + 1);
      }
      return result;
    }

    const result = await downloadWithRetry();
    if (!result) {
      return;
    }

    const { arrayBuffer, mimeType, fullSize } = result;

    navigator.serviceWorker.controller!.postMessage({
      type: 'partResponse',
      messageId,
      result: {
        arrayBuffer,
        mimeType,
        fullSize,
      },
    }, [arrayBuffer!]);
  });
}

function getRetryTimeout(retryNumber: number) {
  // 250ms, 500ms, 1s, 2s, 4s
  return 250 * 2 ** retryNumber;
}

// ---------- TeleBridge Media Decryption ----------

/**
 * Fetch media and decrypt it if the chat has TeleBridge encryption.
 *
 * This wraps the standard fetch function with a decryption step.
 * After downloading, if the chat has a key and the data looks like
 * encrypted TeleBridge media (starts with 0x01 or 0x02 version byte),
 * it decrypts the data before returning it.
 *
 * V1 Bug #4 guard: Uses explicit chatId, NOT selectCurrentChat().
 *
 * @param url - Media URL to fetch
 * @param mediaFormat - Media format (BlobUrl, Text, etc.)
 * @param chatId - Explicit chat ID for key lookup
 * @param mediaId - Unique media file identifier for key derivation
 * @param isHtmlAllowed - Whether HTML is allowed
 * @param onProgress - Progress callback
 * @param callbackUniqueId - Unique callback ID
 * @returns Decrypted media URL, or original URL if not encrypted
 */
export async function fetchAndDecrypt(
  url: string,
  mediaFormat: ApiMediaFormat.BlobUrl,
  chatId: string,
  mediaId: string,
  isHtmlAllowed = false,
  onProgress?: ApiOnProgress,
  callbackUniqueId?: string,
): Promise<ApiPreparedMedia> {
  // First, fetch the media normally
  const result = await fetch(url, mediaFormat, isHtmlAllowed, onProgress, callbackUniqueId);

  if (!result) {
    return result;
  }

  // Try TeleBridge decryption if the chat has a key
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mediaPipe = require('../telebridge/mediaPipeline') as typeof import('../telebridge/mediaPipeline');

  if (!mediaPipe.shouldDecryptForChat(chatId)) {
    return result;
  }

  try {
    // The result is a blob URL — fetch the blob data to inspect
    // Use globalThis.fetch to avoid conflict with the local fetch() export
    const response = await globalThis.fetch(result);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    // Check if the data looks like encrypted TeleBridge media
    // Version byte 0x01 = single-piece, 0x02 = chunked
    if (data.length > 0 && (data[0] === 0x01 || data[0] === 0x02)) {
      const decryptedBlob = await mediaPipe.decryptDownloadedMedia(
        blob, chatId, mediaId,
      );

      if (decryptedBlob instanceof Blob) {
        // Create a new blob URL for the decrypted data
        URL.revokeObjectURL(result);
        return URL.createObjectURL(decryptedBlob);
      }
    }
  } catch {
    // Decryption failed — return original result
    // This can happen if the data is not actually TeleBridge encrypted
  }

  return result;
}
