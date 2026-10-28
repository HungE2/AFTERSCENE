(function () {
  'use strict';
  const id = 'G-77DJK8C5S3';
  const production = location.hostname === 'hunge2.github.io';
  const page = location.pathname.split('/').pop() || 'index.html';
  const pageType = ({'index.html':'landing','taste.html':'taste','pricing.html':'pricing','result.html':'result'})[page] || 'other';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  // Only known campaign/result codes enter Analytics; arbitrary URL input is excluded.
  const incoming = new URL(location.href);
  const clean = new URL(location.origin + location.pathname);
  ['utm_source','utm_medium','utm_campaign','utm_content'].forEach(function (key) {
    const value = incoming.searchParams.get(key);
    if (value && /^[a-z0-9_-]{1,80}$/.test(value)) clean.searchParams.set(key, value);
  });
  window.gtag('js', new Date());
  window.gtag('config', id, {
    send_page_view: false, allow_google_signals: false,
    allow_ad_personalization_signals: false, page_location: clean.href,
    page_referrer: document.referrer ? document.referrer.split('?')[0].split('#')[0] : ''
  });
  const memory = {};
  const keys = ['preferred_plan','result_type','entry_cta_id','completion_pending','campaign_touch','campaign_seen'];
  const state = {
    get(key) { if (!keys.includes(key)) return null; try { return sessionStorage.getItem('afterscene_' + key) || memory[key] || null; } catch (_) { return memory[key] || null; } },
    set(key, value) { if (!keys.includes(key)) return; memory[key] = String(value); try { sessionStorage.setItem('afterscene_' + key, String(value)); } catch (_) {} },
    remove(key) { delete memory[key]; try { sessionStorage.removeItem('afterscene_' + key); } catch (_) {} }
  };
  // Explicit allowlist: never collect input values, DOM text, email, name, or hashes.
  const allowed = new Set(['placement','element_id','destination','intent','platform','section_id','entry_cta_id','form_id','field_id','error_type','modal_mode','close_method','checked','submission_type','preferred_plan','quiz_id','question_id','option_id','result_type','previous_result_type','content_type','method','entry_point','pricing_version','plan_id','previous_plan_id','monthly_price','currency','mood_id','recommendation_set_id','content_id','faq_id','direction']);
  // These tuples match campaigns/links.json. Existing printed QR codes stay valid.
  const campaigns = [
    ['instagram_bio','instagram','social','bio'],
    ['instagram_story','instagram','social','story_01'],
    ['instagram_feed_qr','instagram','qr','feed_qr_01'],
    ['facebook','facebook','social','post_01'],
    ['x','x','social','post_01'],
    ['threads','threads','social','post_01'],
    ['youtube','youtube','social','description_01'],
    ['naver_blog','naver_blog','social','post_01'],
    ['offline_poster','poster','qr','poster_01']
  ];
  const windowMs = 30 * 60 * 1000;
  function readRecord(key) { try { const value=JSON.parse(state.get(key)||'null'); return value && typeof value==='object' && !Array.isArray(value) ? value : {}; } catch (_) { return {}; } }
  const matchingCampaign = incoming.searchParams.get('utm_campaign') === 'taste_launch'
    ? campaigns.find(c => incoming.searchParams.get('utm_source')===c[1] && incoming.searchParams.get('utm_medium')===c[2] && incoming.searchParams.get('utm_content')===c[3]) : null;
  const hasCampaign = ['utm_source','utm_medium','utm_campaign','utm_content'].some(k=>incoming.searchParams.has(k));
  const landingCampaign = pageType==='landing' ? matchingCampaign : null;
  if (landingCampaign) state.set('campaign_touch',JSON.stringify({id:landingCampaign[0],at:Date.now()}));
  else if (hasCampaign) state.remove('campaign_touch');
  function campaignContext() {
    const touch=readRecord('campaign_touch');
    const campaign=campaigns.find(c=>c[0]===touch.id);
    if (!campaign || !Number.isFinite(touch.at) || Date.now()-touch.at<0 || Date.now()-touch.at>=windowMs) { state.remove('campaign_touch'); return {}; }
    state.set('campaign_touch',JSON.stringify({id:campaign[0],at:Date.now()}));
    return {promo_id:campaign[0],promo_source:campaign[1],promo_medium:campaign[2],promo_campaign:'taste_launch',promo_content:campaign[3]};
  }
  allowed.add('result_origin');
  function track(name, params, done) {
    const payload = { page_type: pageType, measurement_version: 'v2', ...campaignContext() };
    Object.entries(params || {}).forEach(([key,value]) => { if (allowed.has(key) && ['string','number','boolean'].includes(typeof value)) payload[key] = value; });
    let finished = false;
    function finish() { if (finished) return; finished = true; if (done) done(); }
    if (done) { payload.event_callback = finish; payload.event_timeout = 700; setTimeout(finish, 800); }
    if (production) window.gtag('event', name, { ...payload, send_to: id });
    else { window.dataLayer.push({ event: name, ...payload }); if (done) setTimeout(finish, 0); }
  }
  window.AF = { track, state, pageType };
  // Local previews/tests never request Google or send production telemetry.
  if (production) {
    const tag = document.createElement('script'); tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(tag);
    window.gtag('event', 'page_view', { send_to: id, page_location: clean.href, page_title: document.title, page_type: pageType });
  }
  if (landingCampaign) {
    const seen=readRecord('campaign_seen');
    const now=Date.now();
    const last=seen[landingCampaign[0]];
    if (!Number.isFinite(last) || now-last<0 || now-last>=windowMs) track('campaign_visit');
    const recent={};
    campaigns.forEach(c=>{if(Number.isFinite(seen[c[0]]) && now-seen[c[0]]>=0 && now-seen[c[0]]<windowMs)recent[c[0]]=seen[c[0]];});
    // Sliding refresh suppression in this tab; not a claim about GA4 session IDs.
    recent[landingCampaign[0]]=now;state.set('campaign_seen',JSON.stringify(recent));
  }
  document.addEventListener('DOMContentLoaded', function () {
    // Delegation also covers quiz-result controls inserted after page load.
    document.addEventListener('click', function (event) {
        const el=event.target.closest('[data-track]');if(!el)return;
        const params = {placement: el.dataset.placement || pageType, element_id: el.dataset.elementId || el.id || 'unknown'};
        ['destination','intent','platform','entryPoint','resultType'].forEach(key => { if (el.dataset[key]) params[key.replace(/[A-Z]/g, c => '_' + c.toLowerCase())] = el.dataset[key]; });
        if (el.dataset.track === 'preregistration_cta_click') state.set('entry_cta_id', params.element_id);
        if (el.dataset.track === 'preregistration_cta_click') params.preferred_plan=state.get('preferred_plan')||'undecided';
        track(el.dataset.track, params);
    });
    document.querySelectorAll('details[data-faq]').forEach(el => el.addEventListener('toggle', () => { if (el.open) track('faq_open', {faq_id:el.dataset.faq, placement:'faq'}); }));
    if ('IntersectionObserver' in window) {
      const timers = new Map();
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= .5) {
          if (!timers.has(entry.target)) timers.set(entry.target, setTimeout(() => {
            if (!document.hidden) { track('section_view', {section_id:entry.target.dataset.section}); observer.unobserve(entry.target); }
            timers.delete(entry.target);
          },1000));
        } else { clearTimeout(timers.get(entry.target)); timers.delete(entry.target); }
      }), {threshold:.5});
      document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));
    }
  });
})();
