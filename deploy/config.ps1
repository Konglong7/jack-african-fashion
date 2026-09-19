<#
.SYNOPSIS
    部署配置解析（所有基础设施参数一律来自环境变量，不在仓库中硬编码）。

.DESCRIPTION
    本仓库**不包含任何真实服务器 IP、域名、密码或密钥**。
    运行 deploy/ 下任意脚本前，请先设置需要的环境变量（见 deploy.config.example.ps1）。

    被 deploy/ 下的其它脚本通过 `. "$PSScriptRoot\config.ps1"` 点源引入。
    引入后可直接使用：$VPS_HOST / $VPS_USER / $RemoteDir / $Pm2AppName / $ProjectRoot / $CredFile

.NOTES
    设计取舍：把"必需项缺失"变成**启动即失败**的显式错误，
    而不是给一个看起来能用、实际上会连错机器的默认值。
#>

$ErrorActionPreference = 'Stop'

function Get-RequiredEnv {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [string]$Hint = ''
    )

    $value = [Environment]::GetEnvironmentVariable($Name)
    if ([string]::IsNullOrWhiteSpace($value)) {
        Write-Host ''
        Write-Host "✗ 缺少必需的环境变量: $Name" -ForegroundColor Red
        if ($Hint) { Write-Host "  $Hint" -ForegroundColor Yellow }
        Write-Host ''
        Write-Host '  设置示例（当前会话生效）:' -ForegroundColor Cyan
        Write-Host "    `$env:$Name = '<你的值>'" -ForegroundColor Cyan
        Write-Host ''
        Write-Host '  或复制 deploy/deploy.config.example.ps1 为 deploy/deploy.config.local.ps1 并填写后点源。'
        Write-Host '  注意：deploy.config.local.ps1 已被 .gitignore 忽略，不会进入版本库。'
        Write-Host ''
        exit 1
    }
    return $value
}

function Get-OptionalEnv {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Default
    )
    $value = [Environment]::GetEnvironmentVariable($Name)
    if ([string]::IsNullOrWhiteSpace($value)) { return $Default }
    return $value
}

# ---------------------------- 必填项 ----------------------------
# 目标服务器地址（IP 或域名）
$VPS_HOST = Get-RequiredEnv -Name 'VPS_HOST' -Hint '目标服务器地址，例如 203.0.113.10 或 your-domain.example'

# ---------------------------- 可选项 ----------------------------
# SSH 登录用户
$VPS_USER = Get-OptionalEnv -Name 'VPS_USER' -Default 'root'

# 本机 SSH 凭据缓存位置（用 DPAPI 加密，仅当前 Windows 用户可解密）
$CredFile = Get-OptionalEnv -Name 'VPS_CRED_FILE' -Default "$env:USERPROFILE\.ssh\vps-fasion-cred.xml"

# PM2 进程名
$Pm2AppName = Get-OptionalEnv -Name 'PM2_APP_NAME' -Default 'jack-fashion'

# 服务器上的站点目录
$RemoteDir = Get-OptionalEnv -Name 'REMOTE_DIR' -Default '/var/www/jack-fashion-current'

# 线上站点 URL —— 部署完成后用于验证公网可访问性
$SiteUrl = Get-OptionalEnv -Name 'SITE_URL' -Default 'https://example.com'

# 打包产物路径
$PackFile = Join-Path $ProjectRoot 'deploy-package.tar.gz'

# 允许点源本地私有配置覆盖以上任意项（该文件不入库）
$localConfig = Join-Path $PSScriptRoot 'deploy.config.local.ps1'
if (Test-Path $localConfig) { . $localConfig }
