"""Run with qrcode[pil] installed. Generates print-ready QR SVG/PNG plus URL manifest."""
from pathlib import Path
from urllib.parse import urlencode
import csv
import json
import qrcode
import qrcode.image.svg

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'campaigns'
OUT.mkdir(exist_ok=True)
CHANNELS=[
 ('instagram_bio','Instagram 프로필','instagram','social','bio'),
 ('instagram_story','Instagram 스토리','instagram','social','story_01'),
 ('instagram_feed_qr','Instagram 피드 QR','instagram','qr','feed_qr_01'),
 ('facebook','Facebook','facebook','social','post_01'),
 ('x','X','x','social','post_01'),
 ('threads','Threads','threads','social','post_01'),
 ('youtube','YouTube 설명·프로필','youtube','social','description_01'),
 ('naver_blog','네이버 블로그','naver_blog','social','post_01'),
 ('offline_poster','오프라인 포스터','poster','qr','poster_01'),
]
rows=[]
for slug,label,source,medium,content in CHANNELS:
 params=dict(utm_source=source,utm_medium=medium,utm_campaign='taste_launch',utm_content=content)
 url='https://hunge2.github.io/AFTERSCENE/?'+urlencode(params)
 qr=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,box_size=12,border=4)
 qr.add_data(url);qr.make(fit=True)
 qr.make_image(fill_color='black',back_color='white').save(OUT/(slug+'.png'))
 qr.make_image(image_factory=qrcode.image.svg.SvgPathImage).save(OUT/(slug+'.svg'))
 rows.append(dict(id=slug,channel=label,url=url,**params,png=slug+'.png',svg=slug+'.svg'))
(OUT/'links.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
with (OUT/'links.csv').open('w',newline='',encoding='utf-8-sig') as f:
 writer=csv.DictWriter(f,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
md=['# AFTERSCENE SNS·QR 링크','', '모든 QR·주소는 운영 랜딩페이지로 연결됩니다. 기존 주소와 QR은 그대로 사용할 수 있습니다.', '', '| 채널 | 추적 주소 | QR |','|---|---|---|']
for r in rows:md.append(f'| {r["channel"]} | [웹페이지 열기]({r["url"]}) | [PNG]({r["png"]}) · [SVG]({r["svg"]}) |')
md+=['','## GA4 주요 이벤트','- 최우선: preregistration_complete(사전 가입 실습 완료).','- SNS·QR 도착: campaign_visit. promo_id / promo_source / promo_medium / promo_campaign / promo_content로 채널을 구분합니다.','- 이벤트 전송 코드 배포와 GA4 관리자 주요 이벤트 지정이 모두 필요합니다.','- 동일 탭·홍보 주소의 반복 진입은 30분 동안 중복 방지합니다. GA4 세션과 동일한 기준은 아닙니다.','','## 사용 안내','- PNG: 온라인 홍보물. SVG: 인쇄물. 흰 여백(quiet zone)을 자르거나 QR 위에 로고를 덮지 마세요.','- SNS에서는 클릭 링크를 기본으로, QR은 보조로 사용하세요. 각 QR은 같은 행의 추적 주소를 담습니다.','- 반복 캠페인은 utm_content를 변경한 뒤 QR을 다시 생성해 구분하세요.','- GA4는 QR 스캔 자체가 아닌 웹페이지 방문을 측정합니다. 공유된 링크도 원래 UTM으로 분류될 수 있습니다.','- medium=qr은 맞춤 값이므로 기본 채널 그룹 대신 세션 소스/매체와 캠페인으로 비교하세요.']
(OUT/'README.md').write_text('\n'.join(md)+'\n',encoding='utf-8')
cards=''.join(f'<article><h2>{r["channel"]}</h2><img src="{r["png"]}" alt="{r["channel"]}용 QR"><a href="{r["url"]}">추적 주소 열기</a><p><a download href="{r["png"]}">PNG 저장</a> · <a download href="{r["svg"]}">SVG 저장</a></p><textarea readonly aria-label="{r["channel"]} 추적 주소">{r["url"]}</textarea></article>' for r in rows)
(OUT/'index.html').write_text('<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>AFTERSCENE SNS·QR 링크 모음</title><style>body{font-family:system-ui;background:#f3f3f3;color:#111;max-width:1200px;margin:auto;padding:32px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}article{background:white;padding:24px;border-radius:18px}h2{font-size:20px}img{display:block;width:100%;max-width:280px}textarea{width:100%;height:100px;font:12px monospace;box-sizing:border-box}a{color:#142078}</style><h1>AFTERSCENE · SNS별 QR + 주소</h1><p>QR과 같은 행의 추적 주소는 동일합니다. 방문·참여·가입을 채널별로 비교하세요.</p><aside style="padding:18px;background:#e7eaff;border-radius:12px;margin:20px 0"><b>GA4 주요 이벤트</b><p>1순위: 사전 가입 완료 · preregistration_complete<br>SNS·QR 유입: campaign_visit · 채널/홍보 위치별 구분</p><p>기존 QR·주소는 그대로 사용하세요. 계측 보완 PR 배포 후 등록된 홍보 주소로 사이트에 도착하면 방문 이벤트를 보냅니다. GA4 관리자에서 주요 이벤트 지정이 별도로 필요합니다. 이 관리 화면을 여는 것만으로는 캠페인 방문 통계가 발생하지 않습니다.</p></aside><main>'+cards+'</main><p>QR 스캔 자체가 아닌 페이지 방문을 측정합니다. 계측 보완은 PR 머지·배포 후 적용됩니다.</p></html>',encoding='utf-8')
print(f'Generated {len(rows)} verified-source campaign URLs and QR pairs.')
