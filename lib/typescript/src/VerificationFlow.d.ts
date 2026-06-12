/**
 * Headless convenience component that auto-starts a verification flow
 * and fires callbacks on completion, error, or cancellation.
 *
 * Renders nothing — all UI is in the native layer.
 *
 * Usage:
 * ```tsx
 * <KoraIDVProvider apiKey="..." tenantId="...">
 *   <VerificationFlow
 *     externalId="user-123"
 *     onComplete={(v) => console.log(v.status)}
 *     onError={(e) => console.error(e.code)}
 *     onCancel={() => console.log('cancelled')}
 *   />
 * </KoraIDVProvider>
 * ```
 */
import type { Verification, VerificationTier, StartVerificationOptions } from './types';
import type { KoraError } from './types';
export interface VerificationFlowProps {
    /** Unique identifier for this user/verification */
    externalId: string;
    /** Verification tier (default: 'standard') */
    tier?: VerificationTier;
    /** Additional options */
    options?: StartVerificationOptions;
    /** Called when verification completes successfully */
    onComplete?: (verification: Verification) => void;
    /** Called when an error occurs */
    onError?: (error: KoraError) => void;
    /** Called when the user cancels */
    onCancel?: () => void;
}
export declare function VerificationFlow({ externalId, tier, options, onComplete, onError, onCancel, }: VerificationFlowProps): null;
//# sourceMappingURL=VerificationFlow.d.ts.map