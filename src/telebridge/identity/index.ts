/**
 * TeleBridge — Identity Verification Module
 *
 * Identity QR verification (generate, scan, verify contacts).
 * Contact management (verified/unverified/unknown badges, key history).
 */

// Identity QR verification
export type {
  VerificationQrParams,
  ParsedVerificationUri,
  QrVerificationResult,
} from './identityQr';

export {
  VERIFICATION_URI_SCHEME,
  FINGERPRINT_PARAM,
  USER_ID_PARAM,
  DISPLAY_NAME_PARAM,
  computeFingerprint,
  verifyFingerprint,
  generateVerificationUri,
  generateVerificationQrData,
  parseVerificationUri,
  formatSafetyNumber,
  computeCrossPartySafetyNumber,
  verifyScannedQr,
  verifyQrFingerprint,
} from './identityQr';

// Contact verification state
export type {
  ContactVerificationStatus,
  KeyHistoryEntry,
  ContactVerificationState,
  KeyChangeResult,
} from './contactVerification';

export {
  contactVerificationStore,
  initContact,
  processContactKeyChange,
  verifyContact,
  unverifyContact,
  getContactVerification,
  getAllContacts,
  getVerifiedContacts,
  getUnverifiedContacts,
  getUnknownContacts,
  getContactKeyHistory,
  verifyContactFromQr,
  removeContact,
  clearAllContactVerification,
} from './contactVerification';
