/**
 * TeleBridge — Action-Level In-Memory Stores
 *
 * Module-level stores for key exchange state that need to be
 * both accessible from action handlers and testable independently.
 *
 * These stores are separate from the integration-layer stores
 * (recipientX25519PublicKeys in integration.ts) because they
 * hold different representations of the same data:
 * - prekeyStore: PrekeyBundle + consumed OTPKs (only needed by actions)
 * - recipientPubBase64Store: Base64-encoded X25519 public keys (actions convenience)
 *
 * Both sets of stores must be cleared on bridge lock.
 */

import type { X25519Keypair } from './crypto/identity';
import type { PrekeyBundle } from './crypto/keyExchange';

// ---------- Prekey Bundle Store ----------

/**
 * Prekey bundle store for our own signed prekeys.
 * Maps chatId → SignedPrekey + consumed one-time prekeys
 * so we can complete key exchange as responder.
 */
const prekeyStore = new Map<string, {
  bundle: PrekeyBundle;
  consumedOneTimePrekeys: Map<number, X25519Keypair>;
}>();

/**
 * Store a prekey bundle for a chat (for use as responder).
 */
export function setPrekeyBundle(
  chatId: string,
  bundle: PrekeyBundle,
  consumedOneTimePrekeys: Map<number, X25519Keypair>,
): void {
  prekeyStore.set(chatId, { bundle, consumedOneTimePrekeys });
}

/**
 * Get the stored prekey bundle for a chat.
 * Returns undefined if no bundle has been stored.
 */
export function getPrekeyBundle(chatId: string): {
  bundle: PrekeyBundle;
  consumedOneTimePrekeys: Map<number, X25519Keypair>;
} | undefined {
  return prekeyStore.get(chatId);
}

/**
 * Check if a prekey bundle exists for a chat.
 */
export function hasPrekeyBundle(chatId: string): boolean {
  return prekeyStore.has(chatId);
}

// ---------- Recipient X25519 Public Key Store (Base64) ----------

/**
 * In-memory store for recipient X25519 public keys (base64) per chat.
 * Populated during key exchange initiation from the recipient's prekey bundle.
 */
const recipientPubBase64Store = new Map<string, string>();

/**
 * Store a recipient's X25519 public key (base64) for a chat.
 */
export function setRecipientPubBase64(chatId: string, pubBase64: string): void {
  recipientPubBase64Store.set(chatId, pubBase64);
}

/**
 * Get the recipient's X25519 public key (base64) for a chat.
 */
export function getRecipientPubBase64(chatId: string): string | undefined {
  return recipientPubBase64Store.get(chatId);
}

// ---------- Clear on Lock ----------

/**
 * Clear all module-level stores containing private key material.
 * Called by telebridgeLock action before lockMessagePipeline()
 * to clear stores that are defined in this stores module.
 *
 * This is a security requirement: private key material must not remain
 * in memory when the bridge is locked.
 */
export function clearTelebridgeStores(): void {
  prekeyStore.clear();
  recipientPubBase64Store.clear();
}
