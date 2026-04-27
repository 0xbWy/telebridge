# TeleBridge

End-to-end encrypted Telegram web client — a fork of [telegram-tt](https://github.com/Ajaxy/telegram-tt) with a custom 4-layer E2E encryption stack, Signal-style group encryption, identity verification, and BIP39 recovery built on top of the Telegram MTProto transport.

## Setup

### Prerequisites

- **Node.js** v24 (use [nvm](https://github.com/nvm-sh/nvm) or install directly)
- **npm** v10.8+ or v11+

### Install & Run

```sh
cp .env.example .env        # create env file
# Edit .env — add your TELEGRAM_API_ID and TELEGRAM_API_HASH
npm install
npm run build:dev
npm run dev                  # dev server on http://localhost:1234
```

### Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

| Variable              | Description                                      |
| --------------------- | ------------------------------------------------ |
| `TELEGRAM_API_ID`     | Your Telegram API ID from [my.telegram.org](https://my.telegram.org) |
| `TELEGRAM_API_HASH`   | Your Telegram API hash from [my.telegram.org](https://my.telegram.org) |
| `NODE_ENV`            | `development` (default in `.env.example`)        |

**Never commit real API credentials.** The `.env` file is already in `.gitignore`.

## Testing

```sh
npm test
```

Runs the Jest test suite — **639 unit tests** across **16 test suites**, covering all cryptographic layers, key exchange, group encryption, error handling, security hardening, and edge cases.

### Test Coverage Summary

| Suite                                | Focus                                           |
| ------------------------------------ | ----------------------------------------------- |
| crypto-asymmetric                    | Ed25519/X25519 keypair generation & signing     |
| crypto-identity                      | Identity keypairs, fingerprint verification      |
| crypto-key-derivation                | HKDF-SHA256 consistent derivation paths          |
| crypto-key-exchange                  | X3DH key exchange, prekey bundles                |
| crypto-media                         | Media encryption/decryption (all types)          |
| crypto-password-recovery            | Argon2id hashing, BIP39 mnemonic recovery        |
| crypto-persistence                   | Encrypted key storage & lifecycle                |
| crypto-protocol                      | Wire format encoding/decoding                    |
| crypto-symmetric                     | AES-256-GCM encryption, ratcheting, key rotation|
| error-edge-security                  | Error handling, replay attacks, edge cases       |
| group-encryption                     | Sender Key group encryption                      |
| group-identity-contacts              | Contact verification & key history               |
| messages-pipeline                    | Full encrypt/decrypt message pipeline             |
| messaging-media-secured              | Secured (Layer 4) media encryption                |
| telebridge-branding                  | Branding & UI integration                        |

## Architecture

### 4-Layer E2E Encryption Stack

| Layer | Name            | Description                                                                                   |
| ----- | --------------- | --------------------------------------------------------------------------------------------- |
| 1     | Identity        | Ed25519 signing keypair + X25519 derivation for DH. Identity fingerprinting & QR verification. |
| 2     | Key Exchange    | X3DH (Extended Triple Diffie-Hellman) with signed prekeys & one-time prekeys. Signal-style.   |
| 3     | Symmetric       | AES-256-GCM with HKDF-SHA256 ratcheting, per-message keys, out-of-order decryption support.  |
| 4     | Secured         | Per-message X25519 ephemeral keypair for forward secrecy. Encrypt-to-self via separate keys.  |

### Group Encryption

Signal-style **Sender Keys** for group chats:
- Each sender encrypts with their own Sender Key
- Recipients decrypt with the distributed sender key
- Chain key ratcheting for forward secrecy within a session
- Member leave triggers re-keying of all remaining members
- Ed25519 signatures on every group message

### Identity Verification

- **QR Verification**: `telebridge://verify?fingerprint=<hex>&userId=<id>` URI scheme for in-person identity verification
- **SHA-256 fingerprint** of Ed25519 public key displayed as grouped numeric safety number
- **Contact verification statuses**: verified / unverified / unknown
- **Key change warnings** with TOFU (Trust On First Use) auto-accept option
- **Key history** tracking for auditability

### Encryption Indicators

Per-chat encryption status with 5 states:
- `encrypted` — Session established, standard encryption active
- `notEncrypted` — No encryption for this chat
- `verified` — Identity key verified (via QR or safety number comparison)
- `keyChanged` — Contact's key changed, needs acknowledgment
- `secured` — Layer 4 ephemeral encryption active

### Wire Format

All TeleBridge protocol messages use the format:

```
tb<version>.<mode>.<base64_payload>
```

Modes: `s` (symmetric), `a` (asymmetric/secured), `g` (group), `kx` (key exchange), `pk` (prekey)

### Key Recovery & Password

- **BIP39 24-word mnemonic** for key recovery (seed → identity keypair derivation)
- **Argon2id** password hashing (64 MiB memory, 3 iterations, parallelism 1) with PBKDF2-SHA256 fallback
- **Password setup/unlock dialog** — keys remain encrypted at rest, unlocked only during active session
- **In-memory key store** — password is never stored in global or module-level state

## Key Technologies

| Category           | Technology                                                                  |
| ------------------ | --------------------------------------------------------------------------- |
| UI Framework       | [Teact](https://github.com/Ajaxy/teact) (React-paradigm reactive framework) |
| Language           | TypeScript                                                                  |
| Styling            | SCSS (CSS Modules with camelCase class names)                               |
| MTProto            | Custom [GramJS](https://github.com/gram-js/gramjs)                          |
| Crypto (Identity)  | `@noble/curves` (Ed25519 / X25519), `@noble/hashes` (SHA-256, SHA-512, HKDF) |
| Crypto (Symmetric) | Web Crypto API (AES-256-GCM), `@noble/hashes` (HKDF-SHA256 ratcheting)      |
| Password Hashing   | `argon2-browser` (Argon2id) with Web Crypto PBKDF2-SHA256 fallback          |
| Mnemonic Recovery  | `bip39` (24-word mnemonic → 64-byte seed → identity keypair)                |

## V1 Bug Regression Guards

These guards prevent regressions of security bugs found during V1 development:

| #   | Bug Description                                                                                     | Location(s)                        |
| --- | --------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 1   | GCM auth tags are mandatory — never discarded or truncated                                          | `crypto/symmetric.ts`              |
| 2   | `unlockBridge` always decrypts keys before use — never copies encrypted blobs as plaintext           | `crypto/persistence.ts`            |
| 3   | Single consistent HKDF-SHA256 key derivation path — no conditional paths based on input type        | `crypto/keyDerivation.ts`          |
| 4   | Key lookup by explicit `chatId` parameter — never from UI state like `selectCurrentChat()`           | `crypto/media.ts`, `integration.ts`, `hooks.ts`, `messages.ts` |
| 5   | No plaintext keys written to disk — only AEAD-encrypted blobs stored in IndexedDB                    | `crypto/persistence.ts`            |
| 6   | Argon2id used for password hashing — never bare SHA-256                                            | `crypto/password.ts`               |
| 7   | GCM auth tag verification always performed — `decipher.final()` is always called                     | `crypto/symmetric.ts`, `crypto/asymmetric.ts`, `group/groupEncryption.ts`, `crypto/password.ts` |
| 8   | Password never stored in global/module-level variable — always a local parameter                    | `crypto/persistence.ts`, `crypto/password.ts`, `state.ts` |
| 9   | Password dialog not disabled — no early `return;` at the top of the dialog                           | UI layer (validated in tests)       |
| 10  | All media types encrypted unconditionally — no `"if(quick) skip"` conditional skip paths             | `crypto/media.ts`                  |

## License

[GPL-3.0-or-later](LICENSE)
