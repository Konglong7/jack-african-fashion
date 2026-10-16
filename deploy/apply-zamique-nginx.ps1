# Apply the website virtual host atomically, syntax-test before reload, and
# restore the prior file if a gate fails. No other host or network changes.
param([ValidatePattern('^[a-z0-9-]{6,40}$')][string]$ChangeId='cache-policy')
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\config.ps1"
Import-Module Posh-SSH
$auditCredential=Import-Clixml -LiteralPath $CredFile
$auditSftp=New-SFTPSession -ComputerName $VPS_HOST -Credential $auditCredential -AcceptKey
try { Set-SFTPItem -SessionId $auditSftp.SessionId -Path "$PSScriptRoot\nginx-zamique.conf" -Destination '/tmp' -Force }
finally { Remove-SFTPSession -SessionId $auditSftp.SessionId | Out-Null }
$auditCommand=@'
set -euo pipefail
backup=/backup/zamique-continuation-20261001
mkdir -p "$backup"
chmod 700 "$backup"
test "$(readlink -f /etc/nginx/sites-enabled/zamique)" = /etc/nginx/sites-available/zamique
test -f /tmp/nginx-zamique.conf
test ! -e "$backup/nginx-before-__CHANGE_ID__.conf"
cp -a /etc/nginx/sites-available/zamique "$backup/nginx-before-__CHANGE_ID__.conf"
cp /tmp/nginx-zamique.conf "$backup/nginx-after-__CHANGE_ID__.conf"
restore() {
  cp "$backup/nginx-before-__CHANGE_ID__.conf" /etc/nginx/sites-available/zamique
  nginx -t && systemctl reload nginx
}
trap restore ERR
install -m 644 /tmp/nginx-zamique.conf /etc/nginx/sites-available/zamique.new
mv /etc/nginx/sites-available/zamique.new /etc/nginx/sites-available/zamique
nginx -t
systemctl reload nginx
curl --noproxy '*' --resolve zamique.com:2054:127.0.0.1 -k -fsS https://zamique.com:2054/catalog -o /dev/null
trap - ERR
echo WEBSITE_NGINX_POLICY_APPLIED
'@
& "$PSScriptRoot\remote-exec.ps1" -Command $auditCommand.Replace('__CHANGE_ID__',$ChangeId) -Timeout 60
