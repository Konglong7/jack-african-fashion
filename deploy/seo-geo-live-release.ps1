# Release script for Jack Fashion SEO / GEO comprehensive update.
param(
    [ValidateSet('All', 'Stage', 'Activate', 'Rollback', 'Cleanup')][string]$Phase = 'All',
    [string]$ReleaseId = '20261016-jack-fashion-seo-geo-r16'
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\config.ps1"
Import-Module Posh-SSH -ErrorAction Stop

if ($RemoteDir -ne '/var/www/zamique-current' -or $Pm2AppName -ne 'jack-fashion' -or $SiteUrl -ne 'https://zamique.com') {
    throw 'Wrong deployment target'
}

$credential = Import-Clixml -LiteralPath $CredFile
$artifactDir = Join-Path $ProjectRoot "artifacts\$ReleaseId"
$archive = Join-Path $artifactDir "$ReleaseId.tar.gz"
$release = "/var/www/zamique-releases/$ReleaseId"
$backup = "/backup/zamique-$ReleaseId"
$stageApp = 'jack-fashion-seo-geo-stage'

function Invoke-Remote([string]$Cmd, [int]$Timeout = 600) {
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

function Send-Archive {
    $sftp = New-SFTPSession -ComputerName $VPS_HOST -Credential $credential -AcceptKey
    try {
        Set-SFTPItem -SessionId $sftp.SessionId -Path $archive -Destination '/tmp/' -Force
    } finally {
        Remove-SFTPSession -SessionId $sftp.SessionId | Out-Null
    }
}

# --- STAGE ---
if ($Phase -in @('All', 'Stage')) {
    Write-Host ''
    Write-Host '============================================================' -ForegroundColor Cyan
    Write-Host "   Jack Fashion — SEO / GEO 生产发布 (Release $ReleaseId)" -ForegroundColor Cyan
    Write-Host '============================================================' -ForegroundColor Cyan

    New-Item -ItemType Directory -Path $artifactDir -Force | Out-Null

    Write-Host '[1/4] 本地打包待发布文件...' -ForegroundColor Yellow
    Push-Location $ProjectRoot
    try {
        if (Test-Path $archive) { Remove-Item $archive -Force }
        & tar -czf $archive `
            --exclude='data/analytics.json' `
            --exclude='data/analytics.json.tmp' `
            --exclude='*.bak' `
            --exclude='data/raw-assets' `
            src scripts data package.json package-lock.json next.config.ts `
            ecosystem.config.cjs tsconfig.json next-env.d.ts eslint.config.mjs `
            postcss.config.mjs vitest.config.mts deploy public/llms.txt public/llms-full.txt `
            public/images/optimized public/images/products public/images/site public/images/scene-illustrations `
            public/images/factory public/images/trust
        if ($LASTEXITCODE -ne 0 -or -not (Test-Path $archive)) { throw 'Tar archive creation failed' }
    } finally {
        Pop-Location
    }

    $sizeMB = [math]::Round((Get-Item $archive).Length / 1MB, 2)
    Write-Host "   ✅ 打包完成: $archive ($sizeMB MB)" -ForegroundColor Green

    Write-Host ''
    Write-Host '[2/4] 上传到服务器 /tmp/ ...' -ForegroundColor Yellow
    $start = Get-Date
    Send-Archive
    $elapsed = ((Get-Date) - $start).TotalSeconds
    Write-Host ("   ✅ 上传完成，耗时 {0:N1} 秒" -f $elapsed) -ForegroundColor Green

    Write-Host ''
    Write-Host '[3/4] 远端 Staging 环境解压构建与预检...' -ForegroundColor Yellow
    $stageScript = @'
set -euo pipefail
umask 077
release=__RELEASE__
backup=__BACKUP__
stage_app=__STAGE_APP__
archive="/tmp/__ID__.tar.gz"
live=$(readlink -f /var/www/zamique-current)

echo "  当前活跃发布: $live"
test "$(df -Pm /var/www | awk 'NR==2{print $4}')" -gt 1500

pm2 delete "$stage_app" 2>/dev/null || true
rm -rf "$release" "$backup"
mkdir -m 700 "$release" "$backup" "$backup/stage-data"
printf '%s\n' "$live" > "$backup/previous-release.txt"
cp /etc/nginx/sites-available/zamique "$backup/nginx-before.conf"

echo "  硬链接 node_modules, .runtime, public 目录..."
cp -al "$live/node_modules" "$live/.runtime" "$live/public" "$release/"
cp -a "$live/.env.local" "$release/"

echo "  解压发布补丁..."
tar -xzf "$archive" -C "$release"

nodebin="$release/.runtime/node-v22.23.3-linux-x64/bin/node"
if test ! -x "$nodebin"; then
    nodebin="/usr/bin/node"
fi

echo "  配置 Stage 环境变量..."
python3 - "$release" "$backup/stage-data" <<'PY'
import pathlib, sys
release, stage_data = map(pathlib.Path, sys.argv[1:])
env = release / '.env.local'
lines = [l for l in env.read_text().splitlines() if not l.startswith(('JACK_FASHION_RUNTIME_DATA_DIR=','JACK_FASHION_INDEXNOW_ENABLED=','NEXT_DEPLOYMENT_ID='))]
lines += [f'JACK_FASHION_RUNTIME_DATA_DIR={stage_data}', 'JACK_FASHION_INDEXNOW_ENABLED=0', 'NEXT_DEPLOYMENT_ID=__ID__']
env.write_text('\n'.join(lines) + '\n')
env.chmod(0o600)
PY

echo "  运行生产环境构建 (Next.js build)..."
cd "$release"
NODE_OPTIONS='--max-old-space-size=896' nice -n 10 "$nodebin" node_modules/next/dist/bin/next build > "$backup/build.log" 2>&1 || (tail -n 80 "$backup/build.log"; exit 1)

echo "  保留前序版本静态分块以防客户端404..."
cp -an "$live/.next/static/." "$release/.next/static/" 2>/dev/null || true

echo "  启动 Stage 实例 (端口 3211)..."
PORT=3211 PM2_APP_NAME="$stage_app" JACK_FASHION_RUNTIME_DATA_DIR="$backup/stage-data" JACK_FASHION_INDEXNOW_ENABLED=0 ZAMIQUE_NODE_BIN="$nodebin" pm2 start ecosystem.config.cjs --only "$stage_app"

echo "  等待 Stage 实例就绪..."
curl --noproxy '*' --retry 15 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3211/ -o /dev/null

echo "  Stage 关键路径探活验证..."
for p in / /catalog /wholesale/plus-size-womens-clothing /wholesale/two-piece-sets /markets/nigeria /markets/ghana /robots.txt; do
    status=$(curl --noproxy '*' -sS -o /dev/null -w '%{http_code}' "http://127.0.0.1:3211$p")
    test "$status" = "200" || (echo "Failed check on $p: $status"; exit 1)
done

echo STAGE_BUILD_AND_VERIFY_SUCCESS
'@
    $stageScript = $stageScript.Replace('__RELEASE__', $release).Replace('__BACKUP__', $backup).Replace('__STAGE_APP__', $stageApp).Replace('__ID__', $ReleaseId)
    Invoke-Remote -Cmd $stageScript -Timeout 900
}

# --- ACTIVATE ---
if ($Phase -in @('All', 'Activate')) {
    Write-Host ''
    Write-Host '[4/4] 零停机原子切换上线与服务热重载...' -ForegroundColor Yellow
    $activateScript = @'
set -euo pipefail
umask 077
release=__RELEASE__
backup=__BACKUP__
stage_app=__STAGE_APP__
shared=/var/www/zamique-shared/runtime-data
live=$(cat "$backup/previous-release.txt")

echo "  停止 Stage 检查进程..."
pm2 delete "$stage_app" 2>/dev/null || true

echo "  绑定生产持久化数据路径..."
python3 - "$release" "$shared" <<'PY'
import pathlib, sys
release, shared = map(pathlib.Path, sys.argv[1:])
env = release / '.env.local'
lines = [l for l in env.read_text().splitlines() if not l.startswith(('JACK_FASHION_RUNTIME_DATA_DIR=','JACK_FASHION_INDEXNOW_ENABLED='))]
lines += [f'JACK_FASHION_RUNTIME_DATA_DIR={shared}', 'JACK_FASHION_INDEXNOW_ENABLED=1']
env.write_text('\n'.join(lines) + '\n')
env.chmod(0o600)
PY

nodebin="$release/.runtime/node-v22.23.3-linux-x64/bin/node"
if test ! -x "$nodebin"; then
    nodebin="/usr/bin/node"
fi

echo "  原子软链接切换 /var/www/zamique-current..."
ln -s "$release" /var/www/zamique-current.seo-geo-new
mv -Tf /var/www/zamique-current.seo-geo-new /var/www/zamique-current

echo "  平滑重启 PM2 jack-fashion..."
pm2 delete jack-fashion 2>/dev/null || true
cd "$release"
PORT=3200 PM2_APP_NAME=jack-fashion JACK_FASHION_RUNTIME_DATA_DIR="$shared" JACK_FASHION_INDEXNOW_ENABLED=1 ZAMIQUE_NODE_BIN="$nodebin" pm2 start ecosystem.config.cjs --only jack-fashion
pm2 save

echo "  生产服务探活验证..."
curl --noproxy '*' --retry 15 --retry-delay 1 --retry-connrefused -fsS http://127.0.0.1:3200/ -o /dev/null

echo "  清理临时上传包与构建缓存..."
rm -f /tmp/__ID__.tar.gz
rm -rf "$release/.next/cache/webpack" 2>/dev/null || true

echo ACTIVATION_OK
'@
    $activateScript = $activateScript.Replace('__RELEASE__', $release).Replace('__BACKUP__', $backup).Replace('__STAGE_APP__', $stageApp).Replace('__ID__', $ReleaseId)
    Invoke-Remote -Cmd $activateScript -Timeout 300
}

# --- VERIFY PUBLIC ACCESS ---
Write-Host ''
Write-Host '============================================================' -ForegroundColor Green
Write-Host "   ✅ Jack Fashion SEO/GEO 发布 ($ReleaseId) 已成功上线！" -ForegroundColor Green
Write-Host '============================================================' -ForegroundColor Green

Start-Sleep -Seconds 2
try {
    $resp = Invoke-WebRequest -Uri "$SiteUrl" -UseBasicParsing -TimeoutSec 15
    Write-Host "   ✅ 官网首页: $SiteUrl → HTTP $($resp.StatusCode)" -ForegroundColor Green
    $respCat = Invoke-WebRequest -Uri "$SiteUrl/wholesale/plus-size-womens-clothing" -UseBasicParsing -TimeoutSec 15
    Write-Host "   ✅ 大码批发: $SiteUrl/wholesale/plus-size-womens-clothing → HTTP $($respCat.StatusCode)" -ForegroundColor Green
    $respNig = Invoke-WebRequest -Uri "$SiteUrl/markets/nigeria" -UseBasicParsing -TimeoutSec 15
    Write-Host "   ✅ 尼日利亚: $SiteUrl/markets/nigeria → HTTP $($respNig.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️ 公网探测提示: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ''
