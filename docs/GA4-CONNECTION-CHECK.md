# GA4 연결 점검 · 2026-10-28

측정 ID: `G-77DJK8C5S3`
운영 주소: `https://hunge2.github.io/AFTERSCENE/`

## 실제 운영 태그 검사 결과

Google 공식 Tag Assistant로 2026-10-28 오후 5:47(KST)에 운영 사이트를 검사했습니다.

| 확인 항목 | 관찰 결과 |
|---|---|
| Google 태그 감지 | 1개, `G-77DJK8C5S3` |
| 대상 ID | `G-77DJK8C5S3` |
| 조회 발송됨 | 페이지 조회, `section_view` 표시 |
| 페이지 조회 이벤트 | `en=page_view` |
| 수집 요청 주소 | `https://www.google-analytics.com/g/collect` |
| 수집 요청의 측정 ID | `tid=G-77DJK8C5S3` |
| 수집 요청의 페이지 위치 | `https://hunge2.github.io/AFTERSCENE/` |

이 결과는 기존 운영 태그가 해당 ID로 이벤트를 발송하고 있다는 증거입니다. GA4 계정의 보고서에 실제 반영됐는지는 이 검사만으로 확인할 수 없습니다. 디버그용 창이 닫히면 Tag Assistant 상단에는 '연결되지 않음'이 표시되지만 기록된 발송 내역은 남습니다.

## 이번 수정

- 존재하지 않는 `ga4-easy.js`를 참조하던 줄을 HTML 5개에서 제거합니다.
- 공개 페이지 4개(index / taste / pricing / result)의 기존 `assets/analytics.js`를 문자 인코딩 선언 바로 뒤로 옮겨 스타일시트보다 먼저 초기화합니다.
- 기존 Google 태그 로더와 맞춤 이벤트를 유지합니다. 별도 태그를 중복 설치하지 않습니다.
- 페이지 조회·맞춤 이벤트의 `send_to`를 `G-77DJK8C5S3`로 명시합니다.
- campaigns/index.html은 홍보물 관리 화면으로, 캠페인 도착 이벤트를 발생시키지 않습니다. 각 홍보 링크의 운영 사이트 도착은 기존 `campaign_visit`로 측정합니다.

## 계정에서 데이터가 보이지 않을 때

1. 관리자 → 데이터 스트림에서 확인하는 스트림의 측정 ID가 정확히 `G-77DJK8C5S3`인지 확인합니다. 웹사이트 주소를 입력하거나 주요 이벤트를 등록하는 것만으로 태그 설치가 대신되지는 않습니다.
2. localhost 대신 운영 주소에 접속합니다. 로컬 미리보기는 통계를 보내지 않도록 설계되어 있습니다.
3. 보고서 → 실시간 또는 관리자 → DebugView에서 확인합니다. Tag Assistant 검사는 디버그 모드로 기록됩니다. 내부/개발자 트래픽 제외 필터가 활성화되어 있다면 일반 보고서와 다를 수 있습니다.
4. 일반 보고서는 처리에 24~48시간이 걸릴 수 있습니다. 태그 발송과 보고서 처리 상태를 구분합니다.
5. 해당 속성의 데이터 필터·광고 차단 확장·브라우저 추적 차단도 확인합니다. 계정 설정은 이 PR에서 변경하지 않았습니다.

최종 코드 반영은 PR 머지 및 GitHub Pages 배포 후 이뤄집니다. 위 실제 태그 검사 결과는 이번 보완 PR을 머지하기 전의 운영 사이트에서도 관찰됐습니다.

참고: [Google 태그 설치·검증](https://developers.google.com/tag-platform/gtagjs), [GA4 연결 문제 해결](https://developers.google.com/analytics/devguides/collection/ga4/troubleshoot).
