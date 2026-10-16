# Release only audited source/config. Live data, images and secrets stay on the VPS.
param(
    [Parameter(Mandatory)][ValidatePattern('^[a-z0-9-]{6,50}$')][string]$ReleaseId,
    [ValidateSet('Stage', 'Refresh', 'Patch', 'Runtime', 'Activate', 'Cleanup')][string]$Phase = 'Stage'
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\config.ps1"
Import-Module Posh-SSH -ErrorAction Stop
$credential = Import-Clixml -LiteralPath $CredFile

function Invoke-ReleaseCommand([string]$Command, [int]$Timeout = 60) {
    $session = New-SSHSession -ComputerName $VPS_HOST -Credential $credential -AcceptKey
    try {
        $result = Invoke-SSHCommand -SessionId $session.SessionId -Command $Command -TimeOut $Timeout
        Write-Output $result.Output
        if ($result.Error) { Write-Output $result.Error }
        if ($result.ExitStatus -ne 0) { throw "Remote release phase failed: $($result.ExitStatus)" }
    } finally {
        Remove-SSHSession -SessionId $session.SessionId | Out-Null
    }
}

function Upload-ReleaseFile([string]$Path, [string]$Destination) {
    $session = New-SFTPSession -ComputerName $VPS_HOST -Credential $credential -AcceptKey
    try { Set-SFTPItem -SessionId $session.SessionId -Path $Path -Destination $Destination -Force }
    finally { Remove-SFTPSession -SessionId $session.SessionId | Out-Null }
}

$releasePath = "/var/www/zamique-releases/$ReleaseId"
$backupPath = "/backup/zamique-$ReleaseId"
if ($RemoteDir -ne '/var/www/zamique-current' -or $Pm2AppName -ne 'jack-fashion') {
    throw 'This scoped release requires the verified Zamique production symlink and PM2 app.'
}

# Official, checksum-verified runtime scoped to this release. Host Node, PATH,
# the PM2 daemon and unrelated apps retain their existing configuration.
$runtimeSetup = @'
test "$(uname -m)" = x86_64
mkdir -p "$release/.runtime"
nodebin="$release/.runtime/node-v22.23.3-linux-x64/bin/node"
if test ! -x "$nodebin"; then
  curl -fL --retry 2 --max-time 120 https://nodejs.org/dist/v22.23.3/node-v22.23.3-linux-x64.tar.xz -o "$release/.runtime/node-v22.23.3-linux-x64.tar.xz"
  printf '%s  %s\n' df450af89261115ef9f9e3830c3eeb2cc9213b63c720b1af623cb5dcbe2e02de "$release/.runtime/node-v22.23.3-linux-x64.tar.xz" | sha256sum -c -
  tar -xJf "$release/.runtime/node-v22.23.3-linux-x64.tar.xz" -C "$release/.runtime"
fi
test "$("$nodebin" --version)" = v22.23.3
'@
$runtimeCheck = @'
"$nodebin" -e 'const sharp=require("sharp"); Promise.all([sharp({create:{width:8,height:8,channels:3,background:"white"}}).webp().toBuffer(), sharp({create:{width:8,height:8,channels:3,background:"white"}}).avif().toBuffer()]).then(r=>{if(r.some(b=>b.length===0))process.exit(1); console.log("NATIVE_IMAGE_RUNTIME_OK",process.version)}).catch(e=>{console.error(e.message);process.exit(1)})'
'@

if ($Phase -in @('Stage', 'Refresh', 'Patch')) {
    $artifactDir = Join-Path $ProjectRoot 'artifacts\seo-audit-2026-10-01'
    New-Item -ItemType Directory -Path $artifactDir -Force | Out-Null
    $archive = Join-Path $artifactDir "$ReleaseId.tar.gz"
    Push-Location $ProjectRoot
    try {
        & tar -czf $archive src next.config.ts ecosystem.config.cjs package.json package-lock.json public/llms.txt public/llms-full.txt
        if ($LASTEXITCODE -ne 0) { throw 'Scoped source archive failed' }
    } finally { Pop-Location }
    Upload-ReleaseFile $archive '/tmp'
    Upload-ReleaseFile (Join-Path $PSScriptRoot 'nginx-zamique.conf') '/tmp'
    $baselineLock = if ($Phase -eq 'Patch') { Join-Path $ProjectRoot 'package-lock.json' } else { Join-Path $artifactDir 'before\package-lock.json' }
    $lockHash = (Get-FileHash -LiteralPath $baselineLock -Algorithm SHA256).Hash.ToLowerInvariant()
    $script = @'
set -euo pipefail
umask 077
live=$(readlink -f /var/www/zamique-current)
case "$live" in /var/www/zamique-releases/*) ;; *) exit 21;; esac
release=__RELEASE__
backup=__BACKUP__
test "$release" != "$live"
test "$(sha256sum "$live/package-lock.json" | cut -d' ' -f1)" = '__LOCK_HASH__'
if test '__PHASE__' = Refresh; then
  test -d "$release" && test -d "$backup"
  pm2 stop jack-fashion-seo-stage
elif test '__PHASE__' = Patch; then
  test ! -e "$release"
  test "$(df -Pm /var/www | awk 'NR==2{print $4}')" -gt 1000
  test -x "$live/.runtime/node-v22.23.3-linux-x64/bin/node"
  mkdir -m 700 "$backup"
  printf '%s\n' "$live" > "$backup/previous-release.txt"
  cp /etc/nginx/sites-available/zamique "$backup/nginx-before.conf"
  pm2 jlist > "$backup/pm2-before.json"
  printf '%s\n' /backup/zamique-20261001-seo-display/data-images-env.tar.gz > "$backup/original-data-backup.txt"
  mkdir "$release"
  cp -a "$live/src" "$live/data" "$live/.env.local" "$live/package.json" "$live/package-lock.json" "$live/next.config.ts" "$live/ecosystem.config.cjs" "$release/"
  cp -a "$live/tsconfig.json" "$live/next-env.d.ts" "$live/eslint.config.mjs" "$live/postcss.config.mjs" "$release/"
  # This source-only correction reuses unchanged immutable files by hard link.
  # It does not install dependencies or overwrite image/runtime/package files.
  cp -al "$live/node_modules" "$live/.runtime" "$live/public" "$release/"
  if pm2 describe jack-fashion-seo-stage >/dev/null 2>&1; then pm2 delete jack-fashion-seo-stage; fi
else
  test ! -e "$release"
  test "$(df -Pm /var/www | awk 'NR==2{print $4}')" -gt 2200
  mkdir -m 700 "$backup"
  printf '%s\n' "$live" > "$backup/previous-release.txt"
  cp /etc/nginx/sites-available/zamique "$backup/nginx-before.conf"
  pm2 jlist > "$backup/pm2-before.json"
  tar -czf "$backup/data-images-env.tar.gz" -C "$live" data public/images .env.local
  mkdir "$release"
  cp -a "$live/." "$release/"
fi
# Retire the global loading boundary in the isolated release only. Keeping it
# would stream HTTP 200 before an unknown product can return its 404 status.
rm -f "$release/src/app/loading.tsx"
tar -xzf /tmp/__ID__.tar.gz -C "$release"
cp /tmp/nginx-zamique.conf "$backup/nginx-new.conf"
cd "$release"
chmod 600 .env.local
__RUNTIME_SETUP__
if test '__PHASE__' = Patch; then
  cmp "$live/package.json" package.json
  cmp "$live/package-lock.json" package-lock.json
else
  "$nodebin" "$release/.runtime/node-v22.23.3-linux-x64/lib/node_modules/npm/bin/npm-cli.js" ci --no-audit --registry=https://registry.npmjs.org
fi
NODE_OPTIONS='--max-old-space-size=768' nice -n 10 "$nodebin" node_modules/next/dist/bin/next build
__RUNTIME_CHECK__
# Preserve immutable assets referenced by recently cached production HTML.
cp -an "$live/.next/static/." "$release/.next/static/"
if test '__PHASE__' = Refresh; then
  pm2 delete jack-fashion-seo-stage
fi
PORT=3210 PM2_APP_NAME=jack-fashion-seo-stage ZAMIQUE_NODE_BIN="$nodebin" pm2 start ecosystem.config.cjs --only jack-fashion-seo-stage
for i in $(seq 1 30); do
  if curl --noproxy '*' -fsS http://127.0.0.1:3210/catalog -o /dev/null; then
    echo STAGE_READY
    exit 0
  fi
  sleep 1
done
exit 22
'@
    Invoke-ReleaseCommand ($script.Replace('__RELEASE__', $releasePath).Replace('__BACKUP__', $backupPath).Replace('__ID__', $ReleaseId).Replace('__LOCK_HASH__', $lockHash).Replace('__PHASE__', $Phase).Replace('__RUNTIME_SETUP__', $runtimeSetup).Replace('__RUNTIME_CHECK__', $runtimeCheck)) 480
} elseif ($Phase -eq 'Runtime') {
    # Upgrade an already-built isolated stage only, after native ABI checks.
    Invoke-ReleaseCommand "test `"`$(readlink -f /var/www/zamique-current)`" != '$releasePath' && test -d '$releasePath/.next'" 30
    Upload-ReleaseFile (Join-Path $ProjectRoot 'ecosystem.config.cjs') $releasePath
    $script = @'
set -euo pipefail
release=__RELEASE__
test "$(readlink -f /var/www/zamique-current)" != "$release"
test -d "$release/.next"
cd "$release"
__RUNTIME_SETUP__
__RUNTIME_CHECK__
pm2 delete jack-fashion-seo-stage
PORT=3210 PM2_APP_NAME=jack-fashion-seo-stage ZAMIQUE_NODE_BIN="$nodebin" pm2 start ecosystem.config.cjs --only jack-fashion-seo-stage
for i in $(seq 1 30); do
  if curl --noproxy '*' -fsS http://127.0.0.1:3210/catalog -o /dev/null; then echo RUNTIME_STAGE_READY; exit 0; fi
  sleep 1
done
exit 23
'@
    Invoke-ReleaseCommand ($script.Replace('__RELEASE__', $releasePath).Replace('__RUNTIME_SETUP__', $runtimeSetup).Replace('__RUNTIME_CHECK__', $runtimeCheck)) 180
} elseif ($Phase -eq 'Activate') {
    $script = @'
set -euo pipefail
release=__RELEASE__
backup=__BACKUP__
live=$(cat "$backup/previous-release.txt")
test "$(readlink -f /var/www/zamique-current)" = "$live"
cmp "$live/data/products.json" "$release/data/products.json"
cmp "$live/data/site-content.json" "$release/data/site-content.json"
curl --noproxy '*' -fsS http://127.0.0.1:3210/catalog -o /dev/null
nodebin="$release/.runtime/node-v22.23.3-linux-x64/bin/node"
test "$("$nodebin" --version)" = v22.23.3
rollback() {
  set +e
  pm2 delete jack-fashion
  cd "$live"
  if test -x "$live/.runtime/node-v22.23.3-linux-x64/bin/node"; then
    PORT=3200 ZAMIQUE_NODE_BIN="$live/.runtime/node-v22.23.3-linux-x64/bin/node" pm2 start ecosystem.config.cjs --only jack-fashion
  else
    PORT=3200 pm2 start ecosystem.config.cjs --only jack-fashion
  fi
  if test "$(readlink -f /var/www/zamique-current)" != "$live"; then
    ln -s "$live" /var/www/zamique-current.seo-rollback
    mv -Tf /var/www/zamique-current.seo-rollback /var/www/zamique-current
  fi
  cp "$backup/nginx-before.conf" /etc/nginx/sites-available/zamique
  nginx -t && systemctl reload nginx
  pm2 save
  echo ACTIVATION_ROLLED_BACK
}
trap rollback ERR
# Route buyers to the already healthy stage while the permanent app starts.
sed 's/127.0.0.1:3200/127.0.0.1:3210/' "$backup/nginx-new.conf" > /etc/nginx/sites-available/zamique
nginx -t
systemctl reload nginx
if test -f "$live/data/analytics.json"; then cp -p "$live/data/analytics.json" "$release/data/analytics.json"; fi
pm2 delete jack-fashion
cd "$release"
PORT=3200 ZAMIQUE_NODE_BIN="$nodebin" pm2 start ecosystem.config.cjs --only jack-fashion
ready=0
for i in $(seq 1 30); do
  if curl --noproxy '*' -fsS http://127.0.0.1:3200/catalog -o /dev/null; then ready=1; break; fi
  sleep 1
done
test "$ready" = 1
cp "$backup/nginx-new.conf" /etc/nginx/sites-available/zamique
nginx -t
systemctl reload nginx
ln -s "$release" /var/www/zamique-current.seo-new
mv -Tf /var/www/zamique-current.seo-new /var/www/zamique-current
pm2 save
trap - ERR
echo ACTIVATION_OK
'@
    Invoke-ReleaseCommand ($script.Replace('__RELEASE__', $releasePath).Replace('__BACKUP__', $backupPath)) 120
} else {
    $script = @'
set -euo pipefail
test "$(readlink -f /var/www/zamique-current)" = '__RELEASE__'
curl --noproxy '*' -fsS http://127.0.0.1:3200/catalog -o /dev/null
pm2 delete jack-fashion-seo-stage
pm2 save
echo STAGE_STOPPED
'@
    Invoke-ReleaseCommand ($script.Replace('__RELEASE__', $releasePath)) 45
}
