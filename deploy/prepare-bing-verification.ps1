# Install only Bing's downloaded public ownership proof. Never overwrite an
# existing proof with different contents; credentials remain in encrypted storage.
param([Parameter(Mandatory)][string]$VerificationFile)
$ErrorActionPreference='Stop'
. "$PSScriptRoot\config.ps1"
$auditResolvedFile=(Resolve-Path -LiteralPath $VerificationFile).Path
$auditXmlBytes=[IO.File]::ReadAllBytes($auditResolvedFile)
if($auditXmlBytes.Length -gt 1024){throw 'Unexpected Bing verification file size'}
[xml]$auditXml=[Text.Encoding]::UTF8.GetString($auditXmlBytes)
if($auditXml.DocumentElement.Name -ne 'users' -or $auditXml.users.user -notmatch '^[A-Fa-f0-9]{32}$'){throw 'Unexpected Bing verification XML'}
$auditUploadName='zamique-bing-'+[guid]::NewGuid().ToString('N')+'.xml'
$auditUploadPath=Join-Path ([IO.Path]::GetTempPath()) $auditUploadName
[IO.File]::WriteAllBytes($auditUploadPath,$auditXmlBytes)
Import-Module Posh-SSH
$auditCredential=Import-Clixml -LiteralPath $CredFile
$auditSftp=$null
try {
    $auditSftp=New-SFTPSession -ComputerName $VPS_HOST -Credential $auditCredential -AcceptKey
    Set-SFTPItem -SessionId $auditSftp.SessionId -Path $auditUploadPath -Destination '/tmp'
} finally {
    if($auditSftp){Remove-SFTPSession -SessionId $auditSftp.SessionId | Out-Null}
    Remove-Item -LiteralPath $auditUploadPath
}
$auditCommand=@'
python3 - <<'PY'
import hashlib,json,os,pathlib,re,xml.etree.ElementTree as ET
staged=pathlib.Path('/tmp/__UPLOAD_NAME__')
assert staged.is_file() and not staged.is_symlink()
raw=staged.read_bytes();root=ET.fromstring(raw)
assert len(raw)<=1024 and root.tag=='users' and len(root)==1
assert root[0].tag=='user' and re.fullmatch(r'[A-Fa-f0-9]{32}',root[0].text or '')
directory=pathlib.Path('/var/www/zamique-verification')
assert directory.resolve()==directory and not directory.is_symlink()
directory.mkdir(mode=0o755,exist_ok=True)
target=directory/'BingSiteAuth.xml'
backup=pathlib.Path('/backup/zamique-continuation-20261001/BingSiteAuth.xml')
assert backup.parent.is_dir() and backup.parent.stat().st_mode&0o777==0o700
for file,mode in [(target,0o644),(backup,0o600)]:
    assert not file.is_symlink()
    if file.exists():assert file.read_bytes()==raw,'Existing ownership proof differs; leave it intact'
for file,mode in [(target,0o644),(backup,0o600)]:
    if not file.exists():
        fd=os.open(file,os.O_WRONLY|os.O_CREAT|os.O_EXCL,mode)
        with os.fdopen(fd,'wb') as output:output.write(raw)
    os.chmod(file,mode)
staged.unlink()
print(json.dumps({'persistent_path':str(target),'public_url':'https://zamique.com/BingSiteAuth.xml',
                  'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'private_backup_present':True}))
PY
'@
& "$PSScriptRoot\remote-exec.ps1" -Command $auditCommand.Replace('__UPLOAD_NAME__',$auditUploadName) -Timeout 60
