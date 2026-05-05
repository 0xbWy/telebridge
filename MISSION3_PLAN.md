# Mission 3: TeleBridge Full Product Integration

**Mission ID:** `telebridge-m3-full-product`
**Priority:** 1
**Status:** Planning
**Base Branch:** current working tree (telebridge repo at `/workspace/telebridge`)

---

## 1. Mission Objective

Transform TeleBridge from an un-wired crypto library + UI components into a **fully functional, working end-to-end encrypted messenger**. The crypto modules, global state, and UI components built by Missions 1 & 2 are solid and well-tested (898 tests pass), but they are **not connected to the actual message and media pipelines**. Mission 3's job is to wire everything together, fix critical security bugs, and deliver a product where users can actually exchange encrypted messages.

---

## 2. Current State Summary

### What Works (DO NOT REBUILD)
- **Crypto stack** (`src/telebridge/crypto/`): AES-256-GCM, Ed25519/X25519, HKDF ratcheting, Argon2id, X3DH key exchange, media encryption, BIP39 recovery, persistence — all tested
- **Group encryption** (`src/telebridge/group/`): Sender Keys, distribution, chain ratcheting, signatures — tested
- **Integration layer** (`src/telebridge/integration.ts`): `processOutgoingMessage`, `processIncomingMessage`, `processEditMessage`, `processForwardedMessage`, `processOutgoingSecuredMessage`, `processOutgoingGroupMessage`, `processIncomingGroupMessage`, `encryptMediaForChat`, `decryptMediaForChat`, key rotation, encrypt-to-self — tested in isolation
- **Message pipeline** (`src/telebridge/messages.ts`): `encryptMessage`, `decryptProtocolMessage`, `isTeleBridgeMessage`, `shouldHideMessage` — tested
- **Global state** (`src/telebridge/state.ts`): `TeleBridgeState` with selectors, `ChatEncryptionState`, contact verification — complete
- **Global actions** (`src/global/actions/api/telebridge.ts`): unlock, lock, setPassword, startKeyExchange, completeKeyExchange, toggleEncryption, verifyContact, group actions — complete
- **Global reducers** (`src/global/reducers/telebridge.ts`): all state mutations — complete
- **UI components** (`src/components/telebridge/`): PasswordDialog, TelebridgeLock, KeyExchangeStatus, TelebridgeBanner, TofuBanner, KeyChangeWarning, GroupKeyChangeWarning, SafetyNumber, IdentityQr, ContactList, GlitchLogo, ReducedSecurityWarning, RecoveryPhrase, RecoveryVerification, CustomSendMenu — complete
- **Settings** (`src/components/left/settings/SettingsTelebridge.tsx`): 6-section settings panel — complete
- **Branding**: Full TeleBridge rebrand across all user-visible surfaces — complete
- **Tests**: 898 tests passing across 24 test suites

### What's Broken / Un-Wired (MISSION 3 TARGETS)

| # | Gap | Severity | Status |
|---|-----|----------|--------|
| G1 | Message decryption NOT wired into `MessageText.tsx` | CRITICAL | `useTelebridgeDecryption` hook exists but never imported |
| G2 | Media encryption NOT wired into upload/download pipeline | CRITICAL | `encryptMediaForChat`/`decryptMediaForChat` exist but never called |
| G3 | Protocol messages (kx, pk, sk) NOT filtered from message list | CRITICAL | `shouldHideTeleBridgeMessage` exists but never called |
| G4 | Replay detection broken: uses `keyId` only, not unique `messageId` | CRITICAL | `ReplayDetector.createMessageId` exists but unused |
| G5 | Key rotation sends raw new key in plaintext kx message | CRITICAL | Must use ECDH re-derivation |
| G6 | Message edits NOT intercepted for re-encryption | HIGH | `processEditMessage` exists but never called |
| G7 | Message forwards NOT intercepted for re-encryption | HIGH | `processForwardedMessage` exists but never called |
| G8 | Group message send NOT wired | HIGH | `processOutgoingGroupMessage` exists but never called |
| G9 | Group message receive NOT wired | HIGH | `processIncomingGroupMessage` exists but never called |
| G10 | Secured message send (Layer 4) NOT wired | HIGH | CustomSendMenu UI exists, `processOutgoingSecuredMessage` not called |
| G11 | Production console.error leaks sensitive data | MEDIUM | Gate behind DEBUG flag |
| G12 | Source maps enabled in production build | MEDIUM | Disable in prod webpack config |
| G13 | Minimum password length is 1 character | MEDIUM | Enforce minimum 8 characters |
| G14 | Per-message encryption indicator missing in UI | MEDIUM | Need lock icon on individual messages |

---

## 3. Implementation Plan — Ordered by Dependency

### Phase 1: Critical Wiring (G1, G3) — Messages Must Decrypt & Protocol Messages Must Hide

**G1: Wire `useTelebridgeDecryption` into `MessageText.tsx`**
- Import `useTelebridgeDecryption` and `shouldHideTeleBridgeMessage` from `../../telebridge/hooks`
- In the `MessageText` component, before rendering, call `useTelebridgeDecryption(text, chatId, senderId, ourUserId)`
- If `shouldHide` is true, render nothing (protocol control message)
- If `decryptedText` is available, use it instead of raw `text`
- If `decryptionErrorKey` is set, render a localized error message
- Add `chatId`, `senderId`, and `ourUserId` to the `MessageText` props (derive from parent `Message` component)
- **Validation:** Open chat, send encrypted message from another client, verify it decrypts inline

**G3: Filter protocol messages (kx, pk, sk) from message list**
- Wire `shouldHideTeleBridgeMessage` into `MiddleColumn.tsx` or the `Message` component
- Messages where `shouldHideTeleBridgeMessage(text) === true` should:
  - Still exist in the message list (for key exchange processing)
  - Be rendered as hidden (zero-height or display:none)
  - NOT show as blank gaps or garbled text
- The key exchange dispatch in `apiUpdaters/messages.ts` already detects `tb1.kx.` and `tb1.sk.` — ensure this continues working
- **Validation:** Initiate key exchange; verify no `tb1.kx.xxx` text appears but key exchange still completes

### Phase 2: Media Encryption Wiring (G2) — Files Must Be Encrypted

**G2: Wire media encryption into upload/download pipeline**

Outgoing media (in `Composer.tsx` or `sendMessage` action):
- Before calling `callApi('sendMessage', ...)`, check if chat has an encryption key via `hasChatKey(chatId)`
- If yes, encrypt each attachment via `encryptMediaForChat(attachmentData, chatId, mediaId, mediaType)`
- Replace the attachment data with the encrypted version
- Adjust file size to account for encryption overhead (nonce + auth tag + version byte)

Incoming media (in download/media rendering):
- After downloading media, check if chat has encryption key via `hasChatKey(chatId)` using the message's `chatId` (NOT `selectCurrentChat()` — V1 Bug #4 guard)
- If yes, decrypt via `decryptMediaForChat(encryptedData, chatId, mediaId, mediaType)`
- Replace the blob URL with the decrypted data
- This must be wired into `src/util/mediaLoader.ts` and `src/components/main/DownloadManager.tsx`

Key lookup:
- ALL key lookups use the message's explicit `chatId`, never UI-derived state
- Apply to: `mediaLoader.ts`, `DownloadManager.tsx`, and any inline media rendering

**Validation:** Send encrypted photo/document, verify recipient sees decrypted content

### Phase 3: Critical Security Fixes (G4, G5)

**G4: Fix replay detection**
- In `integration.ts`, `processIncomingMessage`: replace `replayDetector.isReplay(chatId, result.keyId)` with `replayDetector.isReplay(chatId, ReplayDetector.createMessageId(result.keyId, counter, nonce))`
- Extract `counter` and `nonce` from the decryption result (they are in the protocol payload)
- Same fix for `processIncomingSecuredMessage` and `processIncomingGroupMessage`
- **Validation:** Send same encrypted message twice, verify second is rejected

**G5: Fix key rotation — ECDH re-derivation**
- Replace `performKeyRotation` in `integration.ts`:
  - Generate new ephemeral X25519 keypair
  - Perform DH with recipient's X25519 public key → shared secret
  - Derive new chat key via HKDF-SHA256(shared secret, "telebridge-rotation-v1")
  - Sign the rotation message with sender's Ed25519 identity key
  - Send `tb1.kx` message containing the ephemeral public key + signature (NOT the raw key)
  - Recipient derives same shared secret from ephemeral pubkey + their private key
- Update `processIncomingKeyExchangeMessage` to handle rotation messages differently from initial key exchange
- Maintain backward compatibility: rotation messages include a flag distinguishing them from initial key exchange
- **Validation:** Key rotation completes, messages before rotation cannot be decrypted with new key, messages after rotation decrypt correctly

### Phase 4: Message Pipeline Completion (G6, G7, G8, G9, G10)

**G6: Wire message edit encryption**
- In the `editMessage` action handler (`src/global/actions/api/messages.ts`), intercept the text before calling the API
- If chat has encryption key: call `processEditMessage(newText, chatId)` from `integration.ts`
- Send the encrypted edit text instead of plaintext
- **Validation:** Edit an encrypted message, verify the edit displays decrypted on recipient

**G7: Wire message forward encryption**
- In the `forwardMessages` action handler, intercept before API call
- If destination chat has encryption key: call `processForwardedMessage(originalText, sourceChatId, destChatId)` from `integration.ts`
- If destination has no key but source was encrypted: show a warning notification to user that forwarding breaks E2EE
- **Validation:** Forward encrypted message to encrypted chat, verify re-encrypts; forward to unencrypted chat, verify warning shown

**G8/G9: Wire group message encryption/decryption**
- In `Composer.tsx` send path for group chats: if group has encryption enabled, call `processOutgoingGroupMessage(text, chatId, senderUserId)`
- In `apiUpdaters/messages.ts` incoming handler for group messages: if group has encryption enabled, call `processIncomingGroupMessage(text, chatId, senderId)` for `tb1.g.` messages
- The group message result should be fed back to the MessageText rendering via the same `useTelebridgeDecryption` path
- **Validation:** Send group encrypted message, verify all members decrypt correctly

**G10: Wire secured message send (Layer 4)**
- In `CustomSendMenu.tsx`, the "Send Secured" action already exists
- Wire it to call `processOutgoingSecuredMessage(text, recipientUserId, chatId)` from `integration.ts`
- This produces two messages (encrypt-to-self): the recipient copy and the sender copy
- The Composer should send both, with the self-copy tagged for filtering by `useTelebridgeDecryption`
- **Validation:** Right-click send button → "Send Secured", verify message shows secured icon on both sides

### Phase 5: Security Hardening (G11, G12, G13)

**G11: Gate production debug logs**
- In `integration.ts`, `persistence.ts`, and other telebridge modules: wrap all `console.error` / `console.log` calls in `if (DEBUG)` guards
- `DEBUG` is already defined in the project (false in production)
- **Validation:** Production build contains no TeleBridge console.error strings

**G12: Disable source maps in production**
- In `webpack.config.ts`, change `devtool` to be conditional: `'source-map'` in development, `false` or `'hidden-source-map'` in production
- **Validation:** Production build output has no `.map` files, or they are hidden

**G13: Enforce minimum password length**
- In `telebridgeSetPassword` action: already checks `password.length < 8`
- Verify `config.ts` or wherever `MIN_PASSWORD_LENGTH` is set: change from `1` to `8`
- Add password strength indicator (optional but recommended)
- **Validation:** Cannot set password shorter than 8 characters

### Phase 6: Polish & Indicators (G14)

**G14: Per-message encryption indicator**
- Add a small lock icon next to message timestamp for encrypted messages
- 🔒 for Layer 3 symmetric, 🔐 for Layer 4 secured
- The `useTelebridgeDecryption` hook already returns `isSecured` — use it
- Add `data-encryption-status` attribute for test validation
- **Validation:** Lock icons appear on encrypted messages, not on plaintext

---

## 4. Guardrails — What NOT To Do

1. **DO NOT rebuild any crypto module** — the crypto stack is tested and working. Fix bugs IN PLACE, don't rewrite.
2. **DO NOT add new npm dependencies** — use existing noble-* suite only.
3. **DO NOT change the protocol wire format** — `tb<version>.<mode>.<base64>` is stable.
4. **DO NOT break existing tests** — all 898 tests must continue passing after every change.
5. **DO NOT store password in global state** — V1 Bug #8 guard: password is always a local parameter.
6. **DO NOT use `selectCurrentChat()` for key lookup** — V1 Bug #4 guard: always use explicit `chatId`.
7. **DO NOT skip GCM auth tag verification** — V1 Bug #1 guard.
8. **DO NOT persist plaintext keys to disk** — V1 Bug #5 guard.
9. **DO NOT add `.null` or `null` to any type** — project convention: use `undefined`.
10. **DO NOT use `var`** — use `const`/`let` only.
11. **DO NOT directly mutate global state** — use reducers.
12. **DO NOT hardcode user-visible strings** — use `lang()` for all text.
13. **DO NOT use inline styles** — use SCSS modules + `buildClassName`.
14. **DO NOT use `null` in any code** — the project linter enforces this.
15. **DO NOT break production build** — `npm run build:production` must succeed.

---

## 5. Validation Contract

The mission is complete ONLY when ALL of the following are true:

1. **[VAL-PIPE-001]** Opening a chat with an encrypted message shows decrypted text, NOT raw `tb1.s.xxx` base64
2. **[VAL-PIPE-002]** Sending a message in an encrypted chat produces `tb1.s.` wire format (visible in test/debug, hidden in UI)
3. **[VAL-PIPE-003]** Key exchange messages (`tb1.kx.`) are hidden from the chat UI but still processed
4. **[VAL-PIPE-004]** Sender key distribution messages (`tb1.sk.`) are hidden from the chat UI but still processed
5. **[VAL-MEDIA-001]** Photos sent in encrypted chats are encrypted on upload and decrypted on download
6. **[VAL-MEDIA-002]** Documents/files sent in encrypted chats are encrypted/decrypted
7. **[VAL-MEDIA-003]** Media key lookup uses `message.chatId`, never `selectCurrentChat()`
8. **[VAL-SEC-001]** Replay detection uses unique messageId (keyId+counter+nonce), not just keyId
9. **[VAL-SEC-002]** Key rotation uses ECDH re-derivation, never sends raw key material
10. **[VAL-EDIT-001]** Editing a message in an encrypted chat re-encrypts the edit
11. **[VAL-FWD-001]** Forwarding to an encrypted chat re-encrypts; forwarding to unencrypted shows a warning
12. **[VAL-GROUP-001]** Group encrypted messages are encrypted on send and decrypted on receive
13. **[VAL-SECURED-001]** "Send Secured" produces Layer 4 encrypted messages
14. **[VAL-BUILD-001]** `npm run build:production` succeeds
15. **[VAL-TEST-001]** All existing tests pass (`npx jest --ci`)
16. **[VAL-TSC-001]** `npx tsc --noEmit` succeeds with no errors

---

## 6. Known Limitations (Deferred)

These are documented limitations, NOT Mission 3 targets:

1. **Group member leave re-keying not enforced** — soft re-keying only, no mandatory handshake
2. **Post-quantum upgrade path** — ML-KEM-768 / Falcon-512 not implemented (Phase 5 in spec)
3. **TDesktop C++ fork** — desktop client is separate, out of scope
4. **Key backup/recovery beyond BIP39 mnemonic** — no social recovery
5. **Streaming/chunked media encryption** — full-file encrypt-whole-file approach for now
6. **Sticker encryption** — stickers remain unencrypted (public assets by design)
7. **Double ratchet** — current simple ratchet is acceptable per spec, Signal double-ratchet is future improvement
8. **Group AAD version byte** — audit recommendation deferred
9. **Identity attestation in Sender Key distribution** — audit recommendation deferred
10. **CSP header hardening** — `frame-ancestors`, HSTS headers are server-side config, not client code

---

## 7. File Reference

### Primary Files to Modify

| File | Changes |
|------|---------|
| `src/components/common/MessageText.tsx` | Wire `useTelebridgeDecryption` for inline decrypt |
| `src/components/middle/message/Message.tsx` | Pass `chatId`, `senderId`, `ourUserId` to MessageText; add per-message lock icon |
| `src/components/common/Composer.tsx` | Wire `processOutgoingGroupMessage`; wire `processOutgoingSecuredMessage`; wire media encryption on send |
| `src/util/mediaLoader.ts` | Wire `decryptMediaForChat` on download |
| `src/components/main/DownloadManager.tsx` | Wire `decryptMediaForChat` for explicit downloads |
| `src/global/actions/api/messages.ts` | Wire `processEditMessage`, `processForwardedMessage` |
| `src/global/actions/apiUpdaters/messages.ts` | Wire `processIncomingGroupMessage` for `tb1.g.` messages |
| `src/telebridge/integration.ts` | Fix replay detection (G4), fix key rotation (G5) |
| `src/telebridge/crypto/symmetric.ts` or config | Fix minimum password length (G13) |
| `webpack.config.ts` | Disable source maps in production (G12) |
| `src/components/middle/MiddleColumn.tsx` | Ensure protocol message hiding works end-to-end |

### Files to Read (Not Modify)

All files under:
- `src/telebridge/crypto/` — tested crypto modules
- `src/telebridge/group/` — tested group encryption
- `src/telebridge/identity/` — tested identity/verification
- `src/telebridge/state.ts` — state types and selectors
- `src/telebridge/messages.ts` — message pipeline
- `src/telebridge/hooks.ts` — decryption hook
- `src/telebridge/security.ts` — replay detection, protocol validation
- All test files under `tests/`

### Reference Documents

| Document | Location |
|----------|----------|
| Architecture & Spec | `/workspace/repo/Transitional/ARCHITECTURE.md` |
| V2 Requirements | `/workspace/repo/Transitional/V2_REQUIREMENTS.md` |
| V1 System Spec | `/workspace/repo/Transitional/V1_SYSTEM_SPEC.md` |
| Crypto Research | `/workspace/repo/Transitional/CRYPTO_RESEARCH.md` |
| Security Audit | `/workspace/telebridge/SECURITY_AUDIT_REPORT.md` |
| VAL Cross-Area Flows | `/workspace/telebridge/docs/val-cross-area-flows.md` |
| CLAUDE.md (coding rules) | `/workspace/telebridge/CLAUDE.md` |

---

*This mission plan is the authoritative scope for Mission 3. Any deviations must be documented and approved.*
