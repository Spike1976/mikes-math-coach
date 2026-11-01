# Google Play release packet — Mike's Math Coach 2.0

**Developer brand:** Ain't Cloud Software
**Current version:** 2.0.0 (code 30)
**Current application ID:** com.mikesmathcoach.test (REQUIRES Play Console identity confirmation before public release)
**Category suggestion:** Education

## Store listing draft

**App name:** Mike's Math Coach

**Short description:**
Learn math step by step with offline lessons, practice, and progress tracking.

**Full description:**
Mike's Math Coach helps you build math confidence at your own pace. Explore guided lessons, practice with fresh questions, and understand the steps behind each answer.

Highlights:
- Structured learning path from foundational arithmetic into advanced topics
- Fraction, decimal, percentage, and equation practice
- Step-by-step Equation Lab
- Visual explanations and optional spoken tutoring using your device's speech engine
- Personalized review scheduling and adaptive difficulty rules
- Daily practice recommendations and learning progress dashboards
- Offline-first operation with learning data stored on your device

The app uses rule-based practice recommendations. It does not claim an online AI model or remote AI tutor.

## Data Safety preparation
Review **final packaged build**, third-party SDKs, Android TTS engine, backup behavior, and any embedded links before answering the Play Console questionnaire.
- Reviewed app requests no INTERNET permission.
- Locally stores learning history and preferences.
- Android backup disabled.
- No user registration, developer cloud synchronization, or advertising SDK in current reviewed source.
- Current policy draft: PRIVACY_POLICY.md; publish a stable public version before listing.
Do not submit declarations without validating the final build.

## Assets required
- App icon meeting Play's current technical requirements
- Feature graphic
- Real phone screenshots of the actual signed version
- Privacy-policy public URL
- Verified developer contact information, support email, and account requirements
- Content rating and target audience details
- Testing track and tester recruitment if applicable

## Release approval gates
1. Decide the final app package name and verify Play Console status. If previously distributed, preserve update continuity.
2. Provide GitHub production environment and signing secrets; back up keystore securely.
3. Produce signed AAB from manual release workflow.
4. Install QA APK on real Android devices, including API 36, and validate UI insets, keyboard, speech, offline restart and persistence.
5. Review all store assets, listing claims and Play Data Safety form.
6. Upload signed AAB to Play Console internal test, check pre-launch reports, then promote only after testing sign-off.

**Status:** Repository prepared; publication requires account-owner actions, credentials, Play Console review, and device validation.
