/**
 * TeleBridge — Symmetric Encryption (Layer 3)
 * AES-256-GCM with mandatory 16-byte auth tags, 12-byte random nonce,
 * HKDF-SHA256 ratcheting for per-message keys, key rotation,
 * and out-of-order message decryption support.
 *
 * V1 Bug Regression Guards:
 * - #1: Auth tags mandatory, never discarded
 * - #7: GCM finalization always called (Web Crypto guarantees this)
 * - #3: Single consistent HKDF-SHA256 key derivation path
 */
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';

// ---------- Constants ----------

/** AES-256 key length in bytes. */
export const KEY_LENGTH = 32;

/** GCM nonce (IV) length: 12 bytes (96 bits) — standard for GCM. */
export const NONCE_LENGTH = 12;

/** GCM authentication tag length: 16 bytes (128 bits) — MANDATORY. */
export const TAG_LENGTH = 16;

/** Key ID length: 4 bytes. */
export const KEY_ID_LENGTH = 4;

/** HKDF info string for the ratchet message key derivation. */
const RATCHET_INFO = new TextEncoder().encode('TeleBridge-Ratchet-v1');

/** HKDF info string for the ratchet chain key derivation. */
const CHAIN_KEY_INFO = new TextEncoder().encode('TeleBridge-ChainKey-v1');

/** Default message count threshold for key rotation. */
export const DEFAULT_ROTATE_AFTER_MESSAGES = 100;

/** Default time threshold for key rotation (7 days in ms). */
export const DEFAULT_ROTATE_AFTER_TIME_MS = 7 * 24 * 60 * 60 * 1000;

/** Grace period for retaining old keys after rotation (5 minutes in ms). */
export const KEY_RETENTION_MS = 5 * 60 * 1000;

// ---------- Utility ----------

function isUint8Array(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array
    || (ArrayBuffer.isView(value) && (value as Uint8Array).constructor?.name === 'Uint8Array');
}

function concat(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function encodeCounterBE(counter: number): Uint8Array {
  const buf = new Uint8Array(4);
  buf[0] = (counter >>> 24) & 0xFF;
  buf[1] = (counter >>> 16) & 0xFF;
  buf[2] = (counter >>> 8) & 0xFF;
  buf[3] = counter & 0xFF;
  return buf;
}

// ---------- AES-256-GCM Encryption/Decryption (Web Crypto) ----------

async function importAesKey(keyBytes: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt'],
  );
}

/**
 * Encrypt plaintext with AES-256-GCM.
 * Returns nonce, ciphertext, and mandatory 16-byte auth tag separately.
 * The auth tag is NEVER discarded — guards V1 Bug #1.
 *
 * @param plaintext - Data to encrypt
 * @param key - 32-byte AES-256 key
 * @param aad - Optional additional authenticated data
 * @returns nonce (12B), ciphertext, authTag (16B)
 */
export async function encryptSymmetric(
  plaintext: Uint8Array,
  key: Uint8Array,
  aad?: Uint8Array,
): Promise<{ nonce: Uint8Array; ciphertext: Uint8Array; authTag: Uint8Array }> {
  if (!isUint8Array(plaintext)) {
    throw new Error('Plaintext must be a Uint8Array');
  }
  if (!isUint8Array(key)) {
    throw new Error('Key must be a Uint8Array');
  }
  if (key.length !== KEY_LENGTH) {
    throw new Error(`Key must be ${KEY_LENGTH} bytes, got ${key.length}`);
  }

  // Generate random 12-byte nonce — guarantees unique IV per encryption
  const nonce = new Uint8Array(NONCE_LENGTH);
  crypto.getRandomValues(nonce);

  const cryptoKey = await importAesKey(key);

  const algorithm: AesGcmParams = {
    name: 'AES-GCM',
    iv: nonce,
    tagLength: TAG_LENGTH * 8, // 128 bits — MANDATORY
  };

  if (aad) {
    algorithm.additionalData = aad;
  }

  const encrypted = await crypto.subtle.encrypt(algorithm, cryptoKey, plaintext);
  // Web Crypto returns ciphertext || authTag concatenated
  const encryptedArray = new Uint8Array(encrypted);
  const ciphertext = encryptedArray.slice(0, encryptedArray.length - TAG_LENGTH);
  const authTag = encryptedArray.slice(encryptedArray.length - TAG_LENGTH);

  return { nonce, ciphertext, authTag };
}

/**
 * Decrypt ciphertext with AES-256-GCM.
 * GCM finalization (auth tag verification) is ALWAYS performed —
 * Web Crypto API guarantees decipher.final() is called internally.
 * Guards V1 Bug #7.
 *
 * @param nonce - 12-byte nonce
 * @param ciphertext - Encrypted data
 * @param authTag - 16-byte authentication tag (MANDATORY)
 * @param key - 32-byte AES-256 key
 * @param aad - Optional additional authenticated data
 * @returns Decrypted plaintext
 * @throws Error on auth tag mismatch, wrong key, or tampered ciphertext
 */
export async function decryptSymmetric(
  nonce: Uint8Array,
  ciphertext: Uint8Array,
  authTag: Uint8Array,
  key: Uint8Array,
  aad?: Uint8Array,
): Promise<Uint8Array> {
  if (!isUint8Array(nonce) || nonce.length !== NONCE_LENGTH) {
    throw new Error(`Nonce must be ${NONCE_LENGTH} bytes`);
  }
  if (!isUint8Array(ciphertext)) {
    throw new Error('Ciphertext must be a Uint8Array');
  }
  if (!isUint8Array(authTag) || authTag.length !== TAG_LENGTH) {
    throw new Error(`Auth tag must be ${TAG_LENGTH} bytes`);
  }
  if (!isUint8Array(key) || key.length !== KEY_LENGTH) {
    throw new Error(`Key must be ${KEY_LENGTH} bytes`);
  }

  // Web Crypto expects ciphertext + authTag concatenated
  const combined = new Uint8Array(ciphertext.length + authTag.length);
  combined.set(ciphertext);
  combined.set(authTag, ciphertext.length);

  const cryptoKey = await importAesKey(key);

  const algorithm: AesGcmParams = {
    name: 'AES-GCM',
    iv: nonce,
    tagLength: TAG_LENGTH * 8, // 128 bits
  };

  if (aad) {
    algorithm.additionalData = aad;
  }

  // This ALWAYS verifies the auth tag (GCM finalization).
  // If the tag is invalid, throws DOMException with name "OperationError".
  // Guards V1 Bug #7: decipher.final() is always called.
  const decrypted = await crypto.subtle.decrypt(algorithm, cryptoKey, combined);
  return new Uint8Array(decrypted);
}

// ---------- HKDF-SHA256 Ratchet ----------

/**
 * Derive a per-message key from the chain key and message counter.
 * Each message uses a unique key derived via HKDF-SHA256.
 * This provides forward secrecy: compromising one message key doesn't
 * reveal past or future message keys.
 *
 * The chain key is advanced per message:
 *   newChainKey = HKDF(chainKey, counterBytes, CHAIN_KEY_INFO || counterBytes)
 *   messageKey = HKDF(chainKey, counterBytes, RATCHET_INFO || counterBytes)
 *
 * Note: We derive both the message key and the new chain key from the
 * CURRENT chain key before advancing. This provides forward secrecy
 * because knowing messageKey(N) doesn't let you compute chainKey(N-1).
 *
 * @param chainKey - Current 32-byte chain key
 * @param counter - Message counter (monotonically increasing)
 * @returns messageKey (32B) and next chain key (32B)
 */
export function ratchetChainKey(
  chainKey: Uint8Array,
  counter: number,
): { messageKey: Uint8Array; nextChainKey: Uint8Array } {
  if (!isUint8Array(chainKey)) {
    throw new Error('Chain key must be a Uint8Array');
  }
  if (chainKey.length !== KEY_LENGTH) {
    throw new Error(`Chain key must be ${KEY_LENGTH} bytes, got ${chainKey.length}`);
  }
  if (counter < 0) {
    throw new Error('Counter must be non-negative');
  }

  const counterBytes = encodeCounterBE(counter);

  // Build HKDF info: RATCHET_INFO || counterBytes (4 bytes)
  const ratchetInfo = new Uint8Array(RATCHET_INFO.length + 4);
  ratchetInfo.set(RATCHET_INFO);
  ratchetInfo.set(counterBytes, RATCHET_INFO.length);

  // Build HKDF info: CHAIN_KEY_INFO || counterBytes (4 bytes)
  const chainInfo = new Uint8Array(CHAIN_KEY_INFO.length + 4);
  chainInfo.set(CHAIN_KEY_INFO);
  chainInfo.set(counterBytes, CHAIN_KEY_INFO.length);

  // Derive message key from current chain key
  const messageKey = new Uint8Array(hkdf(sha256, chainKey, counterBytes, ratchetInfo, KEY_LENGTH));

  // Advance chain key for next message
  const nextChainKey = new Uint8Array(hkdf(sha256, chainKey, counterBytes, chainInfo, KEY_LENGTH));

  return { messageKey, nextChainKey };
}

/**
 * Derive a message key from a chain key at a specific counter position
 * WITHOUT advancing the chain key. Used for out-of-order message decryption.
 *
 * @param chainKey - The 32-byte chain key
 * @param counter - The message counter
 * @returns 32-byte message key
 */
export function deriveMessageKeyAtCounter(
  chainKey: Uint8Array,
  counter: number,
): Uint8Array {
  if (!isUint8Array(chainKey)) {
    throw new Error('Chain key must be a Uint8Array');
  }
  if (chainKey.length !== KEY_LENGTH) {
    throw new Error(`Chain key must be ${KEY_LENGTH} bytes, got ${chainKey.length}`);
  }
  if (counter < 0) {
    throw new Error('Counter must be non-negative');
  }

  const counterBytes = encodeCounterBE(counter);
  const ratchetInfo = new Uint8Array(RATCHET_INFO.length + 4);
  ratchetInfo.set(RATCHET_INFO);
  ratchetInfo.set(counterBytes, RATCHET_INFO.length);

  return new Uint8Array(hkdf(sha256, chainKey, counterBytes, ratchetInfo, KEY_LENGTH));
}

// ---------- Key ID Utilities ----------

/**
 * Generate a random 32-byte chat key and its 4-byte key ID.
 */
export function generateChatKey(): { key: Uint8Array; keyId: string } {
  const key = new Uint8Array(KEY_LENGTH);
  crypto.getRandomValues(key);
  const keyId = bytesToHex(key.slice(0, KEY_ID_LENGTH));
  return { key, keyId };
}

/**
 * Generate a key ID (hex of first 4 bytes) from a 32-byte key.
 */
export function keyIdFromKey(key: Uint8Array): string {
  if (!isUint8Array(key) || key.length !== KEY_LENGTH) {
    throw new Error(`Key must be ${KEY_LENGTH} bytes`);
  }
  return bytesToHex(key.slice(0, KEY_ID_LENGTH));
}

/**
 * Encode a key ID string (8 hex chars) as 4 bytes.
 */
export function keyIdToBytes(keyId: string): Uint8Array {
  if (keyId.length !== KEY_ID_LENGTH * 2) {
    throw new Error(`Key ID must be ${KEY_ID_LENGTH * 2} hex chars, got ${keyId.length}`);
  }
  const bytes = new Uint8Array(KEY_ID_LENGTH);
  for (let i = 0; i < KEY_ID_LENGTH; i++) {
    bytes[i] = parseInt(keyId.substr(i * 2, 2), 16);
  }
  return bytes;
}

// ---------- Ratchet State Manager ----------

/**
 * Manages the HKDF ratchet state for a single chat.
 * Handles chain key advancement, out-of-order message decryption,
 * and key rotation.
 *
 * The ratchet stores both the *root* chain key (original, for re-derivation)
 * and the *current* chain key (advanced with each message) to support
 * out-of-order decryption and previous key lookup during rotation.
 */
export class RatchetState {
  /** Root chain key (32 bytes) — the original chain key before any messages.
   *  Used to re-derive message keys at arbitrary counters. */
  private rootChainKey: Uint8Array;
  /** Current chain key (32 bytes) — advanced per message. */
  private chainKey: Uint8Array;
  /** Key ID identifying this chat key. */
  private keyId: string;
  /** Current send counter (monotonically increasing). */
  private sendCounter: number;
  /** Highest received and processed counter. */
  private receiveCounter: number;
  /** Cached message keys for out-of-order decryption. */
  private messageKeyCache: Map<number, Uint8Array> = new Map();
  /** When this key was established (timestamp). */
  private establishedAt: number;
  /** Message count threshold for rotation. */
  private rotateAfterMessages: number;
  /** Time threshold for rotation (ms). */
  private rotateAfterTimeMs: number;
  /** Previous keys retained during rotation grace period. */
  private previousKeys: Array<{
    keyId: string;
    rootChainKey: Uint8Array;
    expiredAt: number;
  }> = [];

  constructor(
    chainKey: Uint8Array,
    keyId: string,
    rotateAfterMessages: number = DEFAULT_ROTATE_AFTER_MESSAGES,
    rotateAfterTimeMs: number = DEFAULT_ROTATE_AFTER_TIME_MS,
  ) {
    if (!isUint8Array(chainKey) || chainKey.length !== KEY_LENGTH) {
      throw new Error(`Chain key must be ${KEY_LENGTH} bytes`);
    }
    this.rootChainKey = new Uint8Array(chainKey);
    this.chainKey = new Uint8Array(chainKey);
    this.keyId = keyId;
    this.sendCounter = 0;
    this.receiveCounter = 0;
    this.establishedAt = Date.now();
    this.rotateAfterMessages = rotateAfterMessages;
    this.rotateAfterTimeMs = rotateAfterTimeMs;
  }

  /** Get the current key ID. */
  get currentKeyId(): string {
    return this.keyId;
  }

  /** Get the current send counter. */
  get currentSendCounter(): number {
    return this.sendCounter;
  }

  /** Get the current receive counter (highest processed). */
  get currentReceiveCounter(): number {
    return this.receiveCounter;
  }

  /** Get the message count since this key was established. */
  get messageCount(): number {
    return this.sendCounter + this.receiveCounter;
  }

  /** Get the timestamp when this key was established. */
  get established(): number {
    return this.establishedAt;
  }

  /**
   * Derive the next message key for sending.
   * Advances the chain key and send counter.
   * Returns the message key and key ID to include in the encrypted message.
   */
  nextSendKey(): { messageKey: Uint8Array; keyId: string; counter: number } {
    const counter = this.sendCounter;
    const { messageKey, nextChainKey } = ratchetChainKey(this.chainKey, counter);

    // Overwrite old chain key (forward secrecy: old key not reusable)
    this.chainKey = nextChainKey;
    this.sendCounter = counter + 1;

    return { messageKey, keyId: this.keyId, counter };
  }

  /**
   * Derive the message key for receiving a message at a given counter.
   * Handles out-of-order messages by deriving from the root chain key.
   */
  nextReceiveKey(counter: number): { messageKey: Uint8Array; keyId: string } {
    // Check if we have a cached key for this counter (out-of-order)
    const cached = this.messageKeyCache.get(counter);
    if (cached) {
      return { messageKey: cached, keyId: this.keyId };
    }

    // Derive the message key from the root chain key at this counter.
    // We walk the ratchet from the root to the desired counter,
    // caching intermediate message keys for potential out-of-order use.
    let currentChainKey = this.rootChainKey;
    const maxCounter = Math.max(counter + 1, this.receiveCounter);

    for (let i = 0; i <= maxCounter; i++) {
      const { messageKey, nextChainKey } = ratchetChainKey(currentChainKey, i);

      if (!this.messageKeyCache.has(i)) {
        this.messageKeyCache.set(i, messageKey);
      }

      if (i === counter) {
        // Update the receive counter if we've advanced past it
        if (counter + 1 > this.receiveCounter) {
          this.receiveCounter = counter + 1;
        }

        // Clean up old cached keys beyond the window
        for (const [cachedCounter] of this.messageKeyCache) {
          if (cachedCounter < Math.max(0, this.receiveCounter - 10)) {
            this.messageKeyCache.delete(cachedCounter);
          }
        }

        return { messageKey, keyId: this.keyId };
      }

      currentChainKey = nextChainKey;
    }

    // Should never reach here
    throw new Error(`Failed to derive message key for counter ${counter}`);
  }

  /**
   * Check whether the chat key should be rotated based on usage.
   * Returns true if the key has exceeded message count or time thresholds.
   */
  shouldRotate(): boolean {
    if (this.sendCounter + this.receiveCounter >= this.rotateAfterMessages) return true;
    if (Date.now() - this.establishedAt >= this.rotateAfterTimeMs) return true;
    return false;
  }

  /**
   * Rotate to a new key. The old key is retained briefly for
   * decrypting in-transit messages during the grace period.
   *
   * @param newChainKey - New 32-byte chain key
   * @param newKeyId - New key ID
   */
  rotateKey(newChainKey: Uint8Array, newKeyId: string): void {
    // Retain the current root chain key for the grace period
    this.previousKeys.push({
      keyId: this.keyId,
      rootChainKey: new Uint8Array(this.rootChainKey),
      expiredAt: Date.now() + KEY_RETENTION_MS,
    });

    // Clean up expired previous keys
    const now = Date.now();
    this.previousKeys = this.previousKeys.filter((pk) => pk.expiredAt > now);

    // Set up new key
    this.rootChainKey = new Uint8Array(newChainKey);
    this.chainKey = new Uint8Array(newChainKey);
    this.keyId = newKeyId;
    this.sendCounter = 0;
    this.receiveCounter = 0;
    this.establishedAt = now;
    this.messageKeyCache = new Map();
  }

  /**
   * Try to decrypt a message using a previous key during the rotation grace period.
   * Walks the ratchet from the root chain key to derive the message key at the
   * given counter position.
   * Returns the message key if found, or undefined if no matching previous key exists.
   */
  getPreviousKeyMessageKey(keyId: string, counter: number): Uint8Array | undefined {
    for (const prev of this.previousKeys) {
      if (prev.keyId === keyId) {
        try {
          // Walk the ratchet from the root chain key to derive the message key
          let currentChainKey = prev.rootChainKey;
          for (let i = 0; i < counter; i++) {
            const { nextChainKey } = ratchetChainKey(currentChainKey, i);
            currentChainKey = nextChainKey;
          }
          // At counter position, derive the message key
          const { messageKey } = ratchetChainKey(currentChainKey, counter);
          return messageKey;
        } catch {
          return undefined;
        }
      }
    }
    return undefined;
  }

  /**
   * Get the list of previous key IDs still in the grace period.
   */
  getPreviousKeyIds(): string[] {
    const now = Date.now();
    return this.previousKeys
      .filter((pk) => pk.expiredAt > now)
      .map((pk) => pk.keyId);
  }
}

// ---------- Key Rotation Check ----------

/**
 * Check whether a chat key should be rotated based on message count
 * and time thresholds.
 */
export function shouldRotateKey(
  messageCount: number,
  established: number,
  rotateAfter: number = DEFAULT_ROTATE_AFTER_MESSAGES,
  rotateAfterTime: number = DEFAULT_ROTATE_AFTER_TIME_MS,
): boolean {
  if (messageCount >= rotateAfter) return true;
  if (Date.now() - established >= rotateAfterTime) return true;
  return false;
}

// ---------- File Encryption ----------

/**
 * Encrypt a file/buffer with a dedicated key.
 * Format: [version (1B)] [nonce (12B)] [ciphertext (var)] [authTag (16B)]
 */
export async function encryptFile(
  fileData: Uint8Array,
  key: Uint8Array,
): Promise<Uint8Array> {
  const version = new Uint8Array([0x01]);
  const { nonce, ciphertext, authTag } = await encryptSymmetric(fileData, key);

  // Format: [version (1B)] [nonce (12B)] [ciphertext (var)] [authTag (16B)]
  return concat(version, nonce, ciphertext, authTag);
}

/**
 * Decrypt a file/buffer encrypted with the above format.
 * Returns undefined if the data is invalid or decryption fails.
 */
export async function decryptFile(
  encryptedData: Uint8Array,
  key: Uint8Array,
): Promise<Uint8Array | undefined> {
  if (encryptedData.length < 1 + NONCE_LENGTH + TAG_LENGTH) {
    return undefined;
  }

  const version = encryptedData[0];
  if (version !== 0x01) {
    return undefined;
  }

  const nonce = encryptedData.slice(1, 1 + NONCE_LENGTH);
  const ciphertext = encryptedData.slice(1 + NONCE_LENGTH, encryptedData.length - TAG_LENGTH);
  const authTag = encryptedData.slice(encryptedData.length - TAG_LENGTH);

  try {
    return await decryptSymmetric(nonce, ciphertext, authTag, key);
  } catch {
    return undefined;
  }
}

// ---------- HKDF-SHA256 Test Vector Helper ----------

/**
 * Direct HKDF-SHA256 derivation for test vector verification.
 * This is the same HKDF used throughout — no alternative KDF path.
 */
export function hkdfSha256(
  ikm: Uint8Array,
  salt: Uint8Array,
  info: Uint8Array,
  length: number,
): Uint8Array {
  return new Uint8Array(hkdf(sha256, ikm, salt, info, length));
}
