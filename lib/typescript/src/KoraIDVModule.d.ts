/**
 * JS wrapper singleton — imperative API for KoraIDV React Native SDK.
 *
 * Provides configure(), startVerification(), resumeVerification(), reset().
 * Handles serialization/deserialization and error mapping.
 */
import type { KoraIDVConfiguration, VerificationFlowResult, VerificationTier, StartVerificationOptions } from './types';
export declare const KoraIDVModule: {
    /**
     * Configure the SDK. Must be called before starting any verification.
     */
    configure(config: KoraIDVConfiguration): void;
    /**
     * Start a new verification flow.
     *
     * Launches the native full-screen verification UI and resolves with the result.
     */
    startVerification(externalId: string, tier?: VerificationTier, options?: StartVerificationOptions): Promise<VerificationFlowResult>;
    /**
     * Resume an existing verification.
     */
    resumeVerification(verificationId: string): Promise<VerificationFlowResult>;
    /**
     * Reset the SDK configuration.
     */
    reset(): void;
    /**
     * Whether the SDK has been configured.
     */
    readonly isConfigured: boolean;
    /**
     * SDK version.
     */
    readonly version: string;
};
//# sourceMappingURL=KoraIDVModule.d.ts.map