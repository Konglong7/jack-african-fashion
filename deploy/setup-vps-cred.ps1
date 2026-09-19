# VPS 凭据管理脚本
# 用途：把 SSH 登录口令加密存到本机（DPAPI，仅当前 Windows 用户可解密）
# 以后部署/更新脚本都从这里读凭据，全自动连服务器，无需手动输密码
#
# 用法：
#   1) 先设置环境变量 VPS_HOST（目标服务器地址），或复制 deploy/deploy.config.example.ps1
#      为 deploy/deploy.config.local.ps1 并填写
#   2) 首次或改密后：运行脚本并按提示输入密码（脚本末尾会自动测试连接）

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\config.ps1"

$sec = Read-Host "请输入 $VPS_USER@$VPS_HOST 的登录密码" -AsSecureString
$cred = New-Object System.Management.Automation.PSCredential($VPS_USER, $sec)

$cred | Export-Clixml -Path $CredFile -Force
icacls $CredFile /inheritance:r /grant:r "$($env:USERNAME):(R)" 2>&1 | Out-Null

Write-Host "✅ 凭据已加密存储: $CredFile" -ForegroundColor Green

# 验证连接
Import-Module Posh-SSH -ErrorAction Stop
try {
    $s = New-SSHSession -ComputerName $VPS_HOST -Credential $cred -AcceptKey -ErrorAction Stop
    $r = Invoke-SSHCommand -SessionId $s.SessionId -Command "echo CRED_OK && hostname && pm2 list | grep $Pm2AppName" -TimeOut 10
    Write-Host "验证连接: " -ForegroundColor Green
    Write-Host ($r.Output -join "`n")
    Remove-SSHSession -SessionId $s.SessionId | Out-Null
    Write-Host "✅ 连接正常，$Pm2AppName 进程在线" -ForegroundColor Green
} catch {
    Write-Host "❌ 连接失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   检查密码是否正确、服务器是否在线" -ForegroundColor Yellow
}
    Write-Host "验证连接: " -ForegroundColor Green
    Write-Host ($r.Output -join "`n")
    Remove-SSHSession -SessionId $s.SessionId | Out-Null
    Write-Host "✅ 连接正常，jack-fashion 进程在线" -ForegroundColor Green
} catch {
    Write-Host "❌ 连接失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   检查密码是否正确、服务器是否在线" -ForegroundColor Yellow
}
