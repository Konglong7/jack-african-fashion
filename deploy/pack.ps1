<#
.SYNOPSIS
    打包部署包（只含运行站点所需的文件，排除依赖、构建产物与开发残留）。

.DESCRIPTION
    生成一个 tar.gz，内含 src / public / data / package.json 等运行必需文件。
    之后可任选一种方式上传：
      A) 1Panel 等面板的文件管理器（可视化）
      B) scp / sftp 命令行
      C) 直接用 deploy/auto-update.ps1 全自动上传 + 构建 + 重启

    服务器地址等参数来自环境变量（见 deploy/deploy.config.example.ps1）。

.EXAMPLE
    $env:VPS_HOST = '203.0.113.10'
    powershell -ExecutionPolicy Bypass -File deploy\pack.ps1
#>

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\config.ps1"

$packName = Split-Path -Leaf $PackFile

Write-Host ''
Write-Host '============================================================' -ForegroundColor Cyan
Write-Host '   Jack African Fashion — 打包部署包' -ForegroundColor Cyan
Write-Host '============================================================' -ForegroundColor Cyan
Write-Host "   项目目录 : $ProjectRoot"
Write-Host "   目标服务器: $VPS_USER@$VPS_HOST"
Write-Host "   站点目录 : $RemoteDir"
Write-Host "   输出文件 : $PackFile"
Write-Host ''

if (Test-Path $PackFile) { Remove-Item $PackFile -Force }

Write-Host '[1/2] 正在打包（排除依赖 / 构建产物 / 开发残留）...' -ForegroundColor Yellow
Push-Location $ProjectRoot
try {
    # 采用白名单方式打包：只带运行必需的内容，避免把开发残留一起传上服务器
    & tar -czf $packName `
        --exclude='data/analytics.json' `
        --exclude='data/analytics.json.tmp' `
        --exclude='*.bak' `
        src public data deploy package.json package-lock.json `
        next.config.ts tsconfig.json next-env.d.ts postcss.config.mjs eslint.config.mjs ecosystem.config.cjs
    if ($LASTEXITCODE -ne 0) { throw 'tar 打包失败' }
} finally { Pop-Location }

$sizeMB = [math]::Round((Get-Item $PackFile).Length / 1MB, 1)
Write-Host "[1/2] ✅ 打包完成: $PackFile ($sizeMB MB)" -ForegroundColor Green

Write-Host ''
Write-Host '[2/2] 上传方式（任选其一）：' -ForegroundColor Yellow
Write-Host ''
Write-Host '==== 方式 A：面板文件管理器（可视化）====' -ForegroundColor Cyan
Write-Host '  1) 打开你的面板（如 1Panel）→ 主机 → 文件'
Write-Host "  2) 进入 $RemoteDir 的上级目录"
Write-Host "  3) 上传本包：$PackFile，然后右键解压到站点目录"
Write-Host ''
Write-Host '==== 方式 B：命令行 scp ====' -ForegroundColor Cyan
Write-Host "    scp `"$PackFile`" $VPS_USER@$VPS_HOST:/root/"
Write-Host "    ssh $VPS_USER@$VPS_HOST"
Write-Host "    mkdir -p $RemoteDir"
Write-Host "    tar -xzf /root/$packName -C $RemoteDir"
Write-Host ''
Write-Host '==== 方式 C：全自动（推荐）====' -ForegroundColor Cyan
Write-Host '    powershell -ExecutionPolicy Bypass -File deploy\auto-update.ps1'
Write-Host ''
Write-Host '============================================================' -ForegroundColor Green
Write-Host ' 上传完成后，在服务器上执行首次部署：' -ForegroundColor Green
Write-Host '============================================================' -ForegroundColor Green
Write-Host "    ssh $VPS_USER@$VPS_HOST"
Write-Host "    cd $RemoteDir"
Write-Host '    bash deploy/deploy.sh'
Write-Host ''
Write-Host '部署脚本会自动：装 Node + PM2 → npm install → build → 启动 → 配置备份'
Write-Host '完成后去面板配置反向代理 + SSL（脚本结束会提示步骤）'
Write-Host ''
