# Release the verified Jack Fashion AI-search implementation without mutating
# the currently active release or shared runtime data during staging.
param(
    [ValidateSet('All', 'Stage', 'Activate', 'Rollback')][string]$Phase = 'All',
    [string]$ReleaseId = '20261006-jack-fashion-review-fix-r1'
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\config.ps1"
Import-Module Posh-SSH -ErrorAction Stop

if ($RemoteDir -ne '/var/www/zamique-current' -or $Pm2AppName -ne 'jack-fashion' -or $SiteUrl -ne 'https://zamique.com') {
    throw 'Wrong deployment target'
}
if ($ReleaseId -notmatch '^20261006-jack-fashion-review-fix-r\d+$') {
    throw 'Unexpected release id'
}

$credential = Import-Clixml -LiteralPath $CredFile
$artifactDir = Join-Path $ProjectRoot "artifacts\$ReleaseId"
$archive = Join-Path $artifactDir "$ReleaseId.tar.gz"
$release = "/var/www/zamique-releases/$ReleaseId"
$backup = "/backup/zamique-$ReleaseId"
$stageApp = 'jack-fashion-ai-search-stage'

function Invoke-Remote([string]$Command, [int]$Timeout = 300) {
    $session = New-SSHSession -ComputerName $VPS_HOST -Credential $credential -AcceptKey
    try {
        $result = Invoke-SSHCommand -SessionId $session.SessionId -Command $Command -TimeOut $Timeout
        Write-Output $result.Output
        if ($result.Error) { Write-Warning ($result.Error -join "`n") }
        if ($result.ExitStatus -ne 0) { throw "Remote execution failed with exit code $($result.ExitStatus)" }
    } finally {
        Remove-SSHSession -SessionId $session.SessionId | Out-Null
    }
}

function Send-Archive {
    $sftp = New-SFTPSession -ComputerName $VPS_HOST -Credential $credential -AcceptKey
    try {
        Set-SFTPItem -SessionId $sftp.SessionId -Path $archive -Destination '/tmp/' -Force
    } finally {
        Remove-SFTPSession -SessionId $sftp.SessionId | Out-Null
    }
}

if ($Phase -in @('All', 'Stage')) {
    New-Item -ItemType Directory -Path $artifactDir -Force | Out-Null
    $payload = @(
        'src',
        'scripts',
        'data/products.json',
        'data/site-content.json',
        'data/content-claims.json',
        'data/ai-search-prompts.json',
        'public/llms.txt',
        'public/llms-full.txt',
        'public/images/optimized',
        'deploy/nginx-zamique.conf',
        'package.json',
        'package-lock.json',
        'next.config.ts',
        'ecosystem.config.cjs',
        'tsconfig.json',
        'next-env.d.ts',
        'eslint.config.mjs',
        'postcss.config.mjs'
    )
    foreach ($path in $payload) {
        if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot $path))) { throw "Missing payload path: $path" }
    }
    if (Test-Path -LiteralPath $archive) { Remove-Item -LiteralPath $archive -Force }
    & tar.exe -czf $archive -C $ProjectRoot @payload
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $archive)) { throw 'Could not create release archive' }
    $archiveHash = (Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash.ToLowerInvariant()
    Set-Content -LiteralPath (Join-Path $artifactDir 'release.sha256') -Value "$archiveHash  $ReleaseId.tar.gz" -Encoding ascii

    $hashes = @{}
    foreach ($path in @('package.json','package-lock.json','data/products.json','data/site-content.json','data/content-claims.json','data/ai-search-prompts.json','public/llms.txt','public/llms-full.txt','src/lib/generated/imageVariants.json','deploy/nginx-zamique.conf')) {
        $hashes[$path] = (Get-FileHash -LiteralPath (Join-Path $ProjectRoot $path) -Algorithm SHA256).Hash.ToLowerInvariant()
    }
    Write-Host "Uploading $([math]::Round((Get-Item $archive).Length / 1MB, 2)) MB release payload..." -ForegroundColor Cyan
    Send-Archive

    $stageScript = @'
set -euo pipefail
umask 077
release=__RELEASE__
backup=__BACKUP__
stage_app=__STAGE_APP__
live=$(readlink -f /var/www/zamique-current)
shared=/var/www/zamique-shared/runtime-data

case "$live" in /var/www/zamique-releases/*) ;; *) echo "Unexpected live path: $live"; exit 1;; esac
case "$release" in /var/www/zamique-releases/20261006-jack-fashion-review-fix-r*) ;; *) exit 1;; esac
case "$backup" in /backup/zamique-20261006-jack-fashion-review-fix-r*) ;; *) exit 1;; esac
test "$(df -Pm /var/www | awk 'NR==2{print $4}')" -gt 1200
test ! -e "$release"
test ! -e "$backup"
printf '%s  %s\n' '__HASH_ARCHIVE__' "/tmp/__ID__.tar.gz" | sha256sum -c -

mkdir -m 700 "$release" "$backup" "$backup/stage-data"
printf '%s\n' "$live" > "$backup/previous-release.txt"
cp /etc/nginx/sites-available/zamique "$backup/nginx-before.conf"
pm2 jlist > "$backup/pm2-before.json"
tar -czf "$backup/live-source-data-env.tar.gz" -C "$live" src scripts data package.json package-lock.json next.config.ts ecosystem.config.cjs tsconfig.json next-env.d.ts eslint.config.mjs postcss.config.mjs .env.local
tar -czf "$backup/shared-runtime-data.tar.gz" -C "$shared" .
find /var/www/zamique-image-assets/images/optimized -maxdepth 1 -type f -printf '%f\n' | sort > "$backup/optimized-assets-before.txt"

pm2 delete "$stage_app" >/dev/null 2>&1 || true
cp -al "$live/node_modules" "$live/.runtime" "$live/public" "$release/"
cp -a "$live/src" "$live/scripts" "$live/data" "$live/.env.local" "$live/package.json" "$live/package-lock.json" "$live/next.config.ts" "$live/ecosystem.config.cjs" "$live/tsconfig.json" "$live/next-env.d.ts" "$live/eslint.config.mjs" "$live/postcss.config.mjs" "$release/"
cp -a "$shared/." "$backup/stage-data/"

# public is hard-linked from the live release. Unlink files before overlaying
# them so the active version remains byte-for-byte unchanged during staging.
rm -f "$release/public/llms.txt" "$release/public/llms-full.txt"
rm -rf "$release/public/images/optimized"
tar -xzf /tmp/__ID__.tar.gz -C "$release"

cd "$release"
printf '%s  %s\n' '__HASH_PACKAGE__' package.json '__HASH_LOCK__' package-lock.json '__HASH_PRODUCTS__' data/products.json '__HASH_SITE__' data/site-content.json '__HASH_CLAIMS__' data/content-claims.json '__HASH_PROMPTS__' data/ai-search-prompts.json '__HASH_LLMS__' public/llms.txt '__HASH_LLMS_FULL__' public/llms-full.txt '__HASH_VARIANTS__' src/lib/generated/imageVariants.json '__HASH_NGINX__' deploy/nginx-zamique.conf | sha256sum -c -

mkdir -p /var/www/zamique-image-assets/images/optimized
cp -an "$release/public/images/optimized/." /var/www/zamique-image-assets/images/optimized/
python3 - "$release" /var/www/zamique-image-assets <<'PY'
import json, pathlib, sys
release, asset_root = map(pathlib.Path, sys.argv[1:])
manifest = json.loads((release / 'src/lib/generated/imageVariants.json').read_text())
variants = sorted({path for group in manifest.values() for path in group.values()})
assert variants, 'image variant manifest is empty'
for item in variants:
    relative = item.lstrip('/')
    assert (release / 'public' / relative).is_file(), f'missing release variant: {item}'
    assert (asset_root / relative).is_file(), f'missing shared variant: {item}'
print(f'PREPARED_IMAGE_VARIANTS_VERIFIED={len(variants)}')
PY

python3 - "$release" "$backup/stage-data" <<'PY'
import json, pathlib, sys
release, runtime = map(pathlib.Path, sys.argv[1:])
assert len(json.loads((release / 'data/products.json').read_text())) == 138
assert len(json.loads((release / 'data/ai-search-prompts.json').read_text())) == 18
env = release / '.env.local'
lines = [line for line in env.read_text().splitlines() if not line.startswith(('JACK_FASHION_RUNTIME_DATA_DIR=','JACK_FASHION_INDEXNOW_ENABLED=','NEXT_DEPLOYMENT_ID='))]
lines += [f'JACK_FASHION_RUNTIME_DATA_DIR={runtime}', 'JACK_FASHION_INDEXNOW_ENABLED=0', 'NEXT_DEPLOYMENT_ID=__ID__']
env.write_text('\n'.join(lines) + '\n')
env.chmod(0o600)
PY

nodebin="$release/.runtime/node-v22.23.3-linux-x64/bin/node"
NODE_OPTIONS='--max-old-space-size=768' nice -n 10 "$nodebin" node_modules/next/dist/bin/next build > "$backup/build.log" 2>&1 || (tail -n 100 "$backup/build.log"; exit 1)

PORT=3211 PM2_APP_NAME="$stage_app" JACK_FASHION_RUNTIME_DATA_DIR="$backup/stage-data" JACK_FASHION_INDEXNOW_ENABLED=0 ZAMIQUE_NODE_BIN="$nodebin" pm2 start ecosystem.config.cjs --only "$stage_app"
curl --noproxy '*' --retry 20 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3211/ -o /dev/null
python3 scripts/verify-public-pages.py --base http://127.0.0.1:3211 --expected 169 --output "$backup/stage-crawl.json"

for agent in 'Mozilla/5.0' 'Googlebot/2.1 (+http://www.google.com/bot.html)' 'OAI-SearchBot/1.0; +https://openai.com/searchbot'; do
  for path in / /catalog /about /markets /products/african-batwing-plus-size-dress-1003001; do
    test "$(curl --noproxy '*' -A "$agent" -sS -o /dev/null -w '%{http_code}' "http://127.0.0.1:3211$path")" = 200
  done
done
test "$(curl --noproxy '*' -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:3211/products/nonexistent-release-check)" = 404
grep -q 'OAI-SearchBot' <(curl --noproxy '*' -fsS http://127.0.0.1:3211/robots.txt)
! grep -q 'xAI-SearchBot' <(curl --noproxy '*' -fsS http://127.0.0.1:3211/robots.txt)
echo STAGE_VERIFIED_169_OF_169
'@
    $stageScript = $stageScript.Replace('__RELEASE__', $release).Replace('__BACKUP__', $backup).Replace('__STAGE_APP__', $stageApp).Replace('__ID__', $ReleaseId).Replace('__HASH_ARCHIVE__', $archiveHash)
    $stageScript = $stageScript.Replace('__HASH_PACKAGE__', $hashes['package.json']).Replace('__HASH_LOCK__', $hashes['package-lock.json']).Replace('__HASH_PRODUCTS__', $hashes['data/products.json']).Replace('__HASH_SITE__', $hashes['data/site-content.json']).Replace('__HASH_CLAIMS__', $hashes['data/content-claims.json']).Replace('__HASH_PROMPTS__', $hashes['data/ai-search-prompts.json']).Replace('__HASH_LLMS__', $hashes['public/llms.txt']).Replace('__HASH_LLMS_FULL__', $hashes['public/llms-full.txt']).Replace('__HASH_VARIANTS__', $hashes['src/lib/generated/imageVariants.json']).Replace('__HASH_NGINX__', $hashes['deploy/nginx-zamique.conf'])
    Invoke-Remote -Command $stageScript -Timeout 900
}

if ($Phase -in @('All', 'Activate')) {
    $activateScript = @'
set -euo pipefail
umask 077
release=__RELEASE__
backup=__BACKUP__
stage_app=__STAGE_APP__
shared=/var/www/zamique-shared/runtime-data
previous=$(cat "$backup/previous-release.txt")
current=$(readlink -f /var/www/zamique-current)
test "$current" = "$previous"
test -d "$release/.next"

rollback() {
  rc=$?
  if [ "${nginx_changed:-0}" = 1 ]; then
    cp "$backup/nginx-before.conf" /etc/nginx/sites-available/zamique
    nginx -t >/dev/null
    systemctl reload nginx
  fi
  if [ "${switched:-0}" = 1 ]; then
    ln -s "$previous" /var/www/zamique-current.rollback-new
    mv -Tf /var/www/zamique-current.rollback-new /var/www/zamique-current
    pm2 delete jack-fashion >/dev/null 2>&1 || true
    cd "$previous"
    PORT=3200 PM2_APP_NAME=jack-fashion JACK_FASHION_RUNTIME_DATA_DIR="$shared" JACK_FASHION_INDEXNOW_ENABLED=1 ZAMIQUE_NODE_BIN="$previous/.runtime/node-v22.23.3-linux-x64/bin/node" pm2 start ecosystem.config.cjs --only jack-fashion >/dev/null
    pm2 save >/dev/null
  fi
  exit "$rc"
}
switched=0
nginx_changed=0
trap rollback ERR

pm2 delete "$stage_app" >/dev/null 2>&1 || true
python3 - "$release" "$shared" <<'PY'
import pathlib, sys
release, shared = map(pathlib.Path, sys.argv[1:])
env = release / '.env.local'
lines = [line for line in env.read_text().splitlines() if not line.startswith(('JACK_FASHION_RUNTIME_DATA_DIR=','JACK_FASHION_INDEXNOW_ENABLED='))]
lines += [f'JACK_FASHION_RUNTIME_DATA_DIR={shared}', 'JACK_FASHION_INDEXNOW_ENABLED=1']
env.write_text('\n'.join(lines) + '\n')
env.chmod(0o600)
PY

cp "$release/deploy/nginx-zamique.conf" /etc/nginx/sites-available/zamique
nginx_changed=1
nginx -t
systemctl reload nginx

ln -s "$release" /var/www/zamique-current.ai-search-new
mv -Tf /var/www/zamique-current.ai-search-new /var/www/zamique-current
switched=1
pm2 delete jack-fashion >/dev/null 2>&1 || true
cd "$release"
PORT=3200 PM2_APP_NAME=jack-fashion JACK_FASHION_RUNTIME_DATA_DIR="$shared" JACK_FASHION_INDEXNOW_ENABLED=1 ZAMIQUE_NODE_BIN="$release/.runtime/node-v22.23.3-linux-x64/bin/node" pm2 start ecosystem.config.cjs --only jack-fashion >/dev/null
curl --noproxy '*' --retry 20 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3200/ -o /dev/null
python3 scripts/verify-public-pages.py --base http://127.0.0.1:3200 --expected 169 --output "$backup/production-crawl.json"
nginx -t
pm2 save >/dev/null
test -f "$shared/analytics.json"
test -f "$shared/indexnow.json"
test -f "$shared/indexnow-products.json"
rm -f /tmp/__ID__.tar.gz
if [ -d "$release/.next/cache/webpack" ]; then rm -rf "$release/.next/cache/webpack"; fi
switched=0
nginx_changed=0
trap - ERR
echo ACTIVATION_VERIFIED_169_OF_169
'@
    $activateScript = $activateScript.Replace('__RELEASE__', $release).Replace('__BACKUP__', $backup).Replace('__STAGE_APP__', $stageApp).Replace('__ID__', $ReleaseId)
    Invoke-Remote -Command $activateScript -Timeout 600
}

if ($Phase -eq 'Rollback') {
    $rollbackScript = @'
set -euo pipefail
backup=__BACKUP__
release=__RELEASE__
shared=/var/www/zamique-shared/runtime-data
previous=$(cat "$backup/previous-release.txt")
test "$(readlink -f /var/www/zamique-current)" = "$release"
case "$previous" in /var/www/zamique-releases/*) ;; *) exit 1;; esac
ln -s "$previous" /var/www/zamique-current.manual-rollback-new
mv -Tf /var/www/zamique-current.manual-rollback-new /var/www/zamique-current
pm2 delete jack-fashion >/dev/null 2>&1 || true
cd "$previous"
PORT=3200 PM2_APP_NAME=jack-fashion JACK_FASHION_RUNTIME_DATA_DIR="$shared" JACK_FASHION_INDEXNOW_ENABLED=1 ZAMIQUE_NODE_BIN="$previous/.runtime/node-v22.23.3-linux-x64/bin/node" pm2 start ecosystem.config.cjs --only jack-fashion >/dev/null
curl --noproxy '*' --retry 20 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3200/ -o /dev/null
pm2 save >/dev/null
cp "$backup/nginx-before.conf" /etc/nginx/sites-available/zamique
nginx -t >/dev/null
systemctl reload nginx
echo ROLLBACK_VERIFIED
'@
    $rollbackScript = $rollbackScript.Replace('__RELEASE__', $release).Replace('__BACKUP__', $backup)
    Invoke-Remote -Command $rollbackScript -Timeout 180
}

Write-Host "Release phase $Phase completed for $ReleaseId" -ForegroundColor Green
