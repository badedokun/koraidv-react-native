package com.koraidv.reactnative

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

/**
 * React Native package registration for KoraIDV module.
 *
 * Extends TurboReactPackage to support both Old Architecture and
 * New Architecture (TurboModules). TurboReactPackage is backward-compatible
 * and works correctly on Old Architecture as well.
 *
 * Registered via auto-linking — consumers do not need to manually
 * add this package in their Application class.
 */
class KoraIDVReactNativePackage : TurboReactPackage() {

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == KoraIDVReactNativeModule.NAME) {
            KoraIDVReactNativeModule(reactContext)
        } else {
            null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            mapOf(
                KoraIDVReactNativeModule.NAME to ReactModuleInfo(
                    KoraIDVReactNativeModule.NAME,
                    KoraIDVReactNativeModule.NAME,
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    false, // isCxxModule
                    BuildConfig.IS_NEW_ARCHITECTURE_ENABLED // isTurboModule
                )
            )
        }
    }
}
