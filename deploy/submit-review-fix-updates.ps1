# Notify IndexNow only about high-value public pages changed by the review release.
# Preview is the default; -Apply performs the single external submission.
param([switch]$Apply)
$ErrorActionPreference = 'Stop'

$command = @'
set -euo pipefail
python3 - <<'PY'
import datetime, hashlib, hmac, json, pathlib, re, time, urllib.request

apply = __APPLY__
release = pathlib.Path('/var/www/zamique-current').resolve()
backup = pathlib.Path('/backup/zamique-20261006-jack-fashion-review-fix-r2')
assert release.name == '20261006-jack-fashion-review-fix-r2'
audit = json.loads((backup / 'production-crawl.json').read_text())
assert audit['passed'] and audit['sitemap_count'] == 169

paths = [
    '/',
    '/catalog',
    '/about',
    '/faq',
    '/guides',
    '/guides/wholesale-moq',
    '/buying-guide',
    '/terms',
    '/wholesale/african-dresses',
    '/wholesale/two-piece-sets',
    '/wholesale/plus-size-womens-clothing',
    '/wholesale/ready-stock',
]
urls = ['https://zamique.com' + path for path in paths]
opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
opener.addheaders = [('User-Agent', 'JackFashionOwnerSEO/1.0')]
for url in urls:
    with opener.open(url, timeout=30) as response:
        html = response.read().decode('utf-8')
    assert response.status == 200 and 'Jack Fashion' in html, url
    assert not re.search(r'\b100\s*(?:pieces|pcs)\b', html, re.I), url

key = pathlib.Path('/var/www/zamique-indexnow/indexnow-key.txt').read_text().strip()
with opener.open('https://zamique.com/indexnow-key.txt', timeout=30) as response:
    assert response.status == 200 and response.read().decode().strip() == key

build_id = (release / '.next/BUILD_ID').read_text().strip()
change = 'review-fix-r2-' + build_id
revision = hashlib.sha256(change.encode()).hexdigest()
result = {
    'at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'applied': apply,
    'release': release.name,
    'build_id': build_id,
    'url_count': len(urls),
    'urls': urls,
    'revision': revision,
    'key_verified_publicly': True,
}

if apply:
    env = {}
    for line in (release / '.env.local').read_text().splitlines():
        if '=' in line and not line.lstrip().startswith('#'):
            name, value = line.split('=', 1)
            env[name.strip()] = value.strip().strip('"\'')
    secret = env['ADMIN_SECRET']
    assert len(secret) >= 32
    expires = str(int(time.time() * 1000) + 60_000)
    signature = hmac.new(secret.encode(), expires.encode(), hashlib.sha256).hexdigest()
    request = urllib.request.Request(
        'http://127.0.0.1:3200/api/admin/indexnow',
        data=json.dumps({'paths': paths, 'change': change}).encode(),
        headers={
            'Content-Type': 'application/json',
            'Origin': 'https://zamique.com',
            'Cookie': 'jack_admin_session=' + expires + '.' + signature,
        },
        method='POST',
    )
    with opener.open(request, timeout=30) as response:
        assert response.status == 200
        state = json.loads(response.read())
    assert state['ok']
    latest = state['receipts'][0] if state['receipts'] else None
    assert latest and latest['state'] == 'received' and latest['httpStatus'] in (200, 202)
    result.update({
        'pending_count': len(state['pending']),
        'received_url_count': sum(
            state['successful'].get(url, {}).get('token') == revision for url in urls
        ),
        'latest_receipt': latest,
        'meaning': 'Received by IndexNow; not proof of indexing, ranking or AI citation.',
    })
    assert result['received_url_count'] == len(urls)
    (backup / 'indexnow-targeted-submission.json').write_text(json.dumps(result, indent=2))

print(json.dumps(result))
PY
'@

$output = & "$PSScriptRoot\remote-exec.ps1" -Command $command.Replace('__APPLY__', $(if ($Apply) { 'True' } else { 'False' })) -Timeout 100
if (-not $?) { throw 'Targeted search notification failed' }
$evidenceDir = Join-Path $PSScriptRoot '..\artifacts\remediation-20261006'
New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null
$output | Tee-Object -FilePath (Join-Path $evidenceDir 'indexnow-targeted-submission.json')
