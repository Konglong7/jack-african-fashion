# 远程部署助手（自动读取加密凭据，无需手动输密码）
# 用途：连服务器、跑命令、上传文件
# 被 deploy/ 下其他脚本调用，不直接运行
#
# 服务器地址等参数来自环境变量 / deploy.config.local.ps1（见 deploy/config.ps1），
# 本仓库不含任何真实 IP、域名或口令。

param(
    [Parameter(Mandatory=$true)][string]$Command,
    [int]$Timeout = 60
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\config.ps1"
Import-Module Posh-SSH -ErrorAction Stop

if (-not (Test-Path $CredFile)) {
    Write-Host "❌ 凭据文件不存在: $CredFile" -ForegroundColor Red
    Write-Host "   先运行: powershell -ExecutionPolicy Bypass -File deploy\setup-vps-cred.ps1" -ForegroundColor Yellow
    exit 1
}

$cred = Import-Clixml -Path $CredFile
$s = New-SSHSession -ComputerName $VPS_HOST -Credential $cred -AcceptKey -ErrorAction Stop
try {
    $r = Invoke-SSHCommand -SessionId $s.SessionId -Command $Command -TimeOut $Timeout
    Write-Output $r.Output
    if ($r.Error) { Write-Host "[stderr]" -ForegroundColor Yellow; Write-Host ($r.Error -join "`n") -ForegroundColor Yellow }
    if ($r.ExitCode -ne 0) { Write-Host "[exit $($r.ExitCode)]" -ForegroundColor Red }
} finally {
    Remove-SSHSession -SessionId $s.SessionId | Out-Null
}
