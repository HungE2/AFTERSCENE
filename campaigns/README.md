# AFTERSCENE SNS·QR 링크

모든 QR·주소는 운영 랜딩페이지로 연결됩니다. 기존 주소와 QR은 그대로 사용할 수 있습니다.

| 채널 | 추적 주소 | QR |
|---|---|---|
| Instagram 프로필 | [웹페이지 열기](https://hunge2.github.io/AFTERSCENE/?utm_source=instagram&utm_medium=social&utm_campaign=taste_launch&utm_content=bio) | [PNG](instagram_bio.png) · [SVG](instagram_bio.svg) |
| Instagram 스토리 | [웹페이지 열기](https://hunge2.github.io/AFTERSCENE/?utm_source=instagram&utm_medium=social&utm_campaign=taste_launch&utm_content=story_01) | [PNG](instagram_story.png) · [SVG](instagram_story.svg) |
| Instagram 피드 QR | [웹페이지 열기](https://hunge2.github.io/AFTERSCENE/?utm_source=instagram&utm_medium=qr&utm_campaign=taste_launch&utm_content=feed_qr_01) | [PNG](instagram_feed_qr.png) · [SVG](instagram_feed_qr.svg) |
| Facebook | [웹페이지 열기](https://hunge2.github.io/AFTERSCENE/?utm_source=facebook&utm_medium=social&utm_campaign=taste_launch&utm_content=post_01) | [PNG](facebook.png) · [SVG](facebook.svg) |
| X | [웹페이지 열기](https://hunge2.github.io/AFTERSCENE/?utm_source=x&utm_medium=social&utm_campaign=taste_launch&utm_content=post_01) | [PNG](x.png) · [SVG](x.svg) |
| Threads | [웹페이지 열기](https://hunge2.github.io/AFTERSCENE/?utm_source=threads&utm_medium=social&utm_campaign=taste_launch&utm_content=post_01) | [PNG](threads.png) · [SVG](threads.svg) |
| YouTube 설명·프로필 | [웹페이지 열기](https://hunge2.github.io/AFTERSCENE/?utm_source=youtube&utm_medium=social&utm_campaign=taste_launch&utm_content=description_01) | [PNG](youtube.png) · [SVG](youtube.svg) |
| 네이버 블로그 | [웹페이지 열기](https://hunge2.github.io/AFTERSCENE/?utm_source=naver_blog&utm_medium=social&utm_campaign=taste_launch&utm_content=post_01) | [PNG](naver_blog.png) · [SVG](naver_blog.svg) |
| 오프라인 포스터 | [웹페이지 열기](https://hunge2.github.io/AFTERSCENE/?utm_source=poster&utm_medium=qr&utm_campaign=taste_launch&utm_content=poster_01) | [PNG](offline_poster.png) · [SVG](offline_poster.svg) |

## GA4 주요 이벤트
- 최우선: preregistration_complete(사전 가입 실습 완료).
- SNS·QR 도착: campaign_visit. promo_id / promo_source / promo_medium / promo_campaign / promo_content로 채널을 구분합니다.
- 이벤트 전송 코드 배포와 GA4 관리자 주요 이벤트 지정이 모두 필요합니다.
- 동일 탭·홍보 주소의 반복 진입은 30분 동안 중복 방지합니다. GA4 세션과 동일한 기준은 아닙니다.

## 사용 안내
- PNG: 온라인 홍보물. SVG: 인쇄물. 흰 여백(quiet zone)을 자르거나 QR 위에 로고를 덮지 마세요.
- SNS에서는 클릭 링크를 기본으로, QR은 보조로 사용하세요. 각 QR은 같은 행의 추적 주소를 담습니다.
- 반복 캠페인은 utm_content를 변경한 뒤 QR을 다시 생성해 구분하세요.
- GA4는 QR 스캔 자체가 아닌 웹페이지 방문을 측정합니다. 공유된 링크도 원래 UTM으로 분류될 수 있습니다.
- medium=qr은 맞춤 값이므로 기본 채널 그룹 대신 세션 소스/매체와 캠페인으로 비교하세요.
