/**
 * KoraWallet.ts
 * KoraIDV Wallet — Main wallet class for React Native
 */
import type { WalletCredential, StoredWalletCredential, WalletPresentation } from './WalletModels';
import type { StorageAdapter } from './CredentialStore';
import type { DisclosureProfile } from './SelectiveDisclosure';
/**
 * Main entry point for the Kora Wallet SDK module in React Native.
 *
 * Provides credential storage (adapter-based), selective disclosure,
 * Verifiable Presentation creation, and deep-link sharing.
 */
export declare class KoraWallet {
    private readonly credentialStore;
    /**
     * Create a new KoraWallet instance.
     *
     * @param storage - A StorageAdapter implementation (AsyncStorage, MMKV, etc.)
     */
    constructor(storage: StorageAdapter);
    /**
     * Store a Verifiable Credential in the wallet.
     * Returns the storage ID (same as the credential's `id`).
     */
    store(credential: WalletCredential): Promise<string>;
    /**
     * Retrieve all stored credentials.
     */
    getCredentials(): Promise<StoredWalletCredential[]>;
    /**
     * Retrieve a single credential by ID.
     */
    getCredential(id: string): Promise<StoredWalletCredential | null>;
    /**
     * Delete a credential from the wallet.
     */
    deleteCredential(id: string): Promise<void>;
    /**
     * Number of credentials currently stored.
     */
    getCredentialCount(): Promise<number>;
    /**
     * Create a Verifiable Presentation with selective disclosure.
     */
    createPresentation(params: {
        credentialId: string;
        profile: DisclosureProfile;
        audience?: string;
        nonce?: string;
    }): Promise<WalletPresentation>;
    /**
     * Generate a deep link URL for sharing a presentation.
     */
    generateDeepLink(presentation: WalletPresentation, profile?: DisclosureProfile): string | null;
    /**
     * Check whether a stored credential has expired.
     */
    isExpired(credentialId: string): Promise<boolean>;
}
//# sourceMappingURL=KoraWallet.d.ts.map