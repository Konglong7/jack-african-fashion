# One explicit submission per verified sitemap version. Defaults to preview.
# Sends only public canonical URLs; never private, query or account pages.
param([switch]$Apply)
$ErrorActionPreference='Stop'
$auditCommand=@'
python3 - <<'PY'
import datetime,hashlib,json,pathlib,urllib.request,urllib.error,urllib.parse,xml.etree.ElementTree as ET
apply=__APPLY__
backup=pathlib.Path('/backup/zamique-continuation-20261001')
keyfile=pathlib.Path('/var/www/zamique-indexnow/indexnow-key.txt')
assert keyfile.is_file() and not keyfile.is_symlink()
key=keyfile.read_text();assert len(key)==32 and all(c in '0123456789abcdef' for c in key)
key_location='https://zamique.com/indexnow-key.txt'
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
opener.addheaders=[('User-Agent','ZamiqueOwnerSEO/1.0')]
with opener.open(key_location,timeout=30) as r:
    assert r.status==200 and r.read().decode('utf-8')==key
with opener.open('https://zamique.com/sitemap.xml',timeout=30) as r:
    assert r.status==200;root=ET.fromstring(r.read())
urls=sorted({n.text for n in root.findall('{*}url/{*}loc')})
assert len(urls)==83,'Changed sitemap needs a fresh review'
for url in urls:
    p=urllib.parse.urlsplit(url)
    assert p.scheme=='https' and p.netloc=='zamique.com' and not p.query and not p.fragment
    assert p.path not in ['/inquiry','/admin/login'] and not p.path.startswith(('/admin','/api','/_next'))
fingerprint=hashlib.sha256('\n'.join(urls).encode()).hexdigest()
content_version=(pathlib.Path('/var/www/zamique-current')/'.next/BUILD_ID').read_text().strip()
receipt=backup/'indexnow-submission.json'
if receipt.exists():
    previous=json.loads(receipt.read_text())
    assert previous.get('request_state') not in ['sending','uncertain'],'Prior request effect is uncertain; inspect before another submission'
    assert not (previous.get('url_fingerprint')==fingerprint and previous.get('content_version')==content_version and previous.get('http_status') in [200,202]),'Already accepted; do not resubmit unchanged URLs'
result={'time':datetime.datetime.now().astimezone().isoformat(),'key_location':key_location,
        'key_verified_publicly':True,'url_count':len(urls),'urls':urls,'url_fingerprint':fingerprint,'content_version':content_version,'applied':apply}
if apply:
    payload=json.dumps({'host':'zamique.com','key':key,'keyLocation':key_location,'urlList':urls}).encode('utf-8')
    request=urllib.request.Request('https://api.indexnow.org/indexnow',data=payload,
        headers={'Content-Type':'application/json; charset=utf-8','User-Agent':'ZamiqueOwnerSEO/1.0'},method='POST')
    # No automatic retry: a timeout has an uncertain external effect.
    result['request_state']='sending';receipt.write_text(json.dumps(result,indent=2))
    try:
        with opener.open(request,timeout=45) as r:
            result['http_status']=r.status;r.read()
        result['request_state']='received'
    except urllib.error.HTTPError as error:
        result.update({'http_status':error.code,'request_state':'rejected'})
        receipt.write_text(json.dumps(result,indent=2));raise
    except (OSError,TimeoutError) as error:
        result.update({'request_state':'uncertain','error_type':type(error).__name__})
        receipt.write_text(json.dumps(result,indent=2));raise
    assert result['http_status'] in [200,202]
    result['meaning']='Received by IndexNow; 202 means key validation pending. Receipt is not indexing or ranking.'
    receipt.write_text(json.dumps(result,indent=2))
else:
    (backup/'indexnow-preview.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result))
PY
'@
& "$PSScriptRoot\remote-exec.ps1" -Command $auditCommand.Replace('__APPLY__',$(if($Apply){'True'}else{'False'})) -Timeout 120
