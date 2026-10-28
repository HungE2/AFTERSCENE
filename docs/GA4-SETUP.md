# AFTERSCENE GA4 운영·검수 안내

측정 ID: `G-77DJK8C5S3`. 승인 후 PR을 머지하고 GitHub Pages 배포가 완료되면 운영 도메인에서만 Google 태그를 로드합니다. localhost와 다른 호스트의 미리보기는 Google 요청 없이 dataLayer에 검수용 이벤트만 남깁니다.

## GA4 관리자에서 마무리할 설정

코드 배포와 별개로 아래 설정은 GA4 속성의 편집 권한으로 직접 적용해야 합니다. 이 PR에서는 관리자 설정을 변경하지 않습니다.

1. 웹 스트림 URL: `https://hunge2.github.io/AFTERSCENE/`.
2. 향상된 측정 → 폼 상호작용 OFF. 맞춤 이벤트를 사용하므로 자동 `form_start` / `form_submit`은 분석에서 제외합니다.
3. 향상된 측정 → 페이지 조회 고급 설정 → 브라우저 기록 이벤트 기반 페이지 변경 OFF. 문서 로드당 코드에서 `page_view`를 한 번 전송하며, 앵커 이동은 클릭 이벤트로 측정합니다.
4. **최우선 주요 이벤트는 `preregistration_complete`입니다.** `campaign_visit`(SNS·QR 방문)와 `taste_quiz_complete`는 보조 주요 이벤트, `plan_preference_submit`은 선택 후보입니다. 실제 회원 가입이나 매출이 아닌 실습·이용 의향 지표입니다. 결과 화면 `page_view`나 `preregistration_result_view`를 같은 완료 성과로 중복 지정하지 않습니다. [지정 순서·채널별 보고서 안내](GA4-KEY-EVENTS.md)를 확인하세요.
5. 아래 맞춤 측정기준을 이벤트 범위로 등록합니다. 파라미터를 전송하는 것만으로 GA4 보고서에 모두 표시되지는 않습니다.
6. 운영 배포 후 Realtime / Tag Assistant DebugView에서 실제 수신을 확인합니다. 로컬 자동 테스트는 태그 전송 코드·이벤트 로직만 검증하며, 속성 접근이나 실제 수신을 보장하지 않습니다.

## 맞춤 측정기준

`page_type`, `measurement_version`, `placement`, `element_id`, `destination`, `platform`, `section_id`, `entry_cta_id`, `preferred_plan`, `submission_type`, `quiz_id`, `question_id`, `option_id`, `result_type`, `entry_point`, `pricing_version`, `plan_id`, `previous_plan_id`, `mood_id`, `recommendation_set_id`, `content_id`, `content_type`, `method`, `faq_id`, `modal_mode`, `close_method`, `field_id`, `error_type`, `direction`, `result_origin`, `promo_id`, `promo_source`, `promo_medium`, `promo_campaign`, `promo_content`.

계측 버전은 `v2`입니다. 캠페인 중복 방지용 홍보 코드·시각과 최근 홍보 코드를 탭 세션에 저장하며 이름·이메일은 저장하지 않습니다.

`monthly_price`는 이용 의향 조사에 표시한 가격이며 매출이 아닙니다. `value`, `purchase`는 전송하지 않습니다.

## 이벤트 명세

| 기능 | 이벤트 | 파라미터 / 발생 기준 |
|---|---|---|
| 페이지 조회 | page_view | page_location, page_title, page_type. 문서 로드 1회, 쿼리는 허용 UTM만 포함 |
| 영역 노출 | section_view | section_id. 제목 50% 이상 1초 노출, 문서당 영역별 1회 |
| 기존 메뉴 | navigation_click | placement, element_id, destination |
| 가입 진입 | preregistration_cta_click | placement, element_id, destination, platform(해당 시). 가장 최근 CTA 코드를 세션 유지 |
| 미연결 SNS 링크 | placeholder_link_click | element_id, placement. 실제 외부 방문이 아님 |
| 테스트 진입 링크 | taste_quiz_entry_click | element_id, placement |
| 테스트 시작 | taste_quiz_start | quiz_id=taste_v1, entry_point |
| 질문 이동 | taste_quiz_step_click | quiz_id, question_id, direction=previous/next |
| 결과 열람 | taste_result_view | quiz_id, result_type, result_origin=own/shared. 공유받은 결과는 본인 완료와 구분 |
| 영화 소개 종료 | movie_detail_close | content_id, placement, close_method=button/escape |
| SNS·QR 도착 | campaign_visit | 등록된 9개 주소만, promo_id, promo_source, promo_medium, promo_campaign, promo_content. 세부 기준은 GA4-KEY-EVENTS.md |
| 답변 선택·변경 | taste_quiz_answer | quiz_id, question_id, option_id. 답변 원문 제외 |
| 결과 계산 완료 | taste_quiz_complete | quiz_id, result_type. 테스트 실행당 1회 |
| 다시 하기 | taste_quiz_restart | quiz_id, previous_result_type |
| 카드 저장 시작 | result_card_download | result_type, content_type. PNG 생성 성공 후 다운로드 실행; 디스크 저장 완료 보장 아님 |
| 공유 시도 | share_click | result_type, method |
| 복사·공유 API 성공 | share | result_type, method, content_type. 수신자 전달·열람 보장 아님 |
| 요금제 진입 링크 | pricing_entry_click | element_id, placement |
| 요금제 노출 | pricing_view | entry_point, pricing_version=v1 |
| 비교표 펼침 | plan_comparison_expand | placement, pricing_version |
| 플랜 선택 | plan_select | plan_id, previous_plan_id, monthly_price, currency=KRW |
| 플랜 확정 | plan_preference_submit | plan_id, pricing_version. 확정 전 저장하지 않음; 연속 클릭 중복 방지 |
| 선택 유보 | plan_preference_skip | entry_point. preferred_plan=undecided |
| 기분 선택 | mood_select | mood_id, placement. 같은 항목 연속 클릭 제외 |
| 추천 노출 | recommendation_view | mood_id, recommendation_set_id |
| 영화 소개 | select_content | content_type=movie, content_id, placement |
| FAQ | faq_open | faq_id, placement |
| 입력 시작 | preregistration_start | form_id, entry_cta_id. 실제 입력 최초 1회 |
| 제출 시도 | preregistration_submit_attempt | form_id, element_id, placement. 검증 성공 전 |
| 검증 오류 | preregistration_validation_error | form_id, field_id, error_type. 오류 입력값 제외 |
| 안내 팝업 | privacy_notice_open / privacy_notice_close | modal_mode=info/submit, placement 또는 close_method |
| 안내 확인 체크 | privacy_acknowledgement_change | modal_mode, checked. 통계 수집 동의 상태로 사용하지 않음 |
| 안내만 확인 | privacy_notice_confirm | modal_mode=info. 가입 완료로 집계하지 않음 |
| 가입 실습 완료 | preregistration_complete | form_id, submission_type=demo, preferred_plan, result_type, entry_cta_id. 입력 삭제 후 1회, 콜백 또는 800ms 후 이동 |
| 정상 완료 화면 도달 | preregistration_result_view | submission_type, preferred_plan, result_type, entry_cta_id. 일회성 세션 플래그 소비 후 발생 |

## 개인정보·상태

- 이름·이메일에 `name` 속성을 추가하지 않습니다. JS가 꺼져도 폼 값이 GET URL에 포함되지 않습니다.
- 사용자 입력값·해시·자유 텍스트는 이벤트·공유 URL·세션 저장소에 넣지 않습니다. 분석 래퍼는 파라미터 이름을 허용 목록으로 제한합니다.
- 세션 저장은 취향 유형, 희망 플랜, CTA 코드, 정상 완료 화면 진입 플래그, 홍보 코드·중복 방지 시각만 사용합니다. 저장소 사용이 제한되어도 페이지 안의 선택·완료는 동작합니다. 페이지 간 유지·중복 방지가 제한될 수 있습니다.
- 공유받은 결과 열람은 본인의 테스트 완료가 아니며, 자신의 기존 취향 유형을 덮어쓰지 않습니다.
- GA4 방문·행동 통계 및 분석 쿠키 사용 가능성을 페이지에 안내했습니다. 기존 안내 확인 체크박스를 분석 동의로 전용하지 않습니다.
- 기존 코드의 `generate_lead`와 Meta `Lead` 조건부 호출을 제거했습니다. 실제 리드 확보로 집계하지 않습니다.

## 배포 후 수동 확인

| 시나리오 | 기대 결과 |
|---|---|
| 이름·이메일 누락 / 이메일 형식 오류 | validation_error, 완료 이벤트 0 |
| 자세히 보기 → 확인만 | 안내 이벤트만, 완료 0 |
| 정상 입력 → 안내 확인 → 완료 | preregistration_complete 1, 입력값 삭제, 결과 도달 1 |
| 결과 URL 직접 방문·새로고침 | 주요 완료 이벤트 0, 정상 도달 이벤트 추가 0 |
| 공유받은 결과 링크 | 공유 결과 표시, taste_quiz_complete 0 |
| 테스트 4문항 완료 | 완료 1, 추천 3편, 결과 유형 유지 |
| 요금제 선택 후 다른 플랜 선택 | plan_select 각각 발생, 최종 확정 플랜만 저장 |
| 공유 취소·복사 실패 | share 완료 이벤트 0, 대체 안내 |
| 캠페인 링크 진입 | 세션 소스/매체·캠페인 구분, 이후 완료 행동 연결 |

## 로컬 검수

```sh
npm ci
npm test
python -m http.server 4174 --bind 127.0.0.1
```

QR 재생성: `pip install qrcode[pil]` 후 `python scripts/generate_campaigns.py`. QR 해독 검증에는 OpenCV를 사용했습니다. 홍보 파일은 `campaigns/`에 있습니다.

참고: [Google 이벤트 구현](https://developers.google.com/analytics/devguides/collection/ga4/events), [Google tag API](https://developers.google.com/tag-platform/gtagjs/reference), [UTM 캠페인 링크](https://support.google.com/analytics/answer/10917952).
