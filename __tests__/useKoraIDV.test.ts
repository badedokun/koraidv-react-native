import { renderHook, act } from '@testing-library/react-native';
import React from 'react';
import { useKoraIDV } from '../src/useKoraIDV';
import { KoraIDVModule } from '../src/KoraIDVModule';
import { KoraIDVProvider } from '../src/KoraIDVProvider';
import { KoraError, KoraErrorCode } from '../src/types';
import type { VerificationFlowResult } from '../src/types';

// Mock NativeModules
jest.mock('react-native', () => ({
  NativeModules: {
    KoraIDVReactNative: {
      configure: jest.fn(),
      startVerification: jest.fn(),
      resumeVerification: jest.fn(),
    },
  },
  Platform: {
    select: jest.fn((obj: Record<string, string>) => obj.default ?? ''),
  },
}));

// Mock KoraIDVModule to control behavior
jest.mock('../src/KoraIDVModule', () => {
  const actual = jest.requireActual('../src/KoraIDVModule');
  return {
    ...actual,
    KoraIDVModule: {
      ...actual.KoraIDVModule,
      configure: jest.fn(),
      startVerification: jest.fn(),
      resumeVerification: jest.fn(),
      reset: jest.fn(),
      get isConfigured() {
        return true;
      },
      get version() {
        return '1.0.0';
      },
    },
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(KoraIDVProvider, {
    apiKey: 'ck_live_test',
    tenantId: 'tenant-123',
    children,
  });

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useKoraIDV', () => {
  it('starts with idle state', () => {
    const { result } = renderHook(() => useKoraIDV(), { wrapper });

    expect(result.current.verification).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isCancelled).toBe(false);
  });

  it('transitions to loading state when starting verification', async () => {
    let resolvePromise: (value: VerificationFlowResult) => void;
    (KoraIDVModule.startVerification as jest.Mock).mockImplementation(
      () => new Promise<VerificationFlowResult>((resolve) => {
        resolvePromise = resolve;
      })
    );

    const { result } = renderHook(() => useKoraIDV(), { wrapper });

    let promise: Promise<void>;
    act(() => {
      promise = result.current.startVerification('user-123');
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.verification).toBeNull();
    expect(result.current.error).toBeNull();

    await act(async () => {
      resolvePromise!({
        type: 'success',
        verification: {
          id: 'ver-001',
          externalId: 'user-123',
          tenantId: 'tenant-123',
          tier: 'standard',
          status: 'approved',
          documentVerification: null,
          faceVerification: null,
          livenessVerification: null,
          riskSignals: null,
          riskScore: null,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:05:00Z',
          completedAt: null,
        },
      });
      await promise!;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.verification?.id).toBe('ver-001');
    expect(result.current.verification?.status).toBe('approved');
  });

  it('handles cancellation', async () => {
    (KoraIDVModule.startVerification as jest.Mock).mockResolvedValueOnce({
      type: 'cancelled',
    });

    const { result } = renderHook(() => useKoraIDV(), { wrapper });

    await act(async () => {
      await result.current.startVerification('user-123');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isCancelled).toBe(true);
    expect(result.current.verification).toBeNull();
  });

  it('handles errors', async () => {
    (KoraIDVModule.startVerification as jest.Mock).mockRejectedValueOnce(
      new KoraError(KoraErrorCode.CAMERA_ACCESS_DENIED)
    );

    const { result } = renderHook(() => useKoraIDV(), { wrapper });

    await act(async () => {
      await result.current.startVerification('user-123');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeInstanceOf(KoraError);
    expect(result.current.error?.code).toBe(KoraErrorCode.CAMERA_ACCESS_DENIED);
    expect(result.current.verification).toBeNull();
  });

  it('resets state', async () => {
    (KoraIDVModule.startVerification as jest.Mock).mockResolvedValueOnce({
      type: 'success',
      verification: {
        id: 'ver-001',
        externalId: 'user-123',
        tenantId: 'tenant-123',
        tier: 'standard',
        status: 'approved',
        documentVerification: null,
        faceVerification: null,
        livenessVerification: null,
        riskSignals: null,
        riskScore: null,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:05:00Z',
        completedAt: null,
      },
    });

    const { result } = renderHook(() => useKoraIDV(), { wrapper });

    await act(async () => {
      await result.current.startVerification('user-123');
    });

    expect(result.current.verification).not.toBeNull();

    act(() => {
      result.current.reset();
    });

    expect(result.current.verification).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isCancelled).toBe(false);
  });

  it('throws when used outside KoraIDVProvider', () => {
    expect(() => {
      renderHook(() => useKoraIDV());
    }).toThrow('useKoraIDV must be used within a KoraIDVProvider');
  });
});
