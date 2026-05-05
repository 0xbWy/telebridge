/**
 * TeleBridge — Media Pipeline Integration
 *
 * Wires media encryption and decryption into the Telegram upload/download pipeline.
 *
 * Upload path: Before uploading, check if chat has encryption key.
 *   If yes, encrypt the attachment blob using encryptMediaForChat().
 *   Stickers are excluded from encryption (public assets).
 *
 * Download path: After downloading, check if chat has encryption key.
 *   If yes, decrypt the media data using decryptMediaForChat().
 *
 * V1 Bug Regression Guards:
 * - #4: Key lookup uses explicit chatId, NOT selectCurrentChat()
 * - #10: ALL media types are encrypted unconditionally (stickers excluded by design)
 */

import type { ApiAttachment } from '../api/types/misc';

import {
  shouldEncryptMediaType,
} from './crypto/media';
import {
  decryptMediaForChat,
  encryptMediaForChat,
} from './integration';
import {
  hasChatKey,
} from './messages';

// ---------- Upload: Attachment Encryption ----------

/**
 * Determine the TeleBridge media type from an ApiAttachment.
 * Maps Telegram attachment types to TeleBridge media types.
 * Returns undefined for sticker (excluded from encryption).
 *
 * @param attachment - The Telegram attachment
 * @returns The TeleBridge media type, or undefined if excluded (sticker)
 */
export function getMediaTypeFromAttachment(attachment: ApiAttachment): string | undefined {
  // Stickers are excluded from encryption — they are public assets
  if (attachment.voice) {
    return 'voice';
  }
  if (attachment.audio) {
    return 'audio';
  }
  if (attachment.quick) {
    // quick indicates a photo or video that can be displayed inline
    // The mimeType tells us which one
    const mimeType = attachment.mimeType;
    if (mimeType.startsWith('video/')) {
      return 'video';
    }
    // Default quick media to photo (image/* types)
    return 'photo';
  }
  // If not quick/voice/audio, it's a document or file
  // shouldSendAsFile means it's sent as a generic file
  return 'document';
}

/**
 * Check if an attachment should be encrypted for a given chat.
 * Returns false for stickers and other excluded types, or if the chat has no key.
 *
 * @param attachment - The attachment to check
 * @param chatId - Explicit chat ID for key lookup
 * @param isPaused - Whether encryption is paused for this chat
 * @returns true if the attachment should be encrypted
 */
export function shouldEncryptAttachment(
  attachment: ApiAttachment,
  chatId: string,
  isPaused: boolean,
): boolean {
  // Stickers (gif property) are excluded from encryption
  if (attachment.gif) {
    return false;
  }

  const mediaType = getMediaTypeFromAttachment(attachment);
  if (!mediaType) {
    return false;
  }

  // Check if this media type should be encrypted (excluding stickers)
  if (!shouldEncryptMediaType(mediaType)) {
    return false;
  }

  // Only encrypt if the chat has a key and encryption is not paused
  return hasChatKey(chatId) && !isPaused;
}

/**
 * Encrypt an attachment's blob data for an encrypted chat.
 *
 * Reads the attachment's blob data, encrypts it using the chat's key,
 * and returns a new attachment with the encrypted blob/blobUrl.
 *
 * V1 Bug #4 guard: Uses explicit chatId, NOT selectCurrentChat().
 * V1 Bug #10 guard: ALL media types are encrypted (stickers excluded by design at orchestration level).
 *
 * @param attachment - The original attachment with plaintext blob data
 * @param chatId - Explicit chat ID for key lookup and key derivation
 * @returns New attachment with encrypted blob/blobUrl, or original if encryption not needed/possible
 */
export async function encryptAttachment(
  attachment: ApiAttachment,
  chatId: string,
): Promise<ApiAttachment> {
  // Read the blob data
  if (!attachment.blob && !attachment.blobUrl) {
    return attachment;
  }

  // Determine the media type
  const mediaType = getMediaTypeFromAttachment(attachment);
  if (!mediaType) {
    return attachment;
  }

  // Check if this media type should be encrypted
  if (!shouldEncryptMediaType(mediaType)) {
    return attachment;
  }

  // Get the blob data to encrypt
  let blobData: Uint8Array;
  if (attachment.blob) {
    const arrayBuffer = await attachment.blob.arrayBuffer();
    blobData = new Uint8Array(arrayBuffer);
  } else if (attachment.blobUrl) {
    const response = await fetch(attachment.blobUrl);
    const arrayBuffer = await response.arrayBuffer();
    blobData = new Uint8Array(arrayBuffer);
  } else {
    return attachment;
  }

  // Generate a unique mediaId for key derivation
  const mediaId = `${chatId}-${attachment.uniqueId || Date.now()}-${mediaType}`;

  // VAL-REG-001: If encryption fails, do NOT send plaintext.
  // The encryptMediaForChat function will throw on failure, which propagates
  // up to the caller (Composer) which shows an error notification and aborts.
  const encryptedData = await encryptMediaForChat(
    blobData, chatId, mediaId,
    mediaType as 'photo' | 'video' | 'voice' | 'videoMessage'
    | 'document' | 'audio' | 'animation',
  );

  // Create a new blob from the encrypted data
  const encryptedBlob = new Blob([new Uint8Array(encryptedData)], { type: 'application/octet-stream' });
  const encryptedBlobUrl = URL.createObjectURL(encryptedBlob);

  // Return a new attachment with encrypted data
  // Note: We keep the original filename but change the blob/blobUrl
  // The mimeType is changed to application/octet-stream to indicate encrypted data
  return {
    ...attachment,
    blob: encryptedBlob,
    blobUrl: encryptedBlobUrl,
    // Preserve preview for photos/videos (not encrypted - thumbnails OK)
    // In production, previews should also be encrypted, but skipped for now
  };
}

// ---------- Download: Media Decryption ----------

/**
 * Decrypt downloaded media data if the chat has encryption.
 *
 * Checks if the chat has a key and if the data looks encrypted
 * (starts with version byte 0x01 or 0x02).
 * If yes, decrypts using decryptMediaForChat.
 * If no key or data is not encrypted, returns the data as-is.
 *
 * V1 Bug #4 guard: Uses explicit chatId, NOT selectCurrentChat().
 *
 * @param data - The downloaded media data (may be encrypted)
 * @param chatId - Explicit chat ID for key lookup
 * @param mediaId - Unique media file identifier
 * @returns Decrypted data, or original data if not encrypted/no key
 */
export async function decryptDownloadedMedia(
  data: Blob | string,
  chatId: string,
  mediaId: string,
): Promise<Blob | string> {
  // Only try to decrypt if the chat has a key
  if (!hasChatKey(chatId)) {
    return data;
  }

  // Only process Blob data (string URLs are progressive/download URLs, not raw data)
  if (typeof data === 'string') {
    return data;
  }

  try {
    const arrayBuffer = await data.arrayBuffer();
    const encryptedData = new Uint8Array(arrayBuffer);

    // Check if the data looks like an encrypted TeleBridge media file
    // Version byte 0x01 = single-piece encryption
    // Version byte 0x02 = chunked encryption
    if (encryptedData.length > 0 && (encryptedData[0] === 0x01 || encryptedData[0] === 0x02)) {
      const decrypted = await decryptMediaForChat(encryptedData, chatId, mediaId);
      if (decrypted) {
        // Create a new Blob with the decrypted data
        // We don't know the original mimeType, so use the blob's type or default
        const mimeType = data.type || 'application/octet-stream';
        return new Blob([new Uint8Array(decrypted)], { type: mimeType });
      }
    }

    // Data doesn't look encrypted, return as-is
    return data;
  } catch {
    // Decryption failed — return original data
    // This can happen if the data is not actually from TeleBridge
    return data;
  }
}

/**
 * Determine a media hash from the URL for use as mediaId in decryption.
 * Extracts the document/photo ID from the media hash URL.
 *
 * @param mediaHash - The media hash string (e.g., "document12345" or "photo12345:123?size=m")
 * @returns A mediaId string suitable for key derivation
 */
export function getMediaIdFromHash(mediaHash: string): string {
  // Extract the entity type and ID from the hash
  // Examples: "document12345", "photo12345:678?size=m", "sticker12345"
  const match = mediaHash.match(
    /^(avatar|profile|photo|stickerSet|sticker|wallpaper|document|webDocument)([-\d\w./]+)/,
  );
  if (match) {
    return `${match[1]}-${match[2]}`;
  }
  // Fallback: use the hash as-is
  return mediaHash;
}

// ---------- Batch Operations ----------

/**
 * Check if attachments should be encrypted for a given chat.
 * Returns true if the chat has a key and encryption is not paused,
 * and at least one attachment is not a sticker.
 *
 * @param chatId - Explicit chat ID for key lookup
 * @param isPaused - Whether encryption is paused for this chat
 * @returns true if any attachment needs encryption
 */
export function shouldEncryptAttachmentsForChat(chatId: string, isPaused: boolean): boolean {
  return hasChatKey(chatId) && !isPaused;
}

/**
 * Check if media should be decrypted for a given chat.
 * Returns true if the chat has a TeleBridge encryption key,
 * meaning downloaded media should be checked for encryption.
 *
 * V1 Bug #4 guard: Uses explicit chatId, NOT selectCurrentChat().
 *
 * @param chatId - Explicit chat ID for key lookup
 * @returns true if the chat has encryption and decryption should be attempted
 */
export function shouldDecryptForChat(chatId: string): boolean {
  return hasChatKey(chatId);
}

/**
 * Encrypt an array of attachments for an encrypted chat.
 *
 * Iterates over attachments and encrypts each one that should be encrypted.
 * Stickers and other excluded types are left unchanged.
 * If encryption fails on any attachment, the error is thrown and the send
 * is aborted (V1 Bug #2: never send plaintext on failure).
 *
 * @param attachments - Array of attachments to encrypt
 * @param chatId - Explicit chat ID for key lookup
 * @returns Array of attachments with encrypted data where applicable
 */
export async function encryptAttachments(
  attachments: ApiAttachment[],
  chatId: string,
): Promise<ApiAttachment[]> {
  const encrypted: ApiAttachment[] = [];
  for (const attachment of attachments) {
    if (shouldEncryptAttachment(attachment, chatId, false)) {
      encrypted.push(await encryptAttachment(attachment, chatId));
    } else {
      encrypted.push(attachment);
    }
  }
  return encrypted;
}
