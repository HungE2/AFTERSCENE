(function () {
  'use strict';
  const {track, state} = window.AF;
  const types = {
    afterglow: {name:'여운 수집가',line:'엔딩 크레딧 뒤에도, 당신의 영화는 계속됩니다.',description:'인물의 마음과 오래 남는 이야기에 끌리는 편이에요. 정답을 찾기보다 감정을 천천히 돌아보는 영화를 골라보세요.',movies:['close','strangers','paris']},
    visual: {name:'장면 탐험가',line:'대사보다 먼저, 한 장면이 마음에 들어옵니다.',description:'빛과 색, 음악이 만드는 분위기를 즐기는 편이에요. 화면의 결이 뚜렷한 영화 세 편을 준비했어요.',movies:['fallen','paris','bigfish']},
    story: {name:'이야기 추적자',line:'다음 장면이 궁금해서, 눈을 뗄 수 없어요.',description:'갈등의 흐름과 인물의 선택을 따라가는 편이에요. 긴장감 있는 이야기 속에서 다음 한 편을 만나보세요.',movies:['ballerina','joker','watchmen']},
    discovery: {name:'세계 발견자',line:'익숙한 일상 밖에서, 새로운 시선을 찾습니다.',description:'낯선 공간과 다른 삶의 방식에 호기심이 많은 편이에요. 당신의 시야를 넓힐 이야기를 추천해요.',movies:['meek','bigfish','strangers']}
  };
  const films = {
    close:['클로즈','close.jpg','말로 다 설명하지 못하는 우정의 감정을 따라가 보세요.','두 소년의 관계가 달라지는 순간들을 섬세하게 담은 작품입니다. 관계와 상실을 다뤄 감정적으로 무겁게 느껴질 수 있어요.'],
    strangers:['올 오브 어스 스트레인저스','all of strangers.jpg','그리움과 연결의 감각을 오래 돌아보게 해요.','외로운 인물이 과거와 현재의 관계를 마주하는 이야기입니다. 상실과 성인 관계를 다루는 작품이에요.'],
    paris:['파리, 텍사스','paris, texas.jpg','색과 풍경 사이에 남는 인물의 마음을 만나보세요.','긴 침묵과 넓은 풍경을 통해 가족과 단절, 다시 마주하는 시간을 그립니다. 느린 호흡을 즐기는 날에 어울려요.'],
    fallen:['타락천사','fallen angels.jpg','도시의 빛과 리듬으로 기억되는 한 편이에요.','홍콩의 밤을 배경으로 스쳐 가는 인물들을 독특한 화면과 리듬으로 담습니다. 폭력과 성인 소재가 포함되어 있어요.'],
    bigfish:['빅 피쉬','big fish.jpg','상상력 넘치는 장면과 따뜻한 이야기를 함께 즐겨요.','아버지가 들려준 환상적인 이야기와 아들의 시선이 만나는 작품입니다. 가족과 삶의 마지막을 돌아보는 이야기예요.'],
    ballerina:['발레리나','Ballerina.jpg','선명한 목표와 빠른 전개에 집중하고 싶은 날에 어울려요.','한 인물의 복수를 따라가는 액션 영화입니다. 강한 폭력과 성폭력 관련 소재가 포함되어 있어요.'],
    joker:['조커','Joker.jpg','인물의 변화가 만드는 긴장감을 따라가 보세요.','고립된 인물이 변해가는 과정을 그린 작품입니다. 폭력과 심리적으로 무거운 소재를 다뤄요.'],
    watchmen:['왓치맨','watch man.jpg','영웅의 선택을 다른 시선으로 바라보게 해요.','대체 역사를 배경으로 영웅과 권력의 관계를 묻는 작품입니다. 폭력과 성인 소재가 포함되어 있어요.'],
    meek:['미크스 컷오프',"meek's cutoff.jpg",'낯선 여정 속 판단과 시선을 천천히 살펴보세요.','서부 개척 시기의 여정 속에서 길과 신뢰를 둘러싼 선택을 그립니다. 느린 전개와 열린 해석을 즐기는 분에게 어울려요.']
  };
  const questions = [
    ['영화를 고를 때, 무엇에 먼저 끌리나요?',['인물의 마음과 관계','빛과 색, 음악과 분위기','다음 장면이 궁금한 이야기','내가 몰랐던 삶과 세계']],
    ['영화가 끝난 뒤, 가장 자주 하는 일은?',['인물의 감정을 돌아봐요','기억에 남는 장면을 찾아봐요','이야기의 단서를 다시 짚어요','배경과 새로운 관점을 찾아봐요']],
    ['오늘은 어떤 한 편이 필요한가요?',['마음에 오래 남을 영화','분위기에 푹 빠질 영화','몰입해서 따라갈 영화','시야를 넓혀줄 영화']],
    ['오래 기억하는 영화의 매력은?',['쉽게 설명되지 않는 감정','나만 간직하고 싶은 장면','인상적인 전개와 마무리','생각을 바꿔놓은 새로운 시선']]
  ];
  const typeIds = Object.keys(types);
  function resultFor(answers) {
    const counts = typeIds.map((_,i) => answers.filter(a => a === i).length);
    // A tie follows the first question's preference among tied types.
    const best = Math.max(...counts);
    const winner = answers.find(a => counts[a] === best);
    return typeIds[winner];
  }
  function movieCards(ids, placement) {
    return ids.map(id => { const f = films[id]; return `<article class="movie-card"><img src="assets/images/${encodeURIComponent(f[1])}" alt="${f[0]} 영화 이미지" loading="lazy"><div><h3>${f[0]}</h3><p>${f[2]}</p><button type="button" data-movie="${id}" data-placement="${placement}">영화 소개 보기 ↗</button></div></article>`; }).join('');
  }
  document.addEventListener('click', function (e) {
    const button = e.target.closest('[data-movie]'); if (!button) return;
    const film = films[button.dataset.movie];
    track('select_content',{content_type:'movie',content_id:button.dataset.movie,placement:button.dataset.placement});
    let dialog = document.querySelector('#movie-dialog');
    if (!dialog) { dialog = document.createElement('dialog'); dialog.id='movie-dialog'; dialog.className='movie-dialog'; dialog.setAttribute('aria-labelledby','movie-title'); document.body.appendChild(dialog); }
    dialog.innerHTML=`<span class="eyebrow-new">MOVIE NOTE</span><h2 id="movie-title">${film[0]}</h2><p>${film[3]}</p><p class="quiet">추천은 취향 선택에 따른 예시입니다. 시청 가능 OTT와 관람 등급은 이용 전 확인해주세요.</p><form method="dialog"><button class="secondary-action">닫기</button></form>`;
    dialog.showModal();
  });
  const moodResults = document.getElementById('mood-results');
  if (moodResults) {
    const moods = {comfort:['bigfish','close','paris'],thrill:['ballerina','joker','watchmen'],reflect:['strangers','meek','fallen']};
    document.querySelectorAll('[data-mood]').forEach(button => button.addEventListener('click', function () {
      if (button.getAttribute('aria-pressed') === 'true') return;
      const mood = button.dataset.mood;
      document.querySelectorAll('[data-mood]').forEach(b => b.setAttribute('aria-pressed',String(b===button)));
      moodResults.innerHTML=movieCards(moods[mood],'mood'); moodResults.hidden=false;
      track('mood_select',{mood_id:mood,placement:'lab'});
      track('recommendation_view',{mood_id:mood,recommendation_set_id:'mood_'+mood+'_v1'});
      document.getElementById('mood-status').textContent=button.textContent+'에 어울리는 추천 영화 3편입니다.';
    }));
  }
  const planNames={free:'FREE 탐색 · 무료',choice:'CHOICE 초이스 · 월 4,900원',plus:'PLUS 플러스 · 월 9,900원',undecided:'아직 결정하지 않았어요'};
  const planNote=document.getElementById('preferred-plan-note');
  if(planNote) { const plan=state.get('preferred_plan'); planNote.textContent='이용 희망 요금제: '+(planNames[plan]||planNames.undecided); }
  if(document.getElementById('plans')) {
    let selected=null;
    let confirmed=false;
    const previous=state.get('preferred_plan');
    const entry=new URL(location.href).searchParams.get('from');
    const entryPoint=['header','taste','apply','footer','result'].includes(entry)?entry:'direct';
    track('pricing_view',{entry_point:entryPoint,pricing_version:'v1'});
    const status=document.getElementById('plan-status');
    const submit=document.getElementById('plan-confirm');
    document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click',function(){
      const plan=button.dataset.plan;if(selected===plan)return;
      track('plan_select',{plan_id:plan,previous_plan_id:selected||previous||'none',monthly_price:{free:0,choice:4900,plus:9900}[plan],currency:'KRW'});
      selected=plan;confirmed=false;submit.disabled=false;
      document.querySelectorAll('[data-plan]').forEach(b=>{b.setAttribute('aria-pressed',String(b===button));b.closest('.plan-card').classList.toggle('selected',b===button);});
      status.textContent=planNames[plan]+' 선택 중';document.getElementById('plan-next').hidden=true;
    }));
    submit.addEventListener('click',function(){if(!selected||confirmed)return;confirmed=true;submit.disabled=true;state.set('preferred_plan',selected);track('plan_preference_submit',{plan_id:selected,pricing_version:'v1'});status.textContent=planNames[selected]+' 선택을 완료했어요. 결제는 진행되지 않습니다.';document.getElementById('plan-next').hidden=false;});
    document.getElementById('plan-skip').addEventListener('click',function(){state.set('preferred_plan','undecided');track('plan_preference_skip',{entry_point:entryPoint});location.href='./#apply';});
    document.getElementById('plan-comparison').addEventListener('toggle',function(){if(this.open)track('plan_comparison_expand',{placement:'pricing',pricing_version:'v1'});});
  }
  const quizRoot=document.getElementById('quiz-root');
  if(!quizRoot)return;
  let answers=[], step=0, finished=false, currentType=null;
  const entry=new URL(location.href).searchParams.get('from');
  const entryPoint=['lab','result','header','footer'].includes(entry)?entry:'direct';
  const intro=document.getElementById('quiz-intro'),panel=document.getElementById('quiz-panel'),result=document.getElementById('quiz-result');
  function focusHeading(){panel.querySelector('h2').focus();}
  function draw(){
    panel.innerHTML=`<span class="eyebrow-new">TASTE CHECK · ${step+1} / 4</span><div class="quiz-progress" role="progressbar" aria-label="질문 진행" aria-valuemin="1" aria-valuemax="4" aria-valuenow="${step+1}"><span style="width:${(step+1)*25}%"></span></div><h2 tabindex="-1">${questions[step][0]}</h2><div class="quiz-options" role="group" aria-label="답변 선택">${questions[step][1].map((label,i)=>`<button type="button" class="quiz-option" data-answer="${i}" aria-pressed="${answers[step]===i}"><span class="option-letter">0${i+1}</span>${label}</button>`).join('')}</div><div class="quiz-controls"><button type="button" class="secondary-action" id="quiz-prev" ${step===0?'disabled':''}>이전 질문</button><button type="button" class="primary-action" id="quiz-next" ${answers[step]===undefined?'disabled':''}>${step===3?'결과 보기':'다음 질문 →'}</button></div>`;
    panel.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{
      const answer=Number(button.dataset.answer);if(answers[step]!==answer)track('taste_quiz_answer',{quiz_id:'taste_v1',question_id:'q'+(step+1),option_id:typeIds[answer]});answers[step]=answer;
      panel.querySelectorAll('[data-answer]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));panel.querySelector('#quiz-next').disabled=false;
    }));
    panel.querySelector('#quiz-prev').addEventListener('click',()=>{if(step>0){step--;draw();focusHeading();}});
    panel.querySelector('#quiz-next').addEventListener('click',()=>{if(answers[step]===undefined||finished)return;if(step<3){step++;draw();focusHeading();}else{finished=true;const type=resultFor(answers);state.set('result_type',type);track('taste_quiz_complete',{quiz_id:'taste_v1',result_type:type});showResult(type,false);}});
  }
  function start(restart){answers=[];step=0;finished=false;intro.hidden=true;result.hidden=true;panel.hidden=false;if(restart)track('taste_quiz_restart',{quiz_id:'taste_v1',previous_result_type:currentType});track('taste_quiz_start',{quiz_id:'taste_v1',entry_point:entryPoint});draw();focusHeading();}
  document.getElementById('quiz-start').addEventListener('click',()=>start(false));
  function showResult(type,shared){
    currentType=type;const t=types[type];intro.hidden=true;panel.hidden=true;result.hidden=false;
    result.innerHTML=`${shared?'<p class="shared-notice">친구가 공유한 취향 결과예요. 나의 취향도 알아볼까요?</p>':''}<div class="result-banner"><span class="eyebrow-new">AFTERSCENE · YOUR TASTE</span><h2 tabindex="-1">${t.name}</h2><p><b>${t.line}</b></p><p>${t.description}</p><span class="quiet">4개 질문의 선택에 따른 간단한 취향 분류입니다.</span></div><h3>당신의 다음 한 편</h3><div class="movie-grid">${movieCards(t.movies,'taste_result')}</div><div class="action-row"><button class="secondary-action" id="card-save">카드 이미지 저장</button><button class="secondary-action" id="link-copy">결과 링크 복사</button><button class="secondary-action" id="result-share">공유하기</button></div><p id="share-status" class="status-text" role="status"></p><div class="action-row"><a class="primary-action" href="pricing.html?from=taste">나에게 맞는 요금제 보기 →</a><a class="secondary-action" href="./#apply" data-taste-apply>사전 가입하기</a><button class="secondary-action" id="quiz-restart">${shared?'내 취향 알아보기':'다시 하기'}</button></div><p class="quiet">이름·이메일은 결과 카드나 공유 주소에 포함되지 않습니다.</p>`;
    result.querySelector('h2').focus();
    result.querySelector('#quiz-restart').addEventListener('click',()=>{history.replaceState(null,'',location.pathname);start(!shared);});
    result.querySelector('[data-taste-apply]').addEventListener('click',()=>{state.set('entry_cta_id','taste_signup');track('preregistration_cta_click',{placement:'taste_result',element_id:'taste_signup',destination:'apply'});});
    const shareUrl=new URL('https://hunge2.github.io/AFTERSCENE/taste.html');shareUrl.search=new URLSearchParams({result:type,utm_source:'afterscene',utm_medium:'referral',utm_campaign:'taste_share',utm_content:type}).toString();
    const status=result.querySelector('#share-status');
    result.querySelector('#link-copy').addEventListener('click',async()=>{track('share_click',{result_type:type,method:'copy_link'});try{await navigator.clipboard.writeText(shareUrl.href);track('share',{result_type:type,method:'copy_link',content_type:'taste_result'});status.textContent='결과 링크를 복사했어요.';}catch(_){status.textContent='자동 복사를 사용할 수 없어요. 아래 주소를 선택해 복사해주세요.';let input=document.getElementById('share-url');if(!input){input=document.createElement('input');input.id='share-url';input.readOnly=true;input.setAttribute('aria-label','공유할 결과 주소');input.style.width='100%';status.after(input);}input.value=shareUrl.href;input.select();}});
    result.querySelector('#result-share').addEventListener('click',async()=>{track('share_click',{result_type:type,method:'native'});if(!navigator.share){status.textContent='이 브라우저에서는 결과 링크 복사를 이용해주세요.';return;}try{await navigator.share({title:'AFTERSCENE · '+t.name,text:t.line,url:shareUrl.href});track('share',{result_type:type,method:'native',content_type:'taste_result'});status.textContent='공유 창을 닫았어요. 실제 전달 여부는 공유한 앱에서 확인해주세요.';}catch(error){status.textContent=error.name==='AbortError'?'공유를 취소했어요.':'공유하지 못했어요. 결과 링크 복사를 이용해주세요.';}});
    result.querySelector('#card-save').addEventListener('click',async function(){
      const button=this;button.disabled=true;
      try{if(document.fonts)await document.fonts.ready;const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('canvas');
        const gradient=ctx.createLinearGradient(0,0,1080,1350);gradient.addColorStop(0,'#142078');gradient.addColorStop(1,'#090a11');ctx.fillStyle=gradient;ctx.fillRect(0,0,1080,1350);ctx.fillStyle='#ffffff';ctx.font='700 34px "Pretendard Variable", sans-serif';ctx.fillText('AFTERSCENE',80,110);ctx.fillStyle='#b8c0ff';ctx.font='24px "Pretendard Variable", sans-serif';ctx.fillText('YOUR FILM TASTE',80,290);ctx.fillStyle='#ffffff';ctx.font='700 100px "Pretendard Variable", sans-serif';ctx.fillText(t.name,75,435);
        function wrap(text,y,maxWidth,lineHeight){let line='';for(const char of text){if(ctx.measureText(line+char).width>maxWidth){ctx.fillText(line,80,y);y+=lineHeight;line=char;}else line+=char;}if(line)ctx.fillText(line,80,y);return y+lineHeight;}
        ctx.font='500 36px "Pretendard Variable", sans-serif';let y=wrap(t.line,540,900,55);ctx.fillStyle='#d3d6e5';ctx.font='30px "Pretendard Variable", sans-serif';wrap(t.description,y+60,900,49);ctx.fillStyle='#aab3f4';ctx.font='24px "Pretendard Variable", sans-serif';ctx.fillText('영화를 보는 것에서, 내 취향을 쌓는 것으로.',80,1170);ctx.fillText('hunge2.github.io/AFTERSCENE/',80,1240);
        const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('blob');const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='AFTERSCENE-'+type+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);track('result_card_download',{result_type:type,content_type:'taste_result'});status.textContent='카드 이미지 저장을 시작했어요.';
      }catch(_){status.textContent='이미지를 저장하지 못했어요. 결과 링크 복사를 이용해주세요.';}finally{button.disabled=false;}
    });
  }
  const sharedType=new URL(location.href).searchParams.get('result');
  if(Object.hasOwn(types,sharedType))showResult(sharedType,true);
})();
