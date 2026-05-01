# TeleBridge

End-to-end encrypted Telegram web client — a fork of [Telegram Web A](https://github.com/Ajaxy/telegram-tt) that adds a custom E2E encryption stack on top of the Telegram MTProto transport. TeleBridge connects to the Telegram API (via gramjs/MTProto) for message transport but adds an independent encryption layer, providing true end-to-end encryption that even Telegram's servers cannot read.

The entire UI has been rebranded from Telegram to TeleBridge.

## Key Features

- **End-to-end encryption** using X3DH key exchange (Ed25519 + X25519)
- **AES-256-GCM encryption** with HKDF-SHA256 ratcheting for 1:1 chats
- **Signal-style Sender Keys** for group encryption
- **Encryption pause/resume toggle** in chat UI — users can temporarily pause E2E encryption per chat
- **"Login Needed" prompt** when the bridge is locked (keys encrypted at rest)
- **Key change notifications** and safety number verification — TOFU model with explicit trust confirmation
- **Argon2id password derivation** with AES-256-GCM encrypted key storage — private keys never touch disk unencrypted
- **Full rebranding** from Telegram to TeleBridge across the entire UI

## Setup

### Prerequisites

- **Node.js** v24 (use [nvm](https://github.com/nvm-sh/nvm) or install directly)
- **npm** v10.8+ or v11+

### Install & Run

```sh
cp .env.example .env        # create env file
# Edit .env — add your TELEGRAM_API_ID and TELEGRAM_API_HASH
npm install
npm run dev                  # dev server on http://localhost:1234
```

### Build & Check

```sh
npm run build:production     # production build
npm run check                # typecheck + lint
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

Runs the Jest test suite covering all cryptographic layers, key exchange, group encryption, error handling, security hardening, and edge cases.

### Test Coverage Summary

| Suite                                | Focus                                           |
| ------------------------------------ | ----------------------------------------------- |
| crypto-asymmetric                    | Ed25519/X25519 keypair generation & signing     |
| crypto-identity                      | Identity keypairs, fingerprint verification      |
| crypto-key-derivation                | HKDF-SHA256 consistent derivation paths          |
| crypto-key-exchange                  | X3DH key exchange, prekey bundles                |
| crypto-media                         | Media encryption/decryption (all types)          |
| crypto-password-recovery              | Argon2id hashing, BIP39 mnemonic recovery        |
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

### 6-Layer E2E Encryption Stack

| Layer | Name                      | Description                                                                                    |
| ----- | ------------------------- | ---------------------------------------------------------------------------------------------- |
| 0     | Telegram Transport        | gramjs/MTProto — provides the underlying message transport to Telegram servers.                |
| 1     | Identity & Key Management | Ed25519/X25519 keypairs, Argon2id password hashing, AES-256-GCM encrypted key storage.          |
| 2     | X3DH Key Exchange         | Ephemeral keypairs, prekey bundles, shared secret derivation via Extended Triple DH.           |
| 3     | Symmetric Encryption      | 1:1 chat AES-256-GCM with HKDF-SHA256 ratcheting, per-message keys (`tb1.s.` protocol).       |
| 4     | Secured Messages          | Per-message X25519 ephemeral keypair for forward secrecy, encrypt-to-self (`tb1.a.` protocol). |
| 5     | Group Encryption          | Signal-style Sender Keys, chain key ratcheting, member re-keying (`tb1.g.` protocol).           |

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

## TeleBridge Wire Protocol

All TeleBridge protocol messages use the format:

```
tb<version>.<mode>.<base64_payload>
```

| Prefix     | Mode                 | Description                          |
| ---------- | -------------------- | ------------------------------------ |
| `tb1.s.`   | Symmetric            | 1:1 chat encrypted messages          |
| `tb1.kx.`  | Key Exchange         | X3DH prekey bundles & negotiations   |
| `tb1.a.`   | Asymmetric/Secured   | Ephemeral per-message encryption     |
| `tb1.g.`   | Group                | Sender Key group encrypted messages  |
| `tb1.sk.`  | Sender Key           | Group sender key distribution        |

## Security Notes

- **Private keys encrypted at rest** — keys are stored in IndexedDB only as AEAD-encrypted blobs, unlocked via Argon2id-derived password
- **X3DH key exchange** — provides authenticated key agreement using long-term identity keys and ephemeral keys
- **Forward secrecy via HKDF ratcheting** — each message uses a unique key derived through HKDF-SHA256 chain ratcheting
- **AES-256-GCM auth tag verification** — every decryption verifies the GCM authentication tag; tampered or corrupted messages are rejected
- **Argon2id KDF** — password-based key derivation uses Argon2id (64 MiB memory, 3 iterations, parallelism 1) with PBKDF2-SHA256 fallback

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
