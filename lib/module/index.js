/**
 * @koraidv/react-native — barrel export
 */

// Imperative API
export { KoraIDVModule as KoraIDV } from './KoraIDVModule';

// React components & hooks
export { KoraIDVProvider } from './KoraIDVProvider';
export { useKoraIDV } from './useKoraIDV';
export { VerificationFlow } from './VerificationFlow';
// Types
export { DocumentType, KoraErrorCode, KoraError } from './types';
// Wallet — W3C Verifiable Credentials
export { KoraWallet, WalletError, DisclosureClaim, DisclosureProfiles, WalletPresentationBuilder, WalletCredentialStore, applyDisclosure, computeAgeOver18, createWalletCredential } from './wallet';
//# sourceMappingURL=index.js.map