/**
 * React context provider that configures the KoraIDV SDK.
 *
 * Usage:
 * ```tsx
 * <KoraIDVProvider apiKey="ck_live_xxx" tenantId="uuid">
 *   <App />
 * </KoraIDVProvider>
 * ```
 */
import React, { type ReactNode } from 'react';
import type { KoraIDVConfiguration } from './types';
export interface KoraIDVContextValue {
    /** Whether the SDK has been configured */
    isConfigured: boolean;
    /** The configuration used to initialize the SDK */
    config: KoraIDVConfiguration;
}
export interface KoraIDVProviderProps {
    /** API key for authentication */
    apiKey: string;
    /** Tenant ID */
    tenantId: string;
    /** Additional configuration options */
    config?: Partial<Omit<KoraIDVConfiguration, 'apiKey' | 'tenantId'>>;
    /** Children components */
    children: ReactNode;
}
export declare function KoraIDVProvider({ apiKey, tenantId, config, children, }: KoraIDVProviderProps): React.JSX.Element;
export declare function useKoraIDVContext(): KoraIDVContextValue;
//# sourceMappingURL=KoraIDVProvider.d.ts.map