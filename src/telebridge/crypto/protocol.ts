/**
 * TeleBridge — Protocol Wire Format
 *
 * Encoding and decoding TeleBridge protocol messages.
 *
 * Format: tb<version>.<mode>.<base64_payload>
 *   Modes:
 *     s  = Layer 3 symmetric encrypted message
 *     a  = Layer 4 asymmetric secured message
 *     kx = Layer 2 key exchange handshake
 *     pk = Layer 1 prekey publication
 *
 * V1 Bug Regression Guards:
 * - No conditional format switching — single consistent wire format
 * - Size budget validation before encoding — no oversized protocol messages
 */

// ---------- Constants ----------

/** Current protocol version. */
export const PROTOCOL_VERSION = 1;

/** Protocol prefix for all TeleBridge messages. */
export const PROTOCOL_PREFIX = 'tb';

/** Valid message modes. */
export type ProtocolMode = 's' | 'a' | 'g' | 'sk' | 'kx' | 'pk';

/** Set of valid modes for fast lookup. */
const VALID_MODES = new Set<string>(['s', 'a', 'g', 'sk', 'kx', 'pk']);

/**
 * Maximum Telegram message length in characters.
 * Telegram allows 4096 characters per message.
 */
export const TELEGRAM_MAX_MESSAGE_LENGTH = 4096;

/**
 * Usable payload size in bytes after accounting for protocol overhead.
 *
 * Overhead: "tb1." (4 chars) + mode (1-2 chars) + "." (1 char) = 6-7 chars
 * Base64 expansion: 4/3 ratio
 * Available for base64: 4096 - 7 = 4089 chars
 * Available for binary payload: floor(4089 * 3 / 4) = 3066 bytes
 *
 * We use a conservative estimate of 2900 bytes to leave room for protocol
 * version changes and future extensions.
 */
export const MAX_PLAINTEXT_BYTES = 2900;

/**
 * Minimum binary payload size after base64 decoding.
 * Any message smaller than this is likely malformed.
 */
export const MIN_PAYLOAD_BYTES = 1;

/** Check if value is a Uint8Array-like typed array (handles cross-realm instances). */
function isUint8Array(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array
    || (ArrayBuffer.isView(value) && (value as Uint8Array).constructor?.name === 'Uint8Array');
}

// ---------- Encoding ----------

/**
 * Encode a binary payload into a TeleBridge protocol message string.
 *
 * Format: tb<version>.<mode>.<base64_payload>
 * Example: tb1.s.AQIDBA==
 * Example: tb1.kx.Base64Data...
 *
 * @param mode - Message mode ('s', 'a', 'kx', 'pk')
 * @param payload - Binary payload to encode
 * @param version - Protocol version (default: 1)
 * @returns Protocol-encoded string
 * @throws Error if mode is invalid or payload exceeds size budget
 */
export function encodeProtocol(
  mode: ProtocolMode,
  payload: Uint8Array,
  version: number = PROTOCOL_VERSION,
): string {
  // Validate mode
  if (!VALID_MODES.has(mode)) {
    throw new Error(`Invalid protocol mode: "${mode}". Must be one of: s, a, g, sk, kx, pk`);
  }

  // Validate version
  if (!Number.isInteger(version) || version < 1 || version > 99) {
    throw new Error(`Invalid protocol version: ${version}. Must be integer 1-99.`);
  }

  // Validate payload
  if (!isUint8Array(payload)) {
    throw new Error('Payload must be a Uint8Array');
  }

  if (payload.length < MIN_PAYLOAD_BYTES) {
    throw new Error(`Payload must be at least ${MIN_PAYLOAD_BYTES} bytes`);
  }

  // Check size budget: plaintext must fit within the Telegram message limit
  // after base64 encoding and protocol overhead
  const base64 = uint8ArrayToBase64(payload);
  const encoded = `${PROTOCOL_PREFIX}${version}.${mode}.${base64}`;

  if (encoded.length > TELEGRAM_MAX_MESSAGE_LENGTH) {
    throw new Error(
      `Encoded message exceeds Telegram limit of ${TELEGRAM_MAX_MESSAGE_LENGTH} chars. `
      + `Encoded length: ${encoded.length} chars. `
      + `Payload: ${payload.length} bytes. `
      + `For large payloads, use chunked media encryption instead.`,
    );
  }

  return encoded;
}

/**
 * Encode a text message (string) as a protocol message.
 * UTF-8 encodes the text, then wraps it in the protocol format.
 *
 * @param mode - Message mode
 * @param text - Text to encode
 * @param version - Protocol version (default: 1)
 * @returns Protocol-encoded string
 * @throws Error if text exceeds size budget
 */
export function encodeProtocolText(
  mode: ProtocolMode,
  text: string,
  version: number = PROTOCOL_VERSION,
): string {
  const payload = new TextEncoder().encode(text);

  if (payload.length > MAX_PLAINTEXT_BYTES) {
    throw new Error(
      `Plaintext too large: ${payload.length} bytes. `
      + `Maximum usable plaintext size: ${MAX_PLAINTEXT_BYTES} bytes. `
      + `For large content, use media encryption with chunking.`,
    );
  }

  return encodeProtocol(mode, payload, version);
}

// ---------- Decoding ----------

/**
 * Result of decoding a protocol message.
 */
export interface ProtocolMessage {
  /** Protocol version number. */
  readonly version: number;
  /** Message mode ('s', 'a', 'g', 'kx', 'pk'). */
  readonly mode: ProtocolMode;
  /** Binary payload (decoded from base64). */
  readonly payload: Uint8Array;
}

/**
 * Decode a TeleBridge protocol message string.
 *
 * Returns undefined if:
 * - The message doesn't start with the protocol prefix
 * - The version is not a valid integer
 * - The mode is not a recognized mode
 * - The base64 payload is invalid or too short
 *
 * @param message - String to decode
 * @returns Decoded protocol message, or undefined if invalid
 */
export function decodeProtocol(message: string): ProtocolMessage | undefined {
  if (typeof message !== 'string') return undefined;
  if (!message.startsWith(PROTOCOL_PREFIX)) return undefined;

  const withoutPrefix = message.slice(PROTOCOL_PREFIX.length);

  // Find the first dot (separates version from the rest)
  const firstDot = withoutPrefix.indexOf('.');
  if (firstDot === -1) return undefined;

  const versionStr = withoutPrefix.slice(0, firstDot);
  const version = parseInt(versionStr, 10);
  if (isNaN(version) || version < 1 || version > 99) return undefined;

  // Currently only version 1 is supported
  if (version !== PROTOCOL_VERSION) return undefined;

  const afterVersion = withoutPrefix.slice(firstDot + 1);

  // Mode can be 1 char ('s', 'a') or 2 chars ('kx', 'pk')
  // Find the second dot (separates mode from base64 payload)
  let mode: string;
  let payloadBase64: string;

  if (afterVersion.startsWith('kx.') || afterVersion.startsWith('pk.') || afterVersion.startsWith('sk.')) {
    // Two-character mode
    mode = afterVersion.slice(0, 2);
    payloadBase64 = afterVersion.slice(3);
  } else if (afterVersion.startsWith('s.') || afterVersion.startsWith('a.') || afterVersion.startsWith('g.')) {
    // Single-character mode
    mode = afterVersion.slice(0, 1);
    payloadBase64 = afterVersion.slice(2);
  } else {
    // No valid mode found
    return undefined;
  }

  // Validate mode
  if (!VALID_MODES.has(mode)) return undefined;

  // Decode base64 payload
  if (payloadBase64.length === 0) return undefined;

  try {
    const payload = base64ToUint8Array(payloadBase64);
    if (payload.length < MIN_PAYLOAD_BYTES) return undefined;

    return {
      version,
      mode: mode as ProtocolMode,
      payload,
    };
  } catch {
    return undefined;
  }
}

/**
 * Check if a string looks like a TeleBridge protocol message.
 * This is a fast check that only examines the prefix, not the full structure.
 *
 * @param message - String to check
 * @returns true if the string starts with 'tb' and could be a protocol message
 */
export function isProtocolMessage(message: string): boolean {
  return typeof message === 'string' && message.startsWith(PROTOCOL_PREFIX);
}

// ---------- Size Budget Utilities ----------

/**
 * Calculate the encoded size of a payload in characters.
 * Useful for checking if a payload will fit within Telegram limits.
 *
 * @param payload - Binary payload
 * @param mode - Message mode
 * @param version - Protocol version
 * @returns Encoded message length in characters
 */
export function calculateEncodedLength(
  payload: Uint8Array,
  mode: ProtocolMode = 's',
  version: number = PROTOCOL_VERSION,
): number {
  const base64 = uint8ArrayToBase64(payload);
  return `${PROTOCOL_PREFIX}${version}.${mode}.${base64}`.length;
}

/**
 * Check if a given plaintext size will fit within the Telegram message limit
 * after encoding.
 *
 * @param plaintextBytes - Plaintext size in bytes
 * @param mode - Message mode
 * @returns true if the message will fit
 */
export function willFitInTelegram(
  plaintextBytes: number,
  mode: ProtocolMode = 's',
): boolean {
  // Estimate base64 size: ceil(bytes * 4/3)
  const estimatedBase64 = Math.ceil((plaintextBytes * 4) / 3);
  // Protocol overhead: "tb" + version + "." + mode + "."
  const overhead = `tb1.${mode}.`.length;
  return overhead + estimatedBase64 <= TELEGRAM_MAX_MESSAGE_LENGTH;
}

// ---------- Utility Functions ----------

function uint8ArrayToBase64(arr: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < arr.length; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    arr[i] = binary.charCodeAt(i);
  }
  return arr;
}
