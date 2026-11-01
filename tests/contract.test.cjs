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

test('Settings reports installed Android version and build', () => {
  const gradle = fs.readFileSync('app/build.gradle','utf8');
  assert.match(gradle, /versionName '1\.8\.0-test'/);
  assert.match(gradle, /versionCode 14/);
  assert.match(java, /@JavascriptInterface public String getAppVersion\(\)/);
  assert.match(html, /function installedVersion\(\)/);
  assert.match(html, /App version/);
  assert.match(html, /installedVersion\(\)/);
});

test('offline spaced review is connected to learning attempts and UI', () => {
  for (const fn of ['reviewSchedule','readReviewState','recordReviewAttempt','dueReviewCourses','startDueReview']) {
    assert.ok(html.includes('function ' + fn + '('), fn);
  }
  assert.match(html, /if\(!diagnosticMode\)recordReviewAttempt/);
  assert.match(html, /Review skills due today/);
  assert.match(html, /mathReviewState/);
});
test('spaced review interval policy rewards unaided accuracy', () => {
  const match = html.match(/function reviewSchedule\(previous,correct,usedHint,now\)\{[\s\S]*?\n\}/);
  assert.ok(match, 'Review scheduling implementation exists');
  const reviewSchedule = new Function(match[0] + ';return reviewSchedule')();
  const now=1700000000000;
  const wrong=reviewSchedule(null,false,false,now);
  const first=reviewSchedule(null,true,false,now);
  const second=reviewSchedule(first,true,false,now);
  const hinted=reviewSchedule(second,true,true,now);
  assert.equal(wrong.dueAt,now);
  assert.equal(first.intervalDays,1);
  assert.equal(second.intervalDays,3);
  assert.equal(hinted.intervalDays,1);
  assert.equal(hinted.stage,0);
});

test('mastery requires independent success on separated days', () => {
  const match=html.match(/function reviewSchedule\(previous,correct,usedHint,now\)\{[\s\S]*?\n\}/);
  assert.ok(match);
  const schedule=new Function(match[0]+';return reviewSchedule')();
  const day=86400000,t=1700000000000;
  let state=schedule(null,true,false,t);
  state=schedule(state,true,false,t+day);
  state=schedule(state,true,false,t+day*2);
  assert.equal(state.mastered,true);
  const sameDay=schedule(schedule(schedule(null,true,false,t),true,false,t+1000),true,false,t+2000);
  assert.equal(sameDay.mastered,false);
  assert.equal(schedule(state,false,false,t+day*3).mastered,false);
  assert.equal(schedule(state,true,true,t+day*3).mastered,false);
});

test('visual tutor has guarded lesson-only walkthrough controls',()=>{
 for(const fn of ['visualDemoKind','visualDemoFrames','visualDemoArt','showVisualDemo'])assert.ok(html.includes('function '+fn+'('));
 assert.match(html,/if\(diagnosticMode\)return;/);
 assert.match(html,/Show interactive visual lesson/);
 assert.match(html,/visual-pieces/);
 assert.match(html,/visual-line/);
 assert.match(html,/hintUsed=true;/);
});
