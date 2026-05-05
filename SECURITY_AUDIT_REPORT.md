# TeleBridge Holistic Security Audit Report

**Date:** 2026-04-30
**Scope:** `/workspace/telebridge/src/telebridge` — End-to-end encrypted Telegram web client (4-layer encryption stack)
**Auditor:** Security Review Subagent
**Methodology:** Source code review of crypto modules, state management, protocol handlers, identity verification, and integration layer.

---

## 1. Crypto Key Management

### 1.1 Key Generation & Storage (`src/telebridge/crypto/persistence.ts`)

**Findings:**
- **Ed25519 identity keys are generated using `@noble/curves/ed25519.js`** — a well-audited, constant-time纯 JavaScript cryptography library.
- **X25519 keys are deterministically derived from Ed25519 signing keys** via standard libsodium-style SHA-512 hash + clamping (`identity.ts`).
- **Private keys are NEVER written to disk in plaintext.** Keys are encrypted as AES-256-GCM blobs using a wrapping key derived from the bridge password via Argon2id.
- **Public keys are stored in plaintext** in the EncryptedKeyStore for lookup and key exchange. This is acceptable as public keys are not secret.
- **Crash recovery markers** (`markKeyGenerationStart`, `markKeyGenerationComplete`) prevent partial/corrupt key states.
- **IndexedDB fallback** to in-memory-only operation when storage is unavailable, with graceful degradation.

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **LOW** | `zeroUint8Array` is best-effort only | `arr.fill(0)` cannot guarantee key erasure from JavaScript memory due to engine optimizations (copy-on-write, garbage collection delays). There is no use of `crypto.subtle.zeroize` or secure buffer types. |
| **MEDIUM** | No key derivation parameter tuning | Argon2id parameters are hardcoded (64 MiB, 3 iterations, parallelism 1). On high-end devices, stronger parameters could be used. However, the current values meet minimum thresholds per spec. |
| **LOW** | `argon2AvailableCache` is mutable module state | In `password.ts`, the availability of Argon2id is cached in a module-level variable. A malicious script in the same origin could theoretically interfere, though this requires XSS compromise already. |

---

### 1.2 Private Key Exposure in Memory

**Findings:**
- Keys exist in memory ONLY while `unlockedIdentity` is defined in `persistence.ts`.
- When `lockBridge()` is called, the signing bytes and scalar are zero-filled and the reference is set to `undefined`.
- **No plaintext private keys are copied** without decryption (guards against V1 Bug #2).
- The `unlockedIdentity` is a module-level `let`, accessible only within the module closure. This is acceptable for a browser app.

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **MEDIUM** | Module-level `unlockedIdentity` is accessible to same-origin scripts | If an attacker can execute arbitrary JS in the same origin (e.g., via a compromised dependency or XSS), `unlockedIdentity` is in scope. However, this is a fundamental browser limitation, not a TeleBridge-specific flaw. |

---

### 1.3 IndexedDB Storage Security

**Findings:**
- All stored data is **AEAD-encrypted** (AES-256-GCM with 16-byte auth tags).
- **Password verifier** uses a known plaintext encrypted with the derived key, providing fast password verification before full decryption.
- **Salt is stored alongside the verifier**, which is standard practice.
- **Account namespacing** (`VAL-DATA-002`) prevents cross-contamination between multiple Telegram accounts.
- The `Partial Key Marker` prevents crash recovery corruption.

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **HIGH** | Salt and verifier are stored unencrypted alongside the encrypted blob | An attacker with read access to IndexedDB can read `salt`, `verifier`, `ed25519PubBase64`, and `x25519PubBase64`. While the salt is public by design in password hashing, and public keys are fine, storing the verifier alongside the ciphertext enables **offline brute-force attacks** on the password. Argon2id mitigates this, but users with weak passwords are still vulnerable to offline dictionary attacks. **Suggested fix:** Consider additional client-side stretching or rate-limiting wrappers. |
| **MEDIUM** | No integrity check on the EncryptedKeyStore object itself | The `encryptedBlob`, `verifier`, and `salt` are stored as separate fields. An attacker with write access could swap a valid `encryptedBlob` with one from another account/device. While the password verifier would fail, there is no signature or MAC over the entire store structure. **Suggested fix:** Add an HMAC or signature over the entire `EncryptedKeyStore` object using a key derived from the password. |
| **LOW** | `TELEBRIDGE_DB_NAME` and `TELEBRIDGE_STORE_NAME` are hardcoded constants | Not a critical issue, but an attacker targeting the app knows exactly where to look.

---

## 2. Password Handling (`src/telebridge/crypto/password.ts`)

### 2.1 Argon2id Configuration

**Findings:**
- **Primary KDF:** Argon2id with:
  - Memory = 64 MiB (65536 KiB)
  - Time = 3 iterations
  - Parallelism = 1
  - Hash length = 32 bytes
- **Fallback KDF:** PBKDF2-SHA256 with 600,000 iterations (OWASP 2023 recommendation for AES-256) when Argon2id WASM is unavailable (e.g., CSP-restricted browsers).
- **Salt is 16 bytes (128 bits)** and generated via `crypto.getRandomValues`.

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **MEDIUM** | Argon2id parameters are at the minimum threshold | 64 MiB / 3 iterations / parallelism 1 is the stated "minimum per spec." For a security-conscious E2EE app, consider higher defaults on capable devices (e.g., 128 MiB, 4+ iterations). However, this is acceptable for web environments where OOM is a real concern. |
| **LOW** | Argon2id availability check uses a hardcoded test string | `isArgon2Available()` hashes `'telebridge-argon2-check'` with a zero salt. If `argon2-browser` has a vulnerability triggered by specific inputs, this could be exploited. **Suggested fix:** Use a randomly generated test input. |
| **MEDIUM** | No minimum password length enforcement | `MIN_PASSWORD_LENGTH = 1` in `config.ts`. A 1-character password with Argon2id is trivially brute-forceable offline. **Suggested fix:** Enforce a minimum password length of at least 8 characters with a strength meter. |

### 2.2 Password Global State

**Findings:**
- **Password is NEVER stored in a global, module, or Redux state variable.** (Verified across `persistence.ts`, `password.ts`, `state.ts`.)
- The bridge password is only ever a local function parameter in `deriveKeyFromPassword`, `createEncryptedKeyStore`, `unlockBridge`, and `changeBridgePassword`.
- After the async operation completes, the password string is eligible for garbage collection.

**Verdict:** ✅ **COMPLIANT** — Password is correctly scoped and never leaked to persistent state.

---

## 3. Message Security

### 3.1 Encryption Coverage (`src/telebridge/crypto/media.ts`, `src/telebridge/messages.ts`)

**Findings:**
- **Text messages:** Encrypted with AES-256-GCM + HKDF-SHA256 ratchet per-message keys (`symmetric.ts`).
- **Media files (photos, videos, voice, documents, audio, stickers, animations):** ALL encrypted unconditionally. No skip paths (`VAL-#10` guard).
- **Edits and Replies:** Re-encrypted with the current chat key.
- **Forwards:** If destination has a key, decrypt source → re-encrypt for destination. If not, forwarded as-is.

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **MEDIUM** | Forwarded messages from encrypted chats to unencrypted chats decrypt the plaintext | `processForwardedMessage` decrypts the source and sends plaintext to the destination if no key exists. While expected behavior, users may not realize forwarding breaks E2EE. **Suggested fix:** Show a warning when forwarding an encrypted message to an unencrypted chat. |
| **LOW** | No re-encryption on paste from clipboard | If a user copies an encrypted message (the `tb1.s.xxx` string) and pastes it into another chat, it is sent as a raw protocol string. The receiving chat will fail to decrypt it (wrong key) and show an error. This is acceptable UX, but could be improved by stripping the protocol prefix on paste. |

### 3.2 Forward Secrecy (`src/telebridge/crypto/symmetric.ts`)

**Findings:**
- **HKDF-SHA256 ratchet** advances the chain key after each message.
- `ratchetChainKey` derives both a message key and a next chain key.
- Old chain keys are overwritten with `this.chainKey = nextChainKey`.
- **Key rotation** is triggered automatically after 100 messages or 7 days.
- **Grace period** of 5 minutes retains old keys for in-transit messages.

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **HIGH** | Ratchet `nextReceiveKey` re-derives from root chain key for out-of-order messages | In `RatchetState.nextReceiveKey(counter)`, when a message arrives out-of-order, the code walks the ratchet from `rootChainKey` all the way to the target counter. This repeatedly derives chain keys but **does NOT advance** the stored `chainKey`. However, the stored `chainKey` IS the sender's current position. An attacker who knows a later message key cannot derive earlier ones, but this design means the `rootChainKey` is retained indefinitely. If the `rootChainKey` is compromised, ALL past messages in that key's lifetime are decryptable (until rotation). Standard Signal double-ratchet would be more robust. **Suggested fix:** Clarify documentation — this is a standard symmetric ratchet, not a full double-ratchet. For 1:1 chats, consider implementing a true Axolotl/Signal double ratchet. |
| **MEDIUM** | No maximum ratchet chain length limit | If a chat sends 1 million messages without rotation, the `getPreviousKeyMessageKey` or `nextReceiveKey` would walk up to 1 million HKDF iterations. While `messageKeyCache` mitigates this, a very large receive counter gap could cause performance issues or DoS. **Suggested fix:** Cap the allowed counter gap (e.g., 10,000 messages) and reject messages that jump too far ahead. |

### 3.3 Auth Tag Verification (`symmetric.ts`)

**Findings:**
- **AES-256-GCM with 16-byte (128-bit) auth tags is mandatory** for ALL symmetric operations.
- Web Crypto API's `subtle.decrypt` with AES-GCM automatically verifies the auth tag.
- `decryptSymmetric` in `symmetric.ts` always passes the auth tag.
- `encryptSymmetric` always returns the auth tag separately.

**Verdict:** ✅ **COMPLIANT** — Auth tags are mandatory and verified on every operation.

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **LOW** | `decryptMedia` swallows all decryption failures silently | Returns `undefined` on any failure. An attacker could tamper with media data and the app would silently show nothing. **Suggested fix:** Distinguish between format errors (corruption) and auth tag failures (tampering) and surface tampering warnings to the user. |

---

## 4. Group Encryption (`src/telebridge/group/`)

### 4.1 Sender Key Distribution (`groupEncryption.ts`, `senderKey.ts`)

**Findings:**
- **Signal-style Sender Keys** are used: each member generates their own Sender Key per group.
- Sender Keys are distributed via **pairwise 1-on-1 encrypted channels**.
- Each Sender Key contains a **chain key + Ed25519 signing keypair**.
- **Chain key ratcheting** via HKDF-SHA256 provides forward secrecy per message.
- **Ed25519 signatures** cover `keyId + groupId + memberId + chainIndex + nonce + ciphertext + authTag`.

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **CRITICAL** | Group message payload uses variable-length fields for keyId, groupId, and memberId without a total length prefix or delimiter | In `groupEncryption.ts`, the payload format is: `[keyIdLen(2B)][keyId(var)][groupIdLen(2B)][groupId(var)][memberIdLen(2B)][memberId(var)]...`. Because the lengths are encoded as 2-byte big-endian integers, and the fields are adjacent, this is technically parseable. However, there is **no total payload length field**, and the signature is at the end. An attacker who can truncate the payload could cause parsing errors or potentially manipulate the AAD vs payload mismatch. **Suggested fix:** Prefix the entire payload with a 4-byte total length. |
| **HIGH** | `deriveMessageKeyAtChainIndex` walks the ratchet from `startChainIndex` to target index for EVERY out-of-order message | Similar to the 1:1 issue, but in groups this is worse because the distributed key's `startChainIndex` could be far behind the current sender index. This is computationally expensive and could be DoSed by sending many out-of-order messages. **Suggested fix:** Cache message keys in the `DistributedSenderKey` object (or a wrapper) to avoid recomputing the ratchet walk. |
| **MEDIUM** | Group message AAD does NOT include the version byte | The AAD for group messages includes `keyId + groupId + memberId + chainIndex`, but does NOT include a protocol version. If a future version changes the payload format, the AAD would not bind to the version. **Suggested fix:** Add a version byte to the AAD. |
| **MEDIUM** | `isGroupMessage` uses a simple prefix check (`startsWith('tb1.g.')`) | This could be confused by non-protocol messages that happen to start with that string. **Suggested fix:** Use `decodeGroupProtocol` for robust validation. |

### 4.2 Member Leave Handling (`groupState.ts`)

**Findings:**
- `removeMember(groupId, memberId)` removes the member's distributed key and recalculates group status.
- `removeGroupMember` triggers re-keying (`startGroupRekeying` / `completeGroupRekeying`).
- All remaining members are expected to regenerate their Sender Keys after a member leaves.

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **HIGH** | No automatic deletion of distributed keys from departed members | In `groupState.ts`, `removeMember` only removes the member from the local `GroupSenderKeyStore`. However, if a member leaves and their messages are still in transit, other members might hold old distributed keys. More critically, **there is no mechanism to ensure all members re-key**. `startGroupRekeying` sets a status flag, but the actual re-keying requires all members to regenerate and redistribute keys manually. If one member fails to re-key, the group continues using the old keys, which the departed member might still know. **Suggested fix:** Implement a mandatory re-keying handshake where messages cannot be sent until all members have acknowledged new keys. |
| **MEDIUM** | `GroupEncryptionState` status logic may show 'locked' even if one member hasn't re-keyed | The `recalculateGroupStatus` logic says `'locked'` means "We have our Sender Key AND all members have keys." But if a member was removed and hasn't re-keyed yet, their status would be 'missing' and the group would show 'warning'. This is a UX issue, not a security bug, but it means the 'locked' status doesn't guarantee post-compromise security. |

### 4.3 Group Message Signing

**Findings:**
- Every group message is signed with the sender's Ed25519 signing key (from the Sender Key).
- The signature covers the ciphertext, nonce, auth tag, and metadata.
- `verifyGroupMessageSignature` uses standard Ed25519 verification.

**Verdict:** ✅ **COMPLIANT** — Group messages are properly signed.

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **MEDIUM** | The signing key (`signingBytes`) in a Sender Key is unrelated to the user's identity key | This is correct per Signal protocol design (sender keys are independent). However, there is no binding between the Sender Key's signing key and the user's identity key visible to recipients. An attacker who compromises a group could forge a new Sender Key and sign messages as the victim, unless recipients verify the Sender Key distribution via the 1-on-1 channel. **Suggested fix:** Include an identity attestation (signed by the user's identity key) in the Sender Key distribution message. |

---

## 5. Identity Verification (`src/telebridge/identity/`)

### 5.1 QR Verification Flow (`identityQr.ts`)

**Findings:**
- **Fingerprint** is SHA-256 of the Ed25519 public key (64 hex chars).
- **QR URI format:** `telebridge://verify?fingerprint=<hex>&userId=<id>&displayName=<name>`
- **Cross-party safety number** is computed by sorting public keys lexicographically, concatenating, and SHA-256 hashing.
- `parseVerificationUri` validates fingerprint format (`^[0-9a-f]{64}$`).

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **HIGH** | QR fingerprint is only a SHA-256 hash of the public key — no key binding attestation | The QR code encodes `telebridge://verify?fingerprint=<hash>`. An attacker with a MitM position could present a QR code with their own fingerprint. The user must visually compare the fingerprint with the contact. There is no cryptographic binding to a CA or web-of-trust. **This is standard TOFU behavior, but users must be warned.** |
| **MEDIUM** | `telebridge://` URI scheme is not registered with the OS | On mobile devices, scanning a QR code with `telebridge://` will likely fail to open the app. This is a UX issue that could lead to users manually typing fingerprints (error-prone). **Suggested fix:** Add standard `https://telebridge.online/verify?...` fallback URLs for web-based verification. |
| **LOW** | `formatSafetyNumber` uses `hexToDecimalGroups` which may not produce truly uniform groupings | The function takes hex chunks, parses them as integers, and zero-pads. For certain hex values, this could produce non-uniform distributions. Very minor issue. |

### 5.2 Fingerprint Comparison

**Findings:**
- `computeFingerprint` uses SHA-256 of the 32-byte Ed25519 public key.
- `verifyFingerprint` does a direct string comparison.
- `computeCrossPartySafetyNumber` sorts keys and hashes the concatenation.

**Verdict:** ✅ **COMPLIANT** — Standard Signal-style approach.

### 5.3 TOFU Implementation (`contactVerification.ts`)

**Findings:**
- **New contacts default to `unknown` status with `isTofuAccepted: true`**.
- **Key changes demote contacts to `unverified`** (`processKeyChange`).
- **Manual verification via QR or safety number promotes to `verified`**.
- Key history is tracked (`keyHistory`) for auditability.

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **HIGH** | TOFU auto-accept has no user opt-out at first contact | `initContact` automatically accepts the first key with `isTofuAccepted: true`. A sophisticated attacker could perform a real-time MitM during first contact and establish their own key. While this is inherent to TOFU, **TeleBridge offers no initial prompt** asking users to verify the key. **Suggested fix:** On first key exchange, show a prominent banner: "Verify this contact's identity to protect against impersonation." Do not auto-hide TOFU warnings. |
| **MEDIUM** | `keyHistory` is an in-memory array with no eviction limit | For a long-running app, a contact with many key changes could accumulate a large history. **Suggested fix:** Cap history entries (e.g., last 10 keys). |
| **LOW** | `processKeyChange` sets `isTofuAccepted: false` on key change, but doesn't notify the user prominently | The state is updated, but the notification mechanism is in the UI layer (outside audit scope). Ensure TOFU warnings are re-triggered on key change. |

---

## 6. General Security

### 6.1 Hardcoded Secrets / Test Keys

**Findings:**
- ✅ **No hardcoded test keys or secrets found** in the TeleBridge source code.
- The `.env` file contains `TELEGRAM_API_ID` and `TELEGRAM_API_HASH` (required for Telegram API access). These are public application credentials for the Telegram API and are not secrets in the E2EE sense.
- No hardcoded passwords, salts, or private keys.
- `password.ts` passphrase check string `'TeleBridge-Password-Verify-v1'` is a public verifier constant, not a secret.

**Verdict:** ✅ **COMPLIANT**.

### 6.2 Debug Code / Sensitive Data Leaks

**Findings:**
- `DEBUG` flag is active when `APP_ENV !== 'production'`.
- Several `console.error` calls in sensitive paths:
  - `persistence.ts`: `console.error('[TeleBridge] IndexedDB unavailable...')`
  - `integration.ts`: `console.error('[TeleBridge] Encryption failed:', error)`
  - `integration.ts`: `console.error('[TeleBridge] Decryption failed:', error)`
  - `integration.ts`: `console.error('[TeleBridge] Secured message decryption failed:', error)`
  - `integration.ts`: `console.error('[TeleBridge] Group message encryption failed')`
  - `integration.ts`: `console.error('[TeleBridge] Group message decryption failed')`

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **MEDIUM** | `console.error` in `integration.ts` may leak ciphertext/ plaintext fragments in production | The `processOutgoingMessage` and `processIncomingMessage` functions log errors to `console.error` unconditionally. In production, if a user has DevTools open or uses a browser extension that captures console output, these logs could leak plaintext snippets or error details that reveal message timing/content. **Suggested fix:** Wrap all `console.error` calls in `if (DEBUG)` guards, or strip them in production builds. |
| **LOW** | `DEBUG_GRAMJS = false` is hardcoded but `DEBUG` is dynamic | Ensure GramJS debug logging is never enabled in production. |

### 6.3 CSP Headers & Security Headers (`webpack.config.ts`, `index.html`)

**Findings:**
- **CSP header is present** in `index.html`: `<meta http-equiv="Content-Security-Policy" content="<%= htmlWebpackPlugin.options.csp %>">`
- **CSP in webpack devServer:**
  - `default-src 'self'`
  - `connect-src 'self' wss://*.telebridge.online wss://*.web.telegram.org blob: http: https:`
  - `script-src 'self' 'wasm-unsafe-eval' https://t.me/_websync_ https://telegram.me/_websync_`
  - `style-src 'self' 'unsafe-inline'`
  - `img-src 'self' data: blob: https://ss3.4sqi.net/img/categories_v2/`
  - `media-src 'self' blob: data:`
  - `object-src 'none'`
  - `frame-src http: https:` (many wallet schemes)
  - `base-uri 'none'`
  - `form-action 'none'`

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **HIGH** | `script-src` includes `'wasm-unsafe-eval'` | This CSP directive is necessary for Argon2id (WASM) but weakens the CSP significantly. `'wasm-unsafe-eval'` allows any WASM module to be instantiated, which could be exploited by an XSS attacker to run compiled code. **Suggested fix:** If possible, use a nonce or hash for the specific WASM script, though this is difficult with inline WASM loading. At minimum, document this trade-off prominently. |
| **MEDIUM** | `frame-src` allows `http:` and `https:` (any origin) | This allows the app to be framed by any site or to frame any site. While needed for Telegram Mini Apps and wallet integrations, it enables clickjacking if the app doesn't implement frame-busting. **Suggested fix:** Add `X-Frame-Options: DENY` or `SAMEORIGIN` headers. Add CSP `frame-ancestors 'none'` for production. |
| **MEDIUM** | `connect-src` includes `http:` and `https:` (any origin) in development | In production, the CSP restricts `connect-src` better, but during development it's wide open. Ensure production CSP is strictly enforced. |
| **LOW** | No `Referrer-Policy` header | Could leak sensitive referrer data to third parties. **Suggested fix:** Add `<meta name="referrer" content="no-referrer">`. |
| **LOW** | No `Strict-Transport-Security` (HSTS) header | The app should enforce HTTPS. **Suggested fix:** Add `Strict-Transport-Security: max-age=31536000; includeSubDomains` on the server. |

### 6.4 XSS / Injection Vulnerabilities

**Findings:**
- The project uses a React-like framework (Teact) which should provide automatic HTML escaping.
- Protocol messages (`tb1.xxx`) are validated before DOM insertion.
- `encodeProtocolText` validates size budgets before encoding.
- No `innerHTML` usage found in TeleBridge crypto modules.
- The `lang()` system for localization is used throughout.

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **MEDIUM** | Decrypted text is returned as a raw string and passed to message rendering | While Teact/React should escape HTML, if the message rendering pipeline ever uses `dangerouslySetInnerHTML` or similar, decrypted text could inject XSS. **Suggested fix:** Audit the `MessageText` component in `src/components` to ensure decrypted strings are never rendered as HTML. Also consider a content sanitization pass on decrypted text (e.g., DOMPurify) before rendering. |
| **LOW** | `parseVerificationUri` uses `new URLSearchParams(queryString)` | This is safe for standard URI parsing, but if the query string is extremely long, it could cause ReDoS or memory exhaustion. However, the function has early returns for invalid formats. |

---

## 7. Protocol & Integration Layer (`src/telebridge/integration.ts`)

**Findings:**
- **Outgoing messages** are encrypted before sending. If encryption fails, plaintext is NOT sent (`VAL-ERR-002`).
- **Incoming messages** are detected by the `tb` prefix and routed to decrypt.
- **Encrypt-to-self** for Layer 4 (secured) messages is implemented correctly — two separate ciphertexts are produced.
- **Self-sent secured messages are hidden** from the UI (`isEncryptToSelfDuplicate`).
- **Key exchange messages (kx, pk) are hidden** from the chat UI.
- **Media encryption** uses explicit `chatId` for key lookup (not UI state).

**Issues Found:**
| Severity | Finding | Details |
|----------|---------|---------|
| **CRITICAL** | `processIncomingMessage` replay detection only checks `messageId = keyId` | In `integration.ts`, the replay detector checks `replayDetector.isReplay(chatId, messageId)` where `messageId = result.keyId`. However, `result.keyId` is only the 4-byte key ID (hex), NOT a unique per-message identifier. All messages in a chat use the same `keyId` until rotation. This means **replay detection will falsely flag ALL messages after the first as replays**, or conversely, **will NOT detect replays if the counter changes but the key ID stays the same**. Looking at `replayDetector.ts`, `createMessageId(keyId, counter, nonce)` is defined but appears to be unused in the actual check. In `integration.ts`, the code uses `result.keyId` directly instead of `ReplayDetector.createMessageId(keyId, counter, nonce)`. **Suggested fix:** Use `ReplayDetector.createMessageId(result.keyId, counter, nonce)` for proper per-message replay detection. |
| **HIGH** | `performKeyRotation` encodes a kx message with the new key in plaintext | In `integration.ts` lines 816-825, `performKeyRotation` constructs a `kxPayload` as: `const kxPayload = new Uint8Array(36); ... kxPayload.set(newKey.subarray(0, 32), 4);` and sends it as `encodeProtocol('kx', kxPayload)`. This sends the **raw 32-byte chat key** in plaintext over Telegram! This completely breaks forward secrecy for key rotation. **Suggested fix:** Do NOT send the raw key in a kx message. Instead, perform a new X25519 ephemeral key exchange and derive the new key from ECDH. If pre-shared key rotation is needed, encrypt the new key with the old key. |
| **MEDIUM** | `processIncomingSecuredMessage` uses `senderVerifyKey = senderEd25519Pub ?? new Uint8Array(32)` | If `senderEd25519Pub` is not provided, the function creates an all-zero verifying key. `ed25519.verify` with an all-zero key will return `false`, which is safe, but this is fragile. **Suggested fix:** Throw an error if sender key is required but missing. |
| **MEDIUM** | `lockMessagePipeline` uses `require()` for group state cleanup | In `integration.ts`, `require('./group/groupState')` is used. This works in webpack but is not type-safe and could fail if module resolution changes. Minor code quality issue. |

---

## 8. Additional Observations

### 8.1 Dependency Security
- The project uses `@noble/hashes` and `@noble/curves` for cryptography. These are modern, well-audited JavaScript libraries. ✅
- `argon2-browser` is used for Argon2id. This is a WASM-based implementation. Ensure its WASM file integrity via SRI (Subresource Integrity) if loaded from CDN.

### 8.2 Web Worker Usage
- GramJS runs inside a web worker. This is good for isolating heavy crypto operations, but ensure no plaintext bridges the worker boundary unsafely.

### 8.3 Source Maps in Production
- `devtool: 'source-map'` is enabled in `webpack.config.ts` unconditionally. Source maps expose original source code in production. **Suggested fix:** Only enable source maps in non-production builds, or use hidden-source-map.

---

## Summary of Issues by Severity

| Severity | Count | Issues |
|----------|-------|--------|
| **CRITICAL** | 2 | 1. Broken replay detection in `integration.ts` (uses keyId only). <br>2. `performKeyRotation` sends raw new key in plaintext kx message. |
| **HIGH** | 4 | 1. Offline brute-force risk from salt+verifier stored with encrypted blob. <br>2. `rootChainKey` retained indefinitely — forward secrecy weaker than double-ratchet. <br>3. No automatic/mandatory re-keying after member leaves group. <br>4. Group protocol payload lacks total length prefix. |
| **MEDIUM** | 12 | 1. Argon2id params at minimum threshold. <br>2. No minimum password length (allows 1-char passwords). <br>3. Forwarding encrypted → unencrypted decrypts silently. <br>4. No max ratchet chain gap limit (DoS). <br>5. Group AAD lacks version byte. <br>6. Missing identity attestation in Sender Key distribution. <br>7. TOFU auto-accept without initial prompt. <br>8. `console.error` may leak data in production. <br>9. `script-src 'wasm-unsafe-eval'` weakens CSP. <br>10. `frame-src` allows any origin. <br>11. Secured message sender key fallback to zeros. <br>12. Source maps enabled in production. |
| **LOW** | 10 | Various: best-effort zeroing, hardcoded DB names, clipboard paste issue, `hexToDecimalGroups` distribution, no HMAC over key store, CSP referrer/HSTS headers, `innerHTML` audit needed, Argon2id test string hardcoded, QR `telebridge://` scheme not registered, group message prefix check too simple. |

---

## Remediation Priorities

1. **Fix CRITICAL #1 (Replay Detection):** Update `integration.ts` to use `ReplayDetector.createMessageId(keyId, counter, nonce)`.
2. **Fix CRITICAL #2 (Key Rotation Leak):** Never send raw keys in protocol messages. Use ECDH re-derivation or encrypt the new key with the old key.
3. **Fix HIGH #3 (Group Member Leave):** Implement mandatory re-keying handshake. Block group message sending until all members have acknowledged new keys.
4. **Fix HIGH #1 (Offline Brute-Force):** Add server-side rate limiting or increase Argon2id parameters for users willing to accept the trade-off.
5. **Fix MEDIUM #8 (Production Debug Logs):** Strip or gate `console.error` calls behind `DEBUG` flags.
6. **Audit CSP Headers:** Tighten `frame-src`, add `frame-ancestors`, add HSTS, add referrer-policy.
7. **Audit MessageText Component:** Ensure decrypted strings never pass through HTML rendering unsanitized.
8. **Source Maps:** Disable in production builds.

---

*End of report.*
