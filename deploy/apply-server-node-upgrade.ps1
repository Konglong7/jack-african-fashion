# Uses only the prepared packages; a temporary independent website process
# covers the PM2 restart. The remote script owns rollback and all health gates.
$ErrorActionPreference='Stop'
. "$PSScriptRoot\config.ps1"
Import-Module Posh-SSH
$auditCredential=Import-Clixml -LiteralPath $CredFile
$auditSftp=New-SFTPSession -ComputerName $VPS_HOST -Credential $auditCredential -AcceptKey
try { Set-SFTPItem -SessionId $auditSftp.SessionId -Path "$PSScriptRoot\apply-server-node-upgrade.py" -Destination '/backup/zamique-continuation-20261001/node-upgrade' -Force }
finally { Remove-SFTPSession -SessionId $auditSftp.SessionId | Out-Null }
& "$PSScriptRoot\remote-exec.ps1" -Command 'python3 /backup/zamique-continuation-20261001/node-upgrade/apply-server-node-upgrade.py' -Timeout 420
