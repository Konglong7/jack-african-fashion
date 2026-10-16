"""Validate a business JSON snapshot before atomically replacing its destination."""
import argparse
import json
import os
from pathlib import Path
import tempfile


def atomic_json_copy(source, destination, kind):
    source, destination = Path(source), Path(destination)
    raw = source.read_bytes()
    data = json.loads(raw.decode('utf-8-sig'))
    if kind == 'analytics':
        assert isinstance(data, dict) and isinstance(data.get('recent'), list)
        assert all(isinstance(data.get('totals', {}).get(k), int) for k in ['page_view', 'whatsapp_click'])
    elif kind == 'products':
        assert isinstance(data, list) and all(isinstance(p, dict) and p.get('id') and p.get('slug') for p in data)
    elif kind == 'site':
        assert isinstance(data, dict) and data.get('name') and data.get('whatsappLink')
    else:
        raise ValueError('Unknown snapshot type')
    assert source.resolve() != destination.resolve(), 'Source and destination must differ'
    destination.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=destination.parent, prefix=destination.name+'.copy-', delete=False) as stream:
            temporary = Path(stream.name)
            stream.write(raw)
            stream.flush()
            os.fsync(stream.fileno())
        temporary.chmod(0o600)
        os.replace(temporary, destination)
    finally:
        if temporary and temporary.exists():
            temporary.unlink()
    return data


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('source')
    parser.add_argument('destination')
    parser.add_argument('--kind', choices=['analytics', 'products', 'site'], required=True)
    args = parser.parse_args()
    atomic_json_copy(args.source, args.destination, args.kind)
    print('VALIDATED_ATOMIC_COPY')
