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

import React, { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import type { KoraIDVConfiguration } from './types';
import { KoraIDVModule } from './KoraIDVModule';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface KoraIDVContextValue {
  /** Whether the SDK has been configured */
  isConfigured: boolean;
  /** The configuration used to initialize the SDK */
  config: KoraIDVConfiguration;
}

const KoraIDVContext = createContext<KoraIDVContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

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

export function KoraIDVProvider({
  apiKey,
  tenantId,
  config = {},
  children,
}: KoraIDVProviderProps) {
  const fullConfig = useMemo<KoraIDVConfiguration>(
    () => ({
      apiKey,
      tenantId,
      ...config,
    }),
    [apiKey, tenantId, config]
  );

  useEffect(() => {
    KoraIDVModule.configure(fullConfig);
  }, [fullConfig]);

  const value = useMemo<KoraIDVContextValue>(
    () => ({
      isConfigured: true,
      config: fullConfig,
    }),
    [fullConfig]
  );

  return (
    <KoraIDVContext.Provider value={value}>{children}</KoraIDVContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Internal hook to access context
// ---------------------------------------------------------------------------

export function useKoraIDVContext(): KoraIDVContextValue {
  const context = useContext(KoraIDVContext);
  if (!context) {
    throw new Error('useKoraIDV must be used within a KoraIDVProvider');
  }
  return context;
}
