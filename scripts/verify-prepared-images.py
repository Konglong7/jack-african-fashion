"""Read-only public image, CDN and MOQ verification after the isolated release."""
import argparse
import hashlib
import json
import time
import threading
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

parser = argparse.ArgumentParser()
parser.add_argument('--base', default='https://zamique.com')
parser.add_argument('--output', required=True)
parser.add_argument('--previous-image-evidence', help='Reuse unchanged, already verified immutable files; recheck catalog and CDN repeats')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'artifacts/image-speed-moq-2026-10-01/image-variants.json').read_text(encoding='utf-8'))
rows = [x for x in manifest['verification'] if x['path'].endswith('-640.webp')]
checks = []
connections = threading.local()

def get(url):
    if not hasattr(connections, 'session'):
        connections.session = requests.Session()
        connections.session.mount('https://', HTTPAdapter(max_retries=Retry(
            total=2, connect=2, read=2, backoff_factor=0.3, allowed_methods=['GET'])))
    return connections.session.get(url, timeout=40)

def inspect(row):
    try:
        response = get(args.base + row['path'])
    except requests.RequestException as error:
        return {'src': row['src'], 'path': row['path'], 'passed': False, 'error': str(error)}
    cc = response.headers.get('Cache-Control', '')
    return {'src': row['src'], 'path': row['path'], 'status': response.status_code,
            'bytes': len(response.content), 'cache': response.headers.get('cf-cache-status'),
            'cache_control': cc, 'seconds': response.elapsed.total_seconds(),
            'passed': response.status_code == 200 and response.headers.get('Content-Type', '').startswith('image/webp')
                      and hashlib.sha256(response.content).hexdigest() == row['sha256']
                      and '31536000' in cc and 'immutable' in cc}

if args.previous_image_evidence:
    previous = json.loads(Path(args.previous_image_evidence).read_text(encoding='utf-8'))
    checks = previous['images']
    assert previous['base'] == args.base and len(checks) == len(rows) and all(x['passed'] for x in checks)
    assert [x['path'] for x in checks] == [x['path'] for x in rows]
else:
    with ThreadPoolExecutor(max_workers=2) as pool:
        checks = list(pool.map(inspect, rows))

repeat = []
for row in rows[:3]:
    # Record actual repeat status/timing; do not assume a specific initial CDN state.
    response = get(args.base + row['path'])
    repeat.append({'path': row['path'], 'status': response.status_code,
                   'cache': response.headers.get('cf-cache-status'),
                   'age': response.headers.get('age'), 'seconds': response.elapsed.total_seconds()})

response = get(args.base + '/catalog')
soup = BeautifulSoup(response.content, 'html.parser')
photo_links = soup.select('[data-product-image]')
card_moq = [node.parent.parent.get_text(' ', strip=True) for node in soup.find_all(string='MOQ:')]
catalog = {'status': response.status_code, 'cards': len(photo_links),
           'photo_controls': sum(len(node.select('button')) for node in photo_links),
           'moq_text': card_moq, 'new_arrival_badges': len(soup.find_all(string='New Arrival')),
           'prepared_srcsets': sum('/images/optimized/' in str(node) for node in photo_links)}
catalog['passed'] = (response.status_code == 200 and len(photo_links) > 0
                     and catalog['photo_controls'] == 0 and catalog['new_arrival_badges'] == 0
                     and len(card_moq) == len(photo_links) and all('100 pcs' in text for text in card_moq)
                     and catalog['prepared_srcsets'] == len(photo_links))
report = {'base': args.base, 'images': checks, 'repeat': repeat, 'catalog': catalog,
          'reused_image_evidence': args.previous_image_evidence,
          'failures': [x for x in checks if not x['passed']] + ([] if catalog['passed'] else [catalog])}
Path(args.output).write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps({'images': len(checks), 'repeat': repeat, 'catalog': catalog, 'failures': report['failures']}))
raise SystemExit(bool(report['failures']))
