# 주요 이벤트 설정: 사전 가입 최우선

이 문서는 코드와 별도로 GA4 관리자에서 적용할 설정입니다. PR 생성·머지만으로 이벤트가 주요 이벤트로 지정되지는 않습니다. 측정 ID는 `G-77DJK8C5S3`입니다. 주요 이벤트 지정은 과거 데이터에 소급 적용되지 않으므로 배포 전 이벤트명으로 등록할 수 있습니다.

## 지정할 주요 이벤트

| 우선순위 | 이벤트명 | 의미 | 집계 방식 제안 |
|---|---|---|---|
| **1 · 최우선** | **preregistration_complete** | 정상 검증·안내 확인 후 사전 가입 실습 완료 | 이벤트당 1회. 코드에서 더블 클릭 방지 |
| 보조 · 유입 | campaign_visit | 등록된 SNS·QR 홍보 주소로 랜딩 도착 | 이벤트당 1회. 아래 탭별 중복 방지 적용 |
| 보조 · 체험 | taste_quiz_complete | 본인이 4문항 테스트 완료 | 이벤트당 1회 |
| 선택 후보 | plan_preference_submit | 이용 희망 플랜 확정 | 필요할 때 주요 이벤트로 지정 |

`preregistration_cta_click`과 `preregistration_submit_attempt`는 가입 완료 전 행동이며 일반 이벤트로 유지합니다. `preregistration_result_view`를 같은 성과로 중복 지정하지 않습니다. 실제 계정 생성·리드 접수·결제는 아닙니다.

GA4에는 업무상 우선순위 1·2·3을 설정하는 기능이 없으므로 위 순위는 운영·보고 기준입니다. 사전 가입 성과는 이벤트명을 `preregistration_complete`로 선택해 확인하고, 전체 주요 이벤트 합계에는 유입·체험도 포함됨을 구분합니다. 광고에 연결한다면 가입 목표는 가입 완료를 별도로 선택하세요.

## 관리자 적용 순서

1. Google Analytics에서 `G-77DJK8C5S3` 웹 스트림이 속한 속성을 선택합니다.
2. 관리자 → 데이터 표시 → 주요 이벤트에서 위 이벤트명을 정확히 등록합니다. 또는 수집된 이벤트의 '주요 이벤트로 표시'를 켭니다. 편집 권한이 필요합니다.
3. 관리자 → 맞춤 정의에서 아래 파라미터를 **이벤트 범위 맞춤 측정기준**으로 등록합니다.
4. `docs/GA4-SETUP.md`의 자동 폼·기록 기반 페이지 조회 중복 설정을 확인합니다.
5. 머지·배포 후 실제 홍보 링크로 진입해 Realtime / Tag Assistant DebugView에서 수신을 확인합니다. localhost는 운영 통계를 보내지 않습니다.

## SNS·QR 주요 이벤트 파라미터

| 파라미터 | 의미 | 예시 |
|---|---|---|
| promo_id | 홍보 주소의 고정 식별자 | instagram_bio |
| promo_source | 배포 채널 | instagram |
| promo_medium | 주소에 지정된 매체 | social / qr |
| promo_campaign | 캠페인명 | taste_launch |
| promo_content | 게시 위치·소재 코드 | bio / story_01 / feed_qr_01 |

이 파라미터는 등록된 캠페인 진입 후 가입 완료·테스트·플랜 확정 등의 이벤트에도 연결됩니다. **탭 내에서 마지막으로 확인한 등록 캠페인**을 보조 분석용으로 유지하며, GA4의 세션 소스/매체·기여 분석을 대체하지 않습니다. 30분 동안 추적 행동이 없으면 보조 연결이 만료됩니다. 다른 명시적 UTM으로 진입하면 이전 캠페인 연결을 지웁니다.

## 등록된 9개 홍보 주소

| promo_id | 채널·위치 | source | medium | content |
|---|---|---|---|---|
| instagram_bio | Instagram 프로필 | instagram | social | bio |
| instagram_story | Instagram 스토리 | instagram | social | story_01 |
| instagram_feed_qr | Instagram 피드 QR | instagram | qr | feed_qr_01 |
| facebook | Facebook | facebook | social | post_01 |
| x | X | x | social | post_01 |
| threads | Threads | threads | social | post_01 |
| youtube | YouTube 설명·프로필 | youtube | social | description_01 |
| naver_blog | 네이버 블로그 | naver_blog | social | post_01 |
| offline_poster | 오프라인 포스터 | poster | qr | poster_01 |

기존 PNG·SVG와 주소는 변경하지 않습니다. `campaigns/links.json`의 source·medium·campaign·content 조합과 정확히 일치하며 랜딩페이지에 도착했을 때만 `campaign_visit`가 발생합니다. 일반 직접 방문·공유 결과·알 수 없는 캠페인·QR 모음 관리 페이지 방문에는 발생하지 않습니다.

## 중복 방지와 측정 범위

- 같은 탭에서 같은 홍보 주소를 반복 열거나 새로고침하면 마지막 진입 이후 30분 동안 `campaign_visit`를 중복 전송하지 않습니다. 다른 홍보 주소는 별도 집계합니다. 이 기준은 GA4 세션 ID와 동일하다는 뜻이 아닙니다.
- 새 탭·새 기기에서는 다시 집계될 수 있습니다. 저장소를 사용할 수 없으면 페이지 이동·새로고침 간 중복 방지가 제한됩니다.
- QR 스캔 자체나 SNS 게시물 노출을 측정하지 않습니다. QR·주소를 열어 사이트가 로드된 행동을 수집합니다.
- 같은 행의 QR과 클릭 주소는 동일하므로 실제 스캔인지 클릭인지 구분할 수 없습니다. `medium=qr`은 QR 전용으로 배포한 주소의 표기입니다.
- 링크가 다른 SNS로 재공유되면 원래 지정된 채널로 집계될 수 있습니다. 실제 방문자의 신원이나 계정을 추적하지 않습니다.
- 캠페인 주소를 추가·변경할 때는 생성 스크립트와 `assets/analytics.js` 등록 조합을 함께 갱신하고 테스트를 실행합니다.

## 보고서 구성

| 확인할 항목 | GA4에서 보는 기준 |
|---|---|
| 최우선 사전 가입 성과 | 이벤트명=preregistration_complete, 주요 이벤트 수·사용자 수 |
| SNS·홍보 위치별 방문 | 이벤트명=campaign_visit, promo_id·promo_source·promo_content |
| SNS 유입 후 가입 | 이벤트명=preregistration_complete, promo_id별 비교 |
| 가입 전환율 | 같은 기간·같은 대상의 캠페인 방문 사용자 중 가입 완료 사용자 비율. 이벤트 횟수 단순 나눗셈 제외 |
| GA4 기본 유입 성과 | 트래픽 획득의 세션 소스/매체·세션 캠페인, 선택 주요 이벤트=preregistration_complete |

참고: [주요 이벤트](https://support.google.com/analytics/answer/9267568), [주요 이벤트 생성·수정](https://support.google.com/analytics/answer/12844695), [UTM 캠페인 링크](https://support.google.com/analytics/answer/10917952).
