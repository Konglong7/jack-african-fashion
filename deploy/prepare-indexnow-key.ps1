# Create a persistent ownership proof without changing application/data files.
# The verification token stays on the server; output contains only its hash.
$ErrorActionPreference='Stop'
$auditCommand=@'
python3 - <<'PY'
import hashlib,json,os,pathlib,secrets
directory=pathlib.Path('/var/www/zamique-indexnow');backup=pathlib.Path('/backup/zamique-continuation-20261001')
assert directory.resolve()==directory and not directory.is_symlink()
directory.mkdir(mode=0o755,exist_ok=True)
keyfile=directory/'indexnow-key.txt'
assert not keyfile.is_symlink()
if not keyfile.exists():
    with keyfile.open('x',encoding='utf-8') as f:f.write(secrets.token_hex(16))
    os.chmod(keyfile,0o644)
key=keyfile.read_text();assert len(key)==32 and all(c in '0123456789abcdef' for c in key)
private=backup/'indexnow-key.txt'
if not private.exists():
    with private.open('x',encoding='utf-8') as f:f.write(key)
    os.chmod(private,0o600)
assert private.read_text()==key
print(json.dumps({'key_location':'https://zamique.com/indexnow-key.txt','sha256':hashlib.sha256(key.encode()).hexdigest(),'persistent_path':str(keyfile),'private_backup_present':True}))
PY
'@
& "$PSScriptRoot\remote-exec.ps1" -Command $auditCommand -Timeout 60
