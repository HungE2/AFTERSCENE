const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {parseHTML}=require('linkedom');
const root=path.resolve(__dirname,'..');
function app(file,{production=false,query='',blockedStorage=false,store=new Map(),navigator={}}={}){
  const {document,window:dom}=parseHTML(fs.readFileSync(path.join(root,file),'utf8'));
  const address=new URL('https://'+(production?'hunge2.github.io/AFTERSCENE/':'localhost/')+file+query);
  const location=new Proxy(address,{get:(target,key)=>Reflect.get(target,key,target),set:(target,key,value)=>{if(key==='href')target.href=new URL(value,target).href;else target[key]=value;return true;}});
  location.replace=(url)=>{location.href=new URL(url,address.href).href;};
  const storage={getItem:key=>{if(blockedStorage)throw Error('blocked');return store.get(key)||null;},setItem:(key,value)=>{if(blockedStorage)throw Error('blocked');store.set(key,value);},removeItem:key=>store.delete(key)};
  const callbacks=[];
  const sandbox={document,window:null,location,navigator,sessionStorage:storage,URL,URLSearchParams,console,history:{replaceState(){}},setTimeout:(fn)=>{callbacks.push(fn);return callbacks.length;},clearTimeout(){}};
  sandbox.window=sandbox;const context=vm.createContext(sandbox);
  function load(script){vm.runInContext(fs.readFileSync(path.join(root,'assets',script),'utf8'),context,{filename:script});}
  load('analytics.js');
  const events=()=>sandbox.dataLayer.map(e=>e.event?e:(e[0]==='event'?{event:e[1],...e[2]}:null)).filter(Boolean);
  function click(selector){const el=document.querySelector(selector);assert.ok(el,selector);el.dispatchEvent(new dom.Event('click',{bubbles:true}));}
  function input(selector,value){const el=document.querySelector(selector);el.value=value;el.dispatchEvent(new dom.Event('input',{bubbles:true}));}
  return {document,location,store,load,click,input,events,AF:sandbox.AF,callbacks,sandbox,dom};
}
test('all 256 answer combinations resolve deterministically; previous answers persist; one completion per run',()=>{
  for(let code=0;code<256;code++){
    const a=app('taste.html');a.load('experience.js');a.click('#quiz-start');
    const answers=Array.from({length:4},(_,i)=>(code>>(i*2))&3);
    answers.forEach((answer,i)=>{a.click(`[data-answer="${answer}"]`);if(i===1){a.click('#quiz-prev');assert.equal(a.document.querySelector(`[data-answer="${answers[0]}"]`).getAttribute('aria-pressed'),'true');a.click('#quiz-next');}a.click('#quiz-next');});
    const ids=['afterglow','visual','story','discovery'];const counts=ids.map((_,i)=>answers.filter(x=>x===i).length);const expected=ids[answers.find(x=>counts[x]===Math.max(...counts))];
    assert.equal(a.AF.state.get('result_type'),expected);assert.equal(a.events().filter(e=>e.event==='taste_quiz_complete').length,1);
    a.click('#quiz-restart');assert.equal(a.document.querySelector('#quiz-next').disabled,true);
  }
});
test('shared and unknown results never fabricate a quiz completion or replace the visitor own type',()=>{
  for(const result of ['afterglow','visual','story','discovery','unknown','<script>']){
    const a=app('taste.html',{query:'?result='+encodeURIComponent(result)});a.AF.state.set('result_type','story');a.load('experience.js');
    assert.equal(a.events().filter(e=>e.event==='taste_quiz_complete').length,0);assert.equal(a.AF.state.get('result_type'),'story');
  }
});
test('plan click is separate from confirmation; changing and skipping work',()=>{
  const a=app('pricing.html');a.load('experience.js');a.click('[data-plan="choice"]');assert.equal(a.AF.state.get('preferred_plan'),null);
  a.click('#plan-confirm');a.click('#plan-confirm');assert.equal(a.AF.state.get('preferred_plan'),'choice');assert.equal(a.events().filter(e=>e.event==='plan_preference_submit').length,1);
  a.click('[data-plan="plus"]');a.click('#plan-confirm');assert.equal(a.AF.state.get('preferred_plan'),'plus');a.click('#plan-skip');assert.equal(a.AF.state.get('preferred_plan'),'undecided');
});
test('blocked browser storage still permits quiz and plan interactions',()=>{
  const a=app('pricing.html',{blockedStorage:true});a.load('experience.js');a.click('[data-plan="free"]');a.click('#plan-confirm');assert.equal(a.AF.state.get('preferred_plan'),'free');
});
test('form validation, notice-only acknowledgement, wipe and duplicate completion protection',()=>{
  const a=app('index.html');let valid=false;const form=a.document.querySelector('#lead-form');form.checkValidity=()=>valid;form.reportValidity=()=>{};
  form.querySelectorAll('input').forEach(el=>Object.defineProperty(el,'validity',{get:()=>({valid,valueMissing:!valid})}));
  form.reset=()=>form.querySelectorAll('input').forEach(el=>el.value='');a.load('privacy.js');
  const submit=()=>form.dispatchEvent(new a.dom.Event('submit',{bubbles:true,cancelable:true}));
  submit();assert.equal(a.events().filter(e=>e.event==='preregistration_complete').length,0);
  a.click('[data-privacy-open]');a.document.querySelector('#privacy-agree').checked=true;a.click('#privacy-ok');assert.equal(a.events().filter(e=>e.event==='preregistration_complete').length,0);
  valid=true;a.input('#f-name','PRIVATE_NAME');a.input('#f-contact','private@example.com');a.AF.state.set('preferred_plan','plus');submit();a.click('#privacy-ok');assert.equal(a.events().filter(e=>e.event==='preregistration_complete').length,0);
  a.document.querySelector('#privacy-agree').checked=true;a.click('#privacy-ok');a.click('#privacy-ok');
  assert.equal(a.events().filter(e=>e.event==='preregistration_complete').length,1);assert.equal(form.querySelector('#f-contact').value,'');
  assert.doesNotMatch(JSON.stringify(a.events()),/PRIVATE_NAME|private@example/);assert.doesNotMatch(JSON.stringify([...a.store]),/PRIVATE_NAME|private@example/);
  a.callbacks.forEach(fn=>fn());assert.equal(a.location.pathname,'/result.html');
  const b=app('result.html',{store:a.store});b.load('result.js');assert.equal(b.events().filter(e=>e.event==='preregistration_result_view').length,1);
  const c=app('result.html',{store:a.store});c.load('result.js');assert.equal(c.events().length,0);
});
test('production tag uses supplied ID; explicit allowlist drops PII; previews load no Google tag',()=>{
  const a=app('index.html',{production:true,query:'?email=private@example.com&utm_source=instagram&utm_medium=social&utm_campaign=taste_launch#apply'});
  assert.match(a.document.querySelector('script[src*="googletagmanager"]').src,/G-77DJK8C5S3/);
  a.AF.track('example',{email:'private@example.com',name:'PRIVATE_NAME',plan_id:'choice'});
  const event=a.events().find(e=>e.event==='example');assert.equal(event.plan_id,'choice');assert.equal(event.email,undefined);
  const view=a.events().find(e=>e.event==='page_view');assert.doesNotMatch(view.page_location,/email|private|#apply/);assert.match(view.page_location,/utm_source=instagram/);
  const b=app('index.html');assert.equal(b.document.querySelector('script[src*="googletagmanager"]'),null);
});
test('mood selection creates three movies and suppresses repeated identical selections',()=>{
  const a=app('index.html');a.load('experience.js');a.click('[data-mood="reflect"]');a.click('[data-mood="reflect"]');assert.equal(a.document.querySelectorAll('#mood-results .movie-card').length,3);assert.equal(a.events().filter(e=>e.event==='mood_select').length,1);
});
test('sharing cancellation/failure does not emit successful share; copying succeeds only after clipboard resolves',async()=>{
  for(const failure of [true,false]){
    const a=app('taste.html',{query:'?result=visual',navigator:{share:async()=>{if(failure)throw Object.assign(new Error('cancel'),{name:'AbortError'});},clipboard:{writeText:async()=>{}}}});a.load('experience.js');
    a.click('#result-share');await new Promise(setImmediate);
    assert.equal(a.events().filter(e=>e.event==='share').length,failure?0:1);
    a.click('#link-copy');await new Promise(setImmediate);
    assert.equal(a.events().filter(e=>e.event==='share'&&e.method==='copy_link').length,1);
  }
});
test('new pages and movie images link to existing local files',()=>{
  for(const file of ['index.html','taste.html','pricing.html','result.html']){
    const a=app(file);if(file==='taste.html')a.load('experience.js');
    a.document.querySelectorAll('[src],link[href],a[href]').forEach(el=>{
      const url=el.getAttribute('src')||el.getAttribute('href');if(!url||url.startsWith('#')||/^https?:/.test(url))return;
      const target=decodeURIComponent(url.split(/[?#]/)[0]);if(target)assert.ok(fs.existsSync(path.join(root,target)),file+' → '+target);
    });
  }
});
