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

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { KoraIDVModule } from './KoraIDVModule';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const KoraIDVContext = /*#__PURE__*/createContext(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function KoraIDVProvider({
  apiKey,
  tenantId,
  config = {},
  children
}) {
  const fullConfig = useMemo(() => ({
    apiKey,
    tenantId,
    ...config
  }), [apiKey, tenantId, config]);
  useEffect(() => {
    KoraIDVModule.configure(fullConfig);
  }, [fullConfig]);
  const value = useMemo(() => ({
    isConfigured: true,
    config: fullConfig
  }), [fullConfig]);
  return /*#__PURE__*/React.createElement(KoraIDVContext.Provider, {
    value: value
  }, children);
}

// ---------------------------------------------------------------------------
// Internal hook to access context
// ---------------------------------------------------------------------------

export function useKoraIDVContext() {
  const context = useContext(KoraIDVContext);
  if (!context) {
    throw new Error('useKoraIDV must be used within a KoraIDVProvider');
  }
  return context;
}
//# sourceMappingURL=KoraIDVProvider.js.map