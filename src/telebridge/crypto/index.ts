/**
 * TeleBridge — Crypto Module Entry Point
 * All cryptographic operations for the 4-layer architecture.
 */

// Layer 1: Identity
export {
  generateIdentityKeypair,
  generateIdentityKeypairFromSeed,
  deriveX25519FromEd25519,
  signBytes,
  verifySignature,
  computeSharedSecret,
} from './identity';

export type { IdentityKeypair, X25519Keypair } from './identity';

// Layer 2: Key Exchange
export {
  deriveChatKey,
  performECDH,
  generateSignedPrekey,
  generateOneTimePrekey,
  generatePrekeyBundle,
  verifyPrekeyBundle,
  initiateKeyExchange,
  completeKeyExchange,
  OneTimePrekeyStore,
} from './keyExchange';

export type {
  ChatKeyResult,
  SignedPrekey,
  PrekeyBundle,
  VerifiedPrekeyBundle,
  KeyExchangeWithBundleResult,
} from './keyExchange';

// Layer 3: Symmetric Encryption
export {
  encryptSymmetric,
  decryptSymmetric,
  ratchetChainKey,
  deriveMessageKeyAtCounter,
  generateChatKey,
  keyIdFromKey,
  keyIdToBytes,
  RatchetState,
  shouldRotateKey,
  encryptFile,
  decryptFile,
  hkdfSha256,
  KEY_LENGTH,
  NONCE_LENGTH,
  TAG_LENGTH,
  KEY_ID_LENGTH,
  DEFAULT_ROTATE_AFTER_MESSAGES,
  DEFAULT_ROTATE_AFTER_TIME_MS,
  KEY_RETENTION_MS,
} from './symmetric';

// Layer 4: Asymmetric Secured Messages
export {
  encryptAsymmetric,
  decryptAsymmetricRecipient,
  decryptAsymmetricSelf,
  encryptSecuredMessage,
  decryptSecuredMessageRecipient,
  decryptSecuredMessageSelf,
} from './asymmetric';

export type {
  SecuredMessageResult,
  DecryptedSecuredMessage,
} from './asymmetric';

// Password & Key Encryption (Argon2id)
export {
  deriveKeyFromPassword,
  generateSalt,
  isArgon2Available,
  verifyPassword,
  createPasswordVerifier,
  encryptPrivateKey,
  decryptPrivateKey,
  encryptKeyBlob,
  decryptKeyBlob,
  importAesKey,
  ARGON2_MEMORY,
  ARGON2_TIME,
  ARGON2_PARALLELISM,
  ARGON2_HASH_LENGTH,
  SALT_LENGTH,
} from './password';

export type { PasswordHashResult } from './password';

// BIP39 Mnemonic Recovery
export {
  generateMnemonic,
  validateMnemonic,
  mnemonicToSeed,
  mnemonicToKey,
  isBIP39Available,
  MNEMONIC_WORD_COUNT,
} from './bip39';

// Protocol Wire Format
export {
  encodeProtocol,
  encodeProtocolText,
  decodeProtocol,
  isProtocolMessage,
  calculateEncodedLength,
  willFitInTelegram,
  PROTOCOL_VERSION,
  PROTOCOL_PREFIX,
  TELEGRAM_MAX_MESSAGE_LENGTH,
  MAX_PLAINTEXT_BYTES,
} from './protocol';

export type { ProtocolMode, ProtocolMessage } from './protocol';

// Key Persistence (encrypted blobs, unlock/lock bridge)
export {
  unlockBridge,
  lockBridge,
  createEncryptedKeyStore,
  changeBridgePassword,
  verifyBridgePassword,
  getBridgeState,
  isBridgeUnlocked,
  getUnlockedIdentity,
  getUnlockedX25519,
} from './persistence';

export type {
  BridgeState,
  UnlockedIdentity,
  EncryptedKeyStore,
  UnlockResult,
} from './persistence';

// Consistent Key Derivation (HKDF-SHA256 only, single path)
export {
  deriveKey,
  deriveChatKey as deriveChatKeyFromDerivation,
  deriveRatchetMessageKey,
  deriveNextChainKey,
  deriveMediaKey,
  deriveFileKey,
  deriveSecuredMessageKey,
  deriveSecuredSelfKey,
  deriveBIP39Key,
  deriveKeyEncryptionKey,
  deriveKeyFromText,
  verifyConsistentDerivation,
  INFO_STRINGS,
} from './keyDerivation';

// Media Encryption (ALL media types, no skip paths, explicit chatId)
export {
  encryptMedia,
  decryptMedia,
  shouldChunk,
  calculateChunkCount,
  ALL_MEDIA_TYPES,
  CHUNK_SIZE,
  MAX_SINGLE_PIECE_SIZE,
} from './media';

export type { MediaType, ChunkData, ChunkedEncryptionResult } from './media';
