# Mike's Math Coach Build Agent

The Build Agent is a GitHub Actions automation in `.github/workflows/build-agent.yml`.

## Triggers
- Every push to main
- Every pull request
- Manual dispatch from the Actions tab
- Weekly schedule, Mondays 09:15 UTC

## What it does
1. Installs Java 17, Android API 36, Gradle 8.11.1 and Node 22.
2. Runs all Node regression tests.
3. Builds a debug APK, runs Android lint, and packages an **unsigned** release bundle.
4. Verifies output files exist and uploads the debug APK and lint report.
5. Publishes a GitHub Actions run summary.
6. On failed non-PR runs, opens a GitHub issue or comments on an existing issue with run and commit links.

## Limits
- The Build Agent does not rewrite application source code or bypass required reviews.
- Debug builds use the test signing key. It never handles production signing credentials.
- A successful agent run does not prove compatibility on real physical devices.
- Play Store release still requires a privately signed AAB, account-owner approval, policy disclosures and physical QA.
- GitHub must have Actions enabled, and the job must have permission to create GitHub Issues for automated failure reports.

## How to launch
GitHub > Actions > Math Coach Build Agent > Run workflow. Inspect the uploaded debug APK and lint report under Artifacts when the run completes.
