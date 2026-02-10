package com.koraidv.reactnative

import com.koraidv.sdk.ChallengeResult
import com.koraidv.sdk.DocumentVerification
import com.koraidv.sdk.FaceVerification
import com.koraidv.sdk.LivenessVerification
import com.koraidv.sdk.RiskSignal
import com.koraidv.sdk.Verification
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

/**
 * JSON serialization helpers for crossing the React Native bridge.
 *
 * Converts native SDK models → JSON strings that the TypeScript
 * deserialization layer can parse.
 */
object Serialization {

    private val iso8601Format: SimpleDateFormat
        get() = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
            timeZone = TimeZone.getTimeZone("UTC")
        }

    /**
     * Build a success result JSON string containing the verification.
     */
    fun buildSuccessResult(verification: Verification): String {
        val result = JSONObject().apply {
            put("type", "success")
            put("verification", serializeVerification(verification))
        }
        return result.toString()
    }

    /**
     * Serialize a Verification to JSONObject.
     */
    fun serializeVerification(v: Verification): JSONObject {
        return JSONObject().apply {
            put("id", v.id)
            put("externalId", v.externalId)
            put("tenantId", v.tenantId)
            put("tier", v.tier)
            put("status", v.status.value)

            if (v.documentVerification != null) {
                put("documentVerification", serializeDocumentVerification(v.documentVerification))
            }
            if (v.faceVerification != null) {
                put("faceVerification", serializeFaceVerification(v.faceVerification))
            }
            if (v.livenessVerification != null) {
                put("livenessVerification", serializeLivenessVerification(v.livenessVerification))
            }
            if (v.riskSignals != null) {
                put("riskSignals", serializeRiskSignals(v.riskSignals))
            }
            putOpt("riskScore", v.riskScore)
            put("createdAt", formatDate(v.createdAt))
            put("updatedAt", formatDate(v.updatedAt))
            putOpt("completedAt", v.completedAt?.let { formatDate(it) })
        }
    }

    private fun serializeDocumentVerification(dv: DocumentVerification): JSONObject {
        return JSONObject().apply {
            put("documentType", dv.documentType)
            putOpt("documentNumber", dv.documentNumber)
            putOpt("firstName", dv.firstName)
            putOpt("lastName", dv.lastName)
            putOpt("dateOfBirth", dv.dateOfBirth)
            putOpt("expirationDate", dv.expirationDate)
            putOpt("issuingCountry", dv.issuingCountry)
            putOpt("mrzValid", dv.mrzValid)
            putOpt("authenticityScore", dv.authenticityScore)
            if (dv.extractedFields != null) {
                put("extractedFields", JSONObject(dv.extractedFields))
            }
        }
    }

    private fun serializeFaceVerification(fv: FaceVerification): JSONObject {
        return JSONObject().apply {
            put("matchScore", fv.matchScore)
            put("matchResult", fv.matchResult)
            put("confidence", fv.confidence)
        }
    }

    private fun serializeLivenessVerification(lv: LivenessVerification): JSONObject {
        return JSONObject().apply {
            put("livenessScore", lv.livenessScore)
            put("isLive", lv.isLive)
            if (lv.challengeResults != null) {
                val arr = JSONArray()
                for (cr in lv.challengeResults) {
                    arr.put(serializeChallengeResult(cr))
                }
                put("challengeResults", arr)
            }
        }
    }

    private fun serializeChallengeResult(cr: ChallengeResult): JSONObject {
        return JSONObject().apply {
            put("type", cr.type)
            put("passed", cr.passed)
            put("confidence", cr.confidence)
        }
    }

    private fun serializeRiskSignals(signals: List<RiskSignal>): JSONArray {
        val arr = JSONArray()
        for (signal in signals) {
            arr.put(JSONObject().apply {
                put("code", signal.code)
                put("severity", signal.severity)
                put("message", signal.message)
            })
        }
        return arr
    }

    private fun formatDate(date: Date): String {
        return iso8601Format.format(date)
    }
}
