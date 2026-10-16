# A scoped UI/assets release. Business records remain in the existing shared directory.
param(
  [ValidateSet('Stage','Activate','Rollback','Cleanup')][string]$Phase = 'Stage',
  [ValidatePattern('^20261004-jack-fashion-market-editorials-r[0-9]+$')][string]$ReleaseId = '20261004-jack-fashion-market-editorials-r1'
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\config.ps1"
Import-Module Posh-SSH -ErrorAction Stop
if ($RemoteDir -ne '/var/www/zamique-current' -or $Pm2AppName -ne 'jack-fashion') { throw 'Wrong deployment target' }
$credential = Import-Clixml -LiteralPath $CredFile
$artifact = Join-Path $ProjectRoot 'artifacts\jack-fashion-market-editorials-20261004'
$release = "/var/www/zamique-releases/$ReleaseId"
$backup = "/backup/zamique-$ReleaseId"

if ($Phase -eq 'Stage') {
  $archive = Join-Path $artifact ($ReleaseId + '.tar.gz')
  Push-Location $ProjectRoot
  try {
    tar.exe -czf $archive 'src/components/home/MarketCollections.tsx' 'src/components/home/homepage.module.css' 'src/app/markets/[country]/page.tsx' 'src/lib/marketEditorials.ts' 'src/lib/generated/imageVariants.json' public/images/market-editorials
    if ($LASTEXITCODE -ne 0) { throw 'Archive failed' }
  } finally { Pop-Location }
  $sftp = New-SFTPSession -ComputerName $VPS_HOST -Credential $credential -AcceptKey
  try { Set-SFTPItem -SessionId $sftp.SessionId -Path $archive -Destination '/tmp' -Force }
  finally { Remove-SFTPSession -SessionId $sftp.SessionId | Out-Null }
}

$stage = @'
set -euo pipefail
umask 077
release=__RELEASE__
backup=__BACKUP__
live=$(readlink -f /var/www/zamique-current)
test "$live" = /var/www/zamique-releases/20261004-jack-fashion-image-display-r1
test ! -e "$release" && test ! -e "$backup"
test "$(df -Pm /var/www | awk 'NR==2{print $4}')" -gt 1000
if pm2 describe jack-fashion-market-editorials-stage >/dev/null 2>&1; then exit 22; fi
python3 - "$live" <<'PY'
import hashlib,json,pathlib,subprocess,sys,tarfile
p=pathlib.Path(sys.argv[1]);apps=json.loads(subprocess.check_output(['pm2','jlist']))
app=next(a for a in apps if a['name']=='jack-fashion');e=app['pm2_env']
assert e['pm_cwd']==str(p) and e['status']=='online'
assert e.get('JACK_FASHION_RUNTIME_DATA_DIR')=='/var/www/zamique-shared/runtime-data'
expected={'src/components/home/MarketCollections.tsx': 'd9cfb77548a74568dce6d055b202b63a9ec1f2e0b7e862d42a4db7a61d24b4b8', 'src/components/home/homepage.module.css': '05a230ab3fbc59589f7f1a403e6fb8fe20c8c7d12e73187a302e8b1ea4387ce3', 'src/app/markets/[country]/page.tsx': 'c2bb1e2f1c707b4b49d6deb26ab64f910ab5cde4783df0676ccdedf0b8410507', 'src/lib/generated/imageVariants.json': 'a9ce5fa427b86f720306849647f1f4acb72f98e253d7819b410aa5f354435007'}
for name,h in expected.items(): assert hashlib.sha256((p/name).read_bytes()).hexdigest()==h,name
assert not (p/'public/images/market-editorials').exists()
files={'src/lib/generated/imageVariants.json', 'src/components/home/MarketCollections.tsx', 'src/lib/marketEditorials.ts', 'src/components/home/homepage.module.css', 'src/app/markets/[country]/page.tsx'}
with tarfile.open('/tmp/__ID__.tar.gz') as t:
 for item in t.getmembers():
  name=pathlib.PurePosixPath(item.name)
  assert not name.is_absolute() and '..' not in name.parts and not item.issym() and not item.islnk()
  assert (item.isfile() and (item.name in files or (item.name.startswith('public/images/market-editorials/') and item.name.endswith('.webp')))) or (item.isdir() and item.name.rstrip('/')=='public/images/market-editorials'),item.name
PY
mkdir -m 700 "$release" "$backup" "$backup/stage-data"
printf '%s\n' "$live" > "$backup/previous-release.txt"
cp /etc/nginx/sites-available/zamique "$backup/nginx-before.conf"
tar -czf "$backup/source-data-env-before.tar.gz" -C "$live" src data/products.json data/site-content.json .env.local
tar -czf "$backup/runtime-before.tar.gz" -C /var/www/zamique-shared runtime-data
sha256sum "$live/data/products.json" "$live/data/site-content.json" "$live/package.json" "$live/package-lock.json" > "$backup/live-data-before.sha256"
cp -a "$live/src" "$live/scripts" "$live/.env.local" "$live/package.json" "$live/package-lock.json" "$live/next.config.ts" "$live/ecosystem.config.cjs" "$live/tsconfig.json" "$live/next-env.d.ts" "$live/eslint.config.mjs" "$live/postcss.config.mjs" "$release/"
cp -al "$live/node_modules" "$live/.runtime" "$live/public" "$release/"
mkdir "$release/data"
for item in "$live/data/"*; do
  if test "$(basename "$item")" = raw-assets; then
    test -d "$item" && test ! -L "$item"
    cp -al "$item" "$release/data/"
  else
    cp -a "$item" "$release/data/"
  fi
done
tar -xzf /tmp/__ID__.tar.gz -C "$release"
python3 - "$live" "$release" "$backup" <<'PY'
import hashlib,json,pathlib,sys
live,release,backup=map(pathlib.Path,sys.argv[1:])
before=json.loads((live/'src/lib/generated/imageVariants.json').read_text())
after=json.loads((release/'src/lib/generated/imageVariants.json').read_text())
assert all(after.get(k)==v for k,v in before.items()),'Existing image variants changed'
added=set(after)-set(before)
assert len(added)==5 and all(k.startswith('/images/market-editorials/') for k in added),'Unexpected image variant additions'
for k in added:
 assert (release/'public'/k.lstrip('/')).is_file()
 assert len(after[k])==8
 for v in after[k].values(): assert (release/'public'/v.lstrip('/')).is_file()
env=release/'.env.local'
lines=[l for l in env.read_text().splitlines() if not l.startswith(('JACK_FASHION_RUNTIME_DATA_DIR=','JACK_FASHION_INDEXNOW_ENABLED=','NEXT_DEPLOYMENT_ID='))]
revision=hashlib.sha256(pathlib.Path('/tmp/__ID__.tar.gz').read_bytes()).hexdigest()[:12]
lines+=['JACK_FASHION_RUNTIME_DATA_DIR='+str(backup/'stage-data'),'JACK_FASHION_INDEXNOW_ENABLED=0','NEXT_DEPLOYMENT_ID=__ID__-'+revision]
env.write_text('\n'.join(lines)+'\n');env.chmod(0o600)
PY
cd "$release"
nodebin="$release/.runtime/node-v22.23.3-linux-x64/bin/node"
test "$("$nodebin" --version)" = v22.23.3
if ! NODE_OPTIONS='--max-old-space-size=768' nice -n 10 "$nodebin" node_modules/next/dist/bin/next build > "$backup/build.log" 2>&1; then tail -n 50 "$backup/build.log"; exit 25; fi
"$nodebin" scripts/public-site-inventory.mjs "$backup/public-inventory.json"
cp -an "$live/.next/static/." "$release/.next/static/"
PORT=3211 PM2_APP_NAME=jack-fashion-market-editorials-stage JACK_FASHION_RUNTIME_DATA_DIR="$backup/stage-data" JACK_FASHION_INDEXNOW_ENABLED=0 ZAMIQUE_NODE_BIN="$nodebin" pm2 start ecosystem.config.cjs --only jack-fashion-market-editorials-stage
curl --noproxy '*' --retry 15 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3211/about -o /dev/null
python3 scripts/verify-public-pages.py --base http://127.0.0.1:3211 --expected 99 --output "$backup/stage-verification.json"
python3 - "$release" <<'PY'
import json,pathlib,urllib.request,sys
p=pathlib.Path(sys.argv[1]);m=json.loads((p/'src/lib/generated/imageVariants.json').read_text());opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
regions=['africa','middle-east','europe-north-america','latin-america','southeast-asia']
for path in ['/','/about','/markets']:
 html=opener.open('http://127.0.0.1:3211'+path).read().decode()
 assert html.count('data-market-collection=')==5,path
 assert 'Explore collection inspiration' in html,path
for slug in regions:
 html=opener.open('http://127.0.0.1:3211/markets/'+slug).read().decode()
 assert html.count('data-market-editorial=')==1 and 'Collection inspiration.' in html,slug
 assert 'https://wa.me/message/3N5VOJCFAQIGO1' in html,slug
assets=0
for key,value in m.items():
 if not key.startswith('/images/market-editorials/'): continue
 for asset in [key,*value.values()]:
  with opener.open('http://127.0.0.1:3211'+asset) as r: assert r.status==200 and r.headers.get_content_type()=='image/webp',asset
  assets+=1
assert assets==45,assets
print('FIVE_COLLECTIONS_AND_45_ASSETS_VERIFIED')
PY
echo STAGE_VERIFIED
'@

$activate = @'
set -euo pipefail
umask 077
release=__RELEASE__
backup=__BACKUP__
live=$(cat "$backup/previous-release.txt")
shared=/var/www/zamique-shared/runtime-data
test "$(readlink -f /var/www/zamique-current)" = "$live"
sha256sum -c "$backup/live-data-before.sha256"
cmp "$backup/nginx-before.conf" /etc/nginx/sites-available/zamique
python3 - "$backup" <<'PY'
import json,pathlib,sys
p=pathlib.Path(sys.argv[1]);a=json.loads((p/'stage-verification.json').read_text());i=json.loads((p/'public-inventory.json').read_text())
assert a['passed'] and a['sitemap_count']==i['count']==99 and a['base']=='http://127.0.0.1:3211'
PY
curl --noproxy '*' -fsS http://127.0.0.1:3211/about -o /dev/null
pm2 delete jack-fashion-market-editorials-stage
rollback() {
  set +e
  pm2 delete jack-fashion >/dev/null 2>&1
  if ! ln -s "$live" /var/www/zamique-current.illustrations-rollback || ! mv -Tf /var/www/zamique-current.illustrations-rollback /var/www/zamique-current; then echo ROLLBACK_SWITCH_FAILED; return 1; fi
  if ! cd "$live"; then echo ROLLBACK_DIRECTORY_FAILED; return 1; fi
  if ! PORT=3200 PM2_APP_NAME=jack-fashion JACK_FASHION_RUNTIME_DATA_DIR="$shared" JACK_FASHION_INDEXNOW_ENABLED=1 ZAMIQUE_NODE_BIN="$live/.runtime/node-v22.23.3-linux-x64/bin/node" pm2 start ecosystem.config.cjs --only jack-fashion; then echo ROLLBACK_START_FAILED; return 1; fi
  if ! curl --noproxy '*' --retry 15 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3200/about -o /dev/null; then echo ROLLBACK_HEALTH_FAILED; return 1; fi
  pm2 save
  echo ACTIVATION_ROLLED_BACK_SHARED_DATA_RETAINED
}
trap rollback ERR
pm2 delete jack-fashion
# Detect backend edits before replacing the running process. No runtime records are copied back.
sha256sum -c "$backup/live-data-before.sha256"
tar -czf "$backup/runtime-at-cutover.tar.gz" -C /var/www/zamique-shared runtime-data
python3 - "$live" "$release" "$shared" "$backup" <<'PY'
import hashlib,json,pathlib,shutil,sys
live,release,shared,backup=map(pathlib.Path,sys.argv[1:])
uploads=live/'public/uploads'
if uploads.exists():
 for source in uploads.rglob('*'):
  target=release/'public/uploads'/source.relative_to(uploads)
  if source.is_dir(): target.mkdir(parents=True,exist_ok=True)
  elif source.is_file():
   target.parent.mkdir(parents=True,exist_ok=True)
   if target.exists() and source.samefile(target): continue
   if target.exists():
    assert target.resolve().is_relative_to(release/'public/uploads')
    target.unlink()
   shutil.copy2(source,target)
env=release/'.env.local'
lines=[l for l in env.read_text().splitlines() if not l.startswith(('JACK_FASHION_RUNTIME_DATA_DIR=','JACK_FASHION_INDEXNOW_ENABLED='))]
lines+=['JACK_FASHION_RUNTIME_DATA_DIR='+str(shared),'JACK_FASHION_INDEXNOW_ENABLED=1']
env.write_text('\n'.join(lines)+'\n');env.chmod(0o600)
snap={}
for f in shared.glob('*.json'):
 snap[f.name]={'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'bytes':f.stat().st_size}
 if f.name=='analytics.json': snap[f.name]['totals']=json.loads(f.read_text()).get('totals')
(backup/'runtime-at-cutover.json').write_text(json.dumps(snap,indent=2))
PY
ln -s "$release" /var/www/zamique-current.illustrations-new
mv -Tf /var/www/zamique-current.illustrations-new /var/www/zamique-current
cd "$release"
PORT=3200 PM2_APP_NAME=jack-fashion JACK_FASHION_RUNTIME_DATA_DIR="$shared" JACK_FASHION_INDEXNOW_ENABLED=1 ZAMIQUE_NODE_BIN="$release/.runtime/node-v22.23.3-linux-x64/bin/node" pm2 start ecosystem.config.cjs --only jack-fashion
curl --noproxy '*' --retry 15 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3200/about -o /dev/null
python3 - "$shared" "$backup" <<'PY'
import hashlib,json,pathlib,sys
shared,backup=map(pathlib.Path,sys.argv[1:]);before=json.loads((backup/'runtime-at-cutover.json').read_text())
for name,snapshot in before.items():
 f=shared/name
 assert f.exists(),name
 if name=='analytics.json':
  now=json.loads(f.read_text())['totals']
  assert all(now.get(k,0)>=v for k,v in snapshot['totals'].items()),name
 else: assert hashlib.sha256(f.read_bytes()).hexdigest()==snapshot['sha256'],name
print('SHARED_BUSINESS_RECORDS_RETAINED')
PY
pm2 save
trap - ERR
echo ACTIVATION_OK
'@

$rollback = @'
set -euo pipefail
release=__RELEASE__
backup=__BACKUP__
live=$(cat "$backup/previous-release.txt")
shared=/var/www/zamique-shared/runtime-data
test "$(readlink -f /var/www/zamique-current)" = "$release"
pm2 delete jack-fashion
python3 - "$release" "$live" "$backup" <<'PY'
import pathlib,shutil,sys
release,live,backup=map(pathlib.Path,sys.argv[1:])
assert release.resolve().parent==live.resolve().parent==pathlib.Path('/var/www/zamique-releases')
preserved=backup/'catalog-at-rollback';preserved.mkdir(mode=0o700,exist_ok=True)
for name in ['products.json','site-content.json']:
 source=release/'data'/name;target=live/'data'/name
 shutil.copy2(source,preserved/name)
 shutil.copy2(source,target)
uploads=release/'public/uploads'
if uploads.exists():
 for source in uploads.rglob('*'):
  target=live/'public/uploads'/source.relative_to(uploads)
  if source.is_dir(): target.mkdir(parents=True,exist_ok=True)
  elif source.is_file():
   target.parent.mkdir(parents=True,exist_ok=True)
   if target.exists() and source.samefile(target): continue
   if target.exists():
    assert target.resolve().is_relative_to(live/'public/uploads')
    target.unlink()
   shutil.copy2(source,target)
PY
ln -s "$live" /var/www/zamique-current.illustrations-rollback
mv -Tf /var/www/zamique-current.illustrations-rollback /var/www/zamique-current
cd "$live"
PORT=3200 PM2_APP_NAME=jack-fashion JACK_FASHION_RUNTIME_DATA_DIR="$shared" JACK_FASHION_INDEXNOW_ENABLED=1 ZAMIQUE_NODE_BIN="$live/.runtime/node-v22.23.3-linux-x64/bin/node" pm2 start ecosystem.config.cjs --only jack-fashion
curl --noproxy '*' --retry 15 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3200/about -o /dev/null
pm2 save
echo ROLLBACK_OK_SHARED_DATA_RETAINED
'@
$cleanup = @'
set -euo pipefail
if pm2 describe jack-fashion-market-editorials-stage >/dev/null 2>&1; then pm2 delete jack-fashion-market-editorials-stage; fi
python3 - <<'PY'
import datetime,json,pathlib,shutil,subprocess,urllib.request
release=pathlib.Path('__RELEASE__');backup=pathlib.Path('__BACKUP__');cache=release/'.next/cache/webpack'
assert pathlib.Path('/var/www/zamique-current').resolve()==release
assert cache.resolve()==pathlib.Path('/var/www/zamique-releases/__ID__/.next/cache/webpack')
assert not cache.is_symlink()
removed=sum(p.stat().st_size for p in cache.rglob('*') if p.is_file()) if cache.exists() else 0
if cache.exists(): shutil.rmtree(cache)
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
with opener.open('http://127.0.0.1:3200/about',timeout=20) as response:
 assert response.status==200 and response.read().decode().count('data-market-collection=')==5
result={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'only_removed':str(cache),'removed_bytes':removed,'free_mb':int(subprocess.check_output(['df','-Pm','/var/www']).decode().splitlines()[1].split()[3]),'runtime_health':200,'historical_releases_and_backups_preserved':True}
(backup/'build-cache-cleanup.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result))
PY
echo TEMPORARY_STAGE_PROCESS_STOPPED
'@
$script = switch ($Phase) { 'Stage' {$stage} 'Activate' {$activate} 'Rollback' {$rollback} 'Cleanup' {$cleanup} }
$script = $script.Replace('__RELEASE__',$release).Replace('__BACKUP__',$backup).Replace('__ID__',$ReleaseId)
$session = New-SSHSession -ComputerName $VPS_HOST -Credential $credential -AcceptKey
try {
  $result = Invoke-SSHCommand -SessionId $session.SessionId -Command $script -TimeOut $(if ($Phase -eq 'Stage') {600} else {120})
  $result.Output | Tee-Object -FilePath (Join-Path $artifact ($ReleaseId + '-' + $Phase.ToLowerInvariant() + '.txt'))
  if ($result.Error) { Write-Output $result.Error }
  if ($result.ExitStatus -ne 0) { throw "Release failed: $($result.ExitStatus)" }
} finally { Remove-SSHSession -SessionId $session.SessionId | Out-Null }
