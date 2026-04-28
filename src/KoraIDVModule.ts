/**
 * JS wrapper singleton — imperative API for KoraIDV React Native SDK.
 *
 * Provides configure(), startVerification(), resumeVerification(), reset().
 * Handles serialization/deserialization and error mapping.
 */

import { NativeModules, Platform } from 'react-native';

import type {
  KoraIDVConfiguration,
  VerificationFlowResult,
  VerificationTier,
  StartVerificationOptions,
} from './types';
import { KoraError, KoraErrorCode } from './types';
import { serializeConfiguration, deserializeResult, deserializeError } from './serialization';

const LINKING_ERROR =
  `The package '@koraidv/react-native' doesn't seem to be linked. Make sure:\n\n` +
  Platform.select({ ios: '- You ran `pod install`\n', default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go (this package requires native code)\n';

function getNativeModule() {
  const mod = NativeModules.KoraIDVReactNative;
  if (!mod) {
    throw new Error(LINKING_ERROR);
  }
  return mod as {
    configure(configJSON: string): void;
    startVerification(
      externalId: string,
      tier: string,
      optionsJSON: string
    ): Promise<string>;
    resumeVerification(verificationId: string): Promise<string>;
  };
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
  configure(config: KoraIDVConfiguration): void {
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
  async startVerification(
    externalId: string,
    tier: VerificationTier = 'standard',
    options?: StartVerificationOptions
  ): Promise<VerificationFlowResult> {
    if (!_isConfigured) {
      throw new KoraError(KoraErrorCode.NOT_CONFIGURED);
    }

    const nativeModule = getNativeModule();
    const optionsJSON = JSON.stringify(options ?? {});

    try {
      const resultJSON = await nativeModule.startVerification(
        externalId,
        tier,
        optionsJSON
      );
      return deserializeResult(resultJSON);
    } catch (error: unknown) {
      throw mapNativeError(error);
    }
  },

  /**
   * Resume an existing verification.
   */
  async resumeVerification(
    verificationId: string
  ): Promise<VerificationFlowResult> {
    if (!_isConfigured) {
      throw new KoraError(KoraErrorCode.NOT_CONFIGURED);
    }

    const nativeModule = getNativeModule();

    try {
      const resultJSON = await nativeModule.resumeVerification(verificationId);
      return deserializeResult(resultJSON);
    } catch (error: unknown) {
      throw mapNativeError(error);
    }
  },

  /**
   * Reset the SDK configuration.
   */
  reset(): void {
    _isConfigured = false;
  },

  /**
   * Whether the SDK has been configured.
   */
  get isConfigured(): boolean {
    return _isConfigured;
  },

  /**
   * SDK version.
   */
  get version(): string {
    return '1.4.1';
  },
};

// ---------------------------------------------------------------------------
// Error mapping
// ---------------------------------------------------------------------------

function mapNativeError(error: unknown): KoraError {
  if (error instanceof KoraError) {
    return error;
  }

  // React Native wraps native Promise rejections with { code, message, ... }
  const nativeError = error as { code?: string; message?: string };
  if (nativeError.code && nativeError.message) {
    return deserializeError(nativeError.code, nativeError.message);
  }

  if (error instanceof Error) {
    return new KoraError(KoraErrorCode.UNKNOWN, error.message);
  }

  return new KoraError(KoraErrorCode.UNKNOWN, String(error));
}
