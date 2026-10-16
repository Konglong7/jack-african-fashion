param(
    [Parameter(Mandatory)][ValidateSet('PreviewMOQ','ApplyMOQ','InstallImages')][string]$Action,
    [ValidatePattern('^[a-f0-9]{64}$')][string]$ExpectedProductsHash,
    [ValidatePattern('^[a-z0-9-]{6,50}$')][string]$ReleaseId
)
$ErrorActionPreference='Stop'
. "$PSScriptRoot\config.ps1"
Import-Module Posh-SSH
$maintenanceCredential=Import-Clixml -LiteralPath $CredFile
$maintenanceSftp=New-SFTPSession -ComputerName $VPS_HOST -Credential $maintenanceCredential -AcceptKey
try {
    Set-SFTPItem -SessionId $maintenanceSftp.SessionId -Path "$PSScriptRoot\image-moq-maintenance.py" -Destination '/tmp' -Force
    if ($Action -eq 'InstallImages') {
        if (!$ReleaseId) { throw 'Release ID is required' }
        $maintenanceArtifacts=Join-Path $ProjectRoot 'artifacts\image-speed-moq-2026-10-01'
        $maintenanceArchive=Join-Path $maintenanceArtifacts 'image-variants.tar.gz'
        $maintenanceManifest=Join-Path $maintenanceArtifacts 'image-variants.json'
        $maintenancePaths=(Get-Content -LiteralPath $maintenanceManifest -Raw | ConvertFrom-Json).verification.path | ForEach-Object { $_.TrimStart('/') } | Sort-Object -Unique
        $maintenanceList=Join-Path $maintenanceArtifacts 'image-variant-paths.txt'
        [IO.File]::WriteAllLines($maintenanceList,$maintenancePaths,[Text.UTF8Encoding]::new($false))
        & tar -czf $maintenanceArchive -C (Join-Path $ProjectRoot 'public') -T $maintenanceList
        if ($LASTEXITCODE -ne 0) { throw 'Image archive creation failed' }
        Set-SFTPItem -SessionId $maintenanceSftp.SessionId -Path $maintenanceArchive -Destination '/tmp' -Force
        Set-SFTPItem -SessionId $maintenanceSftp.SessionId -Path $maintenanceManifest -Destination '/tmp' -Force
    }
} finally { Remove-SFTPSession -SessionId $maintenanceSftp.SessionId | Out-Null }
if ($Action -eq 'InstallImages') {
    $maintenanceCommand="python3 /tmp/image-moq-maintenance.py images --release-id '$ReleaseId' --archive /tmp/image-variants.tar.gz --manifest /tmp/image-variants.json"
} else {
    if (!$ExpectedProductsHash) { throw 'Expected product SHA256 is required' }
    $maintenanceCommand="python3 /tmp/image-moq-maintenance.py moq --expected-hash '$ExpectedProductsHash'"
    if ($Action -eq 'ApplyMOQ') { $maintenanceCommand+=' --apply' }
}
& "$PSScriptRoot\remote-exec.ps1" -Command $maintenanceCommand -Timeout 180
if ($Action -eq 'InstallImages') {
    & "$PSScriptRoot\remote-exec.ps1" -Command 'pm2 restart jack-fashion-seo-stage' -Timeout 45
}
