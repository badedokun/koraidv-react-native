import {
  serializeConfiguration,
  deserializeResult,
  deserializeError,
} from '../src/serialization';
import {
  KoraErrorCode,
  KoraError,
  DocumentType,
} from '../src/types';

describe('serializeConfiguration', () => {
  it('serializes minimal configuration', () => {
    const json = serializeConfiguration({
      apiKey: 'ck_live_test',
      tenantId: 'tenant-123',
    });

    const parsed = JSON.parse(json);
    expect(parsed.apiKey).toBe('ck_live_test');
    expect(parsed.tenantId).toBe('tenant-123');
    expect(parsed.environment).toBeUndefined();
  });

  it('serializes full configuration', () => {
    const json = serializeConfiguration({
      apiKey: 'ck_sandbox_test',
      tenantId: 'tenant-456',
      environment: 'sandbox',
      baseUrl: 'https://custom.api.com',
      documentTypes: [DocumentType.INTERNATIONAL_PASSPORT, DocumentType.GHANA_CARD],
      livenessMode: 'active',
      theme: { primaryColor: '#2563EB' },
      timeout: 300,
      debugLogging: true,
    });

    const parsed = JSON.parse(json);
    expect(parsed.apiKey).toBe('ck_sandbox_test');
    expect(parsed.tenantId).toBe('tenant-456');
    expect(parsed.environment).toBe('sandbox');
    expect(parsed.baseUrl).toBe('https://custom.api.com');
    expect(parsed.documentTypes).toEqual(['international_passport', 'ghana_card']);
    expect(parsed.livenessMode).toBe('active');
    expect(parsed.theme).toEqual({ primaryColor: '#2563EB' });
    expect(parsed.timeout).toBe(300);
    expect(parsed.debugLogging).toBe(true);
  });

  it('omits undefined optional fields', () => {
    const json = serializeConfiguration({
      apiKey: 'ck_live_test',
      tenantId: 'tenant-123',
      livenessMode: 'passive',
    });

    const parsed = JSON.parse(json);
    expect(parsed.livenessMode).toBe('passive');
    expect(parsed).not.toHaveProperty('baseUrl');
    expect(parsed).not.toHaveProperty('documentTypes');
    expect(parsed).not.toHaveProperty('theme');
    expect(parsed).not.toHaveProperty('timeout');
    expect(parsed).not.toHaveProperty('debugLogging');
  });

  // REQ-005 · Native plugin bridges (ios/KoraIDVReactNative.swift +
  // android/KoraIDVReactNativeModule.kt) read these two keys off the JSON.
  // Guard the wire format so either side can't silently diverge.
  it('serializes resultPageMode as lowercase string', () => {
    const json = serializeConfiguration({
      apiKey: 'ck_live_test',
      tenantId: 'tenant-123',
      resultPageMode: 'simplified',
    });

    const parsed = JSON.parse(json);
    expect(parsed.resultPageMode).toBe('simplified');
  });

  it('serializes customMessages as a nested object', () => {
    const json = serializeConfiguration({
      apiKey: 'ck_live_test',
      tenantId: 'tenant-123',
      customMessages: {
        successTitle: 'All set!',
        failedMessage: 'Try again.',
      },
    });

    const parsed = JSON.parse(json);
    expect(parsed.customMessages).toEqual({
      successTitle: 'All set!',
      failedMessage: 'Try again.',
    });
  });
});

describe('deserializeResult', () => {
  it('deserializes cancelled result', () => {
    const result = deserializeResult('{"type":"cancelled"}');
    expect(result).toEqual({ type: 'cancelled' });
  });

  it('deserializes success result with full verification', () => {
    const json = JSON.stringify({
      type: 'success',
      verification: {
        id: 'ver-001',
        externalId: 'user-123',
        tenantId: 'tenant-456',
        tier: 'standard',
        status: 'approved',
        documentVerification: {
          documentType: 'international_passport',
          documentNumber: 'AB123456',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-15',
          expirationDate: '2030-06-01',
          issuingCountry: 'US',
          mrzValid: true,
          authenticityScore: 0.95,
          extractedFields: { nationality: 'USA' },
        },
        faceVerification: {
          matchScore: 0.92,
          matchResult: 'match',
          confidence: 0.98,
        },
        livenessVerification: {
          livenessScore: 0.97,
          isLive: true,
          challengeResults: [
            { type: 'blink', passed: true, confidence: 0.99 },
            { type: 'smile', passed: true, confidence: 0.95 },
          ],
        },
        riskSignals: [
          { code: 'LOW_QUALITY', severity: 'warning', message: 'Image slightly blurry' },
        ],
        riskScore: 15,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:05:00Z',
        completedAt: '2024-01-15T10:05:00Z',
      },
    });

    const result = deserializeResult(json);
    expect(result.type).toBe('success');

    if (result.type === 'success') {
      const v = result.verification;
      expect(v.id).toBe('ver-001');
      expect(v.externalId).toBe('user-123');
      expect(v.status).toBe('approved');
      expect(v.documentVerification?.documentNumber).toBe('AB123456');
      expect(v.documentVerification?.mrzValid).toBe(true);
      expect(v.faceVerification?.matchScore).toBe(0.92);
      expect(v.livenessVerification?.isLive).toBe(true);
      expect(v.livenessVerification?.challengeResults).toHaveLength(2);
      expect(v.riskSignals).toHaveLength(1);
      expect(v.riskScore).toBe(15);
      expect(v.completedAt).toBe('2024-01-15T10:05:00Z');
    }
  });

  it('deserializes success result with minimal verification', () => {
    const json = JSON.stringify({
      type: 'success',
      verification: {
        id: 'ver-002',
        externalId: 'user-456',
        tenantId: 'tenant-789',
        tier: 'basic',
        status: 'pending',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
    });

    const result = deserializeResult(json);
    if (result.type === 'success') {
      expect(result.verification.documentVerification).toBeNull();
      expect(result.verification.faceVerification).toBeNull();
      expect(result.verification.livenessVerification).toBeNull();
      expect(result.verification.riskSignals).toBeNull();
      expect(result.verification.riskScore).toBeNull();
      expect(result.verification.completedAt).toBeNull();
    }
  });

  it('throws on unknown result type', () => {
    expect(() => {
      deserializeResult('{"type":"unknown_type"}');
    }).toThrow(KoraError);
  });
});

describe('deserializeError', () => {
  it('creates KoraError with known error code', () => {
    const error = deserializeError('UNAUTHORIZED', 'Auth failed');
    expect(error).toBeInstanceOf(KoraError);
    expect(error.code).toBe(KoraErrorCode.UNAUTHORIZED);
    expect(error.message).toBe('Auth failed');
  });

  it('falls back to UNKNOWN for unrecognized codes', () => {
    const error = deserializeError('SOMETHING_NEW', 'Unexpected');
    expect(error.code).toBe(KoraErrorCode.UNKNOWN);
    expect(error.message).toBe('Unexpected');
  });

  it('preserves recovery suggestion from known codes', () => {
    const error = deserializeError('CAMERA_ACCESS_DENIED', 'Camera denied');
    expect(error.recoverySuggestion).toBeDefined();
    expect(error.recoverySuggestion).toContain('Settings');
  });
});
