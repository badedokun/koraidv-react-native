/**
 * Serialization helpers for bridging JSON ↔ typed objects
 *
 * Data crosses the native bridge as JSON strings. These helpers
 * convert between our TypeScript types and the JSON payloads
 * expected by the native modules.
 */

import type {
  KoraIDVConfiguration,
  Verification,
  VerificationFlowResult,
  DocumentVerification,
  FaceVerification,
  LivenessVerification,
  ChallengeResult,
  RiskSignal,
} from './types';
import { KoraError, KoraErrorCode } from './types';

// ---------------------------------------------------------------------------
// Configuration → JSON (sent to native)
// ---------------------------------------------------------------------------

export function serializeConfiguration(config: KoraIDVConfiguration): string {
  const payload: Record<string, unknown> = {
    apiKey: config.apiKey,
    tenantId: config.tenantId,
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

  return JSON.stringify(payload);
}

// ---------------------------------------------------------------------------
// JSON → Verification result (received from native)
// ---------------------------------------------------------------------------

export function deserializeResult(json: string): VerificationFlowResult {
  const raw = JSON.parse(json) as Record<string, unknown>;

  if (raw.type === 'cancelled') {
    return { type: 'cancelled' };
  }

  if (raw.type === 'success') {
    const verification = deserializeVerification(
      raw.verification as Record<string, unknown>
    );
    return { type: 'success', verification };
  }

  throw new KoraError(
    KoraErrorCode.INVALID_RESPONSE,
    `Unknown result type: ${String(raw.type)}`
  );
}

// ---------------------------------------------------------------------------
// JSON → KoraError (received from native Promise rejection)
// ---------------------------------------------------------------------------

export function deserializeError(code: string, message: string): KoraError {
  const errorCode = isKoraErrorCode(code) ? code : KoraErrorCode.UNKNOWN;
  return new KoraError(errorCode, message);
}

function isKoraErrorCode(code: string): code is KoraErrorCode {
  return Object.values(KoraErrorCode).includes(code as KoraErrorCode);
}

// ---------------------------------------------------------------------------
// Verification deserialization
// ---------------------------------------------------------------------------

function deserializeVerification(raw: Record<string, unknown>): Verification {
  return {
    id: raw.id as string,
    externalId: raw.externalId as string,
    tenantId: raw.tenantId as string,
    tier: raw.tier as string,
    status: raw.status as Verification['status'],
    documentVerification: raw.documentVerification
      ? deserializeDocumentVerification(
          raw.documentVerification as Record<string, unknown>
        )
      : null,
    faceVerification: raw.faceVerification
      ? deserializeFaceVerification(
          raw.faceVerification as Record<string, unknown>
        )
      : null,
    livenessVerification: raw.livenessVerification
      ? deserializeLivenessVerification(
          raw.livenessVerification as Record<string, unknown>
        )
      : null,
    riskSignals: raw.riskSignals
      ? (raw.riskSignals as Record<string, unknown>[]).map(
          deserializeRiskSignal
        )
      : null,
    riskScore: (raw.riskScore as number) ?? null,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
    completedAt: (raw.completedAt as string) ?? null,
  };
}

function deserializeDocumentVerification(
  raw: Record<string, unknown>
): DocumentVerification {
  return {
    documentType: raw.documentType as string,
    documentNumber: (raw.documentNumber as string) ?? null,
    firstName: (raw.firstName as string) ?? null,
    lastName: (raw.lastName as string) ?? null,
    dateOfBirth: (raw.dateOfBirth as string) ?? null,
    expirationDate: (raw.expirationDate as string) ?? null,
    issuingCountry: (raw.issuingCountry as string) ?? null,
    mrzValid: (raw.mrzValid as boolean) ?? null,
    authenticityScore: (raw.authenticityScore as number) ?? null,
    extractedFields:
      (raw.extractedFields as Record<string, string>) ?? null,
  };
}

function deserializeFaceVerification(
  raw: Record<string, unknown>
): FaceVerification {
  return {
    matchScore: raw.matchScore as number,
    matchResult: raw.matchResult as string,
    confidence: raw.confidence as number,
  };
}

function deserializeLivenessVerification(
  raw: Record<string, unknown>
): LivenessVerification {
  return {
    livenessScore: raw.livenessScore as number,
    isLive: raw.isLive as boolean,
    challengeResults: raw.challengeResults
      ? (raw.challengeResults as Record<string, unknown>[]).map(
          deserializeChallengeResult
        )
      : null,
  };
}

function deserializeChallengeResult(
  raw: Record<string, unknown>
): ChallengeResult {
  return {
    type: raw.type as string,
    passed: raw.passed as boolean,
    confidence: raw.confidence as number,
  };
}

function deserializeRiskSignal(raw: Record<string, unknown>): RiskSignal {
  return {
    code: raw.code as string,
    severity: raw.severity as string,
    message: raw.message as string,
  };
}
