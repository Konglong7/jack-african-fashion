# Prepare signed NodeSource packages and prove compatibility/rollback before
# changing the installed host runtime. Existing repository key is reused.
$ErrorActionPreference='Stop'
$auditCommand=@'
python3 - <<'PY'
import hashlib,json,os,pathlib,re,shutil,subprocess
backup=pathlib.Path('/backup/zamique-continuation-20261001/node-upgrade')
backup.mkdir(mode=0o700,parents=True,exist_ok=True)
assert not (backup/'applied.json').exists(),'Runtime upgrade has already been applied'
temp=pathlib.Path('/tmp/zamique-node22-apt')
temp.mkdir(mode=0o755,exist_ok=True)
assert temp.resolve()==temp
source=pathlib.Path('/etc/apt/sources.list.d/nodesource.sources')
old=source.read_text()
assert old.count('https://deb.nodesource.com/node_20.x')==1
assert 'Signed-By: /usr/share/keyrings/nodesource.gpg' in old
assert pathlib.Path('/usr/share/keyrings/nodesource.gpg').is_file()
new=old.replace('https://deb.nodesource.com/node_20.x','https://deb.nodesource.com/node_22.x')
(temp/'node22.sources').write_text(new)
(backup/'nodesource-before.sources').write_text(old)
(backup/'nodesource-after.sources').write_text(new)
shutil.copy2('/etc/systemd/system/pm2-root.service',backup/'pm2-root.service')
def run(args,**kw):
    p=subprocess.run(args,capture_output=True,text=True,**kw)
    if p.returncode:
        raise RuntimeError(str(args[:3])+' failed: '+p.stderr[-1500:]+p.stdout[-1500:])
    return p.stdout
old_version=run(['dpkg-query','-W','-f=${Version}','nodejs']).strip()
assert old_version.startswith('20.')
# APT verifies hashes against the existing signed NodeSource 20 metadata.
old_deb=backup/('nodejs_'+old_version+'_amd64.deb')
if not old_deb.is_file():run(['apt-get','download','nodejs='+old_version],cwd=backup,timeout=120)
assert old_deb.is_file()
lists=temp/'lists';(lists/'partial').mkdir(mode=0o755,parents=True,exist_ok=True)
archives=temp/'archives';(archives/'partial').mkdir(mode=0o755,parents=True,exist_ok=True)
opts=['-o','Dir::Etc::sourcelist='+str(temp/'node22.sources'),'-o','Dir::Etc::sourceparts=-','-o','Dir::State::lists='+str(lists),'-o','Dir::Cache::archives='+str(archives),'-o','Acquire::Retries=1','-o','Acquire::https::Timeout=30']
run(['apt-get',*opts,'update'],timeout=120)
policy=run(['apt-cache',*opts,'policy','nodejs'])
candidate=re.search(r'Candidate:\s*(\S+)',policy).group(1)
assert candidate.startswith('22.'),candidate
new_deb=backup/('nodejs_'+candidate+'_amd64.deb')
if not new_deb.is_file():run(['apt-get',*opts,'download','nodejs='+candidate],cwd=backup,timeout=120)
assert new_deb.is_file()
simulation=run(['apt-get','-s','--no-install-recommends','install',str(new_deb)],timeout=60)
assert not any(line.startswith('Remv ') for line in simulation.splitlines()),simulation
installs=[line for line in simulation.splitlines() if line.startswith('Inst ')]
assert len(installs)==1 and installs[0].split()[1]=='nodejs',installs
extracted=temp/'extracted'
if not extracted.exists():run(['dpkg-deb','-x',str(new_deb),str(extracted)],timeout=60)
node=extracted/'usr/bin/node'
version=run([str(node),'--version']).strip()
assert version=='v'+candidate.split('-')[0]
checks=[]
for name,rel in [('pm2','pm2'),('npm','npm'),('corepack','corepack'),('codex','@openai/codex'),('claude','@anthropic-ai/claude-code'),('opencode','opencode-ai')]:
    root=pathlib.Path('/usr/lib/node_modules')/rel;j=json.loads((root/'package.json').read_text());bins=j['bin'];p=root/(bins[name] if isinstance(bins,dict) else bins)
    native=p.open('rb').read(4)==b'\x7fELF'
    reported=run([str(p),'--version'] if native else [str(node),str(p),'--version'],timeout=40)
    checks.append({'name':name,'package_version':j['version'],'reported':reported.strip()[-150:],'native':native})
result={'old_package_version':old_version,'candidate_package_version':candidate,'candidate_runtime':version,
    'old_deb':str(old_deb),'new_deb':str(new_deb),'old_sha256':hashlib.sha256(old_deb.read_bytes()).hexdigest(),
    'new_sha256':hashlib.sha256(new_deb.read_bytes()).hexdigest(),'installation_plan':installs,
    'cli_checks':checks,'verified_by':'APT signed repository metadata and extracted candidate binary',
    'host_runtime_still':run(['node','--version']).strip(),'disk':run(['df','-Pm','/var/www']).strip()}
(backup/'prepared.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result))
PY
'@
& "$PSScriptRoot\remote-exec.ps1" -Command $auditCommand -Timeout 400
