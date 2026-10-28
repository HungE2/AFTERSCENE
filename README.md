# AFTERSCENE

영화를 보는 것에서, 내 취향을 쌓는 것으로. 교육용 정적 웹사이트입니다.

## 페이지

| 파일 | 역할 |
|---|---|
| index.html | 기존 랜딩, 기분별 예시 추천, FAQ, 사전 가입 체험 |
| taste.html | 4문항 취향 테스트, 추천 3편, 결과 카드 PNG 저장·공유 |
| pricing.html | FREE·CHOICE·PLUS 비교와 이용 희망 플랜 선택 |
| result.html | 가입 실습 완료, 테스트·요금제 후속 진입 |
| campaigns/index.html | SNS별 추적 주소와 QR PNG·SVG 모음 |
| docs/GA4-SETUP.md | 이벤트 명세, 주요 이벤트 후보, 관리자 설정·검수 안내 |

기존 SHOP과 작품 해석 소개는 유지합니다. 굿즈 취향 선택, 기능 투표, 해석 글 미리보기, 밸런스 게임은 추가하지 않습니다.

## 로컬 실행·검증

```sh
npm ci
npm test
python -m http.server 4174 --bind 127.0.0.1
```

브라우저에서 http://127.0.0.1:4174/ 를 엽니다. 런타임 빌드나 서버·DB는 필요 없습니다. npm 의존성은 테스트 전용입니다.

## 분석

GA4 ID는 assets/analytics.js의 G-77DJK8C5S3입니다. 운영 도메인 hunge2.github.io에서만 Google 태그를 로드하며 로컬·다른 호스트 미리보기는 실제 통계를 보내지 않습니다. 주요 이벤트 지정·맞춤 측정기준·향상된 측정 조정은 GA4 관리자에서 별도로 적용해야 합니다. 전체 절차는 docs/GA4-SETUP.md를 확인하세요.

## 개인정보와 체험 범위

이름·이메일은 전송·저장하지 않으며 완료 시 삭제합니다. 입력란에 name 속성을 추가하지 마세요. 취향 유형·플랜·CTA 코드·완료 진입 표시만 탭 세션 동안 유지합니다. 공유 URL과 이벤트에는 입력값이 포함되지 않습니다. 방문·선택 통계는 Google Analytics로 집계합니다.

요금제 선택은 이용 의향 조사이며 실제 가입·결제·출시 알림 신청이 아닙니다. 향후 실제 접수 기능을 연결한다면 안내 문구와 성공 이벤트 기준을 함께 변경해야 합니다.

## QR 재생성

```sh
pip install qrcode[pil]
python scripts/generate_campaigns.py
```

주소·UTM·QR 파일은 campaigns/에서 함께 관리합니다. 모든 QR은 랜딩페이지로 연결되며 새 기능은 PR 머지·GitHub Pages 배포 후 표시됩니다. PNG는 온라인 홍보물, SVG는 인쇄용입니다. QR 여백을 자르지 마세요.

## 계측 보완 v2

사전 가입 완료(`preregistration_complete`)가 최우선 주요 이벤트입니다. SNS·QR 홍보 주소 방문은 `campaign_visit`로 구분하고, 이후 가입 완료에 홍보 코드를 연결합니다. 기존 QR·URL은 유지합니다. 주요 이벤트 지정은 GA4 관리자에서 별도로 적용해야 하며 [설정 안내](docs/GA4-KEY-EVENTS.md)를 확인하세요.
