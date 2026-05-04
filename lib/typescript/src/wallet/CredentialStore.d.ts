/**
 * CredentialStore.ts
 * KoraIDV Wallet — Storage adapter-based credential persistence for React Native
 *
 * Uses an injected StorageAdapter interface so consumers can provide
 * their preferred storage backend (AsyncStorage, MMKV, etc.).
 */
import type { StoredWalletCredential } from './WalletModels';
/**
 * Interface for persistent key-value storage.
 * Consumers inject an implementation backed by AsyncStorage, MMKV, or similar.
 */
export interface StorageAdapter {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
}
export declare class WalletCredentialStore {
    private readonly storage;
    constructor(storage: StorageAdapter);
    save(id: string, credential: StoredWalletCredential): Promise<void>;
    load(id: string): Promise<StoredWalletCredential | null>;
    delete(id: string): Promise<void>;
    listIds(): Promise<string[]>;
    private addToIndex;
    private removeFromIndex;
}
//# sourceMappingURL=CredentialStore.d.ts.map