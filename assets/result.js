(function () {
  'use strict';
  const {state, track} = window.AF;
  const pending = state.get('completion_pending');
  // Old landing code already sends completion; only the new marker sends it here.
  if (pending !== 'result-v2' && pending !== '1') return;
  // Consume before tracking so reloads and repeated script execution cannot duplicate it.
  state.remove('completion_pending');
  const params = {
    submission_type: 'demo',
    preferred_plan: state.get('preferred_plan') || 'undecided',
    result_type: state.get('result_type') || 'none',
    entry_cta_id: state.get('entry_cta_id') || 'direct'
  };
  if (pending === 'result-v2') {
    if (window.sendLeadLog) window.sendLeadLog();
    track('preregistration_complete', {form_id: 'lead-form', ...params});
  }
  track('preregistration_result_view', params);
})();
