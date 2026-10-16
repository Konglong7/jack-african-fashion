"""Regression for unknown products behind an HTTPS reverse proxy."""
import argparse
import json
from urllib.parse import urlsplit
from pathlib import Path

import requests

parser = argparse.ArgumentParser()
parser.add_argument('--base', required=True)
parser.add_argument('--output', required=True)
args = parser.parse_args()
product = json.loads((Path(__file__).resolve().parents[2] / 'data/products.json').read_text(encoding='utf-8'))[0]
results = []
for forwarded, rsc in [(False, False), (True, False), (True, True)]:
    headers = {'Host': 'zamique.com', 'X-Forwarded-Host': 'zamique.com',
               'X-Forwarded-Proto': 'https'} if forwarded else {}
    if rsc:
        headers['RSC'] = '1'
    for path, expected in [('/products/nonexistent-seo-audit-product', 404),
                           ('/products/' + product['slug'], 200)]:
        response = requests.get(args.base.rstrip('/') + path, headers=headers, timeout=40)
        results.append({'path': path, 'forwarded_https': forwarded, 'rsc': rsc, 'status': response.status_code,
                        'expected': expected, 'passed': response.status_code == expected})
    if not rsc:
        response = requests.get(args.base.rstrip('/') + '/admin', headers=headers,
                                allow_redirects=False, timeout=40)
        target = urlsplit(response.headers.get('location', ''))
        public = forwarded or args.base.startswith('https://zamique.com')
        results.append({'path': '/admin', 'forwarded_https': forwarded, 'status': response.status_code,
                        'location': response.headers.get('location'),
                        'passed': response.status_code == 307 and target.path == '/admin/login'
                        and (not public or (target.netloc == 'zamique.com' and target.scheme == 'https'))})
Path(args.output).write_text(json.dumps({'base': args.base, 'checks': results}, indent=2), encoding='utf-8')
print(json.dumps({'checks': len(results), 'failures': [r for r in results if not r['passed']]}))
assert all(r['passed'] for r in results)
