# VAL-CROSS: Cross-Area Flow Assertions

Validation contract assertions covering end-to-end scenarios that span multiple feature areas (branding, 1:1 encryption, group encryption, UI toggles, security) in the TeleBridge app.

---

### VAL-CROSS-001: Full 1:1 Encryption Round-Trip

A user can complete the entire 1:1 encrypted messaging cycle: open the app, unlock the Bridge, start key exchange with a contact, send an encrypted message, have the contact receive and decrypt it, have the contact reply encrypted, and the original user decrypt the reply. The key exchange action (`telebridgeStartKeyExchange`) transitions the per-chat state through `idle → inProgress → complete`, the lock indicator transitions `🔓 notEncrypted → 🔒 encrypted`, outgoing messages are encoded as `tb1.s.<base64>` (Layer 3 symmetric), and the `useTelebridgeDecryption` hook on the receiving side returns `decryptedText` matching the original plaintext. No plaintext is ever transmitted; if encryption fails, the message is not sent per VAL-ERR-002.

Tool: agent-browser | jest-test
Evidence: (1) Chat encryption state transitions through `idle → inProgress → complete`. (2) Outgoing wire format starts with `tb1.s.`. (3) Received message `decryptedText` equals sent plaintext. (4) No plaintext visible in network/API layer. (5) Lock indicator renders `🔒` (`data-encryption-status="encrypted"`).

---

### VAL-CROSS-002: Full Group Encryption Round-Trip

A user can complete the entire group encrypted messaging cycle: create or join a group, enable group encryption, exchange Sender Keys with all members, send an encrypted group message, and have all members decrypt it. Group encryption status transitions from `notEncrypted → locked` (or `transitional`), each member's Sender Key is distributed, outgoing group messages are encoded as `tb1.g.<base64>`, every recipient's `useTelebridgeDecryption` hook returns the correct plaintext, and the chain index ratchets forward with each message. No unencrypted group messages are displayed as decrypted; unencrypted groups show no encryption artifacts per `shouldHideEncryptionArtifacts()`.

Tool: agent-browser | jest-test
Evidence: (1) Group encryption status leaves `notEncrypted`. (2) Sender Key distribution count equals group membership. (3) Outgoing wire format starts with `tb1.g.`. (4) All recipients' `decryptedText` equals sender's plaintext. (5) Chain index is monotonically increasing. (6) Ed25519 signature on each group message verifies.

---

### VAL-CROSS-003: Branding Does Not Break Crypto

After the TeleBridge rebranding (app title, meta tags, config hostname, webmanifest names, Tauri product name), the full 1:1 and group encryption flows still work end-to-end. Specifically: `APP_NAME` resolves to `'TeleBridge'`, `PRODUCTION_HOSTNAME` is `'telebridge.online'`, but the crypto modules (`crypto/symmetric`, `crypto/identity`, `crypto/keyExchange`, `group/groupEncryption`) are unaffected — key generation produces valid Ed25519/X25519 keypairs, AES-256-GCM encrypt/decrypt round-trips succeed, and the `tb1.` protocol prefix is unchanged. Branding changes are cosmetic only and never alter crypto code paths.

Tool: jest-test | grep
Evidence: (1) `processOutgoingMessage` and `processIncomingMessage` succeed with `APP_NAME='TeleBridge'`. (2) `generateIdentityKeypair()` produces valid keypairs. (3) `encryptSymmetric` / `decryptSymmetric` round-trip succeeds. (4) `groupEncryptMessage` / `groupDecryptMessage` round-trip succeeds. (5) `PROTOCOL_PREFIX` still equals `'tb'`. (6) No crypto module imports `config.ts` for crypto-logic decisions.

---

### VAL-CROSS-004: Pause + Resume + Decrypt Cross-Flow

In an encrypted 1:1 chat, when encryption is toggled off (paused), the user can send a plain text message (not `tb1.`-prefixed). While encryption is paused, the user can still receive and decrypt an incoming encrypted message from the contact (the `useTelebridgeDecryption` hook still detects `tb1.` prefix and decrypts using the established chat key). When encryption is resumed, the user can again send encrypted messages (`tb1.s.<base64>`). The chat key is not destroyed during pause — only the per-chat encryption status toggles between `encrypted` and `notEncrypted`, and the lock indicator updates accordingly (`🔒` ↔ `🔓`).

Tool: agent-browser | jest-test
Evidence: (1) Plain message sent during pause has no `tb1.` prefix. (2) Incoming encrypted message during pause still decrypts (decryptedText matches plaintext). (3) After resume, outgoing message has `tb1.s.` prefix. (4) Chat key (`hasChatKey(chatId)`) remains true throughout pause. (5) Lock indicator reflects current encryption status at each step.

---

### VAL-CROSS-005: Login Needed → Unlock Bridge → Encrypt

When the Bridge is locked (`isBridgeUnlocked === false`), the TelebridgeLock indicator is displayed in the chat header. Clicking the lock icon or the TeleBridge settings entry shows the PasswordDialog prompting for Bridge unlock. The dialog shows a "Login Needed" / "Bridge Locked" message. Upon entering the correct password, `unlockBridge` decrypts the encrypted key store via Argon2id (VAL-CRYPTO-015), the bridge transitions to unlocked (`isBridgeUnlocked === true`), and the user can then start a key exchange via `telebridgeStartKeyExchange`, which completes and enables encrypted messaging. The password is never stored in global state (V1 Bug #8 guard).

Tool: agent-browser | jest-test
Evidence: (1) Locked state: `isBridgeUnlocked === false`, lock icon visible. (2) PasswordDialog renders with "Bridge Locked" message. (3) After unlock: `isBridgeUnlocked === true`, identity key is available. (4) Key exchange completes: `keyExchangeState === 'complete'`. (5) First encrypted message has `tb1.s.` prefix. (6) Password not present in global state object.

---

### VAL-CROSS-006: New Member Joins Encrypted Group → Receives Sender Keys → Decrypts

When a new member joins a group that has encryption enabled, the Sender Key distribution protocol provides the new member with the necessary keys. The new member's Sender Key is distributed to all existing members, and existing members' Sender Keys are distributed to the new member. After distribution, the new member can decrypt new group messages (`tb1.g.<base64>`) but cannot decrypt messages sent before they joined (forward secrecy). Group encryption status for the new member transitions from `notEncrypted` to `locked` (or appropriate status). If a member leaves, remaining members re-key per the Sender Key protocol design.

Tool: agent-browser | jest-test
Evidence: (1) New member's Sender Key is distributed to all existing members. (2) New member receives all existing Sender Keys. (3) New member can decrypt `tb1.g.` messages sent after their join. (4) New member cannot decrypt pre-join messages. (5) Upon member leave, remaining members' Sender Keys are rotated. (6) Group encryption status updates for the new member.

---

### VAL-CROSS-007: No "Telegram" Brand Leaks Anywhere User-Visible

The app consistently shows "TeleBridge" branding in every user-visible surface with zero "Telegram" leaks. This includes: document `<title>`, `<meta>` tags (og:title, og:description, twitter:title, twitter:description), `<noscript>` fallback, the `APP_NAME` config constant, webmanifest `name`/`short_name` across all 4 manifest files, Tauri `productName`, Settings menu items, error messages, notification toasts, and all `lang()` localization keys under `TeleBridge*`. The string "Telegram" may only appear in: (a) transport-layer references (`TELEGRAM_API_ID`, `TELEGRAM_API_HASH` env vars, GramJS internal class names), (b) the description meta tag when noting "on top of Telegram" as the transport, and (c) API-type identifiers that are protocol-level and not user-visible.

Tool: agent-browser | grep
Evidence: (1) `document.title` contains "TeleBridge", not "Telegram Web". (2) All `<meta>` content attributes contain "TeleBridge". (3) All webmanifest `name`/`short_name` fields contain "TeleBridge". (4) `grep -r "Telegram" src/` returns only transport-layer references, not UI strings. (5) All `lang('TeleBridge*')` keys resolve to "TeleBridge"-branded strings. (6) Settings > TeleBridge page shows no "Telegram" text.

---

### VAL-CROSS-008: Key Change Warning Propagates Across All Chats

When a contact's identity key changes (detected via fingerprint mismatch in TOFU model), the `keyChanged` encryption status and the KeyChangeWarning banner appear not just in one chat but in every chat the user shares with that contact. All 1:1 chats with that contact show the `KeyChangeWarning` component (with acknowledge/dismiss buttons), and all group chats containing that contact show the `GroupKeyChangeWarning` component (non-dismissible until re-verified). The contact's verification status is demoted from `verified` → `unverified` globally. The key change is tracked in the `ContactVerificationEntry.keyChangeCount` and `ContactVerificationEntry.tofuAutoAccepted` fields.

Tool: agent-browser | jest-test
Evidence: (1) Every 1:1 chat with the contact has `encryptionStatus === 'keyChanged'`. (2) Every group chat with the contact has `hasGroupKeyChangeWarning === true`. (3) Contact verification status is `unverified`. (4) `KeyChangeWarning` component renders in affected 1:1 chats. (5) `GroupKeyChangeWarning` component renders in affected group chats. (6) Acknowledging key change in one chat does not dismiss warning in others.

---

### VAL-CROSS-009: Production Build Has No "Telegram" String Leaks

A production build (`npm run build`) produces bundled output with zero user-visible "Telegram" references. Specifically, searching the built JS bundles in `dist/` and the generated `index.html` for the literal string "Telegram" returns hits only in: (a) GramJS internal transport code (API method names, TelegramClient class), (b) the `TELEGRAM_API_ID` / `TELEGRAM_API_HASH` env placeholders, and (c) the description meta tag's "on top of Telegram" phrase. No JS string constants, UI label strings, console.log messages, or error strings contain "Telegram" in a context that a user would see or that could be extracted from the bundle as a user-facing reference.

Tool: grep
Evidence: (1) `grep -r "Telegram" dist/*.js | grep -v "TelegramClient" | grep -v "API_ID" | grep -v "API_HASH" | grep -v "telegram.org" | grep -v "on top of Telegram"` returns zero hits. (2) `index.html` title and meta tags contain only "TeleBridge". (3) Webmanifest files in build output contain only "TeleBridge". (4) Build completes with exit code 0 and no warnings about missing assets.

---

### VAL-CROSS-010: First-Visit Branding Consistency

A new user who has never visited the app before sees "TeleBridge" branding consistently throughout the entire first-visit experience: the login page (document title, app logo, auth form headers), the authentication flow (phone number entry, 2FA prompt, code entry), and the post-login experience (main menu, settings, chat list header, TeleBridge settings page). At no point during the first-visit flow does the string "Telegram" appear in user-visible text, UI headings, placeholder text, button labels, or notification messages. The app favicon, PWA manifest name, and Apple touch icon all display the TeleBridge logo.

Tool: agent-browser
Evidence: (1) Login page `<h1>` or equivalent shows "TeleBridge". (2) Auth flow step titles all say "TeleBridge". (3) Post-login left sidebar header shows "TeleBridge". (4) Settings menu entry says "TeleBridge" (not "Telegram" or "Telegram Settings"). (5) No "Telegram" string in any user-visible text at any step. (6) Favicon loads `favicon.svg` with TeleBridge icon. (7) PWA install prompt (if triggered) shows "TeleBridge" as app name.

---

### VAL-CROSS-011: Encryption Toggle Preserves Message History Decryptability

When a user toggles encryption off and back on in a 1:1 chat (pause then resume), all previously received encrypted messages in the chat history remain decryptable. The `useTelebridgeDecryption` hook correctly decrypts historical `tb1.s.` messages using the chat key that was established before the toggle. Toggling encryption does not delete or invalidate the chat key stored in the key map. Messages sent during the "paused" period appear as plaintext, and messages before/after the pause appear as decrypted ciphertext.

Tool: agent-browser | jest-test
Evidence: (1) Historical encrypted messages still decrypt after pause/resume cycle. (2) Messages sent during pause appear as plaintext (no `tb1.` prefix). (3) `hasChatKey(chatId)` remains true before, during, and after pause. (4) No decryption errors on historical messages after resume. (5) Lock indicator correctly shows `🔓` during pause and `🔒` after resume.

---

### VAL-CROSS-012: Bridge Lock While Encrypted Chat Active

If the Bridge is locked (e.g., session timeout or manual lock) while the user has an active encrypted chat open, the chat becomes unable to send encrypted messages. The lock indicator updates immediately, the TelebridgeBanner and KeyExchangeStatus components are hidden (since they require `isBridgeUnlocked`), and attempting to send a message results in it being sent unencrypted (no key available for encryption) or blocked. Upon re-unlocking the Bridge via the PasswordDialog, the previously established chat key is restored, and the user can resume encrypted messaging without re-running key exchange.

Tool: agent-browser | jest-test
Evidence: (1) After lock: `isBridgeUnlocked === false`, lock indicator shows locked state. (2) Encrypted chat input cannot send `tb1.s.` messages. (3) After re-unlock: `isBridgeUnlocked === true`, chat key restored. (4) Message sent after re-unlock has `tb1.s.` prefix. (5) Key exchange state remains `complete` (no re-exchange needed). (6) PasswordDialog renders on unlock attempt.

---

### VAL-CROSS-013: Key Change Warning Appears in Both 1:1 and Group Chats

When a contact's encryption key changes, the warning propagates to all chat types involving that contact: both 1:1 chats (via `KeyChangeWarning` component with dismiss button) and group chats (via `GroupKeyChangeWarning` component, which is non-dismissible until re-verification). The contact's verification status is demoted globally (verified → unverified), and their `keyChangeCount` increments. The group warning includes a list of affected user IDs with re-verify buttons. Re-verifying in one chat clears that specific warning but does not dismiss warnings in other chats until the contact is fully re-verified.

Tool: agent-browser | jest-test
Evidence: (1) `KeyChangeWarning` renders in 1:1 chat with `status === 'keyChanged'` and `isKeyChangeAcknowledged === false`. (2) `GroupKeyChangeWarning` renders in group chats containing the contact. (3) `GroupKeyChangeWarning.isNonDismissable` is true. (4) Contact verification status is `unverified`. (5) Acknowledging in one 1:1 chat does not dismiss warning in another 1:1 chat. (6) Group warning persists until contact is re-verified via `telebridgeVerifyContactManual`.

---

### VAL-CROSS-014: Branding + Group Encryption Coexistence

After rebranding, the full group encryption flow still works: creating a group, enabling encryption, distributing Sender Keys, exchanging encrypted group messages, and decrypting them. The group encryption UI components (`GroupKeyChangeWarning`, `ReducedSecurityWarning`) show TeleBridge-branded localization strings (e.g., `lang('TeleBridgeGroupKeyChangeWarning')`), not "Telegram"-branded strings. The `tb1.g.` wire format is unaffected by branding changes.

Tool: agent-browser | jest-test | grep
Evidence: (1) Group encryption round-trip succeeds with `APP_NAME='TeleBridge'`. (2) All group encryption UI components use `lang('TeleBridge*')` keys exclusively. (3) Wire format still uses `tb1.g.` prefix. (4) Sender Key generation and distribution unaffected by branding. (5) `grep -r "Telegram" src/components/telebridge/GroupKeyChangeWarning.tsx` returns no hits.

---

### VAL-CROSS-015: Security Hardening Active During Cross-Area Flows

All security hardening assertions (VAL-SEC-001 through VAL-SEC-004) remain active and enforced during cross-area flows. Specifically: (1) Replay detection (VAL-SEC-001) rejects duplicate `tb1.s.` messages even during a pause/resume cycle. (2) Protocol version downgrade rejection (VAL-SEC-002) rejects messages with non-`tb1` or unsupported version prefixes regardless of Bridge lock state. (3) Forged key exchange rejection (VAL-SEC-003) rejects malformed `kx`/`pk` messages even in groups with mixed encryption membership. (4) Forward secrecy (VAL-SEC-004) ensures that compromise of a current chat key does not enable decryption of past messages in any chat.

Tool: jest-test
Evidence: (1) Replayed `tb1.s.` message is rejected by `replayDetector.isReplay()`. (2) Message with downgraded protocol version is rejected by `validateProtocolVersion()`. (3) Forged `kx` message is rejected by `validateKeyExchangeMessage()`. (4) After key rotation, old messages cannot be decrypted with the new key. (5) These checks pass in all flow contexts: 1:1, group, pause/resume, lock/unlock.
