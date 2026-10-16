"""Check public HTML freshness, RSC separation and private responses.

Run after a scoped Cloudflare refresh. A stale edge object is a real failure,
even if the origin and the saved cache rule are correct.
"""
import argparse
import json
import re
from pathlib import Path

import requests

parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True)
args = parser.parse_args()
checks = []
session = requests.Session()


def check(path, expected, headers=None, rsc=False, private=False):
    response = session.get('https://zamique.com' + path, headers=headers, timeout=40)
    cc = response.headers.get('cache-control', '')
    content_type = response.headers.get('content-type', '')
    edge = response.headers.get('cf-cache-status', '')
    passed = response.status_code == 200
    if private:
        passed = passed and 'no-store' in cc and 'private' in cc and edge not in ['HIT', 'STALE', 'UPDATING']
    else:
        shared_ttl = re.search(r'\bs-maxage=(\d+)\b', cc)
        passed = passed and shared_ttl is not None and int(shared_ttl[1]) == expected and '31536000' not in cc
        passed = passed and content_type.startswith('text/x-component' if rsc else 'text/html')
        if rsc or '_rsc=' in path:
            passed = passed and edge not in ['HIT', 'STALE', 'UPDATING']
    checks.append({'path': path, 'rsc': rsc, 'status': response.status_code,
                   'cache_control': cc, 'content_type': content_type, 'edge_cache': edge,
                   'age': response.headers.get('age'), 'passed': passed})


for path, ttl in [('/', 60), ('/catalog', 60), ('/products/elegant-pleated-maxi-dress', 60),
                  ('/about', 600), ('/contact', 600), ('/custom-orders', 600), ('/faq', 600),
                  ('/markets/kenya', 600), ('/wholesale/african-dresses', 600)]:
    check(path, ttl)
for path in ['/inquiry', '/admin/login']:
    check(path, None, private=True)
for path in ['/catalog', '/markets/kenya', '/products/elegant-pleated-maxi-dress']:
    check(path + '?_rsc=owner-cache-audit', 60 if '/markets/' not in path else 600, {'RSC': '1'}, rsc=True)
    check(path + '?_rsc=owner-cache-audit', 60 if '/markets/' not in path else 600)
result = {'checks': checks, 'failures': [c for c in checks if not c['passed']]}
Path(args.output).write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps({'checks': len(checks), 'failures': result['failures']}))
assert not result['failures']
