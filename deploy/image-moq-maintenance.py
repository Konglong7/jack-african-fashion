"""Scoped VPS operations: MOQ fields and append-only, verified image derivatives."""
import argparse
import hashlib
import json
import os
import re
import shutil
import tarfile
from pathlib import Path


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run(args):
    live = Path('/var/www/zamique-current').resolve()
    if live.parent != Path('/var/www/zamique-releases'):
        raise RuntimeError('Unexpected production target')
    backup = Path('/backup/zamique-images-moq-20261001')
    backup.mkdir(mode=0o700, exist_ok=True)
    os.chmod(backup, 0o700)
    if args.action == 'moq':
        target = live / 'data/products.json'
        before_bytes = target.read_bytes()
        before_hash = hashlib.sha256(before_bytes).hexdigest()
        if before_hash != args.expected_hash:
            raise RuntimeError('Product data changed; review before updating')
        products = json.loads(before_bytes)
        if len(products) != 68 or len({p['id'] for p in products}) != 68:
            raise RuntimeError('Unexpected product inventory')
        updated = json.loads(before_bytes)
        for product in updated:
            product['moq'] = 100
            product['moqOptions'] = list(dict.fromkeys([100] + product.get('moqOptions', [])))
        def protected(rows):
            return [{k: v for k, v in row.items() if k not in ('moq', 'moqOptions')} for row in rows]
        assert protected(products) == protected(updated)
        report = {'action': 'moq', 'apply': args.apply, 'release': str(live),
                  'count': len(updated), 'minimums': [100], 'before_sha256': before_hash,
                  'protected_fields_unchanged': True}
        if args.apply:
            saved = backup / 'products-before.json'
            if saved.exists() and digest(saved) != before_hash:
                raise RuntimeError('Existing backup belongs to another product version')
            if not saved.exists():
                saved.write_bytes(before_bytes)
                os.chmod(saved, 0o600)
            temp = target.with_name('products.image-moq-new.json')
            if temp.exists():
                raise RuntimeError('Unexpected pending data file')
            temp.write_text(json.dumps(updated, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
            os.chmod(temp, target.stat().st_mode & 0o777)
            os.chown(temp, target.stat().st_uid, target.stat().st_gid)
            if digest(target) != before_hash:
                temp.unlink()
                raise RuntimeError('Concurrent product update; operation cancelled')
            os.replace(temp, target)
            report['after_sha256'] = digest(target)
            (backup / 'moq-receipt.json').write_text(json.dumps(report, indent=2))
        print(json.dumps(report))
        return
    if not re.fullmatch(r'[a-z0-9-]{6,50}', args.release_id or ''):
        raise RuntimeError('Invalid release ID')
    stage = Path('/var/www/zamique-releases') / args.release_id
    if stage == live or not (stage / '.next/BUILD_ID').is_file():
        raise RuntimeError('Requires a built isolated stage')
    evidence = json.loads(Path(args.manifest).read_text())
    rows = evidence['verification']
    expected = {r['path'].lstrip('/'): r['sha256'] for r in rows}
    if len(rows) != evidence['derivative_count'] or any(expected[r['path'].lstrip('/')] != r['sha256'] for r in rows):
        raise RuntimeError('Derivative count differs')
    # Verify original business photos on the VPS before making anything public.
    originals = {r['src']: r['source_sha256'] for r in rows}
    for src, sha in originals.items():
        if not src.startswith('/images/') or '..' in Path(src).parts:
            raise RuntimeError('Unsafe source path')
        if digest(live / 'public' / src.lstrip('/')) != sha:
            raise RuntimeError('Live original differs: ' + src)
    global_root = Path('/var/www/zamique-image-assets')
    global_root.mkdir(mode=0o755, exist_ok=True)
    # Validate every archive member before installation; never extract links or other files.
    with tarfile.open(args.archive, 'r:gz') as archive:
        members = archive.getmembers()
        if {m.name for m in members} != set(expected) or len(members) != len(expected):
            raise RuntimeError('Unexpected archive contents')
        contents = {}
        for member in members:
            if not member.isfile() or not re.fullmatch(r'images/optimized/[a-f0-9]{20}-[0-9]+\.webp', member.name):
                raise RuntimeError('Unsafe archive member')
            data = archive.extractfile(member).read()
            if hashlib.sha256(data).hexdigest() != expected[member.name]:
                raise RuntimeError('Derivative checksum differs')
            for root in [global_root, stage / 'public']:
                destination = root / member.name
                if destination.exists() and digest(destination) != expected[member.name]:
                    raise RuntimeError('Refusing to overwrite an existing immutable image')
            contents[member.name] = data
    for name, data in contents.items():
        target = global_root / name
        target.parent.mkdir(mode=0o755, parents=True, exist_ok=True)
        if not target.exists():
            with target.open('xb') as file:
                file.write(data)
            os.chmod(target, 0o644)
        staged = stage / 'public' / name
        staged.parent.mkdir(mode=0o755, parents=True, exist_ok=True)
        if not staged.exists():
            os.link(target, staged)
        assert digest(target) == digest(staged) == expected[name]
    for src, sha in originals.items():
        assert digest(live / 'public' / src.lstrip('/')) == sha
    shutil.copyfile(args.manifest, backup / 'image-variants.json')
    report = {'action': 'images', 'release': str(stage), 'originals_verified': len(originals),
              'derivatives_verified': len(expected), 'responsive_entries': len(rows),
              'bytes': sum(len(x) for x in contents.values()),
              'originals_unchanged': True, 'immutable_root': str(global_root)}
    (backup / 'images-receipt.json').write_text(json.dumps(report, indent=2))
    print(json.dumps(report))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('action', choices=['moq', 'images'])
    parser.add_argument('--expected-hash')
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--release-id')
    parser.add_argument('--archive')
    parser.add_argument('--manifest')
    run(parser.parse_args())
