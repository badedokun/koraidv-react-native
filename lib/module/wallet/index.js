/**
 * KoraIDV Wallet — React Native barrel export
 */

// Main wallet class
export { KoraWallet } from './KoraWallet';

// Models

export { WalletError, createWalletCredential } from './WalletModels';

// Selective disclosure
export { DisclosureClaim, DisclosureProfiles, applyDisclosure, computeAgeOver18, getProfileName } from './SelectiveDisclosure';

// Storage adapter

export { WalletCredentialStore } from './CredentialStore';

// Presentation builder
export { WalletPresentationBuilder } from './VerifiablePresentation';
//# sourceMappingURL=index.js.map