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
  assert.match(gradle, /versionName '2\.0\.0'/);
  assert.match(gradle, /versionCode 30/);
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

test('adaptive levels use performance at current difficulty',()=>{
 const match=html.match(/function foundationLevel[^]*?\n\}/);
 assert.ok(match);
 const level=new Function('const readFoundationHistory=()=>[];'+match[0]+';return foundationLevel')();
 const make=(n,lev)=>Array.from({length:8},(_,i)=>({skill:'arithmetic',correct:i<n,level:lev}));
 assert.equal(level('arithmetic',[]),1);
 assert.equal(level('arithmetic',make(7,1)),2);
 assert.equal(level('arithmetic',make(7,2)),3);
 assert.equal(level('arithmetic',make(3,3)),2);
});
test('foundation generator covers all arithmetic modes and valid decimal fractions',()=>{
 assert.match(html,/mode===1/);
 assert.match(html,/mode===2/);
 assert.match(html,/mode===3/);
 assert.match(html,/Division undoes multiplication/);
 assert.match(html,/Add the numerators because the denominators match/);
 assert.match(html,/foundationProblem\(chosen,level\)/);
});

test('foundation dashboard has per-skill progress and practice controls',()=>{
 assert.match(html,/function foundationStats\(/);
 assert.match(html,/function showFoundationDashboard\(/);
 assert.match(html,/Foundation progress dashboard/);
 assert.match(html,/recent accuracy/);
});

test('attempts are recorded once per foundation question',()=>{
 assert.ok(html.includes('if(!foundationSession.recorded)'));
 assert.ok(html.includes('foundationSession.recorded=true'));
});

test('foundation generator stays mathematically consistent on fixed random samples',()=>{
 const match=html.match(/function foundationProblem[^]*?\n\}/);
 assert.ok(match);
 const generate=new Function(match[0]+';return foundationProblem')();
 for(const level of [1,2,3]) for(const skill of ['arithmetic','fractions','decimals','percentages']){
   for(let i=0;i<30;i++){
     const q=generate(skill,level);
     assert.ok(Number.isFinite(q.answer),q.prompt);
     assert.equal(q.skill,skill);
     if(skill==='percentages'){
       const nums=q.prompt.match(/[0-9]+/g).map(Number);
       assert.equal(q.answer,nums[0]*nums[1]/100);
     }
   }
 }
});
test('malformed foundation history is ignored rather than crashing',()=>{
 assert.match(html,/function readFoundationHistory\(\)/);
 assert.match(html,/foundationSkills\.includes\(r\.skill\)/);
 assert.match(html,/Storage is unavailable/);
});

test('fraction and decimal answers match independently parsed expressions',()=>{
 const match=html.match(/function foundationProblem[^]*?\n\}/);
 assert.ok(match);
 const generate=new Function(match[0]+';return foundationProblem')();
 for(let level=1;level<=3;level++){
  for(let n=0;n<100;n++){
   const fraction=generate('fractions',level);
   const parts=fraction.prompt.match(/[0-9]+/g).map(Number);
   const expected=level===1?parts[0]/parts[1]:parts[0]/parts[1]+parts[2]/parts[3];
   assert.ok(Math.abs(fraction.answer-expected)<1e-10,fraction.prompt);
   const decimal=generate('decimals',level);
   const values=decimal.prompt.match(/[0-9]+[.][0-9]+/g).map(Number);
   const calc=decimal.prompt.includes('Subtract')?values[0]-values[1]:values[0]+values[1];
   assert.ok(Math.abs(decimal.answer-calc)<1e-9,decimal.prompt);
  }
 }
});
test('local practice data is safely readable after repeated app initialization',()=>{
 const match=html.match(/function readFoundationHistory\(\)\{[^\n]+\}/);
 assert.ok(match);
 const makeRead=new Function('const foundationSkills=["arithmetic","fractions","decimals","percentages"];return '+match[0])();
 const previous=global.localStorage;
 try{
  global.localStorage={foundationAttempts:JSON.stringify([{skill:'decimals',correct:true,level:2}])};
  assert.equal(makeRead().length,1);
  assert.equal(makeRead().length,1);
  global.localStorage.foundationAttempts='{bad';
  assert.deepEqual(makeRead(),[]);
 }finally{global.localStorage=previous}
});

test('unified dashboard connects learning systems',()=>{
 assert.ok(html.includes('function combinedLearningStats('));
 assert.ok(html.includes('function showLearningDashboard('));
 assert.ok(html.includes('My complete learning dashboard'));
 assert.ok(html.includes('foundation attempts'));
 assert.ok(html.includes('verified skills'));
 assert.ok(html.includes('equation sessions'));
});

test('daily learning plan prioritizes due reviews and weaker skills',()=>{
 const src=html.match(/function dailyLearningRecommendation[^]*?\n\}/);
 assert.ok(src);
 const choose=new Function('const combinedLearningStats=()=>({});const dueReviewCourses=()=>[];'+src[0]+';return dailyLearningRecommendation')();
 const base={foundation:[{skill:'arithmetic',attempts:10,accuracy:55},{skill:'fractions',attempts:5,accuracy:90}],lab:{sessions:0,total:0,worst:-1}};
 assert.equal(choose(base,2).kind,'review');
 assert.equal(choose(base,0).skill,'arithmetic');
 assert.equal(choose({foundation:[{skill:'arithmetic',attempts:10,accuracy:95},{skill:'fractions',attempts:0,accuracy:0}],lab:{sessions:0,total:0,worst:-1}},0).skill,'fractions');
 assert.match(html,/Start today’s learning session/);
 assert.match(html,/function startDailyLearning\(/);
});

test('offline Android app uses restricted WebView settings',()=>{
 const manifest=fs.readFileSync('app/src/main/AndroidManifest.xml','utf8');
 assert.doesNotMatch(manifest,/android.permission.INTERNET/);
 assert.match(manifest,/android:allowBackup="false"/);
 assert.match(manifest,/android:label="Mike's Math Coach"/);
 assert.match(java,/setAllowUniversalAccessFromFileURLs\(false\)/);
 assert.match(java,/setAllowFileAccessFromFileURLs\(false\)/);
 assert.match(java,/setAllowContentAccess\(false\)/);
 assert.match(java,/!"https".equals\(uri.getScheme\(\)\)/);
});

test('signed release requires externally supplied keystore and credentials',()=>{
 const gradle=fs.readFileSync('app/build.gradle','utf8');
 const workflow=fs.readFileSync('.github/workflows/android-release.yml','utf8');
 assert.match(gradle,/MATH_UPLOAD_KEYSTORE/);
 assert.match(gradle,/MATH_UPLOAD_STORE_PASSWORD/);
 assert.match(gradle,/MATH_UPLOAD_KEY_ALIAS/);
 assert.match(workflow,/bundleRelease/);
 assert.match(workflow,/environment: production/);
 assert.match(workflow,/secrets.UPLOAD_KEYSTORE_B64/);
 assert.doesNotMatch(workflow,/mikes-math-test.keystore.b64/);
});

test('v2 release targets the current Google Play API level',()=>{
 const gradle=fs.readFileSync('app/build.gradle','utf8');
 assert.match(gradle,/compileSdk 36/);
 assert.match(gradle,/targetSdk 36/);
 const debugWorkflow=fs.readFileSync('.github/workflows/android-build.yml','utf8');
 const releaseWorkflow=fs.readFileSync('.github/workflows/android-release.yml','utf8');
 assert.match(debugWorkflow,/android-36/);
 assert.match(releaseWorkflow,/android-36/);
 assert.match(releaseWorkflow,/bundleRelease/);
});

test('v2 build tools support API 36',()=>{
 const build=fs.readFileSync('build.gradle','utf8');
 const gradle=fs.readFileSync('app/build.gradle','utf8');
 for(const path of ['.github/workflows/android-build.yml','.github/workflows/android-release.yml']){
  const workflow=fs.readFileSync(path,'utf8');
  assert.match(workflow,/gradle-version: '8\.11\.1'/);
 }
 assert.match(build,/version '8\.9\.2'/);
 assert.match(gradle,/versionName '2\.0\.0'/);
 assert.match(gradle,/targetSdk 36/);
});
test('privacy policy accompanies offline production configuration',()=>{
 const policy=fs.readFileSync('PRIVACY_POLICY.md','utf8');
 assert.match(policy,/offline mathematics tutoring/);
 assert.match(policy,/stored locally/);
});
