/* Names/emails never leave the form. Do not add input name attributes or store values. */
(function () {
  'use strict';
  const form=document.getElementById('lead-form'),modal=document.getElementById('privacy-modal');
  if(!modal)return;
  const {track,state}=window.AF;
  const agree=document.getElementById('privacy-agree'),ok=document.getElementById('privacy-ok'),cancel=document.getElementById('privacy-cancel');
  let mode='info',busy=false,started=false,opener=null;
  function close(method){if(busy)return;modal.classList.remove('open');modal.setAttribute('aria-hidden','true');track('privacy_notice_close',{modal_mode:mode,close_method:method});if(opener)opener.focus();}
  function open(next,source){opener=source||document.activeElement;mode=next;agree.checked=false;ok.disabled=true;ok.textContent=mode==='submit'?'동의하고 완료하기':'확인했습니다';modal.classList.add('open');modal.setAttribute('aria-hidden','false');track('privacy_notice_open',{modal_mode:mode,placement:source&&source.closest('footer')?'footer':'apply',form_id:'lead-form'});agree.focus();}
  agree.addEventListener('change',()=>{ok.disabled=!agree.checked;track('privacy_acknowledgement_change',{modal_mode:mode,checked:agree.checked});});
  cancel.addEventListener('click',()=>close('button'));
  modal.addEventListener('click',e=>{if(e.target===modal)close('backdrop');});
  document.addEventListener('keydown',function(e){if(!modal.classList.contains('open'))return;if(e.key==='Escape'){e.preventDefault();close('escape');}if(e.key==='Tab'){const list=[...modal.querySelectorAll('button:not(:disabled),input')];const first=list[0],last=list[list.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  ok.addEventListener('click',()=>{
    if(!agree.checked||busy)return;
    if(mode!=='submit'){track('privacy_notice_confirm',{modal_mode:'info'});close('confirm');return;}
    if(!form.checkValidity()){close('invalid');form.reportValidity();return;}
    busy=true;ok.disabled=true;cancel.disabled=true;
    form.querySelectorAll('input').forEach(el=>{el.value='';});form.reset();
    state.set('completion_pending','1');
    track('preregistration_complete',{form_id:'lead-form',submission_type:'demo',preferred_plan:state.get('preferred_plan')||'undecided',result_type:state.get('result_type')||'none',entry_cta_id:state.get('entry_cta_id')||'direct'},()=>location.replace('result.html'));
  });
  document.querySelectorAll('[data-privacy-open]').forEach(button=>button.addEventListener('click',e=>{e.preventDefault();open('info',button);}));
  if(form){
    form.addEventListener('input',e=>{if(!started&&e.target.matches('#f-name,#f-contact')&&e.target.value.length){started=true;track('preregistration_start',{form_id:'lead-form',entry_cta_id:state.get('entry_cta_id')||'direct'});}});
    form.addEventListener('submit',e=>{e.preventDefault();if(busy)return;track('preregistration_submit_attempt',{form_id:'lead-form',element_id:'cta-submit',placement:'apply'});if(!form.checkValidity()){form.querySelectorAll('input').forEach(el=>{if(!el.validity.valid)track('preregistration_validation_error',{form_id:'lead-form',field_id:el.id==='f-name'?'name':'email',error_type:el.validity.valueMissing?'required':'invalid_email'});});form.reportValidity();return;}open('submit',document.getElementById('cta-submit'));});
  }
})();
