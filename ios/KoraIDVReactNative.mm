#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <KoraIDVReactNativeSpec/KoraIDVReactNativeSpec.h>
#endif

@interface RCT_EXTERN_MODULE(KoraIDVReactNative, NSObject)

RCT_EXTERN_METHOD(configure:(NSString *)configJSON)

RCT_EXTERN_METHOD(startVerification:(NSString *)externalId
                  tier:(NSString *)tier
                  optionsJSON:(NSString *)optionsJSON
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(resumeVerification:(NSString *)verificationId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
