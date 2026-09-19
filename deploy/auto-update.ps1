# 一键更新上线（全自动版）
# 用途：本地改完代码后，跑这个脚本，自动打包 → 上传 → 服务器构建 → 重启 → 验证
#
# 用法：先设置好环境变量（见 deploy/deploy.config.example.ps1），然后
#   powershell -ExecutionPolicy Bypass -File deploy\auto-update.ps1
#
# 本仓库不含任何真实 IP / 域名 / 口令：服务器地址、站点目录、PM2 进程名、站点 URL
# 全部来自 VPS_HOST / REMOTE_DIR / PM2_APP_NAME / SITE_URL 环境变量。

$ErrorActionPreference = 'Stop'
Import-Module Posh-SSH -ErrorAction Stop

# 解析 VPS_HOST / VPS_USER / CredFile / Pm2AppName / RemoteDir / ProjectRoot / PackFile / SiteUrl
. "$PSScriptRoot\config.ps1"

$VPS = $VPS_HOST
$packName = Split-Path -Leaf $PackFile

Write-Host ''
Write-Host '============================================================' -ForegroundColor Cyan
Write-Host '   Jack African Fashion — 自动更新上线' -ForegroundColor Cyan
Write-Host '============================================================' -ForegroundColor Cyan
Write-Host "   服务器  : $VPS_USER@$VPS_HOST"
Write-Host "   站点目录: $RemoteDir"
Write-Host "   PM2 进程: $Pm2AppName"

# 1. 检查凭据
if (-not (Test-Path $CredFile)) {
    Write-Host '❌ 未找到 SSH 凭据，先配置：' -ForegroundColor Red
    Write-Host '   powershell -ExecutionPolicy Bypass -File deploy\setup-vps-cred.ps1' -ForegroundColor Yellow
    exit 1
}
$cred = Import-Clixml -Path $CredFile

# 2. 打包
Write-Host ''
Write-Host '[1/4] 打包项目（排除 node_modules/.next/.git 与大体积素材）...' -ForegroundColor Yellow
if (Test-Path $PackFile) { Remove-Item $PackFile -Force }
Push-Location $ProjectRoot
& tar -czf $packName `
    --exclude='data/analytics.json' `
    --exclude='data/analytics.json.tmp' `
    --exclude='*.bak' `
    src public data package.json package-lock.json next.config.ts tsconfig.json next-env.d.ts postcss.config.mjs eslint.config.mjs ecosystem.config.cjs
$tarExitCode = $LASTEXITCODE
Pop-Location
if ($tarExitCode -ne 0 -or -not (Test-Path $PackFile)) { throw '项目打包失败' }
$sizeMB = [math]::Round((Get-Item $PackFile).Length / 1MB, 2)
Write-Host "   ✅ 打包完成: $sizeMB MB" -ForegroundColor Green

# 3. 上传
Write-Host ''
Write-Host '[2/4] 上传到服务器...' -ForegroundColor Yellow
$remoteTmp = '/tmp/jack-upload'
$maxRetries = 3
for ($attempt = 1; $attempt -le $maxRetries; $attempt++) {
    $sftp = $null
    try {
        $sftp = New-SFTPSession -ComputerName $VPS -Credential $cred -AcceptKey -ErrorAction Stop
        try { $sftp.Session.CreateDirectory($remoteTmp) } catch {}
        Write-Host "   上传中（尝试 $attempt/$maxRetries，约 1-2 分钟）..." -ForegroundColor DarkGray
        $start = Get-Date
        Set-SFTPItem -SessionId $sftp.SessionId -Path $PackFile -Destination "$remoteTmp/" -Force
        $elapsed = ((Get-Date) - $start).TotalSeconds
        Write-Host ("   ✅ 上传完成，{0:N1} 秒" -f $elapsed) -ForegroundColor Green
        break
    } catch {
        if ($attempt -ge $maxRetries) { throw $_ }
        Write-Host "   ⚠️ 上传遇到网络抖动，正在重试 ($attempt/$maxRetries)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    } finally {
        if ($sftp) { Remove-SFTPSession -SessionId $sftp.SessionId -ErrorAction SilentlyContinue | Out-Null }
    }
}

# 4. 服务器端：备份 → 解压 → 安装依赖 → 构建 → 零停机重启 → 探活
Write-Host ''
Write-Host '[3/4] 服务器端构建 + 重启（3-8 分钟，请耐心）...' -ForegroundColor Yellow

# 用占位符 + Replace 注入变量，避免 here-string 里的 shell 变量（$OK/$i/$(date ...)）被 PowerShell 误插值
$remoteTemplate = @'
set -e
cd __REMOTE_DIR__
echo "  备份线上数据到 /backup..."
mkdir -p /backup
tar -czf "/backup/jack-predeploy-$(date +%Y%m%d-%H%M%S).tar.gz" data public/images/products .env.local 2>/dev/null || true

echo "  解压覆盖代码与资源（含最新商品与图片）..."
tar -xzf __REMOTE_TMP__/__PACK_NAME__ -C __REMOTE_DIR__
rm -f __REMOTE_TMP__/__PACK_NAME__
chmod 600 .env.local 2>/dev/null || true

echo "  检查依赖..."
# 用 npm ci 而不是 --omit=dev：next build 依赖 typescript / tailwindcss / @tailwindcss/postcss，
# 它们都在 devDependencies 里，裁掉 devDeps 会导致远端构建失败。
npm ci --no-audit 2>/dev/null || npm install --no-audit 2>/dev/null || true

echo "  构建..."
NODE_OPTIONS="--max-old-space-size=1536" npm run build

echo "  零停机重启 PM2..."
pm2 reload __PM2_APP__ 2>/dev/null || pm2 restart __PM2_APP__

echo "  等待服务就绪..."
OK=0
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  sleep 2
  if curl -sf -o /dev/null http://127.0.0.1:3000; then
    echo "DEPLOY_OK"
    OK=1
    break
  fi
done

if [ $OK -eq 0 ]; then
  echo "DEPLOY_FAIL"
  pm2 logs __PM2_APP__ --lines 20 --nostream
fi
'@

$remoteScript = $remoteTemplate.
    Replace('__REMOTE_DIR__', $RemoteDir).
    Replace('__REMOTE_TMP__', $remoteTmp).
    Replace('__PACK_NAME__', $packName).
    Replace('__PM2_APP__', $Pm2AppName)

$ssh = New-SSHSession -ComputerName $VPS -Credential $cred -AcceptKey -ErrorAction Stop
try {
    $r = Invoke-SSHCommand -SessionId $ssh.SessionId -Command $remoteScript -TimeOut 480
    Write-Host ($r.Output -join "`n")
    if ($r.Output -match 'DEPLOY_OK') {
        Write-Host ''
        Write-Host '   ✅ 服务器构建重启完成' -ForegroundColor Green
    } else {
        throw '服务器构建或重启失败，部署已停止'
    }
} finally {
    Remove-SSHSession -SessionId $ssh.SessionId | Out-Null
}

# 5. 验证公网访问
Write-Host ''
Write-Host '[4/4] 验证公网访问...' -ForegroundColor Yellow
Start-Sleep -Seconds 2
try {
    $resp = Invoke-WebRequest -Uri $SiteUrl -UseBasicParsing -TimeoutSec 15
    Write-Host "   ✅ $SiteUrl → HTTP $($resp.StatusCode), 长度 $($resp.RawContentLength)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️ 访问异常: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ''
Write-Host '============================================================' -ForegroundColor Green
Write-Host '   ✅ 全自动更新上线完成！' -ForegroundColor Green
Write-Host '============================================================' -ForegroundColor Green
Write-Host "   网站首页: $SiteUrl" -ForegroundColor Cyan
Write-Host "   管理后台: $SiteUrl/admin" -ForegroundColor Cyan
Write-Host ''
