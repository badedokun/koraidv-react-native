buildscript {
    val kotlinVersion = findProperty("kotlinVersion") as? String ?: "1.9.22"

    repositories {
        google()
        mavenCentral()
    }

    dependencies {
        classpath("com.android.tools.build:gradle:8.2.2")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
    }
}

plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
}

// New Architecture: apply codegen plugin if available
if (project.hasProperty("newArchEnabled") && project.property("newArchEnabled") == "true") {
    apply(plugin = "com.facebook.react")
}

val safeExtGet: (String, Any) -> Any = { prop, fallback ->
    if (rootProject.ext.has(prop)) rootProject.ext.get(prop)!! else fallback
}

val isNewArchEnabled: Boolean
    get() = project.hasProperty("newArchEnabled") && project.property("newArchEnabled") == "true"

android {
    namespace = "com.koraidv.reactnative"
    compileSdk = safeExtGet("compileSdkVersion", 34) as Int

    defaultConfig {
        minSdk = safeExtGet("minSdkVersion", 24) as Int
        targetSdk = safeExtGet("targetSdkVersion", 34) as Int
        buildConfigField("boolean", "IS_NEW_ARCHITECTURE_ENABLED", isNewArchEnabled.toString())
    }

    buildFeatures {
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    sourceSets {
        getByName("main") {
            java.srcDirs("src/main/kotlin")
        }
    }
}

repositories {
    google()
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
    flatDir { dirs("libs") }
}

dependencies {
    implementation("com.facebook.react:react-android:+")
    // Local AAR with redesigned UI (replaces JitPack v1.0.3)
    implementation(files("libs/koraidv-release.aar"))

    // The AAR above was packaged as a flat file (not a Maven artifact),
    // so transitive dependencies declared by the SDK's own
    // build.gradle.kts don't reach consumers — they ship as
    // NoClassDefFoundError at runtime on first SDK call. Re-declared
    // here so the host app gets them on the runtime classpath. Versions
    // kept in sync with koraidv-android/gradle/libs.versions.toml
    // (2026-05-25: retrofit 2.11.0, okhttp 4.12.0). Once we publish a
    // proper maven/jitpack artifact, delete this block — the POM /
    // module metadata will carry these.
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // AndroidX foundation — VerificationActivity uses androidx.activity.EdgeToEdge,
    // viewmodel-ktx, lifecycle-runtime. Versions track koraidv-android's
    // libs.versions.toml (2026-05-25).
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.7")

    // Compose — Material 3 + extended icon set. The BOM pins all
    // compose-* artifacts to a consistent versioned set.
    implementation(platform("androidx.compose:compose-bom:2024.12.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    // CameraX — used by the document + selfie capture screens.
    implementation("androidx.camera:camera-core:1.4.1")
    implementation("androidx.camera:camera-camera2:1.4.1")
    implementation("androidx.camera:camera-lifecycle:1.4.1")
    implementation("androidx.camera:camera-view:1.4.1")

    // ML Kit — barcode/text/face/document scanning.
    implementation("com.google.mlkit:face-detection:16.1.7")
    implementation("com.google.mlkit:text-recognition:16.0.1")
    // mlkit:document-scanner:16.0.0-beta1 is referenced in koraidv-android's
    // build.gradle.kts but isn't published on Maven Central, Google Maven, or
    // JitPack (verified 2026-05-25). Omitting here — the demo doesn't
    // exercise the document-scanner code path. If a consumer triggers it
    // they'd hit NoClassDefFoundError at runtime; needs a follow-up to
    // either publish the artifact or remove the dep from the SDK.
    implementation("com.google.mlkit:barcode-scanning:17.3.0")
}
