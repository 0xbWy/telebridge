/**
 * TeleBridge — Group Encryption Module
 *
 * Signal-style Sender Keys for group chat encryption.
 * - Sender Key generation (chain key + signing key, per-member-per-group uniqueness)
 * - Distribution via 1-on-1 encrypted channels
 * - Group message encryption (sender encrypts with own Sender Key)
 * - Group message decryption (recipient uses distributed sender key)
 * - New member joins: bidirectional key distribution, no retroactive access
 * - Member leaves: all remaining regenerate Sender Keys, forward secrecy enforced
 * - Concurrent sends from different members with independent sequence tracking
 * - Group encryption status indicator (locked, warning, transitional, per-member detail)
 * - Identity QR verification (generate, scan, verify contacts)
 * - Contact management (verified/unverified/unknown badges, key history)
 * - Key change detection in groups with non-dismissible warnings
 * - Mixed encrypted/unencrypted member handling with reduced-security warnings
 * - Fallback for unencrypted groups (no Sender Key operations, no encryption UI)
 */

// Sender Key types and operations
export type {
  SenderKey,
  DistributedSenderKey,
  RatchetedKey,
  SerializedSenderKey,
} from './senderKey';

export {
  generateSenderKey,
  generateSenderKeyDeterministic,
  ratchetSenderKey,
  deriveMessageKeyAtChainIndex,
  deriveChainKeyAtIndex,
  signGroupMessage,
  verifyGroupMessageSignature,
  serializeSenderKey,
  deserializeSenderKey,
  createDistributedSenderKey,
  senderKeyIdFromChainKey,
  verifySenderKeyId,
  regenerateSenderKey,
  zeroSenderKey,
  zeroDistributedSenderKey,
  KEY_LENGTH,
  CHAIN_KEY_LENGTH,
  SIGNING_KEY_LENGTH,
  VERIFYING_KEY_LENGTH,
  SIGNATURE_LENGTH,
} from './senderKey';

// Group encryption/decryption
export type {
  GroupEncryptedMessageResult,
  GroupDecryptedMessageResult,
} from './groupEncryption';

export {
  encryptGroupMessage,
  decryptGroupMessage,
  isGroupMessage,
  isTeleBridgeGroupMessage,
  decodeGroupProtocol,
  GROUP_PROTOCOL_MODE,
} from './groupEncryption';

// Group state management
export type {
  GroupEncryptionStatus,
  MemberEncryptionStatus,
  GroupMemberState,
  GroupEncryptionState,
} from './groupState';

export {
  groupSenderKeyStore,
  generateGroupSenderKey,
  getOwnGroupSenderKey,
  storeDistributedSenderKey,
  getDistributedSenderKey,
  removeDistributedSenderKey,
  hasDistributedSenderKey,
  getAllDistributedSenderKeys,
  initGroupEncryptionState,
  getGroupEncryptionState,
  getGroupEncryptionStatus,
  getGroupMemberStates,
  getGroupMemberStatus,
  addGroupMember,
  removeGroupMember,
  setGroupPairwiseKeyComplete,
  startGroupRekeying,
  completeGroupRekeying,
  clearGroupEncryption,
  clearAllGroupEncryption,
} from './groupState';

// Group key change detection
export type {
  GroupKeyChangeEvent,
  GroupKeyChangeWarning,
  MixedMemberComposition,
  ReducedSecurityWarning,
} from './groupKeyChange';

export {
  recordGroupKeyChange,
  getGroupKeyChanges,
  getGroupKeyChange,
  acknowledgeGroupKeyChange,
  clearGroupKeyChange,
  getGroupKeyChangeWarning,
  hasGroupKeyChangeWarning,
  updateGroupMixedComposition,
  getGroupMixedComposition,
  getGroupReducedSecurityWarning,
  isGroupReducedSecurity,
  shouldHideEncryptionArtifacts,
  isUnencryptedGroup,
  clearGroupKeyChangeData,
  clearAllGroupKeyChangeData,
  groupKeyChangeStore,
} from './groupKeyChange';
