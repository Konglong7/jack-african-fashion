# Reclaim only disposable npm download and webpack build caches. No releases,
# images, compiled runtime output, credentials, npx/agent/plugin caches or backups.
param([switch]$Apply)
$ErrorActionPreference = 'Stop'
$auditCommand = @'
python3 - <<'PY'
import datetime,hashlib,json,os,pathlib,shutil,subprocess
apply = __APPLY__
live=pathlib.Path('/var/www/zamique-current').resolve(strict=True)
roots=[pathlib.Path('/var/www/zamique'),*sorted(pathlib.Path('/var/www/zamique-releases').iterdir())]
assert live.parent==pathlib.Path('/var/www/zamique-releases')
apps=json.loads(subprocess.check_output(['pm2','jlist'],text=True))
assert len(apps)==1 and apps[0]['name']=='jack-fashion' and apps[0]['pm2_env']['status']=='online'
assert pathlib.Path(apps[0]['pm2_env']['pm_cwd']).resolve()==live
# A concurrent build/install could use these caches. Only the established PM2
# daemon and its running Next server may be using Node while this task executes.
allowed={str(apps[0]['pid']),str(subprocess.check_output(['systemctl','show','pm2-root','--property=MainPID','--value'],text=True).strip())}
for entry in pathlib.Path('/proc').iterdir():
    if not entry.name.isdigit():continue
    try:
        exe=(entry/'exe').resolve(strict=True)
        if exe.name=='node' and entry.name not in allowed:
            raise RuntimeError('Concurrent Node process detected; cache cleanup deferred')
    except (FileNotFoundError,PermissionError):pass
targets=[]
for root in roots:
    assert root.resolve()==root and (root==pathlib.Path('/var/www/zamique') or root.parent==pathlib.Path('/var/www/zamique-releases'))
    target=root/'.next/cache/webpack'
    if not target.exists():continue
    assert target.resolve(strict=True)==target and target.name=='webpack' and target.parent.name=='cache'
    assert not any(p.is_symlink() for p in target.rglob('*'))
    targets.append(target)
npmcache=pathlib.Path('/root/.npm/_cacache')
assert npmcache.resolve()==npmcache and not npmcache.is_symlink()
assert not any(p.is_symlink() for p in npmcache.rglob('*'))
node=live/'.runtime/node-v22.23.3-linux-x64/bin/node'
npm=pathlib.Path('/usr/lib/node_modules/npm/bin/npm-cli.js')
assert node.is_file() and npm.is_file()
def manifest():
    result={}
    for root in roots:
        for rel in ['data/products.json','data/site-content.json','package.json','package-lock.json','ecosystem.config.cjs','next.config.ts','.next/BUILD_ID','.next/prerender-manifest.json']:
            p=root/rel
            if p.is_file():result[str(p)]={'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
        for rel in ['public','.next/server','.next/static','src','node_modules','.runtime']:
            directory=root/rel
            if not directory.exists():continue
            for p in directory.rglob('*'):
                if p.is_file():
                    # ISR HTML/RSC cache files can refresh during normal traffic.
                    # Verify immutable compiled server code, not those live caches.
                    if rel=='.next/server' and p.suffix in {'.html','.rsc','.meta','.body'}:continue
                    st=p.stat();result[str(p)]={'bytes':st.st_size,'mtime_ns':st.st_mtime_ns,'inode':st.st_ino}
        # Track secret-file identity, never read or emit its contents.
        secret=root/'.env.local'
        if secret.exists():
            st=secret.stat();result[str(secret)]={'bytes':st.st_size,'mtime_ns':st.st_mtime_ns,'inode':st.st_ino}
    for p in [pathlib.Path('/etc/nginx/sites-available/zamique'),pathlib.Path('/etc/systemd/system/pm2-root.service')]:
        result[str(p)]={'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
    return result
before=manifest()
size=lambda p:int(subprocess.check_output(['du','-sm',str(p)],text=True).split()[0])
plan={'time':datetime.datetime.now().astimezone().isoformat(),'active_release':str(live),
      'targets':[{'path':str(p),'mib':size(p)} for p in targets],
      'npm_download_cache_mib':size(npmcache) if npmcache.exists() else 0,
      'protected_file_count':len(before),'disk_before':subprocess.check_output(['df','-Pm','/var/www'],text=True)}
if apply:
    backup=pathlib.Path('/backup/zamique-continuation-20261001')
    backup.mkdir(mode=0o700,exist_ok=True)
    (backup/'cache-cleanup-protected-files-before.json').write_text(json.dumps(before))
    (backup/'cache-cleanup-plan.json').write_text(json.dumps(plan,indent=2))
    for target in targets:shutil.rmtree(target)
    subprocess.run([str(node),str(npm),'cache','clean','--force','--cache','/root/.npm'],check=True,capture_output=True,text=True)
    after=manifest()
    assert before==after,'Protected files changed during cache cleanup'
    plan.update({'applied':True,'protected_files_unchanged':True,'disk_after':subprocess.check_output(['df','-Pm','/var/www'],text=True)})
    (backup/'cache-cleanup-result.json').write_text(json.dumps(plan,indent=2))
else:plan['applied']=False
print(json.dumps(plan))
PY
'@
$auditCommand=$auditCommand.Replace('__APPLY__',$(if($Apply){'True'}else{'False'}))
$auditRaw=& "$PSScriptRoot\remote-exec.ps1" -Command $auditCommand -Timeout 120
$auditRaw
