"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KoraIDVProvider = KoraIDVProvider;
exports.useKoraIDVContext = useKoraIDVContext;
var _react = _interopRequireWildcard(require("react"));
var _KoraIDVModule = require("./KoraIDVModule");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const KoraIDVContext = /*#__PURE__*/(0, _react.createContext)(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

function KoraIDVProvider({
  apiKey,
  tenantId,
  config = {},
  children
}) {
  const fullConfig = (0, _react.useMemo)(() => ({
    apiKey,
    tenantId,
    ...config
  }), [apiKey, tenantId, config]);
  (0, _react.useEffect)(() => {
    _KoraIDVModule.KoraIDVModule.configure(fullConfig);
  }, [fullConfig]);
  const value = (0, _react.useMemo)(() => ({
    isConfigured: true,
    config: fullConfig
  }), [fullConfig]);
  return /*#__PURE__*/_react.default.createElement(KoraIDVContext.Provider, {
    value: value
  }, children);
}

// ---------------------------------------------------------------------------
// Internal hook to access context
// ---------------------------------------------------------------------------

function useKoraIDVContext() {
  const context = (0, _react.useContext)(KoraIDVContext);
  if (!context) {
    throw new Error('useKoraIDV must be used within a KoraIDVProvider');
  }
  return context;
}
//# sourceMappingURL=KoraIDVProvider.js.map