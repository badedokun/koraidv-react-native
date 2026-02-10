package com.koraidv.reactnative

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

/**
 * Abstract base class for the KoraIDV React Native module.
 *
 * When New Architecture is enabled, the codegen generates
 * `NativeKoraIDVReactNativeSpec` which extends `ReactContextBaseJavaModule`
 * and declares the same abstract methods. At that point, this file should
 * be swapped for one that extends the generated spec instead.
 *
 * For Old Architecture, this simply extends `ReactContextBaseJavaModule`
 * and declares the abstract method signatures matching the TurboModule spec.
 */
abstract class KoraIDVReactNativeModuleSpec(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    abstract fun configure(configJSON: String)

    abstract fun startVerification(
        externalId: String,
        tier: String,
        optionsJSON: String,
        promise: Promise
    )

    abstract fun resumeVerification(verificationId: String, promise: Promise)
}
