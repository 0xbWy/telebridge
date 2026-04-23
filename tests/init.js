// Jest setup file for TeleBridge
// This file is referenced by jest.config.js setupFilesAfterEnv

// Polyfill TextEncoder/TextDecoder for @noble/curves and @noble/hashes
const { TextEncoder, TextDecoder } = require('util');
globalThis.TextEncoder = globalThis.TextEncoder || TextEncoder;
globalThis.TextDecoder = globalThis.TextDecoder || TextDecoder;

// Polyfill Web Crypto API for AES-256-GCM (jsdom provides crypto but NOT crypto.subtle)
const { webcrypto } = require('crypto');
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
} else if (!globalThis.crypto.subtle) {
  // jsdom provides crypto.getRandomValues but not crypto.subtle
  globalThis.crypto.subtle = webcrypto.subtle;
  // Also expose other WebCrypto methods if missing
  if (!globalThis.crypto.randomUUID) {
    globalThis.crypto.randomUUID = webcrypto.randomUUID;
  }
}
