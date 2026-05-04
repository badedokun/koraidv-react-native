/**
 * JS wrapper singleton — imperative API for KoraIDV React Native SDK.
 *
 * Provides configure(), startVerification(), resumeVerification(), reset().
 * Handles serialization/deserialization and error mapping.
 */

import { NativeModules, Platform } from 'react-native';
import { KoraError, KoraErrorCode } from './types';
import { serializeConfiguration, deserializeResult, deserializeError } from './serialization';
const LINKING_ERROR = `The package '@koraidv/react-native' doesn't seem to be linked. Make sure:\n\n` + Platform.select({
  ios: '- You ran `pod install`\n',
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go (this package requires native code)\n';
function getNativeModule() {
  const mod = NativeModules.KoraIDVReactNative;
  if (!mod) {
    throw new Error(LINKING_ERROR);
  }
  return mod;
}

// ---------------------------------------------------------------------------
// Module state
// ---------------------------------------------------------------------------

let _isConfigured = false;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const KoraIDVModule = {
  /**
   * Configure the SDK. Must be called before starting any verification.
   */
  configure(config) {
    const nativeModule = getNativeModule();
    const json = serializeConfiguration(config);
    nativeModule.configure(json);
    _isConfigured = true;
  },
  /**
   * Start a new verification flow.
   *
   * Launches the native full-screen verification UI and resolves with the result.
   */
  async startVerification(externalId, tier = 'standard', options) {
    if (!_isConfigured) {
      throw new KoraError(KoraErrorCode.NOT_CONFIGURED);
    }
    const nativeModule = getNativeModule();
    const optionsJSON = JSON.stringify(options ?? {});
    try {
      const resultJSON = await nativeModule.startVerification(externalId, tier, optionsJSON);
      return deserializeResult(resultJSON);
    } catch (error) {
      throw mapNativeError(error);
    }
  },
  /**
   * Resume an existing verification.
   */
  async resumeVerification(verificationId) {
    if (!_isConfigured) {
      throw new KoraError(KoraErrorCode.NOT_CONFIGURED);
    }
    const nativeModule = getNativeModule();
    try {
      const resultJSON = await nativeModule.resumeVerification(verificationId);
      return deserializeResult(resultJSON);
    } catch (error) {
      throw mapNativeError(error);
    }
  },
  /**
   * Reset the SDK configuration.
   */
  reset() {
    _isConfigured = false;
  },
  /**
   * Whether the SDK has been configured.
   */
  get isConfigured() {
    return _isConfigured;
  },
  /**
   * SDK version.
   */
  get version() {
    return '1.5.0';
  }
};

// ---------------------------------------------------------------------------
// Error mapping
// ---------------------------------------------------------------------------

function mapNativeError(error) {
  if (error instanceof KoraError) {
    return error;
  }

  // React Native wraps native Promise rejections with { code, message, ... }
  const nativeError = error;
  if (nativeError.code && nativeError.message) {
    return deserializeError(nativeError.code, nativeError.message);
  }
  if (error instanceof Error) {
    return new KoraError(KoraErrorCode.UNKNOWN, error.message);
  }
  return new KoraError(KoraErrorCode.UNKNOWN, String(error));
}
//# sourceMappingURL=KoraIDVModule.js.map