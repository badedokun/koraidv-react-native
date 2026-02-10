require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "koraidv-react-native"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "14.0" }
  s.source       = { :git => package["repository"]["url"], :tag => s.version.to_s }

  s.source_files = "ios/**/*.{h,m,mm,swift}"

  s.swift_version = "5.7"

  s.dependency "React-Core"
  s.dependency "KoraIDV", "~> 1.0"

  # New Architecture (TurboModule) support — conditionally adds
  # Fabric and TurboModule dependencies when enabled.
  install_modules_dependencies(s)
end
