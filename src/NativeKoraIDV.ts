/**
 * TurboModule spec interface for KoraIDVReactNative.
 *
 * Used by codegen to generate native spec classes. Native implementations
 * support both Old Architecture and New Architecture (TurboModules).
 * On RN 0.72+ with Old Architecture, this works via the interop layer.
 */

import { TurboModuleRegistry, TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  /**
   * Configure the native SDK with a JSON configuration string.
   */
  configure(configJSON: string): void;

  /**
   * Start a verification flow.
   *
   * @param externalId - Unique identifier for this user/verification
   * @param tier - Verification tier (basic, standard, enhanced)
   * @param optionsJSON - Additional options as JSON string
   * @returns JSON string with the result
   */
  startVerification(
    externalId: string,
    tier: string,
    optionsJSON: string
  ): Promise<string>;

  /**
   * Resume an existing verification.
   *
   * @param verificationId - The ID of the verification to resume
   * @returns JSON string with the result
   */
  resumeVerification(verificationId: string): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('KoraIDVReactNative');
