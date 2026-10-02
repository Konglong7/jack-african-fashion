"""Read-only browser checks for the homepage design (run against a local server)."""

import argparse
from io import BytesIO
import json
import os
from pathlib import Path
import re

from PIL import Image
from playwright.sync_api import sync_playwright


def contrast(foreground, background):
    def luminance(rgb):
        channels = [v / 255 for v in rgb[:3]]
        linear = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in channels]
        return sum(v * weight for v, weight in zip(linear, (0.2126, 0.7152, 0.0722)))
    light, dark = sorted((luminance(foreground), luminance(background)), reverse=True)
    return (light + 0.05) / (dark + 0.05)


def rgb(css_color):
    return tuple(float(value) for value in re.findall(r'[\d.]+', css_color)[:3])


def hero_contrast(page):
    # Sample the actual image + masks behind the text, while preserving layout.
    blocks = page.locator('#home-hero h1, #home-hero p')
    samples = blocks.evaluate_all('''nodes => nodes.map(e => ({
        rect:e.getBoundingClientRect().toJSON(), color:getComputedStyle(e).color,
        threshold:e.tagName==='H1' ? 3 : 4.5
    }))''')
    blocks.evaluate_all("nodes => nodes.forEach(e => e.style.visibility='hidden')")
    try:
        background = Image.open(BytesIO(page.screenshot())).convert('RGB')
    finally:
        blocks.evaluate_all("nodes => nodes.forEach(e => e.style.visibility='')")
    minimums = []
    for sample in samples:
        box = sample['rect']
        foreground = rgb(sample['color'])
        ratios = [contrast(foreground, background.getpixel((x, y)))
                  for y in range(max(0, int(box['top'])), min(background.height, int(box['bottom'])), 3)
                  for x in range(max(0, int(box['left'])), min(background.width, int(box['right'])), 3)]
        assert ratios and min(ratios) >= sample['threshold'], sample
        minimums.append(round(min(ratios), 2))
    return minimums


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--baseline', action='store_true')
    args = parser.parse_args()
    base_url = os.environ.get('BASE_URL', 'http://127.0.0.1:3106').rstrip('/')
    output = Path(os.environ.get('HOME_DESIGN_ARTIFACTS', 'test_screenshots/homepage-design'))
    output.mkdir(parents=True, exist_ok=True)
    errors = []
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(reduced_motion='reduce')
        # This audit never submits analytics, business forms or live messages.
        context.route('**/*', lambda route: route.continue_()
                      if route.request.method in ('GET', 'HEAD') else route.abort())
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.set_viewport_size({'width': 390, 'height': 844})
        page.goto(base_url, wait_until='networkidle', timeout=90000)
        page.evaluate('document.fonts.ready')
        page.screenshot(path=str(output / ('before-mobile.png' if args.baseline else 'after-mobile.png')))
        if args.baseline:
            count = page.locator('[data-product-image]').count()
            page.set_viewport_size({'width': 1440, 'height': 900})
            page.screenshot(path=str(output / 'before-desktop.png'))
            (output / 'baseline.json').write_text(json.dumps({'products': count}), encoding='utf-8')
            browser.close()
            assert count == 8, f'Homepage should show 8 styles, currently shows {count}'
            return

        for width, height in [(320, 640), (360, 800), (390, 844), (440, 956),
                              (768, 1024), (1024, 900), (1440, 900), (1920, 1080)]:
            page.set_viewport_size({'width': width, 'height': height})
            page.goto(base_url, wait_until='networkidle', timeout=90000)
            page.evaluate('document.fonts.ready')
            page.evaluate('window.scrollTo(0,0)')
            state = page.evaluate('''() => {
                const hero = document.querySelector('#home-hero');
                const cta = hero.querySelector('a');
                const product = document.querySelector('[data-product-image]');
                const grid = document.querySelector('[data-home-products]');
                const categories = document.querySelector('#home-categories');
                return {width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
                    products:document.querySelectorAll('[data-product-image]').length,
                    productY:Math.round(product.getBoundingClientRect().top),
                    columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,
                    categoryY:Math.round(categories.getBoundingClientRect().top),
                    ctaBottom:cta.getBoundingClientRect().bottom,
                    ctaHeight:cta.getBoundingClientRect().height,
                    headingColor:getComputedStyle(hero.querySelector('h1')).color,
                    iframeCount:document.querySelectorAll('iframe').length,
                    pageHeight:document.documentElement.scrollHeight};
            }''')
            assert state['scrollWidth'] <= width, state
            assert state['products'] == 8, state
            assert state['columns'] == (1 if width < 360 else 2 if width < 768 else 3 if width < 1024 else 4), state
            assert state['categoryY'] < state['productY'], state
            assert state['headingColor'] == 'rgb(255, 255, 255)', state
            assert state['ctaHeight'] >= 52, state
            assert state['iframeCount'] == 0, state
            if width in (390, 440):
                assert state['ctaBottom'] <= height, state
                assert state['productY'] <= 1800, state
            page.locator('a[aria-label="Contact on WhatsApp"]').wait_for(state='detached')
            state['heroContrastMinimums'] = hero_contrast(page)
            primary = page.locator('#home-hero a').first.evaluate('''e => ({
                color:getComputedStyle(e).color, background:getComputedStyle(e).backgroundColor
            })''')
            state['buttonContrast'] = round(contrast(rgb(primary['color']), rgb(primary['background'])), 2)
            assert state['buttonContrast'] >= 4.5, primary
            assert page.locator('#home-categories h3').count() == 6
            assert page.locator('section[aria-labelledby="home-custom-title"] ol > li').count() == 4
            # The generated image wrapper must form a stack below the overlay.
            layering = page.evaluate('''() => {
                const image = document.querySelector('[data-hero-image]');
                const overlay = document.querySelector('[data-hero-overlay]');
                const content = document.querySelector('[data-hero-content]');
                return [image,overlay,content].map(e => Number(getComputedStyle(e).zIndex));
            }''')
            assert layering[0] < layering[1] < layering[2], layering
            page.screenshot(path=str(output / f'after-{width}.png'))
            if width in (390, 1440):
                label = 'mobile' if width == 390 else 'desktop'
                page.screenshot(path=str(output / f'after-{label}.png'))
                for y in range(0, state['pageHeight'], height - 100):
                    page.evaluate('(y) => window.scrollTo(0,y)', y)
                    page.wait_for_timeout(100)
                page.wait_for_timeout(300)
                page.evaluate('window.scrollTo(0,0)')
                page.locator('a[aria-label="Contact on WhatsApp"]').wait_for(state='detached')
                page.screenshot(path=str(output / f'after-{label}-full.png'), full_page=True)
            results.append(state)

        page.set_viewport_size({'width': 390, 'height': 844})
        page.goto(base_url, wait_until='networkidle')
        hero_link = page.locator('#home-hero a').first
        whatsapp_href = hero_link.get_attribute('href')
        page.locator('[data-home-products]').scroll_into_view_if_needed()
        page.wait_for_timeout(150)
        floating = page.get_by_role('link', name='Contact on WhatsApp', exact=True)
        floating.wait_for(state='visible')
        assert floating.get_attribute('href') == whatsapp_href
        assert floating.locator('.animate-ping').count() == 0
        first_image = page.locator('[data-product-image]').first
        first_image.focus()
        first_image.press('Enter')
        preview = page.get_by_role('dialog').first
        preview.wait_for(state='visible')
        assert preview.locator('img').first.evaluate('(e) => getComputedStyle(e).objectFit') == 'contain'
        assert preview.get_by_role('button', name='Close preview').bounding_box()['height'] >= 44
        assert preview.get_by_role('link', name='Ask Stock & Price on WhatsApp').evaluate('(e) => getComputedStyle(e).backgroundColor') == 'rgb(11, 122, 60)'
        for _ in range(8):
            page.keyboard.press('Tab')
            assert preview.evaluate('(e) => e.contains(document.activeElement)')
        page.screenshot(path=str(output / 'mobile-product-preview.png'))
        preview.get_by_role('button', name='Zoom Details').click()
        fullscreen = page.get_by_role('dialog', name=re.compile('image preview$'))
        fullscreen.wait_for(state='visible')
        assert fullscreen.locator('img').first.evaluate('(e) => getComputedStyle(e).objectFit') == 'contain'
        assert fullscreen.get_by_role('button', name='Close preview').bounding_box()['height'] >= 44
        page.keyboard.press('Escape')
        fullscreen.wait_for(state='detached')
        page.keyboard.press('Escape')
        preview.wait_for(state='detached')
        assert page.locator('[data-home-products] img').first.evaluate('(e) => getComputedStyle(e).objectFit') == 'contain'
        page.get_by_role('button', name='Add to Inquiry', exact=True).first.click()
        page.get_by_role('link', name='Open inquiry cart, 1 selected style', exact=True).wait_for(state='visible')
        assert page.get_by_role('button', name='Added', exact=True).count() == 1
        page.set_viewport_size({'width': 320, 'height': 900})
        page.evaluate("document.documentElement.style.fontSize='200%'")
        page.evaluate('() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        notification = page.get_by_role('status')
        if notification.count():
            bounds = notification.bounding_box()
            assert bounds['x'] >= 0 and bounds['x'] + bounds['width'] <= 320, bounds
            page.get_by_role('button', name='Dismiss notification').click()
            notification.wait_for(state='detached')
        page.set_viewport_size({'width': 390, 'height': 844})
        # Text-only zoom stresses layout, not a scaled viewport screenshot.
        page.evaluate("document.documentElement.style.fontSize='200%'")
        page.evaluate('window.scrollTo(0,0)')
        page.locator('a[aria-label="Open inquiry cart, 1 selected style"]').wait_for(state='detached')
        assert page.get_by_role('link', name='Inquiry cart (1 items)', exact=True).count() == 1
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert page.locator('#home-hero a').first.bounding_box()['height'] >= 52
        page.screenshot(path=str(output / 'mobile-text-200-percent.png'))
        page.evaluate("document.documentElement.style.fontSize=''")
        for width in [320, 360, 440, 768, 1024, 1440, 1920]:
            page.set_viewport_size({'width': width, 'height': 900})
            page.evaluate("document.documentElement.style.fontSize='200%'")
            page.evaluate('() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), width
            assert page.locator('[data-home-product-actions] a, [data-home-product-actions] button, [data-home-product-actions] a span').evaluate_all('nodes => nodes.every(e => e.scrollWidth <= e.clientWidth + 1)'), width
        page.evaluate("document.documentElement.style.fontSize=''")
        page.set_viewport_size({'width': 390, 'height': 844})

        help_links = page.locator('section[aria-labelledby="home-help-title"] a')
        assert help_links.evaluate_all('nodes => nodes.map(e => e.getAttribute("href"))') == ['/faq', '/custom-orders', '/contact']
        for link in page.locator('#home-categories a').evaluate_all('nodes => nodes.map(e => e.getAttribute("href"))'):
            assert page.request.get(base_url + link).status == 200, link
        for link in ['/faq', '/custom-orders', '/contact']:
            assert page.request.get(base_url + link).status == 200, link
        internal_links = page.locator('a[href^="/"]').evaluate_all('nodes => [...new Set(nodes.map(e => e.getAttribute("href")))]')
        for link in internal_links:
            assert page.request.get(base_url + link).status == 200, link
        context.route('https://www.google.com/maps**', lambda route: route.fulfill(body='<html></html>', content_type='text/html'))
        page.get_by_role('button', name=re.compile('Load interactive map:')).click()
        assert page.locator('iframe').count() == 1

        page.goto(base_url + '/catalog', wait_until='networkidle', timeout=90000)
        assert page.get_by_role('link', name='Contact on WhatsApp', exact=True).count() > 0
        default_actions = page.locator('[data-product-image]').first.locator('..').get_by_role('link', name='WhatsApp', exact=False)
        assert default_actions.count() > 0
        assert default_actions.first.evaluate('(e) => getComputedStyle(e).backgroundColor') == 'rgb(37, 211, 102)'
        page.get_by_role('button', name='Toggle menu').click()
        page.locator('header a[href="/"]').click()
        page.wait_for_url(base_url + '/')
        page.locator('#home-hero').wait_for(state='visible')
        page.evaluate('window.scrollTo(0,0)')
        page.locator('a[aria-label="Contact on WhatsApp"]').wait_for(state='detached')
        # Repeat warm reloads: the hero can be replaced during hydration.
        for _ in range(3):
            page.reload(wait_until='networkidle')
            page.locator('a[aria-label="Contact on WhatsApp"]').wait_for(state='detached')
            page.locator('[data-home-products]').scroll_into_view_if_needed()
            page.locator('a[aria-label="Contact on WhatsApp"]').wait_for(state='visible')
            page.evaluate('window.scrollTo(0,0)')
            page.locator('a[aria-label="Contact on WhatsApp"]').wait_for(state='detached')
        assert not errors, errors
        (output / 'verification.json').write_text(json.dumps({'viewports': results, 'pageErrors': errors}, indent=2), encoding='utf-8')
        browser.close()
    print(json.dumps({'status': 'passed', 'viewports': len(results), 'artifacts': str(output)}))


if __name__ == '__main__':
    main()
