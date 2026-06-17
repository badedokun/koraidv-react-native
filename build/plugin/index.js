import { withInfoPlist, withAndroidManifest, withProjectBuildGradle, } from '@expo/config-plugins';
const DEFAULT_CAMERA_MESSAGE = 'This app needs camera access to capture your identity document and selfie for verification.';
const withKoraIDVIos = (config, props) => {
    return withInfoPlist(config, (config) => {
        config.modResults.NSCameraUsageDescription =
            props.cameraPermissionMessage ?? DEFAULT_CAMERA_MESSAGE;
        return config;
    });
};
const withKoraIDVAndroidManifest = (config) => {
    return withAndroidManifest(config, (config) => {
        const manifest = config.modResults.manifest;
        // Ensure uses-permission array exists
        if (!manifest['uses-permission']) {
            manifest['uses-permission'] = [];
        }
        const permissions = manifest['uses-permission'];
        const addPermission = (name) => {
            if (!permissions.some((p) => p.$?.['android:name'] === name)) {
                permissions.push({ $: { 'android:name': name } });
            }
        };
        addPermission('android.permission.CAMERA');
        addPermission('android.permission.INTERNET');
        // Ensure uses-feature array exists
        if (!manifest['uses-feature']) {
            manifest['uses-feature'] = [];
        }
        const features = manifest['uses-feature'];
        const addFeature = (name, required) => {
            if (!features.some((f) => f.$?.['android:name'] === name)) {
                features.push({
                    $: { 'android:name': name, 'android:required': required },
                });
            }
        };
        addFeature('android.hardware.camera', 'true');
        addFeature('android.hardware.camera.front', 'true');
        addFeature('android.hardware.camera.autofocus', 'false');
        return config;
    });
};
const withKoraIDVAndroidGradle = (config) => {
    return withProjectBuildGradle(config, (config) => {
        if (config.modResults.language !== 'groovy') {
            return config;
        }
        const contents = config.modResults.contents;
        // Add JitPack repository if not already present
        if (!contents.includes('jitpack.io')) {
            config.modResults.contents = contents.replace(/allprojects\s*\{[\s\S]*?repositories\s*\{/m, (match) => `${match}\n        maven { url 'https://jitpack.io' }`);
        }
        return config;
    });
};
const withKoraIDV = (config, props) => {
    const pluginProps = props ?? {};
    config = withKoraIDVIos(config, pluginProps);
    config = withKoraIDVAndroidManifest(config);
    config = withKoraIDVAndroidGradle(config);
    return config;
};
export default withKoraIDV;
//# sourceMappingURL=index.js.map