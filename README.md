# Mike's Math Coach

Mike's Math Coach is an adaptive Android math-learning app designed to find a learner's true starting point, teach concepts in multiple ways, generate fresh practice problems, and build confidence from basic arithmetic through advanced mathematics.

The core idea is simple: do not assume what the learner knows. Test it cold, identify the first weak prerequisite, teach from there, then keep retesting with new numbers and different representations until the skill is truly understood.

## Current focus

- True starting-point diagnostic with no lesson hints or answer leakage
- Fresh generated practice problems instead of a tiny fixed question bank
- True tap-again-to-stop lesson audio
- Multiple teaching styles and an adaptive teaching mode
- Local progress tracking, strengths, weaknesses, response time, hints, and retention signals
- Guided learning from foundations through calculus, statistics, linear algebra, and machine-learning mathematics
- Offline-first Android experience
- Stable test-package signing so repeat test builds can update cleanly

## Basic Math Worksheet

Basic Math is now available as a normal selectable subject under **FOUNDATIONS**.

Selecting **Basic Math Worksheet** generates a fresh 30-question worksheet covering:

- Number sense and place value
- Comparing numbers
- Even and odd numbers
- Rounding and estimation
- Addition and subtraction
- Multiplication and division facts
- Fact families
- Money and change
- Time
- Measurement and conversions
- Fractions
- Decimals
- Percentages
- Ratios and proportions
- Negative numbers
- Exponent basics
- Square-root basics
- Order of operations
- Number patterns

The worksheet is generated from parameterized problem makers so repeated practice uses different values instead of recycling one tiny fixed set.

## Teaching styles

Mike's Math Coach supports Plain English, Worked Examples, Visual / Spatial, Pattern Discovery, Real-World Application, Rule & Formula First, Why It Works, Analogy / Story, Guided Questions, Learn From Mistakes, Memory & Repetition, Challenge Mode, Audio-First, Read & Study, and Adaptive Mix.

## Placement philosophy

The placement test is intentionally separate from lesson mode. During placement the app does not show Learn This First content, hints, explanations, or immediate correctness feedback. The goal is to measure what the learner can solve without coaching, then use that result to build the learning path.

Basic-math skills are included before higher mathematics so the app can detect an actual foundational starting point rather than assuming arithmetic mastery.

## Math coverage

The project is designed to cover number sense, arithmetic, fractions, decimals, percentages, ratios, negatives, exponents, roots, scientific notation, pre-algebra, Algebra I and II, equations, inequalities, graphing, functions, systems, polynomials, factoring, rational expressions, radicals, geometry, measurement, trigonometry, precalculus, Calculus I-III, linear algebra, probability, statistics, logic, sets, discrete mathematics, combinatorics, numerical methods, optimization, and machine-learning mathematics.

## Audio behavior

The lesson-audio control is intended to behave as a real toggle:

- First tap starts narration
- While narration is playing, the button changes to **Stop audio**
- Tapping the same control again stops Android text-to-speech immediately
- Turning lesson audio off in Settings also stops current speech
- The button resets when speech finishes naturally

The Android bridge exposes native speak, stop, and speaking-state checks so the JavaScript UI and Android TTS engine stay synchronized.

## Android build

This repository includes a GitHub Actions workflow at `.github/workflows/android-build.yml`.

Every push to `main` builds a clean Android debug APK using Java 17, Android SDK 35, Android Gradle Plugin 8.5.2, and Gradle 8.7.

The current test build uses:

- Application ID: `com.mikesmathcoach.test`
- Version: **1.6.3-test**
- Version code: **9**
- Fixed JKS test signing key for repeatable updates
- Artifact name: `Mike-Math-Coach-v1.6.3-test`

Local build command:

```bash
gradle clean assembleDebug
```

APK output:

```text
app/build/outputs/apk/debug/app-debug.apk
```

## Development safety

Before edits, preserve the last working source. Backup branches are created before major changes so failed experiments can be rolled back without sacrificing the previous build.

Recent backup branches include checkpoints before the audio fix, stable test signing work, and Basic Math selector update.

## Privacy

The app is designed around local, on-device learning data whenever practical. Future cloud, account, synchronization, or AI features should clearly disclose what data is collected, why it is collected, where it is stored, and how it can be deleted.

## Status

Active development.

Current Android test version: **1.6.3-test** (`versionCode 9`).

Latest main-branch feature set includes the selectable Basic Math Worksheet, expanded basic-math placement coverage, generated practice, and the corrected audio-stop architecture.

## Copyright

Copyright © 2026 Mike's Math Coach. All rights reserved.

This source code is proprietary and may not be copied, modified, distributed, sublicensed, sold, published, or incorporated into another product without written permission from the copyright owner.

No open-source license is granted by the presence of this repository.
