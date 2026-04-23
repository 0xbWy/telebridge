// Jest setup file for TeleBridge
// This file is referenced by jest.config.js setupFilesAfterEnv

// Polyfill TextEncoder/TextDecoder for @noble/curves and @noble/hashes
const { TextEncoder, TextDecoder } = require('util');
globalThis.TextEncoder = globalThis.TextEncoder || TextEncoder;
globalThis.TextDecoder = globalThis.TextDecoder || TextDecoder;
