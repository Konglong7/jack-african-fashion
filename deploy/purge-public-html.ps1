# Exact website HTML/discovery URLs only. Uses BrowserSkill's logged-in Agent
# Window; never reads cookies/tokens or purges images and immutable assets.
param(
    [Parameter(Mandatory)][string]$BrowserInstance,
    [Parameter(Mandatory)][string]$CacheDashboardUrl,
    [Parameter(Mandatory)][string]$EvidenceDirectory,
    [string]$SitemapFile
)
$ErrorActionPreference = 'Stop'
if ($CacheDashboardUrl -notmatch '^https://dash\.cloudflare\.com/[^/]+/zamique\.com/caching/configuration$') { throw 'Wrong website cache dashboard' }
New-Item -ItemType Directory -Path $EvidenceDirectory -Force | Out-Null
function Invoke-PurgeBrowser([string[]]$Arguments) {
    $result = & bsk @Arguments --json | ConvertFrom-Json
    if ($LASTEXITCODE -ne 0) { throw "Browser operation failed: $($result.code) $($result.message)" }
    return $result
}
function Get-PurgeObservation {
    $observeDeadline=[DateTime]::UtcNow.AddSeconds(10)
    do {
        try { return (Invoke-PurgeBrowser @('observe','--session',$auditSession,'--max-tokens','16000')).text }
        catch {
            if($_.Exception.Message -notmatch 'Document changed during observation' -or [DateTime]::UtcNow -gt $observeDeadline){throw}
            # A navigation invalidates a read-only snapshot. Wait for the new
            # document; never retry a purge mutation on an uncertain result.
            Start-Sleep -Milliseconds 400
        }
    } while($true)
}
function Find-PurgeRef([string]$Text,[string]$Pattern) {
    $match=[regex]::Match($Text,$Pattern)
    if(-not $match.Success){throw "Current control absent: $Pattern"}
    return '@e'+$match.Groups[1].Value
}
[xml]$auditSitemap=if($SitemapFile){Get-Content -LiteralPath $SitemapFile -Raw}else{(Invoke-WebRequest 'https://zamique.com/sitemap.xml').Content}
$sitemapUrls=@($auditSitemap.urlset.url.loc)
if($sitemapUrls.Where({ $_ -notmatch '^https://zamique\.com(?:/|$)' -or ([uri]$_).Query -or ([uri]$_).Fragment }).Count){throw 'Unexpected canonical sitemap URL'}
$auditPaths=@($sitemapUrls | ForEach-Object { ([uri]$_).AbsolutePath }) + @('/robots.txt','/llms.txt','/llms-full.txt','/sitemap.xml','/manifest.webmanifest','/inquiry','/admin/login')
$auditUrls=@($auditPaths | Select-Object -Unique | ForEach-Object { 'https://zamique.com'+$_; 'https://www.zamique.com'+$_ })
if ($auditUrls.Where({ $_ -notmatch '^https://(www\.)?zamique\.com/' -or $_ -match '/_next/|/images/|/uploads/|_rsc=' }).Count) { throw 'Purge scope includes protected assets' }
$auditUrls | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $EvidenceDirectory 'purged-html-urls.json') -Encoding utf8
$auditSession=(Invoke-PurgeBrowser @('session','start','--browser',$BrowserInstance,'--name','zamique scoped HTML refresh','--no-focus')).session_id
$auditResults=@()
try {
    Invoke-PurgeBrowser @('navigate','--session',$auditSession,$CacheDashboardUrl) | Out-Null
    for($offset=0;$offset -lt $auditUrls.Count;$offset+=30){
        $deadline=[DateTime]::UtcNow.AddSeconds(20)
        do {
            $text=Get-PurgeObservation
            $open=[regex]::Match($text,'@e(\d+) button "自定义清除"')
            if($open.Success){break}
            if([DateTime]::UtcNow -gt $deadline){throw 'Cache configuration UI not ready'}
            Start-Sleep -Milliseconds 250
        } while($true)
        Invoke-PurgeBrowser @('click','--session',$auditSession,'--ref',('@e'+$open.Groups[1].Value)) | Out-Null
        $deadline=[DateTime]::UtcNow.AddSeconds(15)
        do {
            $text=Get-PurgeObservation
            if($text -match 'dialog "自定义清除"'){break}
            if([DateTime]::UtcNow -gt $deadline){throw 'Scoped URL purge dialog absent'}
            # Opening the dialog is asynchronous; read its current state rather
            # than clicking again while a transition obscures the page.
            Start-Sleep -Milliseconds 250
        } while($true)
        if($text -notmatch 'radio "URL [^\n]*\[checked\]'){
            $ref=Find-PurgeRef $text '@e(\d+) radio "URL '
            Invoke-PurgeBrowser @('click','--session',$auditSession,'--ref',$ref) | Out-Null
            $text=Get-PurgeObservation
        }
        $ref=Find-PurgeRef $text '@e(\d+) textbox "您将需要指定文件'
        $batch=@($auditUrls[$offset..([Math]::Min($offset+29,$auditUrls.Count-1))])
        $value=$batch -join "`n"
        $filled=Invoke-PurgeBrowser @('fill','--session',$auditSession,'--ref',$ref,'--value',$value)
        if($filled.value_length -ne $value.Length){throw 'Exact URL input length differs'}
        $deadline=[DateTime]::UtcNow.AddSeconds(15)
        do{
            $text=Get-PurgeObservation
            $submit=[regex]::Match($text,'@e(\d+) button "清除"(?:\r?\n|$)')
            if($submit.Success){break}
            if([DateTime]::UtcNow -gt $deadline){throw 'URL validation has not enabled purge'}
            Start-Sleep -Milliseconds 250
        }while($true)
        Invoke-PurgeBrowser @('click','--session',$auditSession,'--ref',('@e'+$submit.Groups[1].Value)) | Out-Null
        $deadline=[DateTime]::UtcNow.AddSeconds(15)
        do{
            $text=Get-PurgeObservation
            if($text -match '已成功收到清除请求' -and $text -notmatch 'dialog "自定义清除"'){break}
            if([DateTime]::UtcNow -gt $deadline){throw 'Purge result uncertain; do not repeat the mutation automatically'}
            Start-Sleep -Milliseconds 300
        }while($true)
        $auditResults+=@{batch=[int]($offset/30)+1;urls=$batch.Count;confirmed=$true}
        Write-Output "HTML refresh batch $([int]($offset/30)+1): $($batch.Count) URLs confirmed"
    }
} finally {
    $auditResults | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $EvidenceDirectory 'purge-results.json') -Encoding utf8
    Invoke-PurgeBrowser @('session','stop',$auditSession) | Out-Null
}
