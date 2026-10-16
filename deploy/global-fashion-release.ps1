# Source and reviewed catalog release. No image deletions or host runtime changes.
param(
  [ValidatePattern('^[a-z0-9-]{6,50}$')][string]$ReleaseId = '20261003-jack-fashion-global-r1',
  [ValidateSet('Stage','Patch','Activate','Cleanup','Rollback')][string]$Phase = 'Stage'
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\config.ps1"
Import-Module Posh-SSH -ErrorAction Stop
$credential = Import-Clixml -LiteralPath $CredFile
if ($RemoteDir -ne '/var/www/zamique-current' -or $Pm2AppName -ne 'jack-fashion') { throw 'Wrong website deployment target' }

function Invoke-ScopedRemote([string]$Command, [int]$Timeout = 60) {
  $session = New-SSHSession -ComputerName $VPS_HOST -Credential $credential -AcceptKey
  try {
    $result = Invoke-SSHCommand -SessionId $session.SessionId -Command $Command -TimeOut $Timeout
    Write-Output $result.Output
    if ($result.Error) { Write-Output $result.Error }
    if ($result.ExitStatus -ne 0) { throw "Scoped release failed: $($result.ExitStatus)" }
  } finally { Remove-SSHSession -SessionId $session.SessionId | Out-Null }
}
function Send-Archive([string]$Path) {
  $session = New-SFTPSession -ComputerName $VPS_HOST -Credential $credential -AcceptKey
  try { Set-SFTPItem -SessionId $session.SessionId -Path $Path -Destination '/tmp' -Force }
  finally { Remove-SFTPSession -SessionId $session.SessionId | Out-Null }
}

$releasePath = "/var/www/zamique-releases/$ReleaseId"
$backupPath = "/backup/zamique-$ReleaseId"
$lockFile = Join-Path $ProjectRoot 'package-lock.json'
$lockHash = & python -c "import hashlib,json,sys; print(hashlib.sha256(json.dumps(json.load(open(sys.argv[1])),sort_keys=True,separators=(',',':')).encode()).hexdigest())" $lockFile
if ($LASTEXITCODE -ne 0 -or $lockHash -notmatch '^[0-9a-f]{64}$') { throw 'Dependency lock validation failed' }
$script = ''
if ($Phase -in @('Stage','Patch')) {
  $artifact = Join-Path $ProjectRoot 'artifacts\jack-fashion-global-20261003'
  New-Item -ItemType Directory -Path $artifact -Force | Out-Null
  $archive = Join-Path $artifact "$ReleaseId.tar.gz"
  Push-Location $ProjectRoot
  try {
    & tar -czf $archive src scripts next.config.ts ecosystem.config.cjs eslint.config.mjs tsconfig.json package.json package-lock.json data/products.json data/site-content.json public/llms.txt public/llms-full.txt public/images/site/jack-fashion-logo-192.png public/images/site/jack-fashion-logo-512.png public/images/site/jack-fashion-social.png public/images/site/jack-fashion-social.svg
    if ($LASTEXITCODE -ne 0) { throw 'Release archive failed' }
  } finally { Pop-Location }
  Send-Archive $archive
  $script = @'
set -euo pipefail
umask 077
live=$(readlink -f /var/www/zamique-current)
release=__RELEASE__
backup=__BACKUP__
case "$live" in /var/www/zamique-releases/*) ;; *) exit 20;; esac
case "$release" in /var/www/zamique-releases/20261003-jack-fashion-global-*) ;; *) exit 21;; esac
test "$live" != "$release"
test ! -e "$release" && test ! -e "$backup"
test "$(python3 -c 'import hashlib,json,sys; print(hashlib.sha256(json.dumps(json.load(open(sys.argv[1])),sort_keys=True,separators=(",",":")).encode()).hexdigest())' "$live/package-lock.json")" = '__LOCK__'
test "$(sha256sum "$live/data/products.json" | cut -d' ' -f1)" = 'b529dc620d597005ac1938ffe5320fec57c5fff00e4943a45ffbb9511d718c9e'
test "$(sha256sum "$live/data/site-content.json" | cut -d' ' -f1)" = '62a79d4ce64560dd2d1b001b73ac7acb31a62db32bfb034692a48f2bd583eafb'
test "$(df -Pm /var/www | awk 'NR==2{print $4}')" -gt 1000
if pm2 describe jack-fashion-global-stage >/dev/null 2>&1; then exit 22; fi
mkdir -m 700 "$backup"
printf '%s\n' "$live" > "$backup/previous-release.txt"
cp /etc/nginx/sites-available/zamique "$backup/nginx-before.conf"
pm2 jlist > "$backup/pm2-before.json"
tar -czf "$backup/data-env-before.tar.gz" -C "$live" data .env.local
sha256sum "$live/data/products.json" "$live/data/site-content.json" > "$backup/live-data-before.sha256"
mkdir "$release"
cp -a "$live/src" "$live/data" "$live/.env.local" "$live/package.json" "$live/package-lock.json" "$live/next.config.ts" "$live/ecosystem.config.cjs" "$live/tsconfig.json" "$live/next-env.d.ts" "$live/eslint.config.mjs" "$live/postcss.config.mjs" "$release/"
cp -al "$live/node_modules" "$live/.runtime" "$live/public" "$release/"
# Detach overwritten static files from their immutable hard links before extraction.
rm -f -- "$release/public/llms.txt" "$release/public/llms-full.txt"
tar -xzf /tmp/__ID__.tar.gz -C "$release"
chmod 600 "$release/.env.local"
cd "$release"
nodebin="$release/.runtime/node-v22.23.3-linux-x64/bin/node"
test "$("$nodebin" --version)" = v22.23.3
python3 - "$live" "$release" <<'PY'
import json,pathlib,sys
for file in ['package.json','package-lock.json']:
    assert json.loads((pathlib.Path(sys.argv[1])/file).read_text()) == json.loads((pathlib.Path(sys.argv[2])/file).read_text()),file
print('Dependency manifests match semantically; existing modules retained.')
PY
NODE_OPTIONS='--max-old-space-size=768' nice -n 10 "$nodebin" node_modules/next/dist/bin/next build
cp -an "$live/.next/static/." "$release/.next/static/"
PORT=3211 PM2_APP_NAME=jack-fashion-global-stage ZAMIQUE_NODE_BIN="$nodebin" pm2 start ecosystem.config.cjs --only jack-fashion-global-stage
for i in $(seq 1 30); do
  if curl --noproxy '*' -fsS http://127.0.0.1:3211/markets/middle-east -o /dev/null; then echo STAGE_READY; exit 0; fi
  sleep 1
done
exit 23
'@
  if ($Phase -eq 'Patch') {
    $script = @'
set -euo pipefail
release=__RELEASE__
backup=__BACKUP__
live=$(readlink -f /var/www/zamique-current)
case "$release" in /var/www/zamique-releases/20261003-jack-fashion-global-*) ;; *) exit 21;; esac
test "$live" != "$release"
test "$live" = "$(cat "$backup/previous-release.txt")"
sha256sum -c "$backup/live-data-before.sha256"
pm2 delete jack-fashion-global-stage
rm -f -- "$release/public/llms.txt" "$release/public/llms-full.txt"
tar -xzf /tmp/__ID__.tar.gz -C "$release"
cd "$release"
python3 - "$live" "$release" <<'PY'
import json,pathlib,sys
for file in ['package.json','package-lock.json']:
    assert json.loads((pathlib.Path(sys.argv[1])/file).read_text()) == json.loads((pathlib.Path(sys.argv[2])/file).read_text()),file
PY
nodebin="$release/.runtime/node-v22.23.3-linux-x64/bin/node"
NODE_OPTIONS='--max-old-space-size=768' nice -n 10 "$nodebin" node_modules/next/dist/bin/next build
cp -an "$live/.next/static/." "$release/.next/static/"
PORT=3211 PM2_APP_NAME=jack-fashion-global-stage ZAMIQUE_NODE_BIN="$nodebin" pm2 start ecosystem.config.cjs --only jack-fashion-global-stage
for i in $(seq 1 30); do
  if curl --noproxy '*' -fsS http://127.0.0.1:3211/markets/middle-east -o /dev/null; then echo STAGE_PATCH_READY; exit 0; fi
  sleep 1
done
exit 23
'@
  }
} elseif ($Phase -eq 'Activate') {
  $script = @'
set -euo pipefail
release=__RELEASE__
backup=__BACKUP__
live=$(cat "$backup/previous-release.txt")
test "$(readlink -f /var/www/zamique-current)" = "$live"
sha256sum -c "$backup/live-data-before.sha256"
python3 - "$backup/stage-verification.json" <<'PY'
import json,sys
audit=json.load(open(sys.argv[1]))
assert audit['passed'] and audit['sitemap_count']==92 and audit['base']=='http://127.0.0.1:3211'
PY
curl --noproxy '*' -fsS http://127.0.0.1:3211/markets/middle-east -o /dev/null
nodebin="$release/.runtime/node-v22.23.3-linux-x64/bin/node"
rollback() {
  set +e
  cp "$backup/nginx-before.conf" /etc/nginx/sites-available/zamique
  pm2 delete jack-fashion
  cd "$live"
  PORT=3200 PM2_APP_NAME=jack-fashion ZAMIQUE_NODE_BIN="$live/.runtime/node-v22.23.3-linux-x64/bin/node" pm2 start ecosystem.config.cjs --only jack-fashion
  if test "$(readlink -f /var/www/zamique-current)" != "$live"; then ln -s "$live" /var/www/zamique-current.global-rollback; mv -Tf /var/www/zamique-current.global-rollback /var/www/zamique-current; fi
  nginx -t && systemctl reload nginx
  pm2 save
  echo ACTIVATION_ROLLED_BACK
}
trap rollback ERR
test "$(grep -c '127.0.0.1:3200' "$backup/nginx-before.conf")" -ge 1
sed 's/127.0.0.1:3200/127.0.0.1:3211/g' "$backup/nginx-before.conf" > /etc/nginx/sites-available/zamique
nginx -t
systemctl reload nginx
if test -f "$live/data/analytics.json"; then cp -p "$live/data/analytics.json" "$release/data/analytics.json"; fi
pm2 delete jack-fashion
cd "$release"
PORT=3200 PM2_APP_NAME=jack-fashion ZAMIQUE_NODE_BIN="$nodebin" pm2 start ecosystem.config.cjs --only jack-fashion
ready=0
for i in $(seq 1 30); do
  if curl --noproxy '*' -fsS http://127.0.0.1:3200/markets/middle-east -o /dev/null; then ready=1; break; fi
  sleep 1
done
test "$ready" = 1
cp "$backup/nginx-before.conf" /etc/nginx/sites-available/zamique
nginx -t
systemctl reload nginx
ln -s "$release" /var/www/zamique-current.global-new
mv -Tf /var/www/zamique-current.global-new /var/www/zamique-current
pm2 save
trap - ERR
echo ACTIVATION_OK
'@
} elseif ($Phase -eq 'Rollback') {
  $script = @'
set -euo pipefail
release=__RELEASE__
backup=__BACKUP__
live=$(cat "$backup/previous-release.txt")
test "$(readlink -f /var/www/zamique-current)" = "$release"
cp -p "$release/data/analytics.json" "$live/data/analytics.json"
pm2 delete jack-fashion
cd "$live"
PORT=3200 PM2_APP_NAME=jack-fashion ZAMIQUE_NODE_BIN="$live/.runtime/node-v22.23.3-linux-x64/bin/node" pm2 start ecosystem.config.cjs --only jack-fashion
curl --noproxy '*' --retry 3 --retry-connrefused -fsS http://127.0.0.1:3200/catalog -o /dev/null
cp "$backup/nginx-before.conf" /etc/nginx/sites-available/zamique
nginx -t && systemctl reload nginx
ln -s "$live" /var/www/zamique-current.global-rollback
mv -Tf /var/www/zamique-current.global-rollback /var/www/zamique-current
pm2 save
echo ROLLBACK_OK
'@
} else {
  $script = @'
set -euo pipefail
test "$(readlink -f /var/www/zamique-current)" = '__RELEASE__'
curl --noproxy '*' -fsS http://127.0.0.1:3200/markets/middle-east -o /dev/null
pm2 delete jack-fashion-global-stage
pm2 save
echo STAGE_STOPPED
'@
}
Invoke-ScopedRemote ($script.Replace('__RELEASE__',$releasePath).Replace('__BACKUP__',$backupPath).Replace('__ID__',$ReleaseId).Replace('__LOCK__',$lockHash)) $(if ($Phase -in @('Stage','Patch')) { 600 } else { 120 })
