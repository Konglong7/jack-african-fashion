# Isolated release, final analytics copy after stopping its sole writer, reversible activation.
param(
  [ValidateSet('Stage','Patch','Activate','Rollback')][string]$Phase = 'Stage',
  [ValidatePattern('^20261003-jack-fashion-seo-ai-[a-z0-9-]+$')][string]$ReleaseId = '20261003-jack-fashion-seo-ai-r1'
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\config.ps1"
Import-Module Posh-SSH -ErrorAction Stop
if ($RemoteDir -ne '/var/www/zamique-current' -or $Pm2AppName -ne 'jack-fashion') { throw 'Wrong deployment target' }
$credential = Import-Clixml -LiteralPath $CredFile
$release = "/var/www/zamique-releases/$ReleaseId"
$backup = "/backup/zamique-$ReleaseId"
$artifact = Join-Path $ProjectRoot 'artifacts\jack-fashion-seo-ai-20261003'
function Run-Remote([string]$Command, [int]$Timeout) {
  $session = New-SSHSession -ComputerName $VPS_HOST -Credential $credential -AcceptKey
  try {
    $result = Invoke-SSHCommand -SessionId $session.SessionId -Command $Command -TimeOut $Timeout
    Write-Output $result.Output
    if ($result.Error) { Write-Output $result.Error }
    if ($result.ExitStatus -ne 0) { throw "Release failed: $($result.ExitStatus)" }
  } finally { Remove-SSHSession -SessionId $session.SessionId | Out-Null }
}
if ($Phase -in @('Stage','Patch')) {
  $archive = Join-Path $artifact ($ReleaseId + '.tar.gz')
  Push-Location $ProjectRoot
  try {
    tar.exe -czf $archive src scripts next.config.ts ecosystem.config.cjs package.json package-lock.json tsconfig.json next-env.d.ts eslint.config.mjs postcss.config.mjs public/llms.txt public/llms-full.txt public/images/garment-examples
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
test "$live" = /var/www/zamique-releases/20261003-jack-fashion-global-r1
test "$(sha256sum "$live/data/products.json" | cut -d' ' -f1)" = c2ed30e6d13efd5b8a9d7d8fcf291002a699835f4e13774e5be63d0988543f31
test "$(sha256sum "$live/data/site-content.json" | cut -d' ' -f1)" = 14b1daafa34c6815b9b252ba1666a77fdf5f934fee186aa1a756a4c3ad93a465
test "$(df -Pm /var/www | awk 'NR==2{print $4}')" -gt 1000
if test '__PHASE__' = Stage; then
  test ! -e "$release" && test ! -e "$backup"
  if pm2 describe jack-fashion-seo-stage >/dev/null 2>&1; then exit 22; fi
  mkdir -m 700 "$backup" "$release" "$backup/stage-data"
  printf '%s\n' "$live" > "$backup/previous-release.txt"
  cp /etc/nginx/sites-available/zamique "$backup/nginx-before.conf"
  tar -czf "$backup/data-env-before.tar.gz" -C "$live" data .env.local
  sha256sum "$live/data/products.json" "$live/data/site-content.json" > "$backup/live-data-before.sha256"
  if test -f "$live/data/analytics.json"; then cp -p "$live/data/analytics.json" "$backup/stage-data/analytics.json"; fi
  cp -a "$live/src" "$live/data" "$live/.env.local" "$live/package.json" "$live/package-lock.json" "$live/next.config.ts" "$live/ecosystem.config.cjs" "$live/tsconfig.json" "$live/next-env.d.ts" "$live/eslint.config.mjs" "$live/postcss.config.mjs" "$release/"
  cp -al "$live/node_modules" "$live/.runtime" "$live/public" "$release/"
else
  test "$live" = "$(cat "$backup/previous-release.txt")"
  if pm2 describe jack-fashion-seo-stage >/dev/null 2>&1; then pm2 delete jack-fashion-seo-stage; fi
fi
case "$(readlink -f "$release")" in /var/www/zamique-releases/20261003-jack-fashion-seo-ai-*) ;; *) exit 24;; esac
rm -f -- "$release/public/llms.txt" "$release/public/llms-full.txt"
tar -xzf /tmp/__ID__.tar.gz -C "$release"
python3 - "$live" "$release" "$backup" <<'PY'
import hashlib,json,pathlib,sys
live,release,backup=map(pathlib.Path,sys.argv[1:])
for name in ['package.json','package-lock.json']:
    assert json.loads((live/name).read_text())==json.loads((release/name).read_text()),name
env=release/'.env.local'
lines=[line for line in env.read_text().splitlines() if not line.startswith(('JACK_FASHION_RUNTIME_DATA_DIR=','JACK_FASHION_INDEXNOW_ENABLED=','JACK_FASHION_INDEXNOW_KEY_FILE=','NEXT_DEPLOYMENT_ID='))]
revision=hashlib.sha256(pathlib.Path('/tmp/__ID__.tar.gz').read_bytes()).hexdigest()[:12]
lines+=['JACK_FASHION_RUNTIME_DATA_DIR='+str(backup/'stage-data'),'JACK_FASHION_INDEXNOW_ENABLED=0','JACK_FASHION_INDEXNOW_KEY_FILE=/var/www/zamique-indexnow/indexnow-key.txt','NEXT_DEPLOYMENT_ID=__ID__-'+revision]
env.write_text('\n'.join(lines)+'\n');env.chmod(0o600)
PY
cd "$release"
nodebin="$release/.runtime/node-v22.23.3-linux-x64/bin/node"
test "$("$nodebin" --version)" = v22.23.3
if ! NODE_OPTIONS='--max-old-space-size=768' nice -n 10 "$nodebin" node_modules/next/dist/bin/next build > "$backup/build.log" 2>&1; then tail -n 50 "$backup/build.log"; exit 25; fi
"$nodebin" scripts/public-site-inventory.mjs "$backup/public-inventory.json"
cp -an "$live/.next/static/." "$release/.next/static/"
PORT=3211 PM2_APP_NAME=jack-fashion-seo-stage ZAMIQUE_NODE_BIN="$nodebin" pm2 start ecosystem.config.cjs --only jack-fashion-seo-stage
curl --noproxy '*' --retry 15 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3211/guides -o /dev/null
count=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["count"])' "$backup/public-inventory.json")
python3 scripts/verify-public-pages.py --base http://127.0.0.1:3211 --expected "$count" --output "$backup/stage-verification.json"
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
p=pathlib.Path(sys.argv[1]);audit=json.loads((p/'stage-verification.json').read_text());inventory=json.loads((p/'public-inventory.json').read_text())
assert audit['passed'] and audit['sitemap_count']==inventory['count'] and audit['base']=='http://127.0.0.1:3211'
PY
curl --noproxy '*' -fsS http://127.0.0.1:3211/guides -o /dev/null
mkdir -p -m 700 "$shared"
if test -e "$shared/analytics.json"; then echo 'Inspect existing shared data before migration'; exit 26; fi
pm2 delete jack-fashion-seo-stage
shared_migrated=0
rollback() {
  set +e
  pm2 delete jack-fashion >/dev/null 2>&1
  if test "$shared_migrated" = 1; then
    if ! python3 "$release/scripts/preserve_rollback_data.py" "$release" "$live" "$shared" "$backup"; then echo ROLLBACK_DATA_COPY_FAILED; return 1; fi
  fi
  if ! ln -s "$live" /var/www/zamique-current.seo-rollback || ! mv -Tf /var/www/zamique-current.seo-rollback /var/www/zamique-current; then echo ROLLBACK_SWITCH_FAILED; return 1; fi
  if ! cd "$live"; then echo ROLLBACK_FAILED; return 1; fi
  if ! PORT=3200 PM2_APP_NAME=jack-fashion JACK_FASHION_RUNTIME_DATA_DIR="$live/data" JACK_FASHION_INDEXNOW_ENABLED=0 ZAMIQUE_NODE_BIN="$live/.runtime/node-v22.23.3-linux-x64/bin/node" pm2 start ecosystem.config.cjs --only jack-fashion; then echo ROLLBACK_START_FAILED; return 1; fi
  if ! curl --noproxy '*' --retry 15 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3200/catalog -o /dev/null; then echo ROLLBACK_HEALTH_FAILED; return 1; fi
  if ! pm2 save; then echo ROLLBACK_SAVE_FAILED; return 1; fi
  echo ACTIVATION_ROLLED_BACK
}
trap rollback ERR
pm2 delete jack-fashion
# Recheck after stopping the writer; a new backend edit requires rebuilding the stage.
sha256sum -c "$backup/live-data-before.sha256"
# There is no second writer during migration. Retain the final state after shutdown.
python3 "$release/scripts/runtime_data_copy.py" "$live/data/analytics.json" "$shared/analytics.json" --kind analytics
shared_migrated=1
cp -p "$shared/analytics.json" "$backup/analytics-at-cutover.json"
python3 - "$release" "$shared" "$backup" <<'PY'
import json,pathlib,sys
release,shared,backup=map(pathlib.Path,sys.argv[1:])
data=json.loads((shared/'analytics.json').read_text())
baseline={'totals':data['totals'],'recentCount':len(data['recent']),'knownVisitorCount':len(data.get('knownVisitors',[])),'statsStartedAt':data.get('statsStartedAt')}
(backup/'statistics-at-cutover.json').write_text(json.dumps(baseline,indent=2))
env=release/'.env.local'
lines=[line for line in env.read_text().splitlines() if not line.startswith(('JACK_FASHION_RUNTIME_DATA_DIR=','JACK_FASHION_INDEXNOW_ENABLED=','JACK_FASHION_INDEXNOW_KEY_FILE='))]
lines+=['JACK_FASHION_RUNTIME_DATA_DIR='+str(shared),'JACK_FASHION_INDEXNOW_ENABLED=1','JACK_FASHION_INDEXNOW_KEY_FILE=/var/www/zamique-indexnow/indexnow-key.txt']
env.write_text('\n'.join(lines)+'\n');env.chmod(0o600)
PY
ln -s "$release" /var/www/zamique-current.seo-new
mv -Tf /var/www/zamique-current.seo-new /var/www/zamique-current
cd "$release"
PORT=3200 PM2_APP_NAME=jack-fashion JACK_FASHION_RUNTIME_DATA_DIR="$shared" JACK_FASHION_INDEXNOW_ENABLED=1 JACK_FASHION_INDEXNOW_KEY_FILE=/var/www/zamique-indexnow/indexnow-key.txt ZAMIQUE_NODE_BIN="$release/.runtime/node-v22.23.3-linux-x64/bin/node" pm2 start ecosystem.config.cjs --only jack-fashion
curl --noproxy '*' --retry 15 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3200/guides -o /dev/null
pm2 save
trap - ERR
echo ACTIVATION_OK
'@
$rollback = @'
set -euo pipefail
umask 077
release=__RELEASE__
backup=__BACKUP__
live=$(cat "$backup/previous-release.txt")
shared=/var/www/zamique-shared/runtime-data
test "$(readlink -f /var/www/zamique-current)" = "$release"
pm2 delete jack-fashion
python3 "$release/scripts/preserve_rollback_data.py" "$release" "$live" "$shared" "$backup"
cp -p "$shared/analytics.json" "$backup/analytics-at-rollback.json"
ln -s "$live" /var/www/zamique-current.seo-rollback
mv -Tf /var/www/zamique-current.seo-rollback /var/www/zamique-current
cd "$live"
PORT=3200 PM2_APP_NAME=jack-fashion JACK_FASHION_RUNTIME_DATA_DIR="$live/data" JACK_FASHION_INDEXNOW_ENABLED=0 ZAMIQUE_NODE_BIN="$live/.runtime/node-v22.23.3-linux-x64/bin/node" pm2 start ecosystem.config.cjs --only jack-fashion
curl --noproxy '*' --retry 15 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3200/catalog -o /dev/null
pm2 save
echo ROLLBACK_OK
'@
$script = if ($Phase -in @('Stage','Patch')) { $stage } elseif ($Phase -eq 'Activate') { $activate } else { $rollback }
Run-Remote ($script.Replace('__RELEASE__',$release).Replace('__BACKUP__',$backup).Replace('__ID__',$ReleaseId).Replace('__PHASE__',$Phase)) $(if ($Phase -in @('Stage','Patch')) { 600 } else { 120 })
