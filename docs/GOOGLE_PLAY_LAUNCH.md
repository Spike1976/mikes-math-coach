# Google Play launch preparation — Mike's Math Coach

Status: PREPARATION ONLY. Nothing has been published to Google Play by this repository change.

## Rollout
- Countries: United States and Philippines only (configure in each Play Console track).
- App name: Mike's Math Coach
- Category: Education
- Pricing recommendation: Free at launch, subject to publisher approval.
- Version currently in source: 2.0.0, versionCode 30.
- Target SDK: 36.
- Test application ID currently in source: `com.mikesmathcoach.test`.

## Release blockers (do not upload debug APK or unsigned AAB)
1. Confirm whether a Play Console app has already been created, and record its **immutable** package name. If new, choose a final production application ID before first upload. Keep the existing test ID for installed test builds until migration is planned.
2. Generate an upload signing key privately and store credentials securely, preferably in GitHub Actions secrets. Never commit the keystore, passwords, or base64 key to the repository. Enable Play App Signing.
3. Build a **signed release AAB** and verify its package name, signature, version code, target SDK, manifest permissions, installation, startup, screen layout, audio/TTS stop/start, worksheet generation, progress persistence, and offline operation on physical devices.
4. Add privacy policy URL and support contact, and complete Play Console Data safety, App access, Ads, Content rating, Target audience, and any Families requirements honestly after reviewing real app behavior.
5. Prepare a 512x512 store icon, 1024x500 feature graphic, and genuine phone screenshots from the release build. Do not use mockups as screenshots portraying the app's actual UI.
6. Complete the account's trader status declaration truthfully. This is account-level, independent of country choices.
7. If Play Console requires closed testing for this developer account, complete it before requesting production access.
8. Review app listing and permissions, select USA and Philippines only, submit for Google review. Do not automatically publish until release gates pass.

## Suggested store listing

**Title (30 chars maximum):** Mike's Math Coach

**Short description (80 chars maximum):**
Learn math your way with adaptive lessons, practice, and step-by-step help.

**Full description:**
Build real math confidence, one skill at a time.

Mike's Math Coach helps you find your starting point, practice at your own pace, and understand how problems work. Start with number sense and arithmetic, or move into more advanced topics as your skills grow.

- Discover which concepts need practice with a starting-point assessment.
- Practice with fresh questions instead of repeating the same worksheet.
- Explore clear explanations, worked examples, and different teaching styles.
- Work through fractions, decimals, percentages, algebra, and more.
- Use optional spoken lessons and on-device progress tracking.
- Learn at your own pace with an offline-first experience.

Whether you're returning to math or strengthening your foundations, Mike's Math Coach is built to help you learn the *why*, not just memorize an answer.

Feature statements must be checked against the final build before publication.

## Privacy / safety notes
The README describes primarily local on-device learning data. Verify all SDKs, network calls, collection, retention, analytics, advertising, and account handling before answering Play Console Data safety questions. Do not claim no data collection without an actual audit.
