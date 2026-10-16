# Read-only bounded sampling; no scheduled task, workload generator or login.
param(
    [ValidateRange(1,20)][int]$Samples=1,
    [ValidateRange(5,30)][int]$IntervalSeconds=15,
    [Parameter(Mandatory)][string]$OutputPath
)
$ErrorActionPreference='Stop'
if(($Samples-1)*$IntervalSeconds -gt 300){throw 'Observation window must be at most five minutes'}
$auditCommand=@'
python3 - <<'PY'
import datetime,json,pathlib,subprocess,time,urllib.request
samples=[]
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
for index in range(__SAMPLES__):
    apps=json.loads(subprocess.check_output(['pm2','jlist'],text=True))
    rows=[]
    for a in apps:
        e=a['pm2_env'];log=pathlib.Path(e['pm_err_log_path']).stat()
        rows.append({'name':a['name'],'pid':a['pid'],'status':e['status'],'restarts':e['restart_time'],
                     'rss_bytes':a['monit']['memory'],'error_log_bytes':log.st_size,'error_log_mtime':log.st_mtime})
    with opener.open(urllib.request.Request('http://127.0.0.1:3200/catalog',headers={'Host':'zamique.com'}),timeout=25) as r:
        status=r.status;r.read()
    samples.append({'time':datetime.datetime.now().astimezone().isoformat(),'apps':rows,'catalog_status':status})
    if index+1<__SAMPLES__:time.sleep(__INTERVAL__)
first=samples[0]['apps'];last=samples[-1]['apps']
assert len(first)==1 and first[0]['name']=='jack-fashion'
checks={'all_online':all(len(s['apps'])==1 and s['apps'][0]['status']=='online' for s in samples),
        'all_catalog_200':all(s['catalog_status']==200 for s in samples),
        'same_pid':all(s['apps'][0]['pid']==first[0]['pid'] for s in samples),
        'no_additional_restarts':all(s['apps'][0]['restarts']==first[0]['restarts'] for s in samples),
        'error_log_unchanged':all(s['apps'][0]['error_log_bytes']==first[0]['error_log_bytes'] and s['apps'][0]['error_log_mtime']==first[0]['error_log_mtime'] for s in samples)}
result={'scope':'bounded read-only observation, not a load test','samples':samples,'checks':checks,
        'max_rss_mib':round(max(s['apps'][0]['rss_bytes'] for s in samples)/1048576,1),
        'disk':subprocess.check_output(['df','-Pm','/var/www'],text=True).strip()}
pathlib.Path('/backup/zamique-continuation-20261001/runtime-observation.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result))
assert all(checks.values())
PY
'@
$auditRaw=& "$PSScriptRoot\remote-exec.ps1" -Command $auditCommand.Replace('__SAMPLES__',[string]$Samples).Replace('__INTERVAL__',[string]$IntervalSeconds) -Timeout (60+($Samples-1)*$IntervalSeconds)
$auditResult=$auditRaw -join "`n"|ConvertFrom-Json
$auditResult|ConvertTo-Json -Depth 8|Set-Content -LiteralPath $OutputPath -Encoding utf8
$auditResult|Select-Object scope,checks,max_rss_mib,disk|ConvertTo-Json -Depth 5
