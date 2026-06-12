/**
 * VerifiablePresentation.ts
 * KoraIDV Wallet — VP creation with selective disclosure for React Native
 */
import type { WalletCredential, WalletPresentation } from './WalletModels';
import type { DisclosureProfile } from './SelectiveDisclosure';
/**
 * Factory for building W3C Verifiable Presentations.
 */
export declare const WalletPresentationBuilder: {
    /**
     * Create a Verifiable Presentation from a credential with selective disclosure.
     */
    create(params: {
        credential: WalletCredential;
        profile: DisclosureProfile;
        holder?: string;
        audience?: string;
        nonce?: string;
    }): WalletPresentation;
    /**
     * Serialize a presentation to a JSON string.
     */
    encode(presentation: WalletPresentation): string;
    /**
     * Deserialize a presentation from a JSON string.
     */
    decode(json: string): WalletPresentation;
};
//# sourceMappingURL=VerifiablePresentation.d.ts.map