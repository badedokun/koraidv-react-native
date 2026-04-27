/**
 * Kora IDV React Native SDK — TypeScript types
 *
 * Self-contained (no dependency on @koraidv/core).
 * Mirrors the same types for API consistency across platforms.
 */
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
    /**
     * Result page mode (REQ-005). In 'simplified' mode the SDK shows only
     * Success / Failed / Review with no scores or metrics. Overrides the
     * tenant-level `result_page_mode` setting when provided.
     */
    resultPageMode?: ResultPageMode;
    /** Optional per-outcome copy overrides for the simplified result page. */
    customMessages?: ResultPageMessages;
}
export type Environment = 'production' | 'sandbox';
export type LivenessMode = 'active' | 'passive';
export type ResultPageMode = 'detailed' | 'simplified';
export interface ResultPageMessages {
    successTitle?: string;
    successMessage?: string;
    failedTitle?: string;
    failedMessage?: string;
    reviewTitle?: string;
    reviewMessage?: string;
}
/**
 * Common document type codes.
 *
 * Note: This is a convenience subset. The full list of supported document types
 * (270+) is fetched dynamically by the native iOS/Android SDKs. New types are
 * available without SDK updates.
 */
export declare enum DocumentType {
    US_DRIVERS_LICENSE = "us_drivers_license",
    US_STATE_ID = "us_state_id",
    US_GREEN_CARD = "us_green_card",
    INTERNATIONAL_PASSPORT = "international_passport",
    EU_ID_GERMANY = "eu_id_de",
    EU_ID_FRANCE = "eu_id_fr",
    EU_ID_SPAIN = "eu_id_es",
    EU_ID_ITALY = "eu_id_it",
    GHANA_CARD = "ghana_card",
    NIGERIA_NIN = "ng_nin",
    NIGERIA_DRIVERS_LICENSE = "ng_drivers_license",
    GHANA_DRIVERS_LICENSE = "gh_drivers_license",
    KENYA_ID = "ke_id",
    KENYA_DRIVERS_LICENSE = "ke_drivers_license",
    SOUTH_AFRICA_ID = "za_id",
    SOUTH_AFRICA_DRIVERS_LICENSE = "za_drivers_license",
    NIGERIA_VOTERS_CARD = "ng_voters_card",
    LIBERIA_ID = "lr_id",
    LIBERIA_DRIVERS_LICENSE = "lr_drivers_license",
    LIBERIA_VOTERS_CARD = "lr_voters_card",
    SIERRA_LEONE_ID = "sl_id",
    SIERRA_LEONE_DRIVERS_LICENSE = "sl_drivers_license",
    SIERRA_LEONE_VOTERS_CARD = "sl_voters_card",
    GAMBIA_ID = "gm_id",
    GAMBIA_DRIVERS_LICENSE = "gm_drivers_license",
    UK_DRIVERS_LICENSE = "uk_drivers_license",
    UK_BRP = "uk_brp",
    CANADA_DRIVERS_LICENSE = "ca_drivers_license",
    CANADA_PR_CARD = "ca_pr_card",
    CANADA_NATIONAL_ID = "ca_national_id",
    INDIA_DRIVERS_LICENSE = "in_drivers_license",
    DE_RESIDENCE_PERMIT = "de_rp",
    FR_RESIDENCE_PERMIT = "fr_rp",
    IT_RESIDENCE_PERMIT = "it_rp",
    ES_RESIDENCE_PERMIT = "es_rp",
    IE_RESIDENCE_PERMIT = "ie_rp",
    PT_RESIDENCE_PERMIT = "pt_rp",
    SE_RESIDENCE_PERMIT = "se_rp",
    DK_RESIDENCE_PERMIT = "dk_rp",
    NO_RESIDENCE_PERMIT = "no_rp",
    FI_RESIDENCE_PERMIT = "fi_rp",
    PL_RESIDENCE_PERMIT = "pl_rp"
}
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
export type VerificationTier = 'basic' | 'standard' | 'enhanced';
export type VerificationStatus = 'pending' | 'document_required' | 'selfie_required' | 'liveness_required' | 'processing' | 'approved' | 'rejected' | 'review_required' | 'expired';
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
export interface DocumentQualityResult {
    qualityScore: number;
    qualityIssues: string[];
    details: {
        textReadability: number;
        faceQuality: number;
        imageClarity: number;
    };
}
export type VerificationFlowResult = {
    type: 'success';
    verification: Verification;
} | {
    type: 'cancelled';
};
export interface StartVerificationOptions {
    /** Override document types for this verification */
    documentTypes?: DocumentType[];
}
export declare enum KoraErrorCode {
    NOT_CONFIGURED = "NOT_CONFIGURED",
    INVALID_API_KEY = "INVALID_API_KEY",
    INVALID_TENANT_ID = "INVALID_TENANT_ID",
    NETWORK_ERROR = "NETWORK_ERROR",
    TIMEOUT = "TIMEOUT",
    NO_INTERNET = "NO_INTERNET",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    NOT_FOUND = "NOT_FOUND",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    RATE_LIMITED = "RATE_LIMITED",
    SERVER_ERROR = "SERVER_ERROR",
    HTTP_ERROR = "HTTP_ERROR",
    INVALID_RESPONSE = "INVALID_RESPONSE",
    NO_DATA = "NO_DATA",
    DECODING_ERROR = "DECODING_ERROR",
    ENCODING_ERROR = "ENCODING_ERROR",
    CAMERA_ACCESS_DENIED = "CAMERA_ACCESS_DENIED",
    CAMERA_NOT_AVAILABLE = "CAMERA_NOT_AVAILABLE",
    CAPTURE_FAILED = "CAPTURE_FAILED",
    QUALITY_VALIDATION_FAILED = "QUALITY_VALIDATION_FAILED",
    DOCUMENT_NOT_DETECTED = "DOCUMENT_NOT_DETECTED",
    DOCUMENT_TYPE_NOT_SUPPORTED = "DOCUMENT_TYPE_NOT_SUPPORTED",
    MRZ_READ_FAILED = "MRZ_READ_FAILED",
    FACE_NOT_DETECTED = "FACE_NOT_DETECTED",
    MULTIPLE_FACES_DETECTED = "MULTIPLE_FACES_DETECTED",
    FACE_MATCH_FAILED = "FACE_MATCH_FAILED",
    LIVENESS_CHECK_FAILED = "LIVENESS_CHECK_FAILED",
    CHALLENGE_NOT_COMPLETED = "CHALLENGE_NOT_COMPLETED",
    SESSION_EXPIRED = "SESSION_EXPIRED",
    VERIFICATION_EXPIRED = "VERIFICATION_EXPIRED",
    VERIFICATION_ALREADY_COMPLETED = "VERIFICATION_ALREADY_COMPLETED",
    INVALID_VERIFICATION_STATE = "INVALID_VERIFICATION_STATE",
    UNKNOWN = "UNKNOWN",
    USER_CANCELLED = "USER_CANCELLED",
    NOT_IMPLEMENTED = "NOT_IMPLEMENTED"
}
export declare class KoraError extends Error {
    readonly code: KoraErrorCode;
    readonly recoverySuggestion?: string;
    readonly details?: unknown;
    constructor(code: KoraErrorCode, message?: string, details?: unknown);
    get isRetryable(): boolean;
    toJSON(): {
        name: string;
        code: KoraErrorCode;
        message: string;
        recoverySuggestion: string | undefined;
        details: unknown;
    };
}
//# sourceMappingURL=types.d.ts.map