# Mike's Math Coach

Mike's Math Coach is an adaptive Android math-learning app designed to find a learner's true starting point, teach concepts in multiple ways, generate fresh practice problems, and build confidence from basic arithmetic through advanced mathematics.

The core idea is simple: do not assume what the learner knows. Test it cold, identify the first weak prerequisite, teach from there, then keep retesting with new numbers and different representations until the skill is truly understood.

## Current focus

- True starting-point diagnostic with no lesson hints or answer leakage
- Fresh generated practice problems instead of a tiny fixed question bank
- Persistent audio controls with immediate stop behavior
- Multiple teaching styles and an adaptive teaching mode
- Local progress tracking, strengths, weaknesses, response time, hints, and retention signals
- Guided learning from foundations through calculus, statistics, linear algebra, and machine-learning mathematics
- Offline-first Android experience

## Teaching styles

Mike's Math Coach supports Plain English, Worked Examples, Visual / Spatial, Pattern Discovery, Real-World Application, Rule & Formula First, Why It Works, Analogy / Story, Guided Questions, Learn From Mistakes, Memory & Repetition, Challenge Mode, Audio-First, Read & Study, and Adaptive Mix.

## Placement philosophy

The placement test is intentionally separate from lesson mode. During placement the app does not show Learn This First content, hints, explanations, or immediate correctness feedback. The goal is to measure what the learner can solve without coaching, then use that result to build the learning path.

## Math coverage

The project is designed to cover number sense, arithmetic, fractions, decimals, percentages, ratios, negatives, exponents, roots, scientific notation, pre-algebra, Algebra I and II, equations, inequalities, graphing, functions, systems, polynomials, factoring, rational expressions, radicals, geometry, measurement, trigonometry, precalculus, Calculus I-III, linear algebra, probability, statistics, logic, sets, discrete mathematics, combinatorics, numerical methods, optimization, and machine-learning mathematics.

## Android build

This repository includes a GitHub Actions workflow at `.github/workflows/android-build.yml`.

Every push to `main` can build a clean Android debug APK using Java 17, Android SDK 35, Android Gradle Plugin 8.5.2, and Gradle 8.7. The compiled APK is uploaded to the workflow run as an artifact named `Mike-Math-Coach-v1.6-debug`.

Local build command:

```bash
gradle clean assembleDebug
```

APK output:

```text
app/build/outputs/apk/debug/app-debug.apk
```

## Development safety

Before editing, preserve the last stable source. The project includes `rotate_backup.sh` for local rotating backups. Signing keys and keystores are deliberately excluded from source control.

## Privacy

The app is designed around local, on-device learning data whenever practical. Future cloud, account, synchronization, or AI features should clearly disclose what data is collected, why it is collected, where it is stored, and how it can be deleted.

## Status

Active development. Current Android version: **1.6.0** (`versionCode 7`).

## Copyright

Copyright © 2026 Mike's Math Coach. All rights reserved.

This source code is proprietary and may not be copied, modified, distributed, sublicensed, sold, published, or incorporated into another product without written permission from the copyright owner.

No open-source license is granted by the presence of this repository.