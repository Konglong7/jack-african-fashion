"""Public UI regression audit. Never submits messages or changes server business data."""
import argparse
import io
import json
import re
import time
from pathlib import Path
from urllib.parse import unquote, urlsplit

from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[2]
PRODUCTS = json.loads((ROOT / 'data/products.json').read_text(encoding='utf-8'))


def wait_until(page, expression, timeout=45000, arg=None):
    deadline = time.monotonic() + timeout / 1000
    while time.monotonic() < deadline:
        value = page.evaluate(expression, arg) if arg is not None else page.evaluate(expression)
        if value:
            return value
        page.wait_for_timeout(100)
    raise AssertionError('Browser condition timed out')


def run(base, output, skip_layout=False, browser_name='chromium'):
    base = base.rstrip('/')
    out = Path(output)
    out.mkdir(parents=True, exist_ok=True)
    report = {'base': base, 'engine': browser_name, 'layout': [], 'functions': [], 'fixtures': [], 'errors': [],
              'scope': 'fresh browser; analytics mocked; WhatsApp links inspected, messages never sent'}
    multi = next((p for p in PRODUCTS if len(p.get('images', [])) > 1), PRODUCTS[0])
    has_multiple_images = len(multi.get('images', [])) > 1
    paths = ['/', '/catalog', '/about', '/faq', '/contact', '/custom-orders', '/inquiry',
             '/wholesale/african-dresses', '/wholesale/two-piece-sets',
             '/wholesale/plus-size-womens-clothing', '/wholesale/ready-stock',
             '/markets/nigeria', '/markets/ghana', '/markets/kenya',
             '/markets/tanzania', '/markets/south-africa',
             '/products/' + PRODUCTS[0]['slug'], '/products/' + PRODUCTS[-1]['slug']]
    with sync_playwright() as pw:
        browser = getattr(pw, browser_name).launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        context.route('**/api/analytics', lambda route: route.fulfill(status=204))
        page = context.new_page()
        pending_prefetches = set()
        page.on('request', lambda request: pending_prefetches.add(request) if '_rsc=' in request.url else None)
        page.on('requestfinished', lambda request: pending_prefetches.discard(request))
        page.on('requestfailed', lambda request: pending_prefetches.discard(request))
        phase = {'path': 'initial', 'viewport': 1440}
        page.on('pageerror', lambda err: report['errors'].append({'url': page.url, **phase, 'message': str(err), 'stack': err.stack}))
        page.on('response', lambda response: report['errors'].append({
            'url': response.url, **phase, 'message': f'Asset HTTP {response.status}'
        }) if response.status >= 400 and (response.url.startswith(base + '/_next/')
                                          or response.url.startswith(base + '/images/optimized/')) else None)

        def goto(path):
            # WebKit reports cancelled prefetches as CORS failures when a test
            # replaces the whole document. Let the current page finish first;
            # steady pages and real client navigation are checked separately.
            if browser_name == 'webkit' and page.url != 'about:blank':
                deadline, quiet_since = time.monotonic() + 60, time.monotonic()
                while pending_prefetches or time.monotonic() - quiet_since < 0.5:
                    if pending_prefetches:
                        quiet_since = time.monotonic()
                    if time.monotonic() > deadline:
                        raise AssertionError('RSC prefetch did not finish: ' + ', '.join(r.url for r in pending_prefetches))
                    page.wait_for_timeout(50)
            phase['path'] = path
            response = page.goto(base + path, wait_until='domcontentloaded', timeout=60000)
            expect(page.locator('main')).to_be_visible()
            expect(page.locator('main h1')).to_have_count(1)
            # SSR controls can be visible before their JavaScript has arrived.
            # Wait for the completed page before testing hydrated interactions.
            page.wait_for_load_state('load', timeout=60000)
            viewport = page.viewport_size or {'width': 1440}
            if viewport['width'] < 1024:
                expect(page.get_by_role('button', name='Toggle menu')).to_be_visible()
            else:
                expect(page.locator('header nav')).to_be_visible()
            return response

        try:
            for width in ([] if skip_layout else [320, 375, 768, 1024, 1440]):
                phase['viewport'] = width
                page.set_viewport_size({'width': width, 'height': 900 if width >= 768 else 812})
                for path in paths:
                    response = goto(path)
                    page.evaluate('document.fonts.ready')
                    # Responsive images may select a new source after hydration
                    # or natural-ratio measurement, after the page load event.
                    # Capture a single loaded snapshot; a broken image times out.
                    snapshot = wait_until(page, '''() => {
                      const data = {
                        width: document.documentElement.clientWidth,
                        scroll: document.documentElement.scrollWidth,
                        h1: document.querySelectorAll('main h1').length,
                        images: [...document.images].filter(i => {
                            const r=i.getBoundingClientRect(); return r.top<innerHeight && r.bottom>0;
                        }).map(i=>({alt:i.alt, loaded:i.complete && i.naturalWidth>0,
                            fit:getComputedStyle(i).objectFit, width:i.width, height:i.height}))
                      };
                      return data.images.every(i => i.loaded) ? data : false;
                    }''', timeout=45000)
                    data = snapshot
                    failures = []
                    if response.status != 200: failures.append('HTTP ' + str(response.status))
                    if data['scroll'] > data['width'] + 1: failures.append('horizontal overflow')
                    if data['h1'] != 1: failures.append('H1 count ' + str(data['h1']))
                    if any(i['fit'] == 'fill' for i in data['images']): failures.append('stretched image')
                    if any(not i['loaded'] for i in data['images']): failures.append('visible image failed to load')
                    report['layout'].append({'path': path, 'viewport': width, **data, 'failures': failures})
                    if path in ['/', '/catalog', '/products/' + PRODUCTS[-1]['slug']] and width in [375, 1440]:
                        page.screenshot(path=str(out / f"{width}-{path.strip('/').replace('/', '-') or 'home'}.png"))
                print(f'layout width {width}: {len(paths)} pages checked', flush=True)

            page.set_viewport_size({'width': 375, 'height': 812})
            goto('/')
            page.locator('#home-categories').first.scroll_into_view_if_needed()
            category_photos = wait_until(page, '''() => {
              const photos=[...document.querySelectorAll('#home-categories img')];
              return photos.length===6 && photos.every(i=>i.complete && i.naturalWidth>0
                && i.getBoundingClientRect().height>100 && i.parentElement.getBoundingClientRect().height>100)
                ? photos.map(i=>({height:i.getBoundingClientRect().height,src:i.currentSrc})) : false;
            }''', timeout=45000)
            report['category_photos'] = category_photos
            page.screenshot(path=str(out / '375-category-photos.png'))

            page.set_viewport_size({'width': 1440, 'height': 900})
            goto('/catalog?category=Two+Piece+Sets&utm_source=seo-test')
            expect(page.get_by_role('button', name=re.compile('^Two Piece Sets'))).to_be_visible()
            assert page.evaluate('new URLSearchParams(location.search).get("category")') == 'Two Piece Sets'
            expect(page.locator('main a[href^="/products/"]')).not_to_have_count(0)
            assert 'utm_source=seo-test' in page.url
            page.get_by_role('button', name=re.compile('^All\\d*$')).click()
            page.get_by_role('textbox', name='Search products', exact=True).fill('zz-no-such-style')
            expect(page.get_by_text('No styles found', exact=False)).to_be_visible()
            page.get_by_role('textbox', name='Search products', exact=True).fill('')
            expect(page.locator('main a[href^="/products/"]')).not_to_have_count(0)
            page.get_by_role('combobox', name='Sort products').select_option('popular')
            wait_until(page, "location.search.includes('sort=popular')", timeout=30000)
            assert 'utm_source=seo-test' in page.url
            report['functions'].append('catalog URL category, search, empty results, sort and attribution preservation')

            # Product card hover must not constrain either nested dialog to the card.
            preview = page.get_by_role('button', name=re.compile('Preview full image of')).first
            assert page.locator('[data-product-image] button').count() == 0
            assert page.locator('[data-product-image]').first.evaluate('(el)=>getComputedStyle(el).backgroundColor') == 'rgb(250, 248, 245)'
            preview.hover()
            preview.click()
            quick = page.get_by_role('dialog', name=re.compile('Quick View'))
            expect(quick).to_be_visible()
            assert quick.bounding_box()['width'] >= 1400
            assert page.evaluate('document.body.style.overflow') == 'hidden'
            quick.get_by_role('button', name='Zoom Details', exact=True).click()
            viewer = page.get_by_role('dialog', name=re.compile('image preview'))
            expect(viewer).to_be_visible()
            assert viewer.bounding_box()['width'] >= 1400
            page.keyboard.press('Tab')
            assert viewer.evaluate('(el)=>el.contains(document.activeElement)')
            page.keyboard.press('Escape')
            expect(viewer).not_to_be_visible()
            expect(quick).to_be_visible()
            assert page.evaluate('document.body.style.overflow') == 'hidden'
            quick.get_by_role('button', name='Close preview', exact=True).click()
            expect(quick).not_to_be_visible()
            assert page.evaluate('document.body.style.overflow') != 'hidden'
            report['functions'].append('card hover, full-viewport dialogs, nested close, scroll lock and focus containment')

            goto('/products/' + multi['slug'])
            page.set_viewport_size({'width': 375, 'height': 812})
            page.get_by_role('button', name='Tap to view full screen photo').click()
            viewer = page.get_by_role('dialog', name=re.compile('image preview'))
            expect(viewer).to_be_visible()
            current = viewer.locator('img[alt]').first
            first_alt = current.get_attribute('alt')
            if has_multiple_images:
                page.keyboard.press('ArrowRight')
                expect(current).not_to_have_attribute('alt', first_alt)
            else:
                expect(current).to_have_attribute('alt', first_alt)
            page.keyboard.press('Escape')
            expect(viewer).not_to_be_visible()
            # Download only to a test browser directory; no production writes.
            with page.expect_download() as dl:
                page.get_by_role('button', name='Save Current Photo', exact=False).click()
            download = dl.value
            assert download.failure() is None
            assert download.suggested_filename.startswith('african-fashion-')
            report['functions'].append('product gallery, fullscreen keyboard navigation, close and original image download')

            goto('/catalog')
            selected = {key: PRODUCTS[0][key] for key in ['id', 'name', 'slug', 'image']}
            selected['quantity'] = 1
            page.evaluate('''item => localStorage.setItem(
                'jack-african-fashion-inquiry', JSON.stringify([item]))''', selected)
            goto('/inquiry')
            expect(page.get_by_role('button', name='Remove', exact=True)).to_have_count(1)
            qty = page.locator('input[type="number"]')
            minimum = int(qty.get_attribute('min'))
            page.get_by_role('button', name='Increase quantity by 10').click()
            expect(qty).to_have_value(str(minimum + 10))
            qty.fill('1')
            qty.blur()
            expect(qty).to_have_value(str(minimum))
            href = page.get_by_role('link', name='Send WhatsApp Inquiry').get_attribute('href')
            assert 'wa.me' in href and '/products/' in unquote(href)
            page.get_by_role('button', name='Remove', exact=True).click()
            expect(page.get_by_role('button', name='Remove', exact=True)).to_have_count(0)
            report['functions'].append('legacy inquiry review, requested quantity editing, MOQ-confirmation message, WhatsApp URL and removal')

            goto('/contact')
            page.set_viewport_size({'width': 1440, 'height': 900})
            expect(page.locator('form')).to_have_count(0)
            contact_links = page.locator('main a[href^="https://wa.me/"]')
            expect(contact_links).not_to_have_count(0)
            assert all(href.startswith('https://wa.me/') for href in contact_links.evaluate_all(
                'nodes => nodes.map(node => node.href)'))
            report['functions'].append('contact page keeps direct WhatsApp paths with no form gate')

            goto('/custom-orders')
            expect(page.locator('form')).to_have_count(0)
            custom_links = page.locator('main a[href^="https://wa.me/"]')
            expect(custom_links).not_to_have_count(0)
            expect(page.get_by_text('No form or website upload required.', exact=True)).to_be_visible()
            report['functions'].append('custom orders keep direct WhatsApp paths with no upload gate')

            goto('/')
            expect(page.locator('iframe')).to_have_count(0)
            page.get_by_role('button', name=re.compile('Load interactive map:')).click()
            expect(page.locator('iframe')).to_have_count(1)
            report['functions'].append('map stays unloaded until requested')

            for missing in ['/nonexistent-seo-audit-page', '/products/nonexistent-seo-audit-product']:
                response = goto(missing)
                assert response.status == 404, (missing, response.status)
                expect(page.locator('main h1')).to_have_text('404')
            report['functions'].append('unknown page and product render HTTP 404 without hydration errors')

            # Synthetic images exercise actual rendered components, without editing product data.
            for w, h in [(480, 1600), (1600, 480), (700, 700), (24, 32), (3840, 2160)]:
                fixture_ctx = browser.new_context(viewport={'width': 375, 'height': 812})
                fixture_ctx.route('**/api/analytics', lambda route: route.fulfill(status=204))
                buffer = fixture(w, h)
                fixture_ctx.route('**/_next/image?*', lambda route: route.fulfill(
                    status=200, content_type='image/png', body=buffer))
                fixture_ctx.route('**/images/optimized/**', lambda route: route.fulfill(
                    status=200, content_type='image/png', body=buffer))
                fixture_page = fixture_ctx.new_page()
                fixture_page.goto(base + '/products/' + multi['slug'], wait_until='domcontentloaded')
                fixture_page.wait_for_load_state('load', timeout=60000)
                image = fixture_page.locator('img[alt*=" - view "]').first
                expect(image).to_be_visible()
                dimensions = wait_until(fixture_page, '''({selector,ratio})=>{
                    const image=document.querySelector(selector);
                    if (!image || !image.complete || !image.naturalWidth || !image.naturalHeight) return false;
                    return Math.abs(image.naturalWidth/image.naturalHeight-ratio)<0.06
                        ? [image.naturalWidth,image.naturalHeight] : false;
                }''', arg={'selector': 'img[alt*=" - view "]', 'ratio': w/h})
                natural = dimensions
                assert image.evaluate('(el)=>getComputedStyle(el).objectFit') == 'contain'
                assert image.bounding_box()['height'] > 150
                fixture_page.get_by_role('button', name='Tap to view full screen photo').click()
                dialog = fixture_page.get_by_role('dialog')
                expect(dialog).to_be_visible()
                displayed = dialog.locator('img').first
                assert displayed.evaluate('(el)=>getComputedStyle(el).objectFit') == 'contain'
                assert displayed.bounding_box()['height'] > 150
                fixture_page.screenshot(path=str(out / f'fixture-{w}x{h}.png'))
                report['fixtures'].append({'natural': [w, h], 'fit': 'contain', 'viewport': 375})
                fixture_ctx.close()
            print('core functions and image fixtures checked', flush=True)
        except Exception as exc:
            report['errors'].append(repr(exc))
            page.screenshot(path=str(out / 'failure.png'))
            raise
        finally:
            (out / 'results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
            browser.close()
    failures = [r for r in report['layout'] if r['failures']]
    print(json.dumps({'layout_cases': len(report['layout']), 'failures': failures,
                      'functions': report['functions'], 'fixtures': report['fixtures'],
                      'errors': report['errors']}, ensure_ascii=False))
    assert not failures and not report['errors']


def fixture(width, height):
    image = Image.new('RGB', (width, height), '#dddddd')
    draw = ImageDraw.Draw(image)
    size = max(2, min(width, height) // 6)
    for x, y, color in [(0, 0, 'red'), (width-size, 0, 'blue'),
                         (0, height-size, 'green'), (width-size, height-size, 'yellow')]:
        draw.rectangle((x, y, x+size-1, y+size-1), fill=color)
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    return buffer.getvalue()


if __name__ == '__main__':
    args = argparse.ArgumentParser()
    args.add_argument('--base', default='http://127.0.0.1:3100')
    args.add_argument('--output', required=True)
    args.add_argument('--skip-layout', action='store_true')
    args.add_argument('--browser', choices=['chromium', 'firefox', 'webkit'], default='chromium')
    config = args.parse_args()
    run(config.base, config.output, config.skip_layout, config.browser)
