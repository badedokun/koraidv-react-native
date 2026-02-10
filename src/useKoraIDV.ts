/**
 * React hook for KoraIDV verification flow.
 *
 * Provides a simple state machine:
 *   idle → loading → (success | error | cancelled)
 *
 * All UI and step management happens in the native layer.
 * The hook only manages the JS-side state around the bridge call.
 */

import { useState, useCallback } from 'react';
import type { Verification, VerificationTier, StartVerificationOptions } from './types';
import { KoraError } from './types';
import { KoraIDVModule } from './KoraIDVModule';
import { useKoraIDVContext } from './KoraIDVProvider';

export interface UseKoraIDVReturn {
  /** Start a new verification flow */
  startVerification: (
    externalId: string,
    tier?: VerificationTier,
    options?: StartVerificationOptions
  ) => Promise<void>;

  /** Resume an existing verification */
  resumeVerification: (verificationId: string) => Promise<void>;

  /** Latest successful verification result */
  verification: Verification | null;

  /** Latest error (null if none) */
  error: KoraError | null;

  /** Whether a verification flow is currently in progress */
  isLoading: boolean;

  /** Whether the user cancelled the last verification */
  isCancelled: boolean;

  /** Reset state back to idle */
  reset: () => void;
}

export function useKoraIDV(): UseKoraIDVReturn {
  // Validates that we're inside a KoraIDVProvider
  useKoraIDVContext();

  const [verification, setVerification] = useState<Verification | null>(null);
  const [error, setError] = useState<KoraError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const reset = useCallback(() => {
    setVerification(null);
    setError(null);
    setIsLoading(false);
    setIsCancelled(false);
  }, []);

  const startVerification = useCallback(
    async (
      externalId: string,
      tier: VerificationTier = 'standard',
      options?: StartVerificationOptions
    ) => {
      setIsLoading(true);
      setError(null);
      setIsCancelled(false);
      setVerification(null);

      try {
        const result = await KoraIDVModule.startVerification(
          externalId,
          tier,
          options
        );

        if (result.type === 'success') {
          setVerification(result.verification);
        } else {
          setIsCancelled(true);
        }
      } catch (err: unknown) {
        const koraError =
          err instanceof KoraError
            ? err
            : new KoraError('UNKNOWN' as never, String(err));
        setError(koraError);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const resumeVerification = useCallback(async (verificationId: string) => {
    setIsLoading(true);
    setError(null);
    setIsCancelled(false);
    setVerification(null);

    try {
      const result = await KoraIDVModule.resumeVerification(verificationId);

      if (result.type === 'success') {
        setVerification(result.verification);
      } else {
        setIsCancelled(true);
      }
    } catch (err: unknown) {
      const koraError =
        err instanceof KoraError
          ? err
          : new KoraError('UNKNOWN' as never, String(err));
      setError(koraError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    startVerification,
    resumeVerification,
    verification,
    error,
    isLoading,
    isCancelled,
    reset,
  };
}
