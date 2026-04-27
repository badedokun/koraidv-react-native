/**
 * CredentialStore.ts
 * KoraIDV Wallet — Storage adapter-based credential persistence for React Native
 *
 * Uses an injected StorageAdapter interface so consumers can provide
 * their preferred storage backend (AsyncStorage, MMKV, etc.).
 */

import type { StoredWalletCredential } from './WalletModels';
import { WalletError } from './WalletModels';

// MARK: - Storage Adapter Interface

/**
 * Interface for persistent key-value storage.
 * Consumers inject an implementation backed by AsyncStorage, MMKV, or similar.
 */
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// MARK: - Credential Store

const INDEX_KEY = '__kora_wallet_credential_ids__';
const KEY_PREFIX = 'kora_wallet_';

export class WalletCredentialStore {
  private readonly storage: StorageAdapter;

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  // MARK: - CRUD Operations

  async save(id: string, credential: StoredWalletCredential): Promise<void> {
    try {
      const json = JSON.stringify(credential);
      await this.storage.setItem(`${KEY_PREFIX}${id}`, json);
      await this.addToIndex(id);
    } catch {
      throw WalletError.storageFailed();
    }
  }

  async load(id: string): Promise<StoredWalletCredential | null> {
    const json = await this.storage.getItem(`${KEY_PREFIX}${id}`);
    if (!json) return null;
    try {
      return JSON.parse(json) as StoredWalletCredential;
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    await this.storage.removeItem(`${KEY_PREFIX}${id}`);
    await this.removeFromIndex(id);
  }

  async listIds(): Promise<string[]> {
    const raw = await this.storage.getItem(INDEX_KEY);
    if (!raw) return [];
    try {
      const ids = JSON.parse(raw) as string[];
      return Array.isArray(ids) ? ids : [];
    } catch {
      return [];
    }
  }

  // MARK: - Index Management

  private async addToIndex(id: string): Promise<void> {
    const ids = new Set(await this.listIds());
    ids.add(id);
    await this.storage.setItem(INDEX_KEY, JSON.stringify([...ids]));
  }

  private async removeFromIndex(id: string): Promise<void> {
    const ids = new Set(await this.listIds());
    ids.delete(id);
    await this.storage.setItem(INDEX_KEY, JSON.stringify([...ids]));
  }
}
