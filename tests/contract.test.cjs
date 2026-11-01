'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('app/src/main/assets/index.html', 'utf8');
const java = fs.readFileSync('app/src/main/java/com/mikesmathcoach/MainActivity.java', 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]);
test('HTML has main learning screen and navigation', () => {
  assert.match(html, /id="screen"/);
  assert.match(html, /id="bar"/);
  assert.match(html, /onclick="backStep\(\)"/);
});
test('all inline JavaScript parses', () => {
  assert.ok(scripts.length > 0);
  for (const script of scripts) assert.doesNotThrow(() => new Function(script));
});
test('placement test cannot show answer explanation in its screen template', () => {
  assert.match(html, /function diagnosticPick\(i\)/);
  assert.match(html, /No hints, lesson preview, or correctness feedback/);
  assert.match(html, /if\(diagnosticMode\)\{/);
});
test('lesson has progressive hints and generated practice', () => {
  for (const fn of ['toggleExample', 'revealCurrentAnswer', 'shuffleStep', 'saveAttempt', 'finishDiagnostic']) {
    assert.ok(html.includes('function ' + fn + '('), fn);
  }
});
test('speech bridge includes stop, unique IDs and completion guards', () => {
  assert.match(java, /activeUtteranceId/);
  assert.match(java, /\+ \(\+\+speechSequence\)/);
  assert.match(java, /utteranceId\.equals\(activeUtteranceId\)/);
  assert.match(java, /@JavascriptInterface public void stop\(\)/);
  assert.match(html, /function stopAudio\(\)/);
});
test('layout supports screen readers and reduced motion preferences', () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /prefers-reduced-motion:reduce/);
  assert.match(html, /focus-visible/);
});
