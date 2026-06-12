"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WalletError = void 0;
exports.createWalletCredential = createWalletCredential;
/**
 * WalletModels.ts
 * KoraIDV Wallet — W3C Verifiable Credential types for React Native
 *
 * Types are prefixed with "Wallet" to avoid conflicts with existing KoraIDV types.
 */

// MARK: - Verifiable Credential

// MARK: - Credential Subject

// MARK: - Credential Status (StatusList2021)

// MARK: - Data Integrity Proof

// MARK: - Stored Credential (wrapper with metadata)

// MARK: - Verifiable Presentation

// MARK: - Errors

class WalletError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'WalletError';
  }
  static storageFailed() {
    return new WalletError('STORAGE_FAILED', 'Failed to store credential.');
  }
  static credentialNotFound() {
    return new WalletError('CREDENTIAL_NOT_FOUND', 'Credential not found.');
  }
  static credentialExpired() {
    return new WalletError('CREDENTIAL_EXPIRED', 'Credential has expired.');
  }
  static encodingFailed() {
    return new WalletError('ENCODING_FAILED', 'Failed to encode credential data.');
  }
}

// MARK: - Helper to create default credential
exports.WalletError = WalletError;
function createWalletCredential(params) {
  return {
    '@context': params['@context'] ?? ['https://www.w3.org/ns/credentials/v2'],
    type: params.type ?? ['VerifiableCredential', 'KoraIdentityCredential'],
    ...params
  };
}
//# sourceMappingURL=WalletModels.js.map