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

The SDK depends on the native `KoraIDV` pod, which isn't yet on
CocoaPods trunk. Add the git source to your `ios/Podfile` **inside the
`target` block, before `use_react_native!`**:

```ruby
pod 'KoraIDV',
    :git => 'https://github.com/badedokun/koraidv-koraidv-ios.git',
    :tag => '1.5.2'
```

Camera permission is required — add to your `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app uses the camera to capture identity documents and verify your selfie.</string>
```

Then:

```bash
cd ios && pod install
```

### Android

The SDK ships an AAR compiled with `isCoreLibraryDesugaringEnabled = true`
and uses `java.time` APIs. Consumers must enable the same feature in
their app module — otherwise the build fails with
`Dependency 'koraidv-release.aar' requires core library desugaring to
be enabled for :app.`

Edit `android/app/build.gradle`:

```groovy
android {
    compileOptions {
        coreLibraryDesugaringEnabled true
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:2.0.4'
}
```

Add camera permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="true" />
```

### Worked example

A full end-to-end RN 0.79 example app lives in [`example/`](./example/).
It builds clean on both platforms and is the canonical "this works"
reference — see [`example/SETUP.md`](./example/SETUP.md) for the
step-by-step procedure we verified.

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
