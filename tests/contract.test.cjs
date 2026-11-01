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
  assert.match(gradle, /versionName '1\.15\.0-test'/);
  assert.match(gradle, /versionCode 21/);
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

test('typed answer feature remains in lesson mode only',()=>{
 for(const fn of ['numericChoiceAnswer','freeResponseMarkup','checkWorkingAnswer'])assert.ok(html.includes('function '+fn+'('));
 assert.match(html,/Solve it yourself/);
 assert.match(html,/if\(diagnosticMode\|\|locked\)return;/);
 assert.match(html,/pick\(l\.ok,target\)/);
 assert.match(html,/type="number"/);
});

test('developer branding is present on header and settings',()=>{
 const count=html.split('Ain’t Cloud Software').length-1;
 assert.ok(count>=2);
 assert.match(html,/Developed by/);
});
test('equation lab checks both operations without exposing answer in active prompt',()=>{
 for(const fn of ['newStepLabProblem','stepLabResult','startStepLab','renderStepLab','checkStepLab'])assert.ok(html.includes('function '+fn+'('));
 const src=html.match(/function stepLabResult\(problem,stage,answer\)\{[\s\S]*?\n\}/);
 assert.ok(src);
 const check=new Function(src[0]+';return stepLabResult')();
 const p={x:7,factor:3,offset:4,total:25};
 assert.equal(check(p,0,21),true);
 assert.equal(check(p,0,7),false);
 assert.equal(check(p,1,7),true);
 assert.equal(check(p,1,21),false);
 assert.equal(check(p,2,25),true);
 assert.equal(check(p,2,7),false);
 const negative={x:4,factor:3,offset:-5,total:7};
 assert.equal(check(negative,0,12),true);
 assert.equal(check(negative,1,4),true);
 assert.equal(check(negative,2,7),true);
});

test('equation lab tracks errors and requires verification',()=>{
 assert.match(html,/stepErrors:\[0,0,0\]/);
 assert.match(html,/function saveLabProgress\(/);
 assert.match(html,/stepLab\.stage===3/);
 assert.match(html,/mathStepLabHistory/);
 assert.match(html,/function stepLabExpression\(/);
});

test('equation dashboard computes mistake counts without requiring a network',()=>{
 for(const fn of ['labHistory','labInsights','showLabHistory'])assert.ok(html.includes('function '+fn+'('));
 const src=html.match(/function labInsights\(history=labHistory\(\)\)\{[\s\S]*?\n\}/);
 assert.ok(src);
 const analyze=new Function(src[0]+';return labInsights')();
 const stats=analyze([{stepErrors:[1,0,2]},{stepErrors:[2,1,0]}]);
 assert.deepEqual(stats.counts,[3,1,2]);
 assert.equal(stats.worst,0);
 assert.equal(stats.sessions,2);
 assert.equal(analyze([]).worst,-1);
});

test('targeted practice selects the worst recorded equation stage',()=>{
 assert.match(html,/function chooseTargetStep\(/);
 assert.match(html,/function startTargetedPractice\(/);
 assert.match(html,/Practice my weakest step/);
 assert.match(html,/stepLab\.targeted\?3:stepLab\.stage\+1/);
 const insight=html.match(/function labInsights\(history=labHistory\(\)\)\{[\s\S]*?\n\}/);
 const select=html.match(/function chooseTargetStep\(history=labHistory\(\)\)\{[\s\S]*?\n\}/);
 assert.ok(insight&&select);
 const selectFn=new Function('const labHistory=()=>[];'+insight[0]+select[0]+';return chooseTargetStep')();
 assert.equal(selectFn([{stepErrors:[0,3,1]}]),1);
 assert.equal(selectFn([{stepErrors:[1,0,4]}]),2);
 assert.equal(selectFn([]),0);
});

test('foundation practice supports four skills and chooses weakest',()=>{
 for(const fn of ['foundationProblem','readFoundationHistory','weakestFoundationSkill','startFoundationPractice','checkFoundationAnswer'])assert.ok(html.includes('function '+fn+'('));
 const skills=html.match(/const foundationSkills=\[[^\]]+\]/);
 assert.ok(skills);
 for(const name of ['arithmetic','fractions','decimals','percentages'])assert.ok(skills[0].includes(name));
 assert.match(html,/foundationSession\.completed=true/);
 assert.match(html,/Practice my weakest foundation skill/);
});

test('adaptive foundation levels adjust to recent accuracy',()=>{
 const match=html.match(/function foundationLevel\(skill,rows=readFoundationHistory\(\)\)\{[\s\S]*?\n\}/);
 assert.ok(match);
 const level=new Function('const readFoundationHistory=()=>[];'+match[0]+';return foundationLevel')();
 const rows=(correctCount)=>Array.from({length:10},(_,i)=>({skill:'arithmetic',correct:i<correctCount}));
 assert.equal(level('arithmetic',[]),1);
 assert.equal(level('arithmetic',rows(6)),1);
 assert.equal(level('arithmetic',rows(7)),2);
 assert.equal(level('arithmetic',rows(9)),3);
});
test('foundation generator covers all arithmetic modes and valid decimal fractions',()=>{
 assert.match(html,/mode===1/);
 assert.match(html,/mode===2/);
 assert.match(html,/mode===3/);
 assert.match(html,/Division undoes multiplication/);
 assert.match(html,/Add the numerators because the denominators match/);
 assert.match(html,/foundationProblem\(chosen,level\)/);
});
