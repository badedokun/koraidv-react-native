# @koraidv/react-native

Kora IDV Identity Verification SDK for React Native. Thin wrapper over the native iOS and Android SDKs — all camera capture, ML processing, liveness detection, and UI runs in the native layer.

## Requirements

- React Native >= 0.72
- iOS >= 14.0
- Android minSdk 24

## Installation

```bash
npm install @koraidv/react-native
# or
yarn add @koraidv/react-native
```

### iOS

```bash
cd ios && pod install
```

### Android

Add JitPack to your project-level `settings.gradle`:

```groovy
dependencyResolutionManagement {
    repositories {
        maven { url 'https://jitpack.io' }
    }
}
```

## Usage

### Imperative API

```typescript
import { KoraIDV, DocumentType } from '@koraidv/react-native';

KoraIDV.configure({
  apiKey: 'ck_live_xxx',
  tenantId: 'your-tenant-uuid',
  documentTypes: [DocumentType.INTERNATIONAL_PASSPORT, DocumentType.GHANA_CARD],
  livenessMode: 'active',
  theme: { primaryColor: '#2563EB' },
});

const result = await KoraIDV.startVerification('user-123', 'standard');
if (result.type === 'success') {
  console.log(result.verification.status);
}
```

### React Hook

```tsx
import { KoraIDVProvider, useKoraIDV } from '@koraidv/react-native';

function App() {
  return (
    <KoraIDVProvider apiKey="ck_live_xxx" tenantId="your-tenant-uuid">
      <VerifyScreen />
    </KoraIDVProvider>
  );
}

function VerifyScreen() {
  const { startVerification, verification, error, isLoading, isCancelled } = useKoraIDV();

  return (
    <Button
      onPress={() => startVerification('user-123')}
      title="Verify Identity"
    />
  );
}
```

### Component

```tsx
import { KoraIDVProvider, VerificationFlow } from '@koraidv/react-native';

<KoraIDVProvider apiKey="ck_live_xxx" tenantId="your-tenant-uuid">
  <VerificationFlow
    externalId="user-123"
    onComplete={(v) => console.log(v.status)}
    onError={(e) => console.error(e.code)}
    onCancel={() => console.log('cancelled')}
  />
</KoraIDVProvider>
```

## API Reference

### `KoraIDV.configure(config)`

Initialize the SDK. Must be called before starting any verification.

### `KoraIDV.startVerification(externalId, tier?, options?)`

Start a new verification flow. Returns a `Promise<VerificationFlowResult>`.

### `KoraIDV.resumeVerification(verificationId)`

Resume an existing verification. Returns a `Promise<VerificationFlowResult>`.

### `KoraIDVProvider`

React context provider that configures the SDK for child components.

### `useKoraIDV()`

React hook providing `startVerification`, `verification`, `error`, `isLoading`, `isCancelled`, and `reset`.

### `VerificationFlow`

Headless component that auto-starts verification and fires `onComplete`, `onError`, and `onCancel` callbacks.

## License

MIT
