/**
 * KoraWallet.ts
 * KoraIDV Wallet — Main wallet class for React Native
 */

import { WalletError } from './WalletModels';
import { WalletCredentialStore } from './CredentialStore';
import { DisclosureProfiles, getProfileName } from './SelectiveDisclosure';
import { WalletPresentationBuilder } from './VerifiablePresentation';
const MAX_INLINE_SIZE = 2048;

/**
 * Main entry point for the Kora Wallet SDK module in React Native.
 *
 * Provides credential storage (adapter-based), selective disclosure,
 * Verifiable Presentation creation, and deep-link sharing.
 */
export class KoraWallet {
  /**
   * Create a new KoraWallet instance.
   *
   * @param storage - A StorageAdapter implementation (AsyncStorage, MMKV, etc.)
   */
  constructor(storage) {
    this.credentialStore = new WalletCredentialStore(storage);
  }

  // MARK: - Credential Management

  /**
   * Store a Verifiable Credential in the wallet.
   * Returns the storage ID (same as the credential's `id`).
   */
  async store(credential) {
    const now = new Date().toISOString();
    const stored = {
      id: credential.id,
      credential,
      storedAt: now,
      issuerDID: credential.issuer,
      subjectName: credential.credentialSubject.fullName,
      expiresAt: credential.expirationDate
    };
    await this.credentialStore.save(credential.id, stored);
    return credential.id;
  }

  /**
   * Retrieve all stored credentials.
   */
  async getCredentials() {
    const ids = await this.credentialStore.listIds();
    const results = [];
    for (const id of ids) {
      const stored = await this.credentialStore.load(id);
      if (stored) results.push(stored);
    }
    return results;
  }

  /**
   * Retrieve a single credential by ID.
   */
  async getCredential(id) {
    return this.credentialStore.load(id);
  }

  /**
   * Delete a credential from the wallet.
   */
  async deleteCredential(id) {
    await this.credentialStore.delete(id);
  }

  /**
   * Number of credentials currently stored.
   */
  async getCredentialCount() {
    const ids = await this.credentialStore.listIds();
    return ids.length;
  }

  // MARK: - Presentation

  /**
   * Create a Verifiable Presentation with selective disclosure.
   */
  async createPresentation(params) {
    const stored = await this.credentialStore.load(params.credentialId);
    if (!stored) {
      throw WalletError.credentialNotFound();
    }
    if (await this.isExpired(params.credentialId)) {
      throw WalletError.credentialExpired();
    }
    return WalletPresentationBuilder.create({
      credential: stored.credential,
      profile: params.profile,
      audience: params.audience,
      nonce: params.nonce
    });
  }

  /**
   * Generate a deep link URL for sharing a presentation.
   */
  generateDeepLink(presentation, profile = DisclosureProfiles.full) {
    const json = JSON.stringify(presentation);
    const data = new TextEncoder().encode(json);
    if (data.length <= MAX_INLINE_SIZE) {
      const encoded = base64UrlEncode(data);
      return `korastratum://present?data=${encoded}`;
    }

    // Fallback: reference link
    const credId = presentation.verifiableCredential[0]?.id ?? 'unknown';
    const profileName = getProfileName(profile);
    return `korastratum://present?ref=${credId}&profile=${profileName}`;
  }

  // MARK: - Expiry

  /**
   * Check whether a stored credential has expired.
   */
  async isExpired(credentialId) {
    const stored = await this.credentialStore.load(credentialId);
    if (!stored) return true;
    const expires = new Date(stored.expiresAt);
    if (isNaN(expires.getTime())) return false;
    return new Date() > expires;
  }
}

// MARK: - Base64URL Encoding

function base64UrlEncode(data) {
  // Convert to regular base64 then to URL-safe variant
  const binString = Array.from(data, byte => String.fromCodePoint(byte)).join('');
  const base64 = btoa(binString);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
//# sourceMappingURL=KoraWallet.js.map