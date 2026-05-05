import { KoraErrorCode, KoraError } from '../src/types';

// Mock NativeModules before importing the module under test
const mockConfigure = jest.fn();
const mockStartVerification = jest.fn();
const mockResumeVerification = jest.fn();

jest.mock('react-native', () => ({
  NativeModules: {
    KoraIDVReactNative: {
      configure: mockConfigure,
      startVerification: mockStartVerification,
      resumeVerification: mockResumeVerification,
    },
  },
  Platform: {
    select: jest.fn((obj: Record<string, string>) => obj.default ?? ''),
  },
}));

import { KoraIDVModule } from '../src/KoraIDVModule';

beforeEach(() => {
  jest.clearAllMocks();
  KoraIDVModule.reset();
});

describe('KoraIDVModule', () => {
  describe('configure', () => {
    it('calls native configure with serialized JSON', () => {
      KoraIDVModule.configure({
        apiKey: 'ck_live_test',
        tenantId: 'tenant-123',
      });

      expect(mockConfigure).toHaveBeenCalledTimes(1);
      const json = JSON.parse(mockConfigure.mock.calls[0][0] as string);
      expect(json.apiKey).toBe('ck_live_test');
      expect(json.tenantId).toBe('tenant-123');
    });

    it('sets isConfigured to true', () => {
      expect(KoraIDVModule.isConfigured).toBe(false);

      KoraIDVModule.configure({
        apiKey: 'ck_live_test',
        tenantId: 'tenant-123',
      });

      expect(KoraIDVModule.isConfigured).toBe(true);
    });
  });

  describe('startVerification', () => {
    it('throws NOT_CONFIGURED if not configured', async () => {
      await expect(
        KoraIDVModule.startVerification('user-123')
      ).rejects.toThrow(KoraError);

      try {
        await KoraIDVModule.startVerification('user-123');
      } catch (err) {
        expect((err as KoraError).code).toBe(KoraErrorCode.NOT_CONFIGURED);
      }
    });

    it('returns success result', async () => {
      KoraIDVModule.configure({
        apiKey: 'ck_live_test',
        tenantId: 'tenant-123',
      });

      const resultJSON = JSON.stringify({
        type: 'success',
        verification: {
          id: 'ver-001',
          externalId: 'user-123',
          tenantId: 'tenant-123',
          tier: 'standard',
          status: 'approved',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:05:00Z',
        },
      });

      mockStartVerification.mockResolvedValueOnce(resultJSON);

      const result = await KoraIDVModule.startVerification('user-123', 'standard');

      expect(mockStartVerification).toHaveBeenCalledWith('user-123', 'standard', '{}');
      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.verification.id).toBe('ver-001');
        expect(result.verification.status).toBe('approved');
      }
    });

    it('returns cancelled result', async () => {
      KoraIDVModule.configure({
        apiKey: 'ck_live_test',
        tenantId: 'tenant-123',
      });

      mockStartVerification.mockResolvedValueOnce('{"type":"cancelled"}');

      const result = await KoraIDVModule.startVerification('user-123');
      expect(result.type).toBe('cancelled');
    });

    it('maps native Promise rejection to KoraError', async () => {
      KoraIDVModule.configure({
        apiKey: 'ck_live_test',
        tenantId: 'tenant-123',
      });

      mockStartVerification.mockRejectedValueOnce({
        code: 'CAMERA_ACCESS_DENIED',
        message: 'Camera access denied.',
      });

      try {
        await KoraIDVModule.startVerification('user-123');
        fail('Expected error to be thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(KoraError);
        expect((err as KoraError).code).toBe(KoraErrorCode.CAMERA_ACCESS_DENIED);
      }
    });

    it('passes tier and options correctly', async () => {
      KoraIDVModule.configure({
        apiKey: 'ck_live_test',
        tenantId: 'tenant-123',
      });

      mockStartVerification.mockResolvedValueOnce('{"type":"cancelled"}');

      await KoraIDVModule.startVerification('user-123', 'enhanced', {
        documentTypes: ['international_passport' as never],
      });

      expect(mockStartVerification).toHaveBeenCalledWith(
        'user-123',
        'enhanced',
        expect.any(String)
      );
    });
  });

  describe('resumeVerification', () => {
    it('throws NOT_CONFIGURED if not configured', async () => {
      await expect(
        KoraIDVModule.resumeVerification('ver-001')
      ).rejects.toThrow(KoraError);
    });

    it('returns success result', async () => {
      KoraIDVModule.configure({
        apiKey: 'ck_live_test',
        tenantId: 'tenant-123',
      });

      const resultJSON = JSON.stringify({
        type: 'success',
        verification: {
          id: 'ver-001',
          externalId: 'user-123',
          tenantId: 'tenant-123',
          tier: 'standard',
          status: 'approved',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:05:00Z',
        },
      });

      mockResumeVerification.mockResolvedValueOnce(resultJSON);

      const result = await KoraIDVModule.resumeVerification('ver-001');
      expect(result.type).toBe('success');
    });

    it('returns cancelled result', async () => {
      KoraIDVModule.configure({
        apiKey: 'ck_live_test',
        tenantId: 'tenant-123',
      });

      mockResumeVerification.mockResolvedValueOnce('{"type":"cancelled"}');

      const result = await KoraIDVModule.resumeVerification('ver-001');
      expect(result.type).toBe('cancelled');
    });

    it('maps native Promise rejection to KoraError', async () => {
      KoraIDVModule.configure({
        apiKey: 'ck_live_test',
        tenantId: 'tenant-123',
      });

      mockResumeVerification.mockRejectedValueOnce({
        code: 'NOT_FOUND',
        message: 'Verification not found.',
      });

      try {
        await KoraIDVModule.resumeVerification('ver-001');
        fail('Expected error to be thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(KoraError);
        expect((err as KoraError).code).toBe(KoraErrorCode.NOT_FOUND);
      }
    });
  });

  describe('reset', () => {
    it('sets isConfigured to false', () => {
      KoraIDVModule.configure({
        apiKey: 'ck_live_test',
        tenantId: 'tenant-123',
      });

      expect(KoraIDVModule.isConfigured).toBe(true);
      KoraIDVModule.reset();
      expect(KoraIDVModule.isConfigured).toBe(false);
    });
  });

  describe('version', () => {
    it('returns the published SDK version', () => {
      // Pin to current release. Bump in lockstep with package.json +
      // KoraIDVModule.ts.
      expect(KoraIDVModule.version).toBe('1.5.2');
    });
  });
});
