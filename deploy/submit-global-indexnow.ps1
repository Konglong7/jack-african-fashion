# Sends this verified public release once. A receipt confirms submission, not ranking.
param(
  [switch]$Apply,
  [ValidatePattern('^20261003-jack-fashion-global-[a-z0-9-]+$')]
  [string]$ReleaseId = '20261003-jack-fashion-global-r1'
)
$ErrorActionPreference = 'Stop'
$command = @'
python3 - <<'PY'
import datetime,hashlib,json,pathlib,urllib.request,urllib.error,urllib.parse,xml.etree.ElementTree as ET
apply=__APPLY__
backup=pathlib.Path('/backup/zamique-__ID__')
assert backup.is_dir()
audit=json.loads((backup/'public-verification.json').read_text())
assert audit['passed'] and audit['base']=='https://zamique.com' and audit['sitemap_count']==92
current=pathlib.Path('/var/www/zamique-current').resolve()
assert current.name=='__ID__'
keyfile=pathlib.Path('/var/www/zamique-indexnow/indexnow-key.txt')
assert keyfile.is_file() and not keyfile.is_symlink()
key=keyfile.read_text()
assert len(key)==32 and all(c in '0123456789abcdef' for c in key)
key_location='https://zamique.com/indexnow-key.txt'
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
opener.addheaders=[('User-Agent','JackFashionOwnerSEO/1.0')]
with opener.open(key_location,timeout=30) as response:
    assert response.status==200 and response.read().decode()==key
with opener.open('https://zamique.com/sitemap.xml',timeout=30) as response:
    assert response.status==200
    root=ET.fromstring(response.read())
urls=sorted({node.text for node in root.findall('{*}url/{*}loc')})
assert len(urls)==92
for url in urls:
    parsed=urllib.parse.urlsplit(url)
    assert parsed.scheme=='https' and parsed.netloc=='zamique.com' and not parsed.query and not parsed.fragment
    assert not parsed.path.startswith(('/admin','/api','/inquiry','/_next'))
fingerprint=hashlib.sha256('\n'.join(urls).encode()).hexdigest()
build_id=(current/'.next/BUILD_ID').read_text().strip()
receipt=backup/'indexnow-submission.json'
if receipt.exists():
    previous=json.loads(receipt.read_text())
    assert previous.get('request_state') not in ['sending','uncertain'],'Inspect uncertain submission first'
    assert not(previous.get('url_fingerprint')==fingerprint and previous.get('build_id')==build_id and previous.get('http_status') in [200,202]),'Already submitted'
result={'time':datetime.datetime.now(datetime.timezone.utc).isoformat(),'url_count':len(urls),
        'key_location':key_location,'key_verified_publicly':True,'url_fingerprint':fingerprint,
        'build_id':build_id,'applied':apply,'urls':urls}
if apply:
    payload=json.dumps({'host':'zamique.com','key':key,'keyLocation':key_location,'urlList':urls}).encode()
    request=urllib.request.Request('https://api.indexnow.org/indexnow',data=payload,
        headers={'Content-Type':'application/json; charset=utf-8','User-Agent':'JackFashionOwnerSEO/1.0'},method='POST')
    result['request_state']='sending'
    receipt.write_text(json.dumps(result,indent=2))
    try:
        with opener.open(request,timeout=45) as response:
            result['http_status']=response.status
            response.read()
        result['request_state']='received'
    except urllib.error.HTTPError as error:
        result.update({'http_status':error.code,'request_state':'rejected'})
        receipt.write_text(json.dumps(result,indent=2))
        raise
    except (OSError,TimeoutError) as error:
        result.update({'request_state':'uncertain','error_type':type(error).__name__})
        receipt.write_text(json.dumps(result,indent=2))
        raise
    assert result['http_status'] in [200,202]
    result['meaning']='Received by IndexNow; not proof of indexing or ranking.'
    receipt.write_text(json.dumps(result,indent=2))
else:
    (backup/'indexnow-preview.json').write_text(json.dumps(result,indent=2))
print(json.dumps({k:v for k,v in result.items() if k!='urls'}))
PY
'@
& "$PSScriptRoot\remote-exec.ps1" -Command $command.Replace('__ID__',$ReleaseId).Replace('__APPLY__',$(if($Apply){'True'}else{'False'})) -Timeout 100
