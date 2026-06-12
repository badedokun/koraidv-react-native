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
import { KoraError } from './types';
import { KoraIDVModule } from './KoraIDVModule';
import { useKoraIDVContext } from './KoraIDVProvider';
export function useKoraIDV() {
  // Validates that we're inside a KoraIDVProvider
  useKoraIDVContext();
  const [verification, setVerification] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const reset = useCallback(() => {
    setVerification(null);
    setError(null);
    setIsLoading(false);
    setIsCancelled(false);
  }, []);
  const startVerification = useCallback(async (externalId, tier = 'standard', options) => {
    setIsLoading(true);
    setError(null);
    setIsCancelled(false);
    setVerification(null);
    try {
      const result = await KoraIDVModule.startVerification(externalId, tier, options);
      if (result.type === 'success') {
        setVerification(result.verification);
      } else {
        setIsCancelled(true);
      }
    } catch (err) {
      const koraError = err instanceof KoraError ? err : new KoraError('UNKNOWN', String(err));
      setError(koraError);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const resumeVerification = useCallback(async verificationId => {
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
    } catch (err) {
      const koraError = err instanceof KoraError ? err : new KoraError('UNKNOWN', String(err));
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
    reset
  };
}
//# sourceMappingURL=useKoraIDV.js.map