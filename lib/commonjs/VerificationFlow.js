"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerificationFlow = VerificationFlow;
var _react = require("react");
var _useKoraIDV = require("./useKoraIDV");
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

function VerificationFlow({
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
  } = (0, _useKoraIDV.useKoraIDV)();
  const started = (0, _react.useRef)(false);

  // Auto-start on mount (once)
  (0, _react.useEffect)(() => {
    if (!started.current) {
      started.current = true;
      startVerification(externalId, tier, options);
    }
  }, [externalId, tier, options, startVerification]);

  // Fire callbacks when state changes
  (0, _react.useEffect)(() => {
    if (verification) {
      onComplete?.(verification);
    }
  }, [verification, onComplete]);
  (0, _react.useEffect)(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);
  (0, _react.useEffect)(() => {
    if (isCancelled) {
      onCancel?.();
    }
  }, [isCancelled, onCancel]);

  // Renders nothing — native layer handles all UI
  return null;
}
//# sourceMappingURL=VerificationFlow.js.map