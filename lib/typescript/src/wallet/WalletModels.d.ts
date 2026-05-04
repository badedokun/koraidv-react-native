/**
 * WalletModels.ts
 * KoraIDV Wallet — W3C Verifiable Credential types for React Native
 *
 * Types are prefixed with "Wallet" to avoid conflicts with existing KoraIDV types.
 */
export interface WalletCredential {
    readonly '@context': string[];
    readonly id: string;
    readonly type: string[];
    readonly issuer: string;
    readonly issuanceDate: string;
    readonly expirationDate: string;
    readonly credentialSubject: WalletCredentialSubject;
    readonly credentialStatus?: WalletCredentialStatus;
    readonly proof?: WalletDataIntegrityProof;
}
export interface WalletCredentialSubject {
    readonly id: string;
    readonly fullName: string;
    readonly dateOfBirth?: string;
    readonly nationality?: string;
    readonly verificationLevel: string;
    readonly documentType: string;
    readonly documentCountry: string;
    readonly biometricMatch: boolean;
    readonly livenessCheck: boolean;
    readonly governmentDbVerified: boolean;
    readonly verifiedAt: string;
    readonly confidenceScore: number;
}
export interface WalletCredentialStatus {
    readonly id: string;
    readonly type: string;
    readonly statusPurpose: string;
    readonly statusListIndex: string;
    readonly statusListCredential: string;
}
export interface WalletDataIntegrityProof {
    readonly type: string;
    readonly cryptosuite: string;
    readonly created: string;
    readonly verificationMethod: string;
    readonly proofPurpose: string;
    readonly proofValue: string;
}
export interface StoredWalletCredential {
    readonly id: string;
    readonly credential: WalletCredential;
    readonly storedAt: string;
    readonly issuerDID: string;
    readonly subjectName: string;
    readonly expiresAt: string;
}
export interface WalletPresentation {
    readonly '@context': string[];
    readonly type: string[];
    readonly holder: string | null;
    readonly verifiableCredential: WalletCredential[];
    readonly created: string;
    readonly audience: string | null;
    readonly challenge: string | null;
}
export declare class WalletError extends Error {
    readonly code: string;
    constructor(code: string, message: string);
    static storageFailed(): WalletError;
    static credentialNotFound(): WalletError;
    static credentialExpired(): WalletError;
    static encodingFailed(): WalletError;
}
export declare function createWalletCredential(params: Omit<WalletCredential, '@context' | 'type'> & {
    '@context'?: string[];
    type?: string[];
}): WalletCredential;
//# sourceMappingURL=WalletModels.d.ts.map