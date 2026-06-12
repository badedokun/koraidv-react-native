/**
 * Serialization helpers for bridging JSON ↔ typed objects
 *
 * Data crosses the native bridge as JSON strings. These helpers
 * convert between our TypeScript types and the JSON payloads
 * expected by the native modules.
 */
import type { KoraIDVConfiguration, VerificationFlowResult } from './types';
import { KoraError } from './types';
export declare function serializeConfiguration(config: KoraIDVConfiguration): string;
export declare function deserializeResult(json: string): VerificationFlowResult;
export declare function deserializeError(code: string, message: string): KoraError;
//# sourceMappingURL=serialization.d.ts.map