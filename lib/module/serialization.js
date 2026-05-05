/**
 * Serialization helpers for bridging JSON ↔ typed objects
 *
 * Data crosses the native bridge as JSON strings. These helpers
 * convert between our TypeScript types and the JSON payloads
 * expected by the native modules.
 */

import { KoraError, KoraErrorCode } from './types';

// ---------------------------------------------------------------------------
// Configuration → JSON (sent to native)
// ---------------------------------------------------------------------------

export function serializeConfiguration(config) {
  const payload = {
    apiKey: config.apiKey,
    tenantId: config.tenantId
  };
  if (config.environment !== undefined) {
    payload.environment = config.environment;
  }
  if (config.baseUrl !== undefined) {
    payload.baseUrl = config.baseUrl;
  }
  if (config.documentTypes !== undefined) {
    payload.documentTypes = config.documentTypes;
  }
  if (config.livenessMode !== undefined) {
    payload.livenessMode = config.livenessMode;
  }
  if (config.theme !== undefined) {
    payload.theme = config.theme;
  }
  if (config.timeout !== undefined) {
    payload.timeout = config.timeout;
  }
  if (config.debugLogging !== undefined) {
    payload.debugLogging = config.debugLogging;
  }
  if (config.resultPageMode !== undefined) {
    payload.resultPageMode = config.resultPageMode;
  }
  if (config.customMessages !== undefined) {
    payload.customMessages = config.customMessages;
  }
  return JSON.stringify(payload);
}

// ---------------------------------------------------------------------------
// JSON → Verification result (received from native)
// ---------------------------------------------------------------------------

export function deserializeResult(json) {
  const raw = JSON.parse(json);
  if (raw.type === 'cancelled') {
    return {
      type: 'cancelled'
    };
  }
  if (raw.type === 'success') {
    const verification = deserializeVerification(raw.verification);
    return {
      type: 'success',
      verification
    };
  }
  throw new KoraError(KoraErrorCode.INVALID_RESPONSE, `Unknown result type: ${String(raw.type)}`);
}

// ---------------------------------------------------------------------------
// JSON → KoraError (received from native Promise rejection)
// ---------------------------------------------------------------------------

export function deserializeError(code, message) {
  const errorCode = isKoraErrorCode(code) ? code : KoraErrorCode.UNKNOWN;
  return new KoraError(errorCode, message);
}
function isKoraErrorCode(code) {
  return Object.values(KoraErrorCode).includes(code);
}

// ---------------------------------------------------------------------------
// Verification deserialization
// ---------------------------------------------------------------------------

function deserializeVerification(raw) {
  return {
    id: raw.id,
    externalId: raw.externalId,
    tenantId: raw.tenantId,
    tier: raw.tier,
    status: raw.status,
    documentVerification: raw.documentVerification ? deserializeDocumentVerification(raw.documentVerification) : null,
    faceVerification: raw.faceVerification ? deserializeFaceVerification(raw.faceVerification) : null,
    livenessVerification: raw.livenessVerification ? deserializeLivenessVerification(raw.livenessVerification) : null,
    scores: raw.scores ? deserializeVerificationScores(raw.scores) : null,
    riskSignals: raw.riskSignals ? raw.riskSignals.map(deserializeRiskSignal) : null,
    riskScore: raw.riskScore ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    completedAt: raw.completedAt ?? null
  };
}
function deserializeDocumentVerification(raw) {
  return {
    documentType: raw.documentType,
    documentNumber: raw.documentNumber ?? null,
    firstName: raw.firstName ?? null,
    lastName: raw.lastName ?? null,
    dateOfBirth: raw.dateOfBirth ?? null,
    expirationDate: raw.expirationDate ?? null,
    issuingCountry: raw.issuingCountry ?? null,
    mrzValid: raw.mrzValid ?? null,
    authenticityScore: raw.authenticityScore ?? null,
    extractedFields: raw.extractedFields ?? null
  };
}
function deserializeFaceVerification(raw) {
  return {
    matchScore: raw.matchScore,
    matchResult: raw.matchResult,
    confidence: raw.confidence
  };
}
function deserializeLivenessVerification(raw) {
  return {
    livenessScore: raw.livenessScore,
    isLive: raw.isLive,
    challengeResults: raw.challengeResults ? raw.challengeResults.map(deserializeChallengeResult) : null
  };
}
function deserializeChallengeResult(raw) {
  return {
    type: raw.type,
    passed: raw.passed,
    confidence: raw.confidence
  };
}
function deserializeRiskSignal(raw) {
  return {
    code: raw.code,
    severity: raw.severity,
    message: raw.message
  };
}
function deserializeVerificationScores(raw) {
  return {
    documentQuality: raw.documentQuality ?? 0,
    documentAuth: raw.documentAuth ?? 0,
    faceMatch: raw.faceMatch ?? 0,
    liveness: raw.liveness ?? 0,
    nameMatch: raw.nameMatch ?? 0,
    dataConsistency: raw.dataConsistency ?? 0,
    screening: raw.screening ?? 0,
    overall: raw.overall ?? 0
  };
}
//# sourceMappingURL=serialization.js.map