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
