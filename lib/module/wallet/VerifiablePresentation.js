/**
 * VerifiablePresentation.ts
 * KoraIDV Wallet — VP creation with selective disclosure for React Native
 */

import { applyDisclosure } from './SelectiveDisclosure';

/**
 * Factory for building W3C Verifiable Presentations.
 */
export const WalletPresentationBuilder = {
  /**
   * Create a Verifiable Presentation from a credential with selective disclosure.
   */
  create(params) {
    const disclosed = applyDisclosure(params.profile, params.credential);
    const now = new Date().toISOString();
    return {
      '@context': ['https://www.w3.org/ns/credentials/v2'],
      type: ['VerifiablePresentation'],
      holder: params.holder ?? null,
      verifiableCredential: [disclosed],
      created: now,
      audience: params.audience ?? null,
      challenge: params.nonce ?? null
    };
  },
  /**
   * Serialize a presentation to a JSON string.
   */
  encode(presentation) {
    return JSON.stringify(presentation, null, 2);
  },
  /**
   * Deserialize a presentation from a JSON string.
   */
  decode(json) {
    return JSON.parse(json);
  }
};
//# sourceMappingURL=VerifiablePresentation.js.map