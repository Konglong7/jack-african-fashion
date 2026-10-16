"""Apply the prepared, signed host runtime with a healthy site fallback.

Run on the VPS as root through the existing encrypted-credential SSH helper.
No business data, global CLI packages, firewall or other services are edited.
"""
import datetime
import hashlib
import http.client
import json
import os
from pathlib import Path
import shutil
import socket
import ssl
import subprocess
import time
import traceback
import urllib.request

BACKUP = Path('/backup/zamique-continuation-20261001/node-upgrade')
SOURCE = Path('/etc/apt/sources.list.d/nodesource.sources')
NGINX = Path('/etc/nginx/sites-available/zamique')
UNIT = 'zamique-maintenance-stage'
EXPECTED_RELEASE = '/var/www/zamique-releases/20261001-seo-display-r3'
started = routed = package_changed = False
events = []


def run(args, timeout=90, check=True):
    p = subprocess.run(args, capture_output=True, text=True, timeout=timeout)
    if check and p.returncode:
        raise RuntimeError(f'{args[0]} failed ({p.returncode}): {p.stderr[-1500:]}')
    return p.stdout.strip()


def event(message):
    events.append({'time': datetime.datetime.now().astimezone().isoformat(), 'event': message})
    print(message, flush=True)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def atomic_text(path, text, mode=0o644):
    temp = path.with_name(path.name + '.zamique-upgrade-new')
    assert not temp.is_symlink() and not path.is_symlink()
    temp.write_text(text)
    os.chmod(temp, mode)
    os.replace(temp, path)


def healthy(port, timeout=60):
    deadline = time.monotonic() + timeout
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    while time.monotonic() < deadline:
        try:
            for path in ['/', '/catalog']:
                request = urllib.request.Request(f'http://127.0.0.1:{port}{path}', headers={'Host': 'zamique.com'})
                with opener.open(request, timeout=10) as response:
                    assert response.status == 200
                    body = response.read()
                    assert b'https://zamique.com' in body and b'</html>' in body
            return True
        except (OSError, AssertionError):
            time.sleep(1)
    return False


def route(text):
    atomic_text(NGINX, text)
    run(['nginx', '-t'])
    run(['systemctl', 'reload', 'nginx'])
    connection = http.client.HTTPSConnection('127.0.0.1', 2054, context=ssl._create_unverified_context(), timeout=20)
    try:
        connection.request('GET', '/catalog', headers={'Host': 'zamique.com'})
        response = connection.getresponse()
        assert response.status == 200 and 's-maxage=60' in response.getheader('Cache-Control', '')
        response.read()
    finally:
        connection.close()


def cli_versions():
    checks = []
    for name, rel in [('pm2', 'pm2'), ('npm', 'npm'), ('corepack', 'corepack'),
                      ('codex', '@openai/codex'), ('claude', '@anthropic-ai/claude-code'), ('opencode', 'opencode-ai')]:
        root = Path('/usr/lib/node_modules') / rel
        meta = json.loads((root / 'package.json').read_text())
        bins = meta['bin']
        executable = root / (bins[name] if isinstance(bins, dict) else bins)
        with executable.open('rb') as stream:
            native = stream.read(4) == b'\x7fELF'
        version = run([str(executable), '--version'] if native else ['/usr/bin/node', str(executable), '--version'], timeout=45)
        checks.append({'name': name, 'package_version': meta['version'], 'reported': version[-150:], 'native': native})
    return checks


try:
    assert os.geteuid() == 0
    assert BACKUP.resolve() == BACKUP and not (BACKUP / 'applied.json').exists()
    os.chmod(BACKUP, 0o700)
    prepared = json.loads((BACKUP / 'prepared.json').read_text())
    for label in ['old', 'new']:
        package = Path(prepared[label + '_deb'])
        assert package.parent == BACKUP and package.is_file() and not package.is_symlink()
        assert sha(package) == prepared[label + '_sha256']
    assert run(['dpkg-query', '-W', '-f=${Version}', 'nodejs']) == prepared['old_package_version']
    assert SOURCE.read_text() == (BACKUP / 'nodesource-before.sources').read_text()
    release = Path('/var/www/zamique-current').resolve()
    assert str(release) == EXPECTED_RELEASE
    node = release / '.runtime/node-v22.23.3-linux-x64/bin/node'
    assert run([str(node), '--version']) == 'v22.23.3'
    apps = json.loads(run(['pm2', 'jlist']))
    assert len(apps) == 1 and apps[0]['name'] == 'jack-fashion' and apps[0]['pm2_env']['status'] == 'online'
    assert apps[0]['pm2_env']['exec_interpreter'] == str(node)
    daemon_pid = int(Path('/root/.pm2/pm2.pid').read_text())
    assert int(run(['systemctl', 'show', 'pm2-root', '--property=MainPID', '--value'])) == daemon_pid
    allowed = {daemon_pid, apps[0]['pid']}
    for proc in Path('/proc').iterdir():
        if not proc.name.isdigit():
            continue
        try:
            exe = (proc / 'exe').resolve(strict=True)
            if exe.name.startswith('node'):
                assert int(proc.name) in allowed, f'Uninventoried runtime process {proc.name}'
        except (FileNotFoundError, PermissionError):
            pass
    assert run(['systemctl', 'is-active', UNIT], check=False) != 'active'
    with socket.socket() as sock:
        assert sock.connect_ex(('127.0.0.1', 3210)) != 0
    assert healthy(3200)
    original_nginx = NGINX.read_text()
    upstream = 'proxy_pass http://127.0.0.1:3200;'
    assert original_nginx.count(upstream) == 1
    simulation = run(['apt-get', '-s', '--no-install-recommends', 'install', prepared['new_deb']])
    installs = [line for line in simulation.splitlines() if line.startswith('Inst ')]
    assert len(installs) == 1 and installs[0].split()[1] == 'nodejs'
    assert not any(line.startswith('Remv ') for line in simulation.splitlines())
    before_cli = cli_versions()
    before_hashes = {name: sha(release / 'data' / name) for name in ['products.json', 'site-content.json']}
    assert before_hashes == {'products.json': '82a759961fae90e30c431d2044f2e4caf70cff491efc77a820b03842ad63a1d4',
                             'site-content.json': '88a82f4bccd3f1243c156d1a1b7f110106dbd26d85e92164db974ac940ff7192'}
    assert not (BACKUP / 'nginx-before-runtime.conf').exists(), 'Prior apply needs inspection'
    shutil.copy2(NGINX, BACKUP / 'nginx-before-runtime.conf')
    run(['pm2', 'save'])
    shutil.copy2('/root/.pm2/dump.pm2', BACKUP / 'dump-before.pm2')
    os.chmod(BACKUP / 'dump-before.pm2', 0o600)
    event('PRECHECKS_PASSED')
    run(['systemd-run', '--unit=' + UNIT, '--working-directory=' + str(release),
         '--setenv=NODE_ENV=production', str(node), str(release / 'node_modules/next/dist/bin/next'),
         'start', '-H', '127.0.0.1', '-p', '3210'])
    started = True
    assert healthy(3210), 'Fallback startup failed'
    route(original_nginx.replace(upstream, 'proxy_pass http://127.0.0.1:3210;'))
    routed = True
    event('HEALTHY_FALLBACK_SERVING')
    package_changed = True  # Also recover a partially failed package installation.
    install_output = run(['dpkg', '-i', prepared['new_deb']], timeout=120)
    (BACKUP / 'package-install.txt').write_text(install_output)
    assert run(['/usr/bin/node', '--version']) == prepared['candidate_runtime']
    atomic_text(SOURCE, (BACKUP / 'nodesource-after.sources').read_text())
    run(['systemctl', 'restart', 'pm2-root'], timeout=90)
    assert healthy(3200, timeout=90), 'Main process failed after daemon restart'
    new_apps = json.loads(run(['pm2', 'jlist']))
    assert len(new_apps) == 1 and new_apps[0]['name'] == 'jack-fashion' and new_apps[0]['pm2_env']['status'] == 'online'
    assert new_apps[0]['pm2_env']['exec_interpreter'] == str(node)
    new_daemon = int(Path('/root/.pm2/pm2.pid').read_text())
    assert int(run(['systemctl', 'show', 'pm2-root', '--property=MainPID', '--value'])) == new_daemon
    assert os.path.samefile(f'/proc/{new_daemon}/exe', '/usr/bin/node'), 'Daemon did not adopt the new runtime'
    after_cli = cli_versions()
    for before in before_cli:
        if before['name'] in ['pm2', 'codex', 'claude', 'opencode']:
            assert next(c for c in after_cli if c['name'] == before['name'])['package_version'] == before['package_version']
    after_hashes = {name: sha(release / 'data' / name) for name in before_hashes}
    assert before_hashes == after_hashes, 'Business content changed; inspect without overwriting data'
    route(original_nginx)
    routed = False
    run(['pm2', 'save'])
    run(['systemctl', 'stop', UNIT])
    started = False
    with socket.socket() as sock:
        assert sock.connect_ex(('127.0.0.1', 3210)) != 0
    assert run(['systemctl', 'is-active', 'pm2-root']) == 'active'
    event('RUNTIME_UPGRADE_VERIFIED')
    result = {'time': datetime.datetime.now().astimezone().isoformat(), 'runtime': run(['node', '--version']),
              'package': run(['dpkg-query', '-W', '-f=${Version}', 'nodejs']), 'daemon_pid': new_daemon,
              'daemon_executable': str(Path(f'/proc/{new_daemon}/exe').resolve()),
              'app': {'name': new_apps[0]['name'], 'pid': new_apps[0]['pid'], 'status': 'online',
                      'interpreter': str(node), 'restarts': new_apps[0]['pm2_env']['restart_time']},
              'before_cli': before_cli, 'after_cli': after_cli, 'business_hashes': after_hashes,
              'nginx_restored_to_main': True, 'fallback_stopped': True,
              'disk': run(['df', '-Pm', '/var/www']), 'events': events}
    (BACKUP / 'applied.json').write_text(json.dumps(result, indent=2))
    print(json.dumps(result), flush=True)
except BaseException as error:
    error_detail = {'type': type(error).__name__, 'message': str(error),
                    'line': traceback.extract_tb(error.__traceback__)[-1].lineno}
    event('FAILURE_RECOVERY_STARTED' if started or routed or package_changed else 'PRECHECK_ABORTED_NO_RUNTIME_CHANGE')
    recovery_error = None
    try:
        if package_changed:
            run(['systemctl', 'stop', 'pm2-root'], timeout=90, check=False)
            run(['dpkg', '-i', prepared['old_deb']], timeout=120)
            atomic_text(SOURCE, (BACKUP / 'nodesource-before.sources').read_text())
            shutil.copy2(BACKUP / 'dump-before.pm2', '/root/.pm2/dump.pm2')
            run(['systemctl', 'start', 'pm2-root'], timeout=90)
        if started or routed:
            assert healthy(3200, timeout=90), 'Keep healthy fallback: main recovery failed'
            route(original_nginx)
            if started:
                run(['systemctl', 'stop', UNIT])
        if started or routed or package_changed:
            event('PRIOR_RUNTIME_AND_MAIN_SERVICE_RESTORED')
    except BaseException as recovery:
        recovery_error = str(recovery)
        event('RECOVERY_NEEDS_ATTENTION_KEEP_FALLBACK')
    result = {'error': error_detail, 'recovery_error': recovery_error, 'events': events}
    (BACKUP / 'failed-apply.json').write_text(json.dumps(result, indent=2))
    print(json.dumps(result), flush=True)
    raise SystemExit(1)
