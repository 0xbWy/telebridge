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

// Configure argon2-browser WASM loading for Node.js test environment
// The WASM binary needs to be loaded from the filesystem in Node.js/jsdom
const path = require('path');
const fs = require('fs');
try {
  const wasmPath = path.resolve(__dirname, '../node_modules/argon2-browser/dist/argon2.wasm');
  if (fs.existsSync(wasmPath)) {
    const wasmBinary = fs.readFileSync(wasmPath);
    // Set up Module.locateFile so argon2-browser can find the WASM
    if (typeof globalThis.Module === 'undefined') {
      globalThis.Module = {};
    }
    globalThis.Module.locateFile = (filename) => {
      if (filename === 'argon2.wasm' || filename === 'argon2-simd.wasm') {
        return path.resolve(__dirname, '../node_modules/argon2-browser/dist', filename);
      }
      return filename;
    };
    // Pre-load the WASM binary for synchronous instantiation
    globalThis.Module.wasmBinary = wasmBinary;
  }
} catch (e) {
  // WASM loading may fail in some environments; argon2-browser will fall back
  // or the tests will use the PBKDF2 fallback in the password module
  // eslint-disable-next-line no-console
  console.warn('[TeleBridge test init] Could not pre-load argon2 WASM:', e.message);
}
