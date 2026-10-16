# Notify the eight public pages changed by the collection image release.
param([switch]$Apply)
$ErrorActionPreference = 'Stop'
$command = @'
set -euo pipefail
python3 - <<'PY'
import datetime,hashlib,hmac,json,pathlib,time,urllib.request
apply=__APPLY__
release=pathlib.Path('/var/www/zamique-current').resolve()
backup=pathlib.Path('/backup/zamique-20261004-jack-fashion-market-editorials-r1')
assert release.name=='20261004-jack-fashion-market-editorials-r1'
audit=json.loads((backup/'public-verification.json').read_text())
assert audit['passed'] and audit['base']=='https://zamique.com' and audit['sitemap_count']==99
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
opener.addheaders=[('User-Agent','JackFashionOwnerSEO/1.0')]
paths=['/', '/about', '/markets', '/markets/africa', '/markets/middle-east', '/markets/europe-north-america', '/markets/latin-america', '/markets/southeast-asia']
urls=["https://zamique.com"+path for path in paths]
for path in paths:
 with opener.open("https://zamique.com"+path,timeout=30) as response:
  html=response.read().decode()
  expected=5 if path in ["/","/about","/markets"] else 1
  marker="data-market-collection=" if expected==5 else "data-market-editorial="
  assert response.status==200 and html.count(marker)==expected,path
key=pathlib.Path('/var/www/zamique-indexnow/indexnow-key.txt').read_text().strip()
with opener.open('https://zamique.com/indexnow-key.txt',timeout=30) as response:
 assert response.status==200 and response.read().decode().strip()==key
change='market-editorials-20261004-r1-'+(release/'.next/BUILD_ID').read_text().strip()
result={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'applied':apply,'url_count':len(urls),'urls':urls,'revision':hashlib.sha256(change.encode()).hexdigest()}
if apply:
 env={}
 for line in (release/'.env.local').read_text().splitlines():
  if '=' in line and not line.lstrip().startswith('#'):
   name,value=line.split('=',1);env[name.strip()]=value.strip().strip('\"\'')
 secret=env['ADMIN_SECRET'];assert len(secret)>=32
 expires=str(int(time.time()*1000)+60000)
 signature=hmac.new(secret.encode(),expires.encode(),hashlib.sha256).hexdigest()
 request=urllib.request.Request('http://127.0.0.1:3200/api/admin/indexnow',data=json.dumps({'paths':paths,'change':change}).encode(),headers={'Content-Type':'application/json','Origin':'https://zamique.com','Cookie':'jack_admin_session='+expires+'.'+signature},method='POST')
 with opener.open(request,timeout=30) as response:
  assert response.status==200;state=json.loads(response.read())
 assert state['ok']
 result.update({'pending_count':len(state['pending']),'received_url_count':sum(state['successful'].get(url,{}).get('token')==result['revision'] for url in urls),'latest_receipt':state['receipts'][0] if state['receipts'] else None,'meaning':'Submission does not guarantee indexing or AI citation.'})
 (backup/'indexnow-submission.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result))
PY
'@
$output = & "$PSScriptRoot\remote-exec.ps1" -Command $command.Replace('__APPLY__',$(if($Apply){'True'}else{'False'})) -Timeout 100
if (-not $?) { throw 'Search notification failed' }
$output | Tee-Object -FilePath (Join-Path $PSScriptRoot '..\artifacts\jack-fashion-market-editorials-20261004\indexnow-submission.json')
