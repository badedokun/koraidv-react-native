"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KoraErrorCode = exports.KoraError = exports.DocumentType = void 0;
/**
 * Kora IDV React Native SDK — TypeScript types
 *
 * Self-contained (no dependency on @koraidv/core).
 * Mirrors the same types for API consistency across platforms.
 */
// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Document Types
// ---------------------------------------------------------------------------
/**
 * Common document type codes.
 *
 * Note: This is a convenience subset. The full list of supported document types
 * (270+) is fetched dynamically by the native iOS/Android SDKs. New types are
 * available without SDK updates.
 */
let DocumentType = exports.DocumentType = /*#__PURE__*/function (DocumentType) {
  // US Documents
  DocumentType["US_DRIVERS_LICENSE"] = "us_drivers_license";
  DocumentType["US_STATE_ID"] = "us_state_id";
  DocumentType["US_GREEN_CARD"] = "us_green_card";
  // Passport (covers all 197 ICAO-compliant countries)
  DocumentType["INTERNATIONAL_PASSPORT"] = "international_passport";
  // EU ID Cards
  DocumentType["EU_ID_GERMANY"] = "eu_id_de";
  DocumentType["EU_ID_FRANCE"] = "eu_id_fr";
  DocumentType["EU_ID_SPAIN"] = "eu_id_es";
  DocumentType["EU_ID_ITALY"] = "eu_id_it";
  // Africa
  DocumentType["GHANA_CARD"] = "ghana_card";
  DocumentType["NIGERIA_NIN"] = "ng_nin";
  DocumentType["NIGERIA_DRIVERS_LICENSE"] = "ng_drivers_license";
  DocumentType["GHANA_DRIVERS_LICENSE"] = "gh_drivers_license";
  DocumentType["KENYA_ID"] = "ke_id";
  DocumentType["KENYA_DRIVERS_LICENSE"] = "ke_drivers_license";
  DocumentType["SOUTH_AFRICA_ID"] = "za_id";
  DocumentType["SOUTH_AFRICA_DRIVERS_LICENSE"] = "za_drivers_license";
  DocumentType["NIGERIA_VOTERS_CARD"] = "ng_voters_card";
  // Liberia
  DocumentType["LIBERIA_ID"] = "lr_id";
  DocumentType["LIBERIA_DRIVERS_LICENSE"] = "lr_drivers_license";
  DocumentType["LIBERIA_VOTERS_CARD"] = "lr_voters_card";
  // Sierra Leone
  DocumentType["SIERRA_LEONE_ID"] = "sl_id";
  DocumentType["SIERRA_LEONE_DRIVERS_LICENSE"] = "sl_drivers_license";
  DocumentType["SIERRA_LEONE_VOTERS_CARD"] = "sl_voters_card";
  // Gambia
  DocumentType["GAMBIA_ID"] = "gm_id";
  DocumentType["GAMBIA_DRIVERS_LICENSE"] = "gm_drivers_license";
  // UK
  DocumentType["UK_DRIVERS_LICENSE"] = "uk_drivers_license";
  DocumentType["UK_BRP"] = "uk_brp";
  // Canada
  DocumentType["CANADA_DRIVERS_LICENSE"] = "ca_drivers_license";
  DocumentType["CANADA_PR_CARD"] = "ca_pr_card";
  DocumentType["CANADA_NATIONAL_ID"] = "ca_national_id";
  // India
  DocumentType["INDIA_DRIVERS_LICENSE"] = "in_drivers_license";
  // EU Residence Permits
  DocumentType["DE_RESIDENCE_PERMIT"] = "de_rp";
  DocumentType["FR_RESIDENCE_PERMIT"] = "fr_rp";
  DocumentType["IT_RESIDENCE_PERMIT"] = "it_rp";
  DocumentType["ES_RESIDENCE_PERMIT"] = "es_rp";
  DocumentType["IE_RESIDENCE_PERMIT"] = "ie_rp";
  DocumentType["PT_RESIDENCE_PERMIT"] = "pt_rp";
  DocumentType["SE_RESIDENCE_PERMIT"] = "se_rp";
  DocumentType["DK_RESIDENCE_PERMIT"] = "dk_rp";
  DocumentType["NO_RESIDENCE_PERMIT"] = "no_rp";
  DocumentType["FI_RESIDENCE_PERMIT"] = "fi_rp";
  DocumentType["PL_RESIDENCE_PERMIT"] = "pl_rp";
  return DocumentType;
}({}); // ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Verification
// ---------------------------------------------------------------------------
/**
 * Per-feature verification scores (0-100 scale).
 * `overall` is the fused risk score (also exposed top-level as `Verification.riskScore`).
 */
// ---------------------------------------------------------------------------
// Document Quality (forward-declaration for future native SDK support)
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Verification Flow Result
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Start Verification Options
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Error Codes
// ---------------------------------------------------------------------------
let KoraErrorCode = exports.KoraErrorCode = /*#__PURE__*/function (KoraErrorCode) {
  // Configuration errors
  KoraErrorCode["NOT_CONFIGURED"] = "NOT_CONFIGURED";
  KoraErrorCode["INVALID_API_KEY"] = "INVALID_API_KEY";
  KoraErrorCode["INVALID_TENANT_ID"] = "INVALID_TENANT_ID";
  // Network errors
  KoraErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
  KoraErrorCode["TIMEOUT"] = "TIMEOUT";
  KoraErrorCode["NO_INTERNET"] = "NO_INTERNET";
  // HTTP errors
  KoraErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
  KoraErrorCode["FORBIDDEN"] = "FORBIDDEN";
  KoraErrorCode["NOT_FOUND"] = "NOT_FOUND";
  KoraErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
  KoraErrorCode["RATE_LIMITED"] = "RATE_LIMITED";
  KoraErrorCode["SERVER_ERROR"] = "SERVER_ERROR";
  KoraErrorCode["HTTP_ERROR"] = "HTTP_ERROR";
  // Response errors
  KoraErrorCode["INVALID_RESPONSE"] = "INVALID_RESPONSE";
  KoraErrorCode["NO_DATA"] = "NO_DATA";
  KoraErrorCode["DECODING_ERROR"] = "DECODING_ERROR";
  KoraErrorCode["ENCODING_ERROR"] = "ENCODING_ERROR";
  // Capture errors
  KoraErrorCode["CAMERA_ACCESS_DENIED"] = "CAMERA_ACCESS_DENIED";
  KoraErrorCode["CAMERA_NOT_AVAILABLE"] = "CAMERA_NOT_AVAILABLE";
  KoraErrorCode["CAPTURE_FAILED"] = "CAPTURE_FAILED";
  KoraErrorCode["QUALITY_VALIDATION_FAILED"] = "QUALITY_VALIDATION_FAILED";
  // Document errors
  KoraErrorCode["DOCUMENT_NOT_DETECTED"] = "DOCUMENT_NOT_DETECTED";
  KoraErrorCode["DOCUMENT_TYPE_NOT_SUPPORTED"] = "DOCUMENT_TYPE_NOT_SUPPORTED";
  KoraErrorCode["MRZ_READ_FAILED"] = "MRZ_READ_FAILED";
  KoraErrorCode["NFC_NOT_AVAILABLE"] = "NFC_NOT_AVAILABLE";
  KoraErrorCode["NFC_READ_FAILED"] = "NFC_READ_FAILED";
  // Face errors
  KoraErrorCode["FACE_NOT_DETECTED"] = "FACE_NOT_DETECTED";
  KoraErrorCode["MULTIPLE_FACES_DETECTED"] = "MULTIPLE_FACES_DETECTED";
  KoraErrorCode["FACE_MATCH_FAILED"] = "FACE_MATCH_FAILED";
  // Liveness errors
  KoraErrorCode["LIVENESS_CHECK_FAILED"] = "LIVENESS_CHECK_FAILED";
  KoraErrorCode["CHALLENGE_NOT_COMPLETED"] = "CHALLENGE_NOT_COMPLETED";
  KoraErrorCode["SESSION_EXPIRED"] = "SESSION_EXPIRED";
  // Verification errors
  KoraErrorCode["VERIFICATION_EXPIRED"] = "VERIFICATION_EXPIRED";
  KoraErrorCode["VERIFICATION_ALREADY_COMPLETED"] = "VERIFICATION_ALREADY_COMPLETED";
  KoraErrorCode["INVALID_VERIFICATION_STATE"] = "INVALID_VERIFICATION_STATE";
  // Generic errors
  KoraErrorCode["UNKNOWN"] = "UNKNOWN";
  KoraErrorCode["USER_CANCELLED"] = "USER_CANCELLED";
  // React Native specific
  KoraErrorCode["NOT_IMPLEMENTED"] = "NOT_IMPLEMENTED";
  return KoraErrorCode;
}({}); // ---------------------------------------------------------------------------
// Error Messages & Recovery Suggestions
// ---------------------------------------------------------------------------
const errorMessages = {
  [KoraErrorCode.NOT_CONFIGURED]: 'SDK not configured. Call KoraIDV.configure() first.',
  [KoraErrorCode.INVALID_API_KEY]: 'Invalid API key provided.',
  [KoraErrorCode.INVALID_TENANT_ID]: 'Invalid tenant ID provided.',
  [KoraErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection.',
  [KoraErrorCode.TIMEOUT]: 'Request timed out. Please try again.',
  [KoraErrorCode.NO_INTERNET]: 'No internet connection.',
  [KoraErrorCode.UNAUTHORIZED]: 'Authentication failed. Check your API key.',
  [KoraErrorCode.FORBIDDEN]: 'Access denied.',
  [KoraErrorCode.NOT_FOUND]: 'Resource not found.',
  [KoraErrorCode.VALIDATION_ERROR]: 'Validation error.',
  [KoraErrorCode.RATE_LIMITED]: 'Rate limit exceeded. Please try again later.',
  [KoraErrorCode.SERVER_ERROR]: 'Server error. Please try again later.',
  [KoraErrorCode.HTTP_ERROR]: 'HTTP error occurred.',
  [KoraErrorCode.INVALID_RESPONSE]: 'Invalid response from server.',
  [KoraErrorCode.NO_DATA]: 'No data received from server.',
  [KoraErrorCode.DECODING_ERROR]: 'Failed to parse response.',
  [KoraErrorCode.ENCODING_ERROR]: 'Failed to encode request.',
  [KoraErrorCode.CAMERA_ACCESS_DENIED]: 'Camera access denied. Please enable camera access in Settings.',
  [KoraErrorCode.CAMERA_NOT_AVAILABLE]: 'Camera not available on this device.',
  [KoraErrorCode.CAPTURE_FAILED]: 'Capture failed.',
  [KoraErrorCode.QUALITY_VALIDATION_FAILED]: 'Quality check failed.',
  [KoraErrorCode.DOCUMENT_NOT_DETECTED]: 'Document not detected. Position document in frame.',
  [KoraErrorCode.DOCUMENT_TYPE_NOT_SUPPORTED]: 'Document type not supported.',
  [KoraErrorCode.MRZ_READ_FAILED]: 'Could not read document MRZ.',
  [KoraErrorCode.NFC_NOT_AVAILABLE]: 'NFC is not available on this device.',
  [KoraErrorCode.NFC_READ_FAILED]: 'NFC read failed. Hold device steady against the chip.',
  [KoraErrorCode.FACE_NOT_DETECTED]: 'Face not detected. Position face in frame.',
  [KoraErrorCode.MULTIPLE_FACES_DETECTED]: 'Multiple faces detected. Show only one face.',
  [KoraErrorCode.FACE_MATCH_FAILED]: 'Face match failed.',
  [KoraErrorCode.LIVENESS_CHECK_FAILED]: 'Liveness check failed.',
  [KoraErrorCode.CHALLENGE_NOT_COMPLETED]: 'Challenge not completed.',
  [KoraErrorCode.SESSION_EXPIRED]: 'Session expired. Please start over.',
  [KoraErrorCode.VERIFICATION_EXPIRED]: 'Verification expired. Please start a new one.',
  [KoraErrorCode.VERIFICATION_ALREADY_COMPLETED]: 'Verification already completed.',
  [KoraErrorCode.INVALID_VERIFICATION_STATE]: 'Invalid verification state.',
  [KoraErrorCode.UNKNOWN]: 'An unknown error occurred.',
  [KoraErrorCode.USER_CANCELLED]: 'Verification cancelled.',
  [KoraErrorCode.NOT_IMPLEMENTED]: 'This feature is not yet implemented on this platform.'
};
const recoverySuggestions = {
  [KoraErrorCode.CAMERA_ACCESS_DENIED]: 'Go to Settings and enable camera access for this app.',
  [KoraErrorCode.NO_INTERNET]: 'Check your Wi-Fi or cellular connection.',
  [KoraErrorCode.TIMEOUT]: 'Please wait a moment and try again.',
  [KoraErrorCode.RATE_LIMITED]: 'Please wait a moment and try again.',
  [KoraErrorCode.SERVER_ERROR]: 'Please wait a moment and try again.',
  [KoraErrorCode.DOCUMENT_NOT_DETECTED]: 'Place document on flat surface with good lighting.',
  [KoraErrorCode.FACE_NOT_DETECTED]: 'Ensure good lighting and center your face.',
  [KoraErrorCode.QUALITY_VALIDATION_FAILED]: 'Hold device steady and ensure good lighting.'
};

// ---------------------------------------------------------------------------
// KoraError class
// ---------------------------------------------------------------------------

class KoraError extends Error {
  constructor(code, message, details) {
    super(message ?? errorMessages[code] ?? 'An error occurred');
    this.name = 'KoraError';
    this.code = code;
    this.recoverySuggestion = recoverySuggestions[code];
    this.details = details;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KoraError);
    }
  }
  get isRetryable() {
    return [KoraErrorCode.NETWORK_ERROR, KoraErrorCode.TIMEOUT, KoraErrorCode.RATE_LIMITED, KoraErrorCode.SERVER_ERROR].includes(this.code);
  }
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      recoverySuggestion: this.recoverySuggestion,
      details: this.details
    };
  }
}
exports.KoraError = KoraError;
//# sourceMappingURL=types.js.map