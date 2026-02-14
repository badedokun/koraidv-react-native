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
}
