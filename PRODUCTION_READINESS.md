# Production release checklist — Mike's Math Coach

## Implemented
- Offline-first learning content, daily plan, skill reviews, progress dashboard, and Ain't Cloud Software branding.
- Android app label uses Mike's Math Coach.
- Unneeded INTERNET permission removed.
- WebView file/content cross-origin access restricted; external navigation only supports HTTPS.
- Automatic Android backup disabled to avoid silently copying local student data.
- Node contract regression checks and Android debug build in CI.

## Required before Google Play release
- Create a private **production** upload signing key, stored only in protected CI secrets. Do not reuse the public repository's test/debug keystore. Configure a separate release signing process.
- Choose and verify final unique applicationId; the current ID is com.mikesmathcoach.test and cannot be silently changed after existing Play distribution.
- Finish device QA on multiple Android versions: voice reading, stop/resume, rotation, back navigation, offline restart, progress persistence, and accessibility.
- Test all lesson banks for mathematical correctness and adversarial input, including negative values, fractions and rounding.
- Provide privacy policy and Data Safety disclosures reflecting actual collection, backup, and device storage behavior; complete Play content rating and screenshots.
- Run Android lint and accessibility review; verify SDK target requirements at submission time.
- Configure a secure signed AAB release pipeline and internal testing track.
- Decide whether to introduce an explicit learning-data export/import flow before shipping with automatic backup disabled.
- Keep public-facing claims accurate: current personalization uses deterministic rules, not a remote generative AI service.

## Release gate
**Not production certified.** The automated debug APK is an internal QA build only. Release should be blocked until signing, AAB delivery, device testing, and store compliance are complete.
