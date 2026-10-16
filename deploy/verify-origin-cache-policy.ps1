$ErrorActionPreference='Stop'
$auditCommand=@'
python3 - <<'PY'
import http.client,ssl,json,re,pathlib
cases=[('/',60),('/catalog',60),('/products/elegant-pleated-maxi-dress',60),('/about',600),('/contact',600),('/custom-orders',600),('/faq',600),('/markets/kenya',600),('/wholesale/african-dresses',600),('/inquiry',None),('/admin/login',None),('/robots.txt',None),('/sitemap.xml',None),('/llms.txt',None),('/manifest.webmanifest',None)]
checks=[]
def request(path,headers={}):
    c=http.client.HTTPSConnection('127.0.0.1',2054,context=ssl._create_unverified_context(),timeout=30)
    c.request('GET',path,headers={'Host':'zamique.com',**headers})
    r=c.getresponse();status=r.status;h={k.lower():v for k,v in r.getheaders()};r.read();c.close();return status,h
for path,ttl in cases:
    status,headers=request(path)
    etag=headers.get('etag');cc=headers.get('cache-control','')
    shared_ttl=re.search(r'\bs-maxage=(\d+)\b',cc)
    ttl_valid=shared_ttl is not None and int(shared_ttl[1])==ttl if ttl else '31536000' not in cc
    checks.append({'path':path,'status':status,'conditional':False,'cache_control':cc,
        'passed':status==200 and (('no-store' in cc and 'private' in cc) if path in ['/inquiry','/admin/login'] else ttl_valid)})
    if etag:
        status,h=request(path,{'If-None-Match':etag});conditional=h.get('cache-control','')
        checks.append({'path':path,'status':status,'conditional':True,'cache_control':conditional,
            'passed':status==304 and conditional==cc})
status,h=request('/_next/static/chunks/255-a094779b3fb6e8c7.js')
checks.append({'path':'immutable JavaScript','status':status,'cache_control':h.get('cache-control'),
    'passed':status==200 and 'immutable' in h.get('cache-control','') and '31536000' in h.get('cache-control','')})
for path in ['/nonexistent-seo-audit-page','/products/nonexistent-seo-audit-product']:
    status,h=request(path);cc=h.get('cache-control','')
    checks.append({'path':path,'status':status,'cache_control':cc,'passed':status==404 and 'no-store' in cc})
result={'checks':checks,'failures':[x for x in checks if not x['passed']]}
pathlib.Path('/backup/zamique-continuation-20261001/origin-cache-policy-verification.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result))
assert not result['failures']
PY
'@
& "$PSScriptRoot\remote-exec.ps1" -Command $auditCommand -Timeout 90
