(function () {
  const {state, track} = window.AF;
  if (state.get('completion_pending') === '1') {
    state.remove('completion_pending');
    track('preregistration_result_view', {submission_type:'demo',preferred_plan:state.get('preferred_plan')||'undecided',result_type:state.get('result_type')||'none',entry_cta_id:state.get('entry_cta_id')||'direct'});
  }
})();
