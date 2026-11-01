# Production release checklist — Mike's Math Coach

## Version 2.0.0 (build 30)
- Target API 36 for Google Play submissions as of August 31, 2026.
- Android Gradle Plugin 8.9.2 and Gradle 8.11.1 for API 36 compatibility.
- Privacy-policy draft is in PRIVACY_POLICY.md, pending verified developer contact and final data handling review.

## Implemented
- Offline-first learning content, daily plan, skill reviews, progress dashboard, and Ain't Cloud Software branding.
- Android app label uses Mike's Math Coach.
- Unneeded INTERNET permission removed.
- WebView file/content cross-origin access restricted; external navigation only supports HTTPS.
- Automatic Android backup disabled to avoid silently copying local student data.
- Node contract regression checks and Android debug build in CI.

## Required before Google Play release
- **Release workflow configured:** Add protected GitHub production environment and four secrets: `UPLOAD_KEYSTORE_B64`, `UPLOAD_STORE_PASSWORD`, `UPLOAD_KEY_ALIAS`, and `UPLOAD_KEY_PASSWORD`. Generate the keystore privately outside GitHub and securely back it up. Invoke the manually gated `Signed Android release bundle` workflow only after secrets and device QA are in place. No production key is currently provisioned here.
- **Package-name gate:** Confirm whether `com.mikesmathcoach.test` has already been registered or distributed in Play Console. Do not change it blindly: doing so creates a distinct Android app and breaks update continuity. Choose a final package ID before first production upload if not already registered.
- Finish real-device QA on Android 16/API 36 and older versions: verify edge-to-edge insets, voice reading, stop/resume, rotation, back navigation, offline restart, progress persistence, and accessibility.
- Test all lesson banks for mathematical correctness and adversarial input, including negative values, fractions and rounding.
- Publish privacy policy at a public stable URL and add the verified support email; complete Data Safety disclosures reflecting actual collection, backup, and device storage behavior; complete Play content rating and screenshots.
- Run Android lint and accessibility review; verify SDK target requirements at submission time.
- Configure a secure signed AAB release pipeline and internal testing track.
- Decide whether to introduce an explicit learning-data export/import flow before shipping with automatic backup disabled.
- Keep public-facing claims accurate: current personalization uses deterministic rules, not a remote generative AI service.

## Release pipeline
The debug workflow assembles an internal APK on pushes. The separate manual release workflow creates a signed AAB with protected secrets and does not publish automatically. A working debug APK is not a signed production bundle.

## Release gate
**Not production certified.** The automated debug APK is an internal QA build only. Release should be blocked until signing, AAB delivery, device testing, and store compliance are complete.
