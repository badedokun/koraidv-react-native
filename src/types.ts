/**
 * Kora IDV React Native SDK — TypeScript types
 *
 * Self-contained (no dependency on @koraidv/core).
 * Mirrors the same types for API consistency across platforms.
 */

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export interface KoraIDVConfiguration {
  /** API key for authentication (starts with ck_live_, ck_sandbox_, kora_live_, or kora_sandbox_) */
  apiKey: string;

  /** Tenant ID (UUID) */
  tenantId: string;

  /** API environment (auto-detected from API key prefix if omitted) */
  environment?: Environment;

  /** Custom base URL override (e.g., for self-hosted deployments) */
  baseUrl?: string;

  /** Allowed document types (default: all) */
  documentTypes?: DocumentType[];

  /** Liveness detection mode (default: 'active') */
  livenessMode?: LivenessMode;

  /** Custom theme for UI customization */
  theme?: Partial<Theme>;

  /** Session timeout in seconds (default: 600) */
  timeout?: number;

  /** Enable debug logging (default: false) */
  debugLogging?: boolean;
}

export type Environment = 'production' | 'sandbox';

export type LivenessMode = 'active' | 'passive';

// ---------------------------------------------------------------------------
// Document Types
// ---------------------------------------------------------------------------

export enum DocumentType {
  // US Documents
  US_DRIVERS_LICENSE = 'us_drivers_license',
  US_STATE_ID = 'us_state_id',
  US_GREEN_CARD = 'us_green_card',

  // Passport (all countries)
  INTERNATIONAL_PASSPORT = 'international_passport',

  // EU ID Cards
  EU_ID_GERMANY = 'eu_id_de',
  EU_ID_FRANCE = 'eu_id_fr',
  EU_ID_SPAIN = 'eu_id_es',
  EU_ID_ITALY = 'eu_id_it',

  // Africa
  GHANA_CARD = 'ghana_card',
  NIGERIA_NIN = 'ng_nin',
  NIGERIA_DRIVERS_LICENSE = 'ng_drivers_license',
  GHANA_DRIVERS_LICENSE = 'gh_drivers_license',
  KENYA_ID = 'ke_id',
  KENYA_DRIVERS_LICENSE = 'ke_drivers_license',
  SOUTH_AFRICA_ID = 'za_id',
  SOUTH_AFRICA_DRIVERS_LICENSE = 'za_drivers_license',

  // UK
  UK_DRIVERS_LICENSE = 'uk_drivers_license',

  // Canada
  CANADA_DRIVERS_LICENSE = 'ca_drivers_license',

  // India
  INDIA_DRIVERS_LICENSE = 'in_drivers_license',
}

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

export interface Theme {
  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  errorColor: string;
  successColor: string;
  borderRadius: number;
  fontFamily: string | null;
}

// ---------------------------------------------------------------------------
// Verification
// ---------------------------------------------------------------------------

export type VerificationTier = 'basic' | 'standard' | 'enhanced';

export type VerificationStatus =
  | 'pending'
  | 'document_required'
  | 'selfie_required'
  | 'liveness_required'
  | 'processing'
  | 'approved'
  | 'rejected'
  | 'review_required'
  | 'expired';

export interface Verification {
  id: string;
  externalId: string;
  tenantId: string;
  tier: string;
  status: VerificationStatus;
  documentVerification: DocumentVerification | null;
  faceVerification: FaceVerification | null;
  livenessVerification: LivenessVerification | null;
  riskSignals: RiskSignal[] | null;
  riskScore: number | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface DocumentVerification {
  documentType: string;
  documentNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  expirationDate: string | null;
  issuingCountry: string | null;
  mrzValid: boolean | null;
  authenticityScore: number | null;
  extractedFields: Record<string, string> | null;
}

export interface FaceVerification {
  matchScore: number;
  matchResult: string;
  confidence: number;
}

export interface LivenessVerification {
  livenessScore: number;
  isLive: boolean;
  challengeResults: ChallengeResult[] | null;
}

export interface ChallengeResult {
  type: string;
  passed: boolean;
  confidence: number;
}

export interface RiskSignal {
  code: string;
  severity: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Verification Flow Result
// ---------------------------------------------------------------------------

export type VerificationFlowResult =
  | { type: 'success'; verification: Verification }
  | { type: 'cancelled' };

// ---------------------------------------------------------------------------
// Start Verification Options
// ---------------------------------------------------------------------------

export interface StartVerificationOptions {
  /** Override document types for this verification */
  documentTypes?: DocumentType[];
}

// ---------------------------------------------------------------------------
// Error Codes
// ---------------------------------------------------------------------------

export enum KoraErrorCode {
  // Configuration errors
  NOT_CONFIGURED = 'NOT_CONFIGURED',
  INVALID_API_KEY = 'INVALID_API_KEY',
  INVALID_TENANT_ID = 'INVALID_TENANT_ID',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  NO_INTERNET = 'NO_INTERNET',

  // HTTP errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR',
  HTTP_ERROR = 'HTTP_ERROR',

  // Response errors
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  NO_DATA = 'NO_DATA',
  DECODING_ERROR = 'DECODING_ERROR',
  ENCODING_ERROR = 'ENCODING_ERROR',

  // Capture errors
  CAMERA_ACCESS_DENIED = 'CAMERA_ACCESS_DENIED',
  CAMERA_NOT_AVAILABLE = 'CAMERA_NOT_AVAILABLE',
  CAPTURE_FAILED = 'CAPTURE_FAILED',
  QUALITY_VALIDATION_FAILED = 'QUALITY_VALIDATION_FAILED',

  // Document errors
  DOCUMENT_NOT_DETECTED = 'DOCUMENT_NOT_DETECTED',
  DOCUMENT_TYPE_NOT_SUPPORTED = 'DOCUMENT_TYPE_NOT_SUPPORTED',
  MRZ_READ_FAILED = 'MRZ_READ_FAILED',

  // Face errors
  FACE_NOT_DETECTED = 'FACE_NOT_DETECTED',
  MULTIPLE_FACES_DETECTED = 'MULTIPLE_FACES_DETECTED',
  FACE_MATCH_FAILED = 'FACE_MATCH_FAILED',

  // Liveness errors
  LIVENESS_CHECK_FAILED = 'LIVENESS_CHECK_FAILED',
  CHALLENGE_NOT_COMPLETED = 'CHALLENGE_NOT_COMPLETED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Verification errors
  VERIFICATION_EXPIRED = 'VERIFICATION_EXPIRED',
  VERIFICATION_ALREADY_COMPLETED = 'VERIFICATION_ALREADY_COMPLETED',
  INVALID_VERIFICATION_STATE = 'INVALID_VERIFICATION_STATE',

  // Generic errors
  UNKNOWN = 'UNKNOWN',
  USER_CANCELLED = 'USER_CANCELLED',

  // React Native specific
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
}

// ---------------------------------------------------------------------------
// Error Messages & Recovery Suggestions
// ---------------------------------------------------------------------------

const errorMessages: Record<KoraErrorCode, string> = {
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
  [KoraErrorCode.NOT_IMPLEMENTED]: 'This feature is not yet implemented on this platform.',
};

const recoverySuggestions: Partial<Record<KoraErrorCode, string>> = {
  [KoraErrorCode.CAMERA_ACCESS_DENIED]: 'Go to Settings and enable camera access for this app.',
  [KoraErrorCode.NO_INTERNET]: 'Check your Wi-Fi or cellular connection.',
  [KoraErrorCode.TIMEOUT]: 'Please wait a moment and try again.',
  [KoraErrorCode.RATE_LIMITED]: 'Please wait a moment and try again.',
  [KoraErrorCode.SERVER_ERROR]: 'Please wait a moment and try again.',
  [KoraErrorCode.DOCUMENT_NOT_DETECTED]: 'Place document on flat surface with good lighting.',
  [KoraErrorCode.FACE_NOT_DETECTED]: 'Ensure good lighting and center your face.',
  [KoraErrorCode.QUALITY_VALIDATION_FAILED]: 'Hold device steady and ensure good lighting.',
};

// ---------------------------------------------------------------------------
// KoraError class
// ---------------------------------------------------------------------------

export class KoraError extends Error {
  readonly code: KoraErrorCode;
  readonly recoverySuggestion?: string;
  readonly details?: unknown;

  constructor(code: KoraErrorCode, message?: string, details?: unknown) {
    super(message ?? errorMessages[code] ?? 'An error occurred');

    this.name = 'KoraError';
    this.code = code;
    this.recoverySuggestion = recoverySuggestions[code];
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KoraError);
    }
  }

  get isRetryable(): boolean {
    return [
      KoraErrorCode.NETWORK_ERROR,
      KoraErrorCode.TIMEOUT,
      KoraErrorCode.RATE_LIMITED,
      KoraErrorCode.SERVER_ERROR,
    ].includes(this.code);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      recoverySuggestion: this.recoverySuggestion,
      details: this.details,
    };
  }
}
