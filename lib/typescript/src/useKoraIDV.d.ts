/**
 * React hook for KoraIDV verification flow.
 *
 * Provides a simple state machine:
 *   idle → loading → (success | error | cancelled)
 *
 * All UI and step management happens in the native layer.
 * The hook only manages the JS-side state around the bridge call.
 */
import type { Verification, VerificationTier, StartVerificationOptions } from './types';
import { KoraError } from './types';
export interface UseKoraIDVReturn {
    /** Start a new verification flow */
    startVerification: (externalId: string, tier?: VerificationTier, options?: StartVerificationOptions) => Promise<void>;
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
export declare function useKoraIDV(): UseKoraIDVReturn;
//# sourceMappingURL=useKoraIDV.d.ts.map