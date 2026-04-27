package com.koraidv.reactnative

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.koraidv.sdk.Configuration
import com.koraidv.sdk.DocumentType
import com.koraidv.sdk.KoraException
import com.koraidv.sdk.KoraIDV
import com.koraidv.sdk.KoraTheme
import com.koraidv.sdk.LivenessMode
import com.koraidv.sdk.ResultPageMessages
import com.koraidv.sdk.ResultPageMode
import com.koraidv.sdk.Verification
import com.koraidv.sdk.VerificationRequest
import com.koraidv.sdk.VerificationTier
import com.koraidv.sdk.ui.VerificationActivity
import org.json.JSONObject

/**
 * React Native bridge module for KoraIDV Android SDK.
 *
 * Exposes three methods:
 *   - configure(configJSON)
 *   - startVerification(externalId, tier, optionsJSON) → Promise<JSON>
 *   - resumeVerification(verificationId) → Promise<JSON>
 *
 * Supports both Old Architecture (ReactContextBaseJavaModule) and
 * New Architecture (TurboModule via codegen-generated spec).
 */
class KoraIDVReactNativeModule(
    reactContext: ReactApplicationContext
) : KoraIDVReactNativeModuleSpec(reactContext) {

    companion object {
        const val NAME = "KoraIDVReactNative"
        private const val REQUEST_CODE_VERIFICATION = 9001
    }

    private var pendingPromise: Promise? = null

    private val activityEventListener: ActivityEventListener =
        object : BaseActivityEventListener() {
            override fun onActivityResult(
                activity: Activity?,
                requestCode: Int,
                resultCode: Int,
                data: Intent?
            ) {
                if (requestCode != REQUEST_CODE_VERIFICATION) return

                val promise = pendingPromise ?: return
                pendingPromise = null

                when (resultCode) {
                    Activity.RESULT_OK -> {
                        @Suppress("DEPRECATION")
                        val verification = data?.getParcelableExtra<Verification>(
                            VerificationActivity.EXTRA_VERIFICATION
                        )
                        if (verification != null) {
                            val resultJSON = Serialization.buildSuccessResult(verification)
                            promise.resolve(resultJSON)
                        } else {
                            promise.reject(
                                "UNKNOWN",
                                "Missing verification data in result."
                            )
                        }
                    }
                    Activity.RESULT_CANCELED -> {
                        @Suppress("DEPRECATION")
                        val error = data?.getParcelableExtra<KoraException>(
                            VerificationActivity.EXTRA_ERROR
                        )
                        if (error != null) {
                            promise.reject(error.errorCode, error.message)
                        } else {
                            val cancelJSON = "{\"type\":\"cancelled\"}"
                            promise.resolve(cancelJSON)
                        }
                    }
                    else -> {
                        val cancelJSON = "{\"type\":\"cancelled\"}"
                        promise.resolve(cancelJSON)
                    }
                }
            }
        }

    init {
        reactContext.addActivityEventListener(activityEventListener)
    }

    override fun getName(): String = NAME

    // -----------------------------------------------------------------------
    // configure
    // -----------------------------------------------------------------------

    @ReactMethod
    override fun configure(configJSON: String) {
        val json = JSONObject(configJSON)

        val apiKey = json.getString("apiKey")
        val tenantId = json.getString("tenantId")

        val documentTypes = if (json.has("documentTypes")) {
            val arr = json.getJSONArray("documentTypes")
            (0 until arr.length()).mapNotNull { i ->
                DocumentType.fromCode(arr.getString(i))
            }
        } else {
            DocumentType.entries
        }

        val livenessMode = if (json.optString("livenessMode") == "passive") {
            LivenessMode.PASSIVE
        } else {
            LivenessMode.ACTIVE
        }

        val theme = if (json.has("theme")) {
            val themeJSON = json.getJSONObject("theme")
            KoraTheme(
                primaryColor = themeJSON.optString("primaryColor").hexToLong()
                    ?: KoraTheme().primaryColor,
                backgroundColor = themeJSON.optString("backgroundColor").hexToLong()
                    ?: KoraTheme().backgroundColor,
                surfaceColor = themeJSON.optString("surfaceColor").hexToLong()
                    ?: KoraTheme().surfaceColor,
                textColor = themeJSON.optString("textColor").hexToLong()
                    ?: KoraTheme().textColor,
                errorColor = themeJSON.optString("errorColor").hexToLong()
                    ?: KoraTheme().errorColor,
                successColor = themeJSON.optString("successColor").hexToLong()
                    ?: KoraTheme().successColor,
                cornerRadius = themeJSON.optDouble("borderRadius", 12.0).toFloat()
            )
        } else {
            KoraTheme()
        }

        // REQ-005 · resultPageMode + customMessages cross the bridge as strings
        // and a nested object. Unknown values fall back to the SDK default
        // (DETAILED) so a stale dashboard setting can't crash the bridge.
        val resultPageMode = when (json.optString("resultPageMode")) {
            "simplified" -> ResultPageMode.SIMPLIFIED
            else -> ResultPageMode.DETAILED
        }
        val customMessages = json.optJSONObject("customMessages")?.let { cm ->
            ResultPageMessages(
                successTitle = cm.optString("successTitle").ifEmpty { null },
                successMessage = cm.optString("successMessage").ifEmpty { null },
                failedTitle = cm.optString("failedTitle").ifEmpty { null },
                failedMessage = cm.optString("failedMessage").ifEmpty { null },
                reviewTitle = cm.optString("reviewTitle").ifEmpty { null },
                reviewMessage = cm.optString("reviewMessage").ifEmpty { null }
            )
        }

        val config = Configuration(
            apiKey = apiKey,
            tenantId = tenantId,
            baseUrl = json.optString("baseUrl").ifEmpty { null },
            documentTypes = documentTypes,
            livenessMode = livenessMode,
            theme = theme,
            timeout = json.optLong("timeout", 600),
            debugLogging = json.optBoolean("debugLogging", false),
            resultPageMode = resultPageMode,
            customMessages = customMessages
        )

        KoraIDV.configure(config)
    }

    // -----------------------------------------------------------------------
    // startVerification
    // -----------------------------------------------------------------------

    @ReactMethod
    override fun startVerification(
        externalId: String,
        tier: String,
        optionsJSON: String,
        promise: Promise
    ) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("NOT_CONFIGURED", "No current activity found.")
            return
        }

        if (!KoraIDV.isConfigured) {
            promise.reject("NOT_CONFIGURED", "SDK not configured. Call KoraIDV.configure() first.")
            return
        }

        val verificationTier = when (tier) {
            "basic" -> VerificationTier.BASIC
            "enhanced" -> VerificationTier.ENHANCED
            else -> VerificationTier.STANDARD
        }

        val request = VerificationRequest(
            externalId = externalId,
            tier = verificationTier
        )

        pendingPromise = promise

        val intent = VerificationActivity.createIntent(activity, request)
        activity.startActivityForResult(intent, REQUEST_CODE_VERIFICATION)
    }

    // -----------------------------------------------------------------------
    // resumeVerification
    // -----------------------------------------------------------------------

    @ReactMethod
    override fun resumeVerification(verificationId: String, promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("NOT_CONFIGURED", "No current activity found.")
            return
        }

        if (!KoraIDV.isConfigured) {
            promise.reject("NOT_CONFIGURED", "SDK not configured. Call KoraIDV.configure() first.")
            return
        }

        pendingPromise = promise

        val intent = VerificationActivity.createResumeIntent(activity, verificationId)
        activity.startActivityForResult(intent, REQUEST_CODE_VERIFICATION)
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    /**
     * Parse hex color string (#RRGGBB) to ARGB Long, or null if invalid.
     */
    private fun String.hexToLong(): Long? {
        if (this.isEmpty()) return null
        val hex = this.removePrefix("#")
        if (hex.length != 6) return null
        return try {
            (0xFF000000 or hex.toLong(16))
        } catch (_: NumberFormatException) {
            null
        }
    }
}
