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
