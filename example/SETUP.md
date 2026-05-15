# KoraIDVExample — Step-by-step integration

A working bare-RN integration of `@koraidv/react-native`. This is the
reference we use to validate the SDK end-to-end and to keep the hosted
docs honest. Every step below was run on macOS with the toolchain
recorded under **Verified environment** and produced a clean build for
both Android and iOS.

If you're integrating the SDK into your own app and hit issues, diff
your `android/app/build.gradle`, `android/app/src/main/AndroidManifest.xml`,
`ios/Podfile`, and `ios/<App>/Info.plist` against this example first.

---

## Verified environment

| Tool | Version |
|---|---|
| Node | 20.19.4 |
| npm | 10.8.2 |
| JDK | Temurin 21 (17 also works; 0.79.x requires JDK 17+) |
| Xcode | 26.0.1 |
| CocoaPods | 1.16.2 |
| Android SDK | platforms 24–36, build-tools 35.0.0 |
| React Native | 0.79.7 |
| `@react-native-community/cli` | 18.0.0 |
| `@koraidv/react-native` | 1.5.4 |

---

## 1. Create the app

```bash
npx @react-native-community/cli@18.0.0 init KoraIDVExample \
    --version 0.79.7 --pm npm --skip-install
cd KoraIDVExample
```

`--skip-install` lets us add the SDK before `npm install` runs.

## 2. Install dependencies

For this in-repo example the SDK is a `file:` reference:

```jsonc
// package.json
"dependencies": {
  "react": "19.0.0",
  "react-native": "0.79.7",
  "@koraidv/react-native": "file:.."
}
```

Then:

```bash
npm install --no-audit --no-fund
```

Downstream consumers pull the package from npm:

```bash
npm install @koraidv/react-native
```

## 3. Android configuration

### 3.1 Enable Java 8+ core library desugaring (required)

The `@koraidv/react-native` Android module ships an AAR
(`koraidv-release.aar`) compiled with
`isCoreLibraryDesugaringEnabled = true` and uses `java.time` APIs.
Consumers must enable the same feature in their app module — otherwise
the AAR-metadata check fails with:

```
Dependency 'koraidv-release.aar' requires core library desugaring
to be enabled for :app.
```

Edit `android/app/build.gradle`:

```groovy
android {
    // …existing config…

    compileOptions {
        coreLibraryDesugaringEnabled true
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    // …existing deps…
    coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:2.0.4'
}
```

Java 17 because RN 0.79 already requires Gradle 8 / AGP 8 / JDK 17.

### 3.2 Camera permission

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="true" />
```

The SDK requests camera permission at runtime if not already granted.

### 3.3 minSdk 24

`@koraidv/react-native` requires `minSdkVersion 24`. The RN 0.79
default is 24, so no change is needed unless your app dropped to 23.

### 3.4 New architecture

New architecture works out of the box on Android. The default
`gradle.properties` flag `newArchEnabled=true` is honoured by the SDK's
Kotlin module without further configuration.

### 3.5 Build

```bash
cd android
./gradlew :app:assembleDebug
```

A clean run completes in ~45s on a warm cache.

## 4. iOS configuration

### 4.1 Add `KoraIDV` to your Podfile

The `koraidv-react-native` podspec depends on `KoraIDV ~> 1.0`, which
is published on CocoaPods trunk. Add to your `ios/Podfile` **inside
the `target` block, before `use_react_native!`**:

```ruby
pod 'KoraIDV', '~> 1.5'
```

This example uses a local-path reference instead so it tracks the
in-repo SDK during development:

```ruby
pod 'KoraIDV', :path => '../../../koraidv-ios'
```

### 4.2 Camera permission

iOS hard-crashes the app on first camera access if
`NSCameraUsageDescription` is missing. Add to `ios/<App>/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app uses the camera to capture identity documents and verify your selfie.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app saves verification artefacts to your photo library on request.</string>
```

### 4.3 iOS deployment target

The SDK requires iOS 14.0+ (per the podspec). RN 0.79 defaults to
`min_ios_version_supported` (currently 15.1), which satisfies this.

### 4.4 Install pods + build

```bash
cd ios
pod install
xcodebuild -workspace KoraIDVExample.xcworkspace \
           -scheme KoraIDVExample \
           -configuration Debug \
           -sdk iphonesimulator \
           -destination 'generic/platform=iOS Simulator' \
           build
```

Expect `** BUILD SUCCEEDED **` on the final line.

## 5. JS integration

The SDK ships two API surfaces. Most React Native apps want the
**Provider + hook** pattern; the **imperative API** is there for
non-React flows or one-off calls outside the React tree.

### 5.1 Recommended: `<KoraIDVProvider>` + `useKoraIDV()`

Mount the provider once at your app root. Every screen inside the
provider tree can then call `useKoraIDV()` to launch and observe a
verification flow.

```tsx
// App.tsx — root of your app
import {KoraIDVProvider} from '@koraidv/react-native';

export default function App() {
  return (
    <KoraIDVProvider
      apiKey={process.env.KORAIDV_API_KEY!}      // ck_live_… or kora_sandbox_…
      tenantId={process.env.KORAIDV_TENANT_ID!}
      config={{environment: 'sandbox'}}           // or 'production'
    >
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </KoraIDVProvider>
  );
}
```

Then in any screen:

```tsx
import {useKoraIDV} from '@koraidv/react-native';

function VerifyScreen() {
  const {startVerification, verification, error, isLoading, isCancelled, reset}
    = useKoraIDV();

  if (isLoading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={reset} />;
  if (verification) return <ResultView verification={verification} />;
  if (isCancelled) return <CancelledView onRetry={reset} />;

  return (
    <Button
      title="Begin Verification"
      onPress={() => startVerification(`user-${userId}`, 'standard')}
    />
  );
}
```

**`verification` is the result slot.** It starts at `null` and only
gets a value after `startVerification()` resolves successfully — seeing
`null` before the user taps Begin is the correct initial state, not a
bug. Don't log it on every render to verify the bridge; use
`useEffect(() => { … }, [verification])` instead.

**Calling `useKoraIDV()` outside the provider throws.** If you see
`useKoraIDV must be used within a KoraIDVProvider` in a redbox or as a
silent crash on launch, the screen is mounted in a navigator that
sits outside `<KoraIDVProvider>`. Move the provider higher in the
tree — typically wrapping `NavigationContainer` at the app root.

### 5.2 Imperative API (non-React contexts)

If you need to fire a verification from a saga, background task, or
any code path that isn't inside a React component, use the imperative
module directly:

```tsx
import {KoraIDV} from '@koraidv/react-native';

await KoraIDV.configure({
  apiKey: process.env.KORAIDV_API_KEY!,
  tenantId: process.env.KORAIDV_TENANT_ID!,
  environment: 'sandbox',
});

const result = await KoraIDV.startVerification({
  externalId: `user-${Date.now()}`,
  tier: 'standard',
});
```

`KoraIDV.configure()` and `<KoraIDVProvider>` can coexist — they
write to the same underlying native config. Pick whichever fits the
call site.

See `App.tsx` in this example for the imperative-API path; see your
own app's root for the provider pattern.

## 6. Run the example

```bash
# Terminal 1: Metro
npm start

# Terminal 2: launch on a simulator/device
npm run android       # or: npm run ios
```

To exercise `startVerification` against the sandbox API, set:

```bash
export KORAIDV_SANDBOX_API_KEY='kora_sandbox_…'
export KORAIDV_SANDBOX_TENANT_ID='<your-tenant-uuid>'
```

(Get these by signing up at https://sandbox.korastratum.com.)

---

## Troubleshooting cheat-sheet

| Symptom | Cause | Fix |
|---|---|---|
| `Dependency 'koraidv-release.aar' requires core library desugaring to be enabled for :app.` | Missing `coreLibraryDesugaring` config | §3.1 |
| `Smart cast to '…' is impossible, because '…' is a public API property declared in different module.` | Pre-1.5.3 SDK bug, fixed in 1.5.4. | Upgrade `@koraidv/react-native` to ≥ 1.5.4. |
| `Unable to find a specification for 'KoraIDV (~> 1.0)'` during `pod install` | Stale Specs repo cache | `pod repo update`, then `pod install` again. §4.1 shows the trunk form. |
| iOS app crashes on first camera access with `NSInvalidArgumentException` | Missing `NSCameraUsageDescription` | §4.2 |
| `Unable to find module dependency: 'KoraIDVReactNativeSpec'` | Pre-1.5.3 SDK bug — Swift wrapper imported a non-existent codegen module | Upgrade `@koraidv/react-native` to ≥ 1.5.4. |
| App crashes on launch / `useKoraIDV must be used within a KoraIDVProvider` | Screen calls `useKoraIDV()` but no `<KoraIDVProvider>` mounted above it | Wrap your app root (typically around `NavigationContainer`) with `<KoraIDVProvider apiKey tenantId config>`. §5.1 |
| `verification` is `null` even after the user finished a flow | Logging on every render — log fires before `startVerification()` resolves | Move the log behind `useEffect(() => { … }, [verification])`. `null` is the correct initial state. §5.1 |
