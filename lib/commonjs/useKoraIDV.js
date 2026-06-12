"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useKoraIDV = useKoraIDV;
var _react = require("react");
var _types = require("./types");
var _KoraIDVModule = require("./KoraIDVModule");
var _KoraIDVProvider = require("./KoraIDVProvider");
/**
 * React hook for KoraIDV verification flow.
 *
 * Provides a simple state machine:
 *   idle → loading → (success | error | cancelled)
 *
 * All UI and step management happens in the native layer.
 * The hook only manages the JS-side state around the bridge call.
 */

function useKoraIDV() {
  // Validates that we're inside a KoraIDVProvider
  (0, _KoraIDVProvider.useKoraIDVContext)();
  const [verification, setVerification] = (0, _react.useState)(null);
  const [error, setError] = (0, _react.useState)(null);
  const [isLoading, setIsLoading] = (0, _react.useState)(false);
  const [isCancelled, setIsCancelled] = (0, _react.useState)(false);
  const reset = (0, _react.useCallback)(() => {
    setVerification(null);
    setError(null);
    setIsLoading(false);
    setIsCancelled(false);
  }, []);
  const startVerification = (0, _react.useCallback)(async (externalId, tier = 'standard', options) => {
    setIsLoading(true);
    setError(null);
    setIsCancelled(false);
    setVerification(null);
    try {
      const result = await _KoraIDVModule.KoraIDVModule.startVerification(externalId, tier, options);
      if (result.type === 'success') {
        setVerification(result.verification);
      } else {
        setIsCancelled(true);
      }
    } catch (err) {
      const koraError = err instanceof _types.KoraError ? err : new _types.KoraError('UNKNOWN', String(err));
      setError(koraError);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const resumeVerification = (0, _react.useCallback)(async verificationId => {
    setIsLoading(true);
    setError(null);
    setIsCancelled(false);
    setVerification(null);
    try {
      const result = await _KoraIDVModule.KoraIDVModule.resumeVerification(verificationId);
      if (result.type === 'success') {
        setVerification(result.verification);
      } else {
        setIsCancelled(true);
      }
    } catch (err) {
      const koraError = err instanceof _types.KoraError ? err : new _types.KoraError('UNKNOWN', String(err));
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