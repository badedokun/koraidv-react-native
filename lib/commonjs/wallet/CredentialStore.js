"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WalletCredentialStore = void 0;
var _WalletModels = require("./WalletModels");
/**
 * CredentialStore.ts
 * KoraIDV Wallet — Storage adapter-based credential persistence for React Native
 *
 * Uses an injected StorageAdapter interface so consumers can provide
 * their preferred storage backend (AsyncStorage, MMKV, etc.).
 */

// MARK: - Storage Adapter Interface

/**
 * Interface for persistent key-value storage.
 * Consumers inject an implementation backed by AsyncStorage, MMKV, or similar.
 */

// MARK: - Credential Store

const INDEX_KEY = '__kora_wallet_credential_ids__';
const KEY_PREFIX = 'kora_wallet_';
class WalletCredentialStore {
  constructor(storage) {
    this.storage = storage;
  }

  // MARK: - CRUD Operations

  async save(id, credential) {
    try {
      const json = JSON.stringify(credential);
      await this.storage.setItem(`${KEY_PREFIX}${id}`, json);
      await this.addToIndex(id);
    } catch {
      throw _WalletModels.WalletError.storageFailed();
    }
  }
  async load(id) {
    const json = await this.storage.getItem(`${KEY_PREFIX}${id}`);
    if (!json) return null;
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
  async delete(id) {
    await this.storage.removeItem(`${KEY_PREFIX}${id}`);
    await this.removeFromIndex(id);
  }
  async listIds() {
    const raw = await this.storage.getItem(INDEX_KEY);
    if (!raw) return [];
    try {
      const ids = JSON.parse(raw);
      return Array.isArray(ids) ? ids : [];
    } catch {
      return [];
    }
  }

  // MARK: - Index Management

  async addToIndex(id) {
    const ids = new Set(await this.listIds());
    ids.add(id);
    await this.storage.setItem(INDEX_KEY, JSON.stringify([...ids]));
  }
  async removeFromIndex(id) {
    const ids = new Set(await this.listIds());
    ids.delete(id);
    await this.storage.setItem(INDEX_KEY, JSON.stringify([...ids]));
  }
}
exports.WalletCredentialStore = WalletCredentialStore;
//# sourceMappingURL=CredentialStore.js.map