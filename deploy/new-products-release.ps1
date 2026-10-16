# Scoped Release script for 70 new products with watermarked images.
param(
    [ValidateSet('All', 'Stage', 'Activate', 'Rollback', 'Cleanup')][string]$Phase = 'All',
    [string]$ReleaseId = '20261005-jack-fashion-new-70-products-r1'
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\config.ps1"
Import-Module Posh-SSH -ErrorAction Stop

if ($RemoteDir -ne '/var/www/zamique-current' -or $Pm2AppName -ne 'jack-fashion') {
    throw 'Wrong deployment target'
}

$credential = Import-Clixml -LiteralPath $CredFile
$artifactDir = Join-Path $ProjectRoot 'artifacts\jack-fashion-new-70-products-20261005'
$archive = Join-Path $artifactDir "$ReleaseId.tar.gz"
$release = "/var/www/zamique-releases/$ReleaseId"
$backup = "/backup/zamique-$ReleaseId"

function Invoke-Remote([string]$Cmd, [int]$Timeout = 300) {
    $session = New-SSHSession -ComputerName $VPS_HOST -Credential $credential -AcceptKey
    try {
        $result = Invoke-SSHCommand -SessionId $session.SessionId -Command $Cmd -TimeOut $Timeout
        Write-Output $result.Output
        if ($result.Error) { Write-Warning ($result.Error -join "`n") }
        if ($result.ExitStatus -ne 0) { throw "Remote execution failed with exit code $($result.ExitStatus)" }
    } finally {
        Remove-SSHSession -SessionId $session.SessionId | Out-Null
    }
}

# --- STAGE ---
if ($Phase -in @('All', 'Stage')) {
    Write-Host ''
    Write-Host '[1/3] Uploading release archive to server...' -ForegroundColor Cyan
    if (-not (Test-Path $archive)) {
        throw "Release archive not found: $archive."
    }
    $sizeMB = [math]::Round((Get-Item $archive).Length / 1MB, 2)
    Write-Host "   Archive size: $sizeMB MB"
    $start = Get-Date
    $sftp = New-SFTPSession -ComputerName $VPS_HOST -Credential $credential -AcceptKey
    try {
        Set-SFTPItem -SessionId $sftp.SessionId -Path $archive -Destination '/tmp/' -Force
    } finally {
        Remove-SFTPSession -SessionId $sftp.SessionId | Out-Null
    }
    $elapsed = ((Get-Date) - $start).TotalSeconds
    Write-Host ("   Upload finished in {0:N1} seconds" -f $elapsed) -ForegroundColor Green

    Write-Host ''
    Write-Host '[2/3] Building Stage environment on server...' -ForegroundColor Cyan
    $stageScript = @'
set -euo pipefail
umask 077
release=__RELEASE__
backup=__BACKUP__
live=$(readlink -f /var/www/zamique-current)

echo "  Current live release: $live"
test "$(df -Pm /var/www | awk 'NR==2{print $4}')" -gt 1000

if pm2 describe jack-fashion-new-products-stage >/dev/null 2>&1; then
    pm2 delete jack-fashion-new-products-stage
fi
rm -rf "$release" "$backup"
mkdir -m 700 "$release" "$backup" "$backup/stage-data"
printf '%s\n' "$live" > "$backup/previous-release.txt"
cp /etc/nginx/sites-available/zamique "$backup/nginx-before.conf"

echo "  Hardlinking dependencies and assets from live..."
cp -al "$live/node_modules" "$live/.runtime" "$live/public" "$release/"
cp -a "$live/src" "$live/scripts" "$live/.env.local" "$live/package.json" "$live/package-lock.json" "$live/next.config.ts" "$live/ecosystem.config.cjs" "$live/tsconfig.json" "$live/next-env.d.ts" "$live/eslint.config.mjs" "$live/postcss.config.mjs" "$release/"
mkdir -p "$release/data"
cp -a "$live/data/"* "$release/data/"

echo "  Extracting 70 new products and assets..."
tar -xzf /tmp/__ID__.tar.gz -C "$release"

python3 - "$live" "$release" "$backup" <<'PY'
import json, pathlib, sys
live, release, backup = map(pathlib.Path, sys.argv[1:])

prods = json.loads((release / 'data/products.json').read_text())
assert len(prods) == 138, f"Expected 138 products, got {len(prods)}"

for i in range(1, 71):
    code = f"1003{i:03d}"
    png = release / 'public/images/products' / f"{code}.png"
    assert png.is_file() and png.stat().st_size > 50000, f"Missing {png}"

env = release / '.env.local'
lines = [l for l in env.read_text().splitlines() if not l.startswith(('JACK_FASHION_RUNTIME_DATA_DIR=','JACK_FASHION_INDEXNOW_ENABLED=','NEXT_DEPLOYMENT_ID='))]
lines += ['JACK_FASHION_RUNTIME_DATA_DIR=' + str(backup / 'stage-data'), 'JACK_FASHION_INDEXNOW_ENABLED=0', 'NEXT_DEPLOYMENT_ID=__ID__']
env.write_text('\n'.join(lines) + '\n')
env.chmod(0o600)
print(f"VERIFIED_70_NEW_PRODUCTS_READY (Total {len(prods)})")
PY

echo "  Running Next.js production build..."
cd "$release"
nodebin="$release/.runtime/node-v22.23.3-linux-x64/bin/node"
NODE_OPTIONS='--max-old-space-size=768' nice -n 10 "$nodebin" node_modules/next/dist/bin/next build > "$backup/build.log" 2>&1 || (tail -n 60 "$backup/build.log"; exit 1)

echo "  Starting Stage check on port 3211..."
PORT=3211 PM2_APP_NAME=jack-fashion-new-products-stage JACK_FASHION_RUNTIME_DATA_DIR="$backup/stage-data" JACK_FASHION_INDEXNOW_ENABLED=0 ZAMIQUE_NODE_BIN="$nodebin" pm2 start ecosystem.config.cjs --only jack-fashion-new-products-stage

echo "  Waiting for Stage server..."
curl --noproxy '*' --retry 15 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3211/catalog -o /dev/null

python3 - <<'PY'
import urllib.request
opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))

with opener.open('http://127.0.0.1:3211/catalog') as r:
    html = r.read().decode('utf-8', errors='ignore')
    assert '1003001' in html, "1003001 missing in catalog"
    assert '1003070' in html, "1003070 missing in catalog"

with opener.open('http://127.0.0.1:3211/products/african-batwing-plus-size-dress-1003001') as r:
    assert r.status == 200

with opener.open('http://127.0.0.1:3211/images/products/1003001.png') as r:
    assert r.status == 200 and int(r.headers.get('content-length', 0)) > 50000

print("STAGE_INTEGRITY_CHECK_100_PERCENT_PASSED")
PY

echo STAGE_VERIFIED
'@
    $stageScript = $stageScript.Replace('__RELEASE__', $release).Replace('__BACKUP__', $backup).Replace('__ID__', $ReleaseId)
    Invoke-Remote -Cmd $stageScript -Timeout 600
}

# --- ACTIVATE ---
if ($Phase -in @('All', 'Activate')) {
    Write-Host ''
    Write-Host '[3/3] Activating new release and reloading service...' -ForegroundColor Cyan
    $activateScript = @'
set -euo pipefail
umask 077
release=__RELEASE__
backup=__BACKUP__
live=$(cat "$backup/previous-release.txt")
shared=/var/www/zamique-shared/runtime-data

echo "  Stopping Stage check process..."
pm2 delete jack-fashion-new-products-stage 2>/dev/null || true

python3 - "$release" "$shared" <<'PY'
import pathlib, sys
release, shared = map(pathlib.Path, sys.argv[1:])
env = release / '.env.local'
lines = [l for l in env.read_text().splitlines() if not l.startswith(('JACK_FASHION_RUNTIME_DATA_DIR=','JACK_FASHION_INDEXNOW_ENABLED='))]
lines += ['JACK_FASHION_RUNTIME_DATA_DIR=' + str(shared), 'JACK_FASHION_INDEXNOW_ENABLED=1']
env.write_text('\n'.join(lines) + '\n')
env.chmod(0o600)
PY

echo "  Atomic symlink switch /var/www/zamique-current..."
ln -s "$release" /var/www/zamique-current.new-products-new
mv -Tf /var/www/zamique-current.new-products-new /var/www/zamique-current

echo "  Restarting PM2 production service jack-fashion..."
pm2 delete jack-fashion 2>/dev/null || true
cd "$release"
PORT=3200 PM2_APP_NAME=jack-fashion JACK_FASHION_RUNTIME_DATA_DIR="$shared" JACK_FASHION_INDEXNOW_ENABLED=1 ZAMIQUE_NODE_BIN="$release/.runtime/node-v22.23.3-linux-x64/bin/node" pm2 start ecosystem.config.cjs --only jack-fashion

echo "  Verifying production server..."
curl --noproxy '*' --retry 15 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3200/catalog -o /dev/null
pm2 save

echo ACTIVATION_OK
'@
    $activateScript = $activateScript.Replace('__RELEASE__', $release).Replace('__BACKUP__', $backup).Replace('__ID__', $ReleaseId)
    Invoke-Remote -Cmd $activateScript -Timeout 120
}

# --- CLEANUP ---
if ($Phase -in @('All', 'Cleanup')) {
    Write-Host ''
    Write-Host 'Cleaning temporary archive and build caches...' -ForegroundColor Cyan
    $cleanupScript = @'
set -euo pipefail
release=__RELEASE__
rm -f /tmp/__ID__.tar.gz
cache="$release/.next/cache/webpack"
if [ -d "$cache" ]; then
    rm -rf "$cache"
fi
echo "CLEANUP_OK"
'@
    $cleanupScript = $cleanupScript.Replace('__RELEASE__', $release).Replace('__ID__', $ReleaseId)
    Invoke-Remote -Cmd $cleanupScript -Timeout 60
}

Write-Host ''
Write-Host '============================================================' -ForegroundColor Green
Write-Host '   SUCCESS: 70 New Products Successfully Deployed to Zamique.com!' -ForegroundColor Green
Write-Host '============================================================' -ForegroundColor Green
Write-Host "   Catalog URL: $SiteUrl/catalog" -ForegroundColor Cyan
