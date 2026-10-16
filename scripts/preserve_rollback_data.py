"""Keep the latest compatible products, settings, uploaded images and analytics on rollback."""
import json
import os
from pathlib import Path
import shutil
import sys
import tempfile
from runtime_data_copy import atomic_json_copy

release, previous, shared, backup = map(Path, sys.argv[1:])
assert release.resolve().parent == Path('/var/www/zamique-releases')
assert previous.resolve().parent == Path('/var/www/zamique-releases')
assert release.resolve() != previous.resolve()
assert shared.resolve() == Path('/var/www/zamique-shared/runtime-data')
assert backup.resolve().parent == Path('/backup')
products = json.loads((release/'data/products.json').read_text())
site = json.loads((release/'data/site-content.json').read_text())
assert isinstance(products, list) and isinstance(site, dict)
assets = set()
def collect(value):
    if isinstance(value, str) and value.startswith('/images/'):
        assets.add(value)
    elif isinstance(value, list):
        for item in value: collect(item)
    elif isinstance(value, dict):
        for item in value.values(): collect(item)
collect(products); collect(site)
copied = 0
for image in assets:
    source = (release/'public'/image.lstrip('/')).resolve()
    target = (previous/'public'/image.lstrip('/')).resolve()
    assert source.is_relative_to(release.resolve()/'public')
    assert target.is_relative_to(previous.resolve()/'public')
    if not source.is_file():
        raise RuntimeError('Missing referenced asset during rollback')
    if target.is_file() and os.path.samefile(source, target):
        continue
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=target.parent, prefix=target.name+'.copy-', delete=False) as stream:
            temporary = Path(stream.name)
        shutil.copy2(source, temporary)
        os.replace(temporary, target)
        copied += 1
    finally:
        if temporary and temporary.exists(): temporary.unlink()
for filename, kind in [('products.json', 'products'), ('site-content.json', 'site')]:
    atomic_json_copy(release/'data'/filename, previous/'data'/filename, kind)
data = atomic_json_copy(shared/'analytics.json', previous/'data/analytics.json', 'analytics')
report = {'products': len(products), 'copied_assets': copied, 'analytics_totals': data['totals'], 'shared_leads_and_receipts_retained': True}
(backup/'rollback-data-preserved.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report))
