# mikes-math-coach
Mike’s Math Coach is an adaptive Android math-learning app designed to find a student’s true starting point, teach concepts in multiple learning styles, track strengths and weaknesses, generate fresh problems, and build confidence from basic arithmetic through algebra, calculus, statistics, linear algebra, and machine-learning math.
Mike’s Math Coach

Mike’s Math Coach is an adaptive Android math-learning app designed to help users find their true mathematical starting point, learn through multiple teaching styles, practice with fresh problems, and build confidence from basic arithmetic through advanced mathematics.

The goal is simple: do not assume what the learner knows. Test it, find the gaps, teach from the correct starting point, and adapt the experience based on how the user actually learns.

Core Goals

Mike’s Math Coach is being built to:

- Find the user’s real mathematical starting point
- Prevent placement tests from giving away answers or teaching during assessment
- Adapt lessons to the learner’s strengths and weaknesses
- Support multiple teaching and learning styles
- Generate large numbers of fresh practice problems
- Track progress, confidence, mistakes, and retention
- Explain mathematics in plain language
- Support users who struggle with traditional math instruction
- Cover mathematics from basic arithmetic through college-level and machine-learning mathematics
- Work well on Android phones

Current Math Coverage

The planned curriculum includes:

- Number sense
- Addition
- Subtraction
- Multiplication
- Division
- Fractions
- Decimals
- Percentages
- Ratios and proportions
- Negative numbers
- Order of operations
- Exponents
- Roots
- Scientific notation
- Pre-algebra
- Algebra I
- Equations
- Inequalities
- Coordinate graphing
- Functions
- Systems of equations
- Polynomials
- Factoring
- Rational expressions
- Radicals
- Algebra II
- Geometry
- Measurement
- Trigonometry
- Precalculus
- Calculus I
- Calculus II
- Calculus III
- Linear algebra
- Probability
- Statistics
- Logic
- Set theory
- Discrete mathematics
- Combinatorics
- Optimization
- Numerical methods
- Machine-learning mathematics

Find My Real Starting Point

The placement system is intended to determine what the learner truly understands rather than simply what answers they can recognize.

During placement testing:

- No lesson recommendations are shown before the assessment is complete
- No “Learn This First” hints are displayed
- No explanations are shown before answering
- No immediate correctness feedback is provided
- Questions vary in format and difficulty
- Multiple representations of the same concept can be tested
- The system can move forward or backward based on performance

The goal is to identify the first weak prerequisite that is likely to interfere with later mathematics.

Teaching Styles

Mike’s Math Coach is designed to support different ways of learning.

Teaching modes include:

Plain English

Minimal jargon with direct explanations.

Worked Example

Every mathematical step is shown.

Visual Learning

Uses diagrams, number lines, graphs, shapes, and visual representations.

Pattern Discovery

Shows examples and helps the learner recognize the underlying rule.

Real-World Learning

Uses practical examples involving money, driving, mileage, fuel, measurements, time, construction, shopping, and other everyday situations.

Formula First

Shows the rule or formula first, followed by application.

Why It Works

Focuses on conceptual understanding rather than memorization alone.

Analogy and Story

Connects abstract mathematics to familiar ideas.

Guided Questions

Breaks problems into smaller questions and guides the learner toward the answer.

Mistake-Based Learning

Shows common wrong approaches and explains why they fail.

Repetition and Memory

Uses repeated practice and spaced review.

Challenge Mode

Reduces assistance and progressively increases difficulty.

Audio-First

Uses spoken explanations with simplified on-screen information.

Read and Study

Provides more detailed textbook-style explanations.

Adaptive Mode

Allows the system to mix teaching styles based on the learner’s results.

Adaptive Learning

The long-term learning engine is intended to track more than simple right and wrong answers.

Data may include:

- Topic
- Subtopic
- Difficulty
- Teaching style used
- First-attempt accuracy
- Retry count
- Response time
- Hint usage
- Explanation usage
- Common mistakes
- Confidence level
- Recent practice
- Long-term retention
- Mastery level

This allows the system to identify both what the learner struggles with and which teaching methods appear to work best.

Problem Generation

Mike’s Math Coach is intended to rely heavily on generated problems instead of a small fixed question bank.

Generated problems can vary:

- Numbers
- Signs
- Fractions
- Decimals
- Percentages
- Equation structures
- Variables
- Word-problem wording
- Context
- Difficulty
- Answer order
- Problem format

This helps reduce memorization of specific questions and keeps practice from becoming stale.

Audio

The Android app includes spoken-learning support.

Audio settings are intended to support:

- Audio on/off
- Immediate stopping of active speech
- Persistent audio preference
- Spoken questions
- Spoken explanations
- Optional sound effects

The user should always be able to turn narration off without restarting the app.

Progress and Mastery

Skills can eventually be tracked using levels such as:

- Unknown
- Emerging
- Developing
- Proficient
- Mastered

Mastery should be based on repeated performance across different forms of the same skill, not one correct answer.

Backup and Development Safety

Every development session should begin by preserving the latest stable project.

The project uses a rotating backup strategy intended to retain several recent copies, along with milestone versions such as:

- Stable
- Alpha
- Beta
- Release

The purpose is simple: no edit should destroy the last working build.

Android

Mike’s Math Coach is currently being developed as an Android application.

The project may include:

- Native Android wrapper
- Offline HTML/JavaScript learning interface
- Android Text-to-Speech integration
- Local progress storage
- Gradle build configuration

Build Automation

The repository may use GitHub Actions to create Android builds automatically.

Typical workflow:

1. Push source changes
2. GitHub Actions starts the Android build
3. Gradle compiles the project
4. APK output is generated
5. APK is stored as a downloadable workflow artifact

This provides a repeatable build process instead of relying on manually repackaged APK files.

Project Philosophy

Math instruction should not assume that a learner failed because they are incapable of understanding mathematics.

Often the missing piece is earlier in the learning chain.

A person may struggle with algebra because fractions were never fully understood. They may struggle with calculus because functions remain unclear. They may know how to produce an answer without understanding why the process works.

Mike’s Math Coach is intended to find those missing pieces and rebuild understanding from the correct point.

The aim is not simply to produce correct answers.

The aim is to teach the learner how to reach those answers with confidence.

Status

Mike’s Math Coach is under active development.

Current development priorities include:

- Improving diagnostic placement
- Expanding generated problem types
- Improving audio controls
- Expanding teaching modes
- Improving adaptive learning
- Tracking long-term strengths and weaknesses
- Expanding math curriculum coverage
- Improving explanations
- Creating reliable automated Android builds

Privacy

The long-term goal is to keep core learning data local to the user whenever practical.

Any future cloud, synchronization, AI, or account features should clearly disclose:

- What information is collected
- Why it is collected
- Where it is stored
- Whether it leaves the device
- How the user can delete it

Copyright

Copyright © 2026 Mike’s Math Coach. All rights reserved.

This source code is proprietary and may not be copied, modified, distributed, sublicensed, sold, published, or incorporated into another product without written permission from the copyright owner.

No open-source license is granted by the presence of this repository.

Repository

Project: Mike’s Math Coach
Platform: Android
Status: Active development
License: Proprietary / All Rights Reserved
