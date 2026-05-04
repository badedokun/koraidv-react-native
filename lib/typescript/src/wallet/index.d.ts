/**
 * KoraIDV Wallet — React Native barrel export
 */
export { KoraWallet } from './KoraWallet';
export type { WalletCredential, WalletCredentialSubject, WalletCredentialStatus, WalletDataIntegrityProof, StoredWalletCredential, WalletPresentation, } from './WalletModels';
export { WalletError, createWalletCredential } from './WalletModels';
export { DisclosureClaim, DisclosureProfiles, applyDisclosure, computeAgeOver18, getProfileName, } from './SelectiveDisclosure';
export type { DisclosureProfile } from './SelectiveDisclosure';
export type { StorageAdapter } from './CredentialStore';
export { WalletCredentialStore } from './CredentialStore';
export { WalletPresentationBuilder } from './VerifiablePresentation';
//# sourceMappingURL=index.d.ts.map