# Submit a verified release through the same durable queue used by product saves.
# The private session signature stays on the VPS and is never printed or saved.
param(
  [switch]$Apply,
  [ValidatePattern('^20261003-jack-fashion-seo-ai-[a-z0-9-]+$')]
  [string]$ReleaseId = '20261003-jack-fashion-seo-ai-r1'
)
$ErrorActionPreference = 'Stop'
$command = @'
python3 - <<'PY'
import datetime,hashlib,hmac,json,pathlib,time,urllib.request,urllib.parse,xml.etree.ElementTree as ET
apply=__APPLY__
backup=pathlib.Path('/backup/zamique-__ID__')
current=pathlib.Path('/var/www/zamique-current').resolve()
assert current.name=='__ID__'
audit=json.loads((backup/'public-verification.json').read_text())
inventory=json.loads((backup/'public-inventory.json').read_text())
assert audit['passed'] and audit['base']=='https://zamique.com' and audit['sitemap_count']==inventory['count']
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
opener.addheaders=[('User-Agent','JackFashionOwnerSEO/1.0')]
keyfile=pathlib.Path('/var/www/zamique-indexnow/indexnow-key.txt')
assert keyfile.is_file() and not keyfile.is_symlink()
key=keyfile.read_text().strip()
assert 8<=len(key)<=128 and all(c.isalnum() or c=='-' for c in key)
with opener.open('https://zamique.com/indexnow-key.txt',timeout=30) as response:
    assert response.status==200 and response.read().decode().strip()==key
with opener.open('https://zamique.com/sitemap.xml',timeout=30) as response:
    assert response.status==200
    urls=sorted({node.text for node in ET.fromstring(response.read()).findall('{*}url/{*}loc')})
assert len(urls)==inventory['count']
assert {urllib.parse.urlsplit(url).path or '/' for url in urls}==set(inventory['paths'])
for url in urls:
    parsed=urllib.parse.urlsplit(url)
    assert parsed.scheme=='https' and parsed.netloc=='zamique.com' and not parsed.query and not parsed.fragment
    assert not parsed.path.startswith(('/admin','/api','/inquiry','/_next'))
build_id=(current/'.next/BUILD_ID').read_text().strip()
canonical_urls=[url if urllib.parse.urlsplit(url).path else url+'/' for url in urls]
result={'time':datetime.datetime.now(datetime.timezone.utc).isoformat(),'applied':apply,
        'url_count':len(urls),'build_id':build_id,'key_verified_publicly':True,
        'url_fingerprint':hashlib.sha256('\n'.join(urls).encode()).hexdigest(),'urls':urls}
if apply:
    env={}
    for line in (current/'.env.local').read_text().splitlines():
        if '=' in line and not line.lstrip().startswith('#'):
            name,value=line.split('=',1)
            env[name.strip()]=value.strip().strip('\"\'')
    secret=env['ADMIN_SECRET']
    assert len(secret)>=32
    expires=str(int(time.time()*1000)+60000)
    signature=hmac.new(secret.encode(),expires.encode(),hashlib.sha256).hexdigest()
    change='release-__ID__-'+build_id
    revision=hashlib.sha256(change.encode()).hexdigest()
    payload=json.dumps({'paths':urls,'change':change}).encode()
    request=urllib.request.Request('http://127.0.0.1:3200/api/admin/indexnow',data=payload,
        headers={'Content-Type':'application/json','Origin':'https://zamique.com',
                 'Cookie':'jack_admin_session='+expires+'.'+signature},method='POST')
    with opener.open(request,timeout=30) as response:
        assert response.status==200
        state=json.loads(response.read())
    assert state['ok']
    result['pending_count']=len(state['pending'])
    result['receipts']=state['receipts']
    result['received_url_count']=sum(state['successful'].get(url,{}).get('token')==revision for url in canonical_urls)
    result['meaning']='Received by IndexNow is not proof of indexing, search exposure or AI citation.'
    (backup/'indexnow-submission.json').write_text(json.dumps(result,indent=2))
else:
    (backup/'indexnow-preview.json').write_text(json.dumps(result,indent=2))
print(json.dumps({k:v for k,v in result.items() if k not in ('urls','receipts')}))
if apply:
    print(json.dumps({'latest_receipt':({k:v for k,v in result['receipts'][0].items() if k!='urls'} if result['receipts'] else None)}))
PY
'@
& "$PSScriptRoot\remote-exec.ps1" -Command $command.Replace('__ID__',$ReleaseId).Replace('__APPLY__',$(if($Apply){'True'}else{'False'})) -Timeout 100
