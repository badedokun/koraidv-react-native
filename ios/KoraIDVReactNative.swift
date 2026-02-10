import Foundation
import KoraIDV

#if RCT_NEW_ARCH_ENABLED
import KoraIDVReactNativeSpec
#endif

/// React Native bridge module for KoraIDV iOS SDK.
///
/// Exposes three methods across the bridge:
///   - configure(configJSON)
///   - startVerification(externalId, tier, optionsJSON) → Promise<JSON>
///   - resumeVerification(verificationId) → Promise<JSON>
///
/// Results cross the bridge as JSON strings. Errors are passed via
/// Promise rejection with (code, message).
///
/// Supports both Old Architecture (RCTBridgeModule) and New Architecture
/// (TurboModule via NativeKoraIDVReactNativeSpec codegen protocol).
@objc(KoraIDVReactNative)
class KoraIDVReactNative: NSObject {

  // MARK: - configure

  @objc
  func configure(_ configJSON: String) {
    configureImpl(configJSON)
  }

  // MARK: - startVerification

  @objc
  func startVerification(
    _ externalId: String,
    tier: String,
    optionsJSON: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    startVerificationImpl(externalId, tier: tier, optionsJSON: optionsJSON, resolve: resolve, reject: reject)
  }

  // MARK: - resumeVerification

  @objc
  func resumeVerification(
    _ verificationId: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    resumeVerificationImpl(verificationId, resolve: resolve, reject: reject)
  }

  // MARK: - Module config

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}

// MARK: - Shared implementation

private extension KoraIDVReactNative {

  func configureImpl(_ configJSON: String) {
    guard let data = configJSON.data(using: .utf8),
          let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
          let apiKey = json["apiKey"] as? String,
          let tenantId = json["tenantId"] as? String
    else {
      return
    }

    var config = Configuration(apiKey: apiKey, tenantId: tenantId)

    if let env = json["environment"] as? String {
      config.environment = env == "sandbox" ? .sandbox : .production
    }

    if let baseUrl = json["baseUrl"] as? String, let url = URL(string: baseUrl) {
      config.baseURL = url
    }

    if let docTypes = json["documentTypes"] as? [String] {
      config.documentTypes = docTypes.compactMap { DocumentType(rawValue: $0) }
    }

    if let liveness = json["livenessMode"] as? String {
      config.livenessMode = liveness == "passive" ? .passive : .active
    }

    if let themeJSON = json["theme"] as? [String: Any] {
      var theme = KoraTheme()
      if let primary = themeJSON["primaryColor"] as? String {
        theme.primaryColor = UIColor(hexString: primary)
      }
      if let bg = themeJSON["backgroundColor"] as? String {
        theme.backgroundColor = UIColor(hexString: bg)
      }
      if let surface = themeJSON["surfaceColor"] as? String {
        theme.surfaceColor = UIColor(hexString: surface)
      }
      if let text = themeJSON["textColor"] as? String {
        theme.textColor = UIColor(hexString: text)
      }
      if let error = themeJSON["errorColor"] as? String {
        theme.errorColor = UIColor(hexString: error)
      }
      if let success = themeJSON["successColor"] as? String {
        theme.successColor = UIColor(hexString: success)
      }
      if let radius = themeJSON["borderRadius"] as? CGFloat {
        theme.cornerRadius = radius
      }
      config.theme = theme
    }

    if let timeout = json["timeout"] as? TimeInterval {
      config.timeout = timeout
    }

    if let debug = json["debugLogging"] as? Bool {
      config.debugLogging = debug
    }

    KoraIDV.configure(with: config)
  }

  func startVerificationImpl(
    _ externalId: String,
    tier: String,
    optionsJSON: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    let verificationTier: VerificationTier
    switch tier {
    case "basic": verificationTier = .basic
    case "enhanced": verificationTier = .enhanced
    default: verificationTier = .standard
    }

    DispatchQueue.main.async {
      guard let presenter = RCTPresentedViewController() else {
        reject("NOT_CONFIGURED", "No presenting view controller found.", nil)
        return
      }

      KoraIDV.startVerification(
        externalId: externalId,
        tier: verificationTier,
        from: presenter
      ) { result in
        Self.handleResult(result, resolve: resolve, reject: reject)
      }
    }
  }

  func resumeVerificationImpl(
    _ verificationId: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      guard let presenter = RCTPresentedViewController() else {
        reject("NOT_CONFIGURED", "No presenting view controller found.", nil)
        return
      }

      KoraIDV.resumeVerification(
        verificationId: verificationId,
        from: presenter
      ) { result in
        Self.handleResult(result, resolve: resolve, reject: reject)
      }
    }
  }

  static func handleResult(
    _ result: VerificationResult,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    switch result {
    case .success(let verification):
      do {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        let verificationData = try encoder.encode(verification)

        guard let verificationJSON = try JSONSerialization.jsonObject(with: verificationData) as? [String: Any] else {
          reject("ENCODING_ERROR", "Failed to serialize verification.", nil)
          return
        }

        let responseDict: [String: Any] = [
          "type": "success",
          "verification": verificationJSON
        ]

        let responseData = try JSONSerialization.data(withJSONObject: responseDict)
        let responseString = String(data: responseData, encoding: .utf8) ?? "{}"
        resolve(responseString)
      } catch {
        reject("ENCODING_ERROR", "Failed to serialize verification: \(error.localizedDescription)", error)
      }

    case .failure(let error):
      reject(error.errorCode, error.message, error)

    case .cancelled:
      let cancelJSON = "{\"type\":\"cancelled\"}"
      resolve(cancelJSON)
    }
  }
}

// MARK: - New Architecture (TurboModule) conformance

#if RCT_NEW_ARCH_ENABLED
extension KoraIDVReactNative: NativeKoraIDVReactNativeSpec {
}
#endif

// MARK: - UIColor hex helper

private extension UIColor {
  convenience init(hexString: String) {
    var hex = hexString.trimmingCharacters(in: .whitespacesAndNewlines)
    if hex.hasPrefix("#") {
      hex.removeFirst()
    }

    var rgbValue: UInt64 = 0
    Scanner(string: hex).scanHexInt64(&rgbValue)

    let r = CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0
    let g = CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0
    let b = CGFloat(rgbValue & 0x0000FF) / 255.0

    self.init(red: r, green: g, blue: b, alpha: 1.0)
  }
}
