"""An old saved cart must drop unverified MOQ data without losing buyer choices."""
import argparse
import json
import time
from pathlib import Path

from playwright.sync_api import sync_playwright, expect

parser = argparse.ArgumentParser()
parser.add_argument('--base', required=True)
parser.add_argument('--output', required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]


def wait_until(page, predicate, timeout=5):
    """Poll without eval-style helpers, which a strict CSP correctly blocks."""
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if page.evaluate(predicate):
            return
        page.wait_for_timeout(50)
    raise AssertionError(f'Condition did not become true within {timeout}s')


product = json.loads((root / 'data/products.json').read_text(encoding='utf-8'))[0]
old = {key: product[key] for key in ['id', 'name', 'slug', 'image']}
old.update(moq=500, quantity=500, color='Buyer saved color', size='Buyer saved size')
with sync_playwright() as pw:
    browser = pw.chromium.launch()
    context = browser.new_context(viewport={'width': 375, 'height': 812})
    context.route('**/api/analytics', lambda route: route.fulfill(status=204))
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(args.base + '/inquiry', wait_until='load')
    page.evaluate('(items)=>localStorage.setItem("jack-african-fashion-inquiry",JSON.stringify(items))', [old])
    page.reload(wait_until='load')
    wait_until(page, '() => !("moq" in JSON.parse(localStorage.getItem("jack-african-fashion-inquiry"))[0])')
    saved = page.evaluate('JSON.parse(localStorage.getItem("jack-african-fashion-inquiry"))[0]')
    assert saved['quantity'] == 500 and saved['color'] == old['color'] and saved['size'] == old['size']
    quantity = page.get_by_role('spinbutton').first
    quantity.fill('100')
    quantity.blur()
    wait_until(page, '() => JSON.parse(localStorage.getItem("jack-african-fashion-inquiry"))[0]?.quantity===100')
    assert not errors
    Path(args.output).write_text(json.dumps({'passed': True, 'old_unverified_moq_removed': 500,
                                           'saved_quantity_preserved': 500, 'edited_quantity': 100,
                                           'color_size_preserved': True, 'errors': errors}, indent=2))
    browser.close()
print('OLD_CART_MOQ_REMOVAL_PASSED')
