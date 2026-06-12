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

import { useEffect, useRef } from 'react';
import { useKoraIDV } from './useKoraIDV';
export function VerificationFlow({
  externalId,
  tier = 'standard',
  options,
  onComplete,
  onError,
  onCancel
}) {
  const {
    startVerification,
    verification,
    error,
    isCancelled
  } = useKoraIDV();
  const started = useRef(false);

  // Auto-start on mount (once)
  useEffect(() => {
    if (!started.current) {
      started.current = true;
      startVerification(externalId, tier, options);
    }
  }, [externalId, tier, options, startVerification]);

  // Fire callbacks when state changes
  useEffect(() => {
    if (verification) {
      onComplete?.(verification);
    }
  }, [verification, onComplete]);
  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);
  useEffect(() => {
    if (isCancelled) {
      onCancel?.();
    }
  }, [isCancelled, onCancel]);

  // Renders nothing — native layer handles all UI
  return null;
}
//# sourceMappingURL=VerificationFlow.js.map