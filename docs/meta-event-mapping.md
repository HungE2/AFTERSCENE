# GA4 → Meta Pixel 이벤트 연결

공통 전송 지점: assets/analytics.js의 production GA4 호출 바로 다음에 trackMeta를 호출합니다. 기존 GA4 payload·콜백·GTM·HTML·디자인은 보존합니다. Meta에는 이벤트 이름만 보내며 Purchase에만 전달된 value와 currency=KRW를 보냅니다.

## 현재 사용 이벤트

| 파일 / 공통 전송 위치 | GA4 이벤트 | 메타 이벤트 |
|---|---|---|
| assets/analytics.js → assets/analytics.js | campaign_visit | trackCustom · campaign_visit |
| assets/analytics.js → assets/analytics.js | faq_open | trackCustom · faq_open |
| assets/analytics.js → assets/analytics.js | section_view | 전송 제외 (스크롤 노출) |
| assets/experience.js → assets/analytics.js | mood_select | trackCustom · mood_select |
| assets/experience.js → assets/analytics.js | movie_detail_close | trackCustom · movie_detail_close |
| assets/experience.js → assets/analytics.js | plan_comparison_expand | trackCustom · plan_comparison_expand |
| assets/experience.js → assets/analytics.js | plan_preference_skip | trackCustom · plan_preference_skip |
| assets/experience.js → assets/analytics.js | plan_preference_submit | trackCustom · plan_preference_submit |
| assets/experience.js → assets/analytics.js | plan_select | trackCustom · plan_select |
| assets/experience.js → assets/analytics.js | preregistration_cta_click | trackCustom · preregistration_cta_click |
| assets/experience.js → assets/analytics.js | pricing_view | trackCustom · pricing_view |
| assets/experience.js → assets/analytics.js | recommendation_view | trackCustom · recommendation_view |
| assets/experience.js → assets/analytics.js | result_card_download | trackCustom · result_card_download |
| assets/experience.js → assets/analytics.js | select_content | trackCustom · select_content |
| assets/experience.js → assets/analytics.js | share | trackCustom · share |
| assets/experience.js → assets/analytics.js | share_click | trackCustom · share_click |
| assets/experience.js → assets/analytics.js | taste_quiz_answer | trackCustom · taste_quiz_answer |
| assets/experience.js → assets/analytics.js | taste_quiz_complete | trackCustom · taste_quiz_complete |
| assets/experience.js → assets/analytics.js | taste_quiz_restart | trackCustom · taste_quiz_restart |
| assets/experience.js → assets/analytics.js | taste_quiz_start | trackCustom · taste_quiz_start |
| assets/experience.js → assets/analytics.js | taste_quiz_step_click | trackCustom · taste_quiz_step_click |
| assets/experience.js → assets/analytics.js | taste_result_view | trackCustom · taste_result_view |
| assets/privacy.js → assets/analytics.js | preregistration_complete | trackCustom · preregistration_complete |
| assets/privacy.js → assets/analytics.js | preregistration_start | trackCustom · preregistration_start |
| assets/privacy.js → assets/analytics.js | preregistration_submit_attempt | trackCustom · preregistration_submit_attempt |
| assets/privacy.js → assets/analytics.js | preregistration_validation_error | trackCustom · preregistration_validation_error |
| assets/privacy.js → assets/analytics.js | privacy_acknowledgement_change | trackCustom · privacy_acknowledgement_change |
| assets/privacy.js → assets/analytics.js | privacy_notice_close | trackCustom · privacy_notice_close |
| assets/privacy.js → assets/analytics.js | privacy_notice_confirm | trackCustom · privacy_notice_confirm |
| assets/privacy.js → assets/analytics.js | privacy_notice_open | trackCustom · privacy_notice_open |
| assets/result.js → assets/analytics.js | preregistration_result_view | trackCustom · preregistration_result_view |
| index.html → assets/analytics.js | navigation_click | trackCustom · navigation_click |
| index.html → assets/analytics.js | placeholder_link_click | trackCustom · placeholder_link_click |
| index.html → assets/analytics.js | preregistration_cta_click | trackCustom · preregistration_cta_click |
| index.html → assets/analytics.js | pricing_entry_click | trackCustom · pricing_entry_click |
| index.html → assets/analytics.js | taste_quiz_entry_click | trackCustom · taste_quiz_entry_click |
| pricing.html → assets/analytics.js | navigation_click | trackCustom · navigation_click |
| pricing.html → assets/analytics.js | preregistration_cta_click | trackCustom · preregistration_cta_click |
| pricing.html → assets/analytics.js | taste_quiz_entry_click | trackCustom · taste_quiz_entry_click |
| result.html → assets/analytics.js | navigation_click | trackCustom · navigation_click |
| result.html → assets/analytics.js | pricing_entry_click | trackCustom · pricing_entry_click |
| result.html → assets/analytics.js | taste_quiz_entry_click | trackCustom · taste_quiz_entry_click |
| taste.html → assets/analytics.js | navigation_click | trackCustom · navigation_click |
| taste.html → assets/analytics.js | preregistration_cta_click | trackCustom · preregistration_cta_click |
| taste.html → assets/analytics.js | pricing_entry_click | trackCustom · pricing_entry_click |
| assets/analytics.js | page_view | 전송 제외 |
| assets/analytics.js | 이름에 scroll 포함 | 전송 제외 |

## 표준 매핑 지원

현재 아래 이벤트의 실제 발생 지점은 없습니다. 향후 AF.track으로 호출되면 이 매핑을 적용합니다.

| 파일 | GA4 이벤트 | 메타 이벤트 |
|---|---|---|
| assets/analytics.js | generate_lead | track · Lead |
| assets/analytics.js | sign_up | track · CompleteRegistration |
| assets/analytics.js | contact_click | track · Contact |
| assets/analytics.js | view_item | track · ViewContent |
| assets/analytics.js | add_to_cart | track · AddToCart |
| assets/analytics.js | begin_checkout | track · InitiateCheckout |
| assets/analytics.js | purchase | track · Purchase (value=전달 금액, currency=KRW) |
| assets/analytics.js | search | track · Search |

그 외 이벤트는 원래 GA4 이름으로 trackCustom 전송합니다. fbq가 없으면 메타 전송을 건너뜁니다. 로컬 미리보기에서는 기존 GA4 동작과 마찬가지로 메타 미러링도 실행하지 않습니다. 기존 Meta 기본 코드의 PageView는 그대로 유지합니다.
