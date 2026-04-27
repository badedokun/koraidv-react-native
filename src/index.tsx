/**
 * @koraidv/react-native — barrel export
 */

// Imperative API
export { KoraIDVModule as KoraIDV } from './KoraIDVModule';

// React components & hooks
export { KoraIDVProvider } from './KoraIDVProvider';
export type { KoraIDVProviderProps, KoraIDVContextValue } from './KoraIDVProvider';
export { useKoraIDV } from './useKoraIDV';
export type { UseKoraIDVReturn } from './useKoraIDV';
export { VerificationFlow } from './VerificationFlow';
export type { VerificationFlowProps } from './VerificationFlow';

// Types
export {
  DocumentType,
  KoraErrorCode,
  KoraError,
} from './types';

export type {
  KoraIDVConfiguration,
  Environment,
  LivenessMode,
  Theme,
  VerificationTier,
  VerificationStatus,
  Verification,
  DocumentVerification,
  FaceVerification,
  LivenessVerification,
  ChallengeResult,
  RiskSignal,
  DocumentQualityResult,
  VerificationFlowResult,
  StartVerificationOptions,
} from './types';

// Wallet — W3C Verifiable Credentials
export {
  KoraWallet,
  WalletError,
  DisclosureClaim,
  DisclosureProfiles,
  WalletPresentationBuilder,
  WalletCredentialStore,
  applyDisclosure,
  computeAgeOver18,
  createWalletCredential,
} from './wallet';
export type {
  WalletCredential,
  WalletCredentialSubject,
  WalletCredentialStatus,
  WalletDataIntegrityProof,
  StoredWalletCredential,
  WalletPresentation,
  DisclosureProfile,
  StorageAdapter,
} from './wallet';
