/**
 * SelectiveDisclosure.ts
 * KoraIDV Wallet — Selective disclosure profiles for Verifiable Presentations
 */
import type { WalletCredential } from './WalletModels';
export declare enum DisclosureClaim {
    FullName = "fullName",
    DateOfBirth = "dateOfBirth",
    Nationality = "nationality",
    VerificationLevel = "verificationLevel",
    DocumentType = "documentType",
    DocumentCountry = "documentCountry",
    BiometricMatch = "biometricMatch",
    LivenessCheck = "livenessCheck",
    GovernmentDbVerified = "governmentDbVerified",
    VerifiedAt = "verifiedAt",
    ConfidenceScore = "confidenceScore"
}
export type DisclosureProfile = {
    type: 'full';
} | {
    type: 'onboarding';
} | {
    type: 'ageOnly';
} | {
    type: 'nationalityOnly';
} | {
    type: 'verificationOnly';
} | {
    type: 'custom';
    claims: Set<DisclosureClaim>;
};
export declare const DisclosureProfiles: {
    full: DisclosureProfile;
    onboarding: DisclosureProfile;
    ageOnly: DisclosureProfile;
    nationalityOnly: DisclosureProfile;
    verificationOnly: DisclosureProfile;
    custom: (claims: Set<DisclosureClaim>) => DisclosureProfile;
};
export declare function getProfileName(profile: DisclosureProfile): string;
/**
 * Apply a disclosure profile to a credential, returning a new credential
 * containing only the disclosed claims in its subject.
 */
export declare function applyDisclosure(profile: DisclosureProfile, credential: WalletCredential): WalletCredential;
/**
 * For ageOnly profile, compute whether the subject is over 18.
 */
export declare function computeAgeOver18(dateOfBirth?: string): boolean;
//# sourceMappingURL=SelectiveDisclosure.d.ts.map