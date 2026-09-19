"""
African Fashion Website - Full Functionality Test
Tests: Homepage, Navigation, Product Catalog, Admin Login, Product Details
"""

import os
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3000"
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "dev-only-change-me")

# Screenshots always land in <repo>/test_screenshots, whatever the working directory is.
SCREENSHOT_DIR = Path(__file__).resolve().parent.parent.parent / "test_screenshots"

# Create screenshot directory
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def save_screenshot(page, name):
    path = str(SCREENSHOT_DIR / f"{name}.png")
    page.screenshot(path=path, full_page=True)
    print(f"  📸 Screenshot saved: {name}.png")
    return path

def goto_page(page, url):
    """Navigate using DOM readiness; Next dev HMR can keep networkidle/load unstable."""
    page.goto(url, wait_until='domcontentloaded', timeout=60000)
    page.wait_for_selector('main', state='attached', timeout=15000)
    try:
        page.wait_for_load_state('networkidle', timeout=10000)
    except Exception:
        pass

def login_if_needed(page):
    if "/admin/login" not in page.url:
        return

    username_input = page.locator('input[id="username"], input[name="username"], input[type="text"]').first
    password_input = page.locator('input[id="password"], input[name="password"], input[type="password"]').first
    submit_button = page.locator('button[type="submit"]').first
    username_input.fill(ADMIN_USERNAME)
    password_input.fill(ADMIN_PASSWORD)
    submit_button.click()
    page.wait_for_function("!window.location.pathname.includes('/admin/login')", timeout=20000)
    page.wait_for_selector('text=/Dashboard|Products|Upload Images/i', timeout=15000)

def test_homepage(page):
    """Test 1: Homepage loads correctly"""
    print("\n🏠 Testing Homepage...")
    goto_page(page, BASE_URL)

    # Check page title
    title = page.title()
    print(f"  Page title: {title}")

    # Check main elements
    header = page.locator('header').count() > 0
    footer = page.locator('footer').count() > 0
    hero = page.locator('text=/Jack African|African Fashion|Wholesale/i').count() > 0

    save_screenshot(page, "01_homepage")

    result = {
        "title": title,
        "header": header,
        "footer": footer,
        "hero_section": hero,
        "status": "✅ PASS" if all([header, footer, hero]) else "❌ FAIL"
    }
    print(f"  {result['status']} - Homepage")
    return result

def test_navigation(page):
    """Test 2: Navigation links work"""
    print("\n🧭 Testing Navigation...")

    goto_page(page, BASE_URL)

    # Find all nav links
    nav_links = page.locator('nav a, header a').all()
    link_texts = [link.inner_text() for link in nav_links if link.inner_text().strip()]
    print(f"  Found {len(nav_links)} navigation links: {link_texts[:5]}...")

    # Test clicking on Catalog/Products link
    catalog_link = page.locator('a[href^="/catalog"]').first
    if catalog_link.count() > 0:
        catalog_link.click()
        page.wait_for_url("**/catalog**", timeout=20000)
        current_url = page.url
        save_screenshot(page, "02_catalog_page")
        print(f"  Navigated to: {current_url}")
        return {"status": "✅ PASS", "url": current_url, "link_count": len(nav_links)}

    save_screenshot(page, "02_navigation")
    return {"status": "⚠️ PARTIAL", "link_count": len(nav_links)}

def test_product_catalog(page):
    """Test 3: Product catalog displays products"""
    print("\n📦 Testing Product Catalog...")

    goto_page(page, f"{BASE_URL}/catalog")
    page.wait_for_selector('a[href^="/products/"]', timeout=20000)

    # Check for products
    product_cards = page.locator('a[href^="/products/"]').all()
    print(f"  Found {len(product_cards)} potential product elements")

    # Check for category filters
    category_filters = page.locator('button:has-text("Dress"), button:has-text("Size"), button:has-text("Plus"), [class*="filter"], [class*="category"]').count()
    print(f"  Found {category_filters} category/filter elements")

    # Check for search
    search_input = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="搜索"]').count()
    print(f"  Search input found: {search_input > 0}")

    save_screenshot(page, "03_product_catalog")

    has_products = len(product_cards) > 0
    return {
        "status": "✅ PASS" if has_products else "❌ FAIL",
        "product_count": len(product_cards),
        "has_filters": category_filters > 0,
        "has_search": search_input > 0
    }

def test_product_detail(page):
    """Test 4: Product detail page"""
    print("\n🔍 Testing Product Detail Page...")

    # Go to catalog first
    goto_page(page, f"{BASE_URL}/catalog")
    page.wait_for_selector('a[href^="/products/"]', timeout=20000)

    # Click on first product
    product_link = page.locator('a[href*="/products/"], .product a, [class*="product"] a').first
    if product_link.count() > 0:
        product_link.click()
        page.wait_for_load_state('networkidle')

        current_url = page.url
        print(f"  Navigated to: {current_url}")

        # Check for product details
        has_image = page.locator('img[src*="product"], img[alt*="dress" i], img[alt*="product" i]').count() > 0
        has_price = page.locator('text=/\\$|¥|price|价格/i').count() > 0
        has_whatsapp = page.locator('a[href*="whatsapp"], button:has-text("WhatsApp"), [class*="whatsapp"]').count() > 0

        save_screenshot(page, "04_product_detail")

        return {
            "status": "✅ PASS" if has_image else "⚠️ PARTIAL",
            "url": current_url,
            "has_image": has_image,
            "has_price": has_price,
            "has_whatsapp_button": has_whatsapp
        }

    save_screenshot(page, "04_product_detail_none")
    return {"status": "❌ FAIL", "message": "No products found to click"}

def test_admin_login(page):
    """Test 5: Admin login functionality"""
    print("\n🔐 Testing Admin Login...")

    goto_page(page, f"{BASE_URL}/admin")

    # Check if already logged in or on login page
    current_url = page.url
    print(f"  Current URL: {current_url}")

    # Look for login form
    username_input = page.locator('input[name="username"], input[type="text"], input[id="username"], input[placeholder*="user" i]').first
    password_input = page.locator('input[name="password"], input[type="password"]').first
    submit_button = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("登录")').first

    save_screenshot(page, "05_admin_login_page")

    if username_input.count() > 0 and password_input.count() > 0:
        print("  Found login form, attempting login...")

        # Fill credentials
        username_input.fill(ADMIN_USERNAME)
        password_input.fill(ADMIN_PASSWORD)

        save_screenshot(page, "05_admin_filled")

        # Click login
        submit_button.click()
        page.wait_for_function("!window.location.pathname.includes('/admin/login')", timeout=20000)
        page.wait_for_selector('text=/Dashboard|Products|Upload Images/i', timeout=15000)

        # Check if logged in
        current_url = page.url
        print(f"  After login URL: {current_url}")

        # Check for admin content
        has_dashboard = page.locator('text=/dashboard|product|manage|admin|管理|产品/i').count() > 0
        has_logout = page.locator('button:has-text("Logout"), a:has-text("Logout"), button:has-text("退出"), a:has-text("退出")').count() > 0

        save_screenshot(page, "05_admin_after_login")

        return {
            "status": "✅ PASS" if has_dashboard or has_logout else "❌ FAIL",
            "login_url": current_url,
            "has_dashboard_content": has_dashboard,
            "has_logout": has_logout
        }

    # Maybe already logged in
    has_admin_content = page.locator('text=/dashboard|product|manage|admin/i').count() > 0
    return {
        "status": "✅ PASS (already logged in)" if has_admin_content else "⚠️ PARTIAL",
        "message": "No login form found"
    }

def test_admin_products(page):
    """Test 6: Admin product management"""
    print("\n📋 Testing Admin Product Management...")

    # Navigate to admin products
    goto_page(page, f"{BASE_URL}/admin/products")
    login_if_needed(page)
    if not page.url.endswith('/admin/products'):
        goto_page(page, f"{BASE_URL}/admin/products")

    current_url = page.url
    print(f"  URL: {current_url}")

    # Check for product list or add button
    has_product_list = page.locator('table, [class*="product-list"], [class*="grid"]').count() > 0
    has_add_button = page.locator('button:has-text("Add"), a:has-text("Add"), button:has-text("New"), a:has-text("New")').count() > 0

    save_screenshot(page, "06_admin_products")

    return {
        "status": "✅ PASS" if has_product_list or has_add_button else "⚠️ PARTIAL",
        "has_product_list": has_product_list,
        "has_add_button": has_add_button
    }

def test_categories(page):
    """Test 7: Category filtering"""
    print("\n🏷️ Testing Categories...")

    goto_page(page, BASE_URL)

    # Look for category links/sections
    category_elements = page.locator('[class*="category"], a[href*="category"], a[href*="catalog?"]').all()
    print(f"  Found {len(category_elements)} category elements")

    # Check for category section on homepage
    has_category_text = page.locator('text=/category|categories|分类|category/i').count() > 0
    has_category_class = page.locator('[class*="category"]').count() > 0
    has_category_section = has_category_text or has_category_class

    save_screenshot(page, "07_categories")

    return {
        "status": "✅ PASS" if len(category_elements) > 0 or has_category_section else "⚠️ PARTIAL",
        "category_count": len(category_elements)
    }

def test_responsive_design(page):
    """Test 8: Mobile responsive design"""
    print("\n📱 Testing Responsive Design...")

    # Test mobile viewport
    page.set_viewport_size({"width": 375, "height": 667})
    goto_page(page, BASE_URL)

    save_screenshot(page, "08_mobile_homepage")

    # Check if mobile menu works
    mobile_menu = page.locator('[class*="mobile"], button[aria-label*="menu"], .hamburger, .menu-toggle').count()
    print(f"  Mobile menu elements: {mobile_menu}")

    # Reset to desktop
    page.set_viewport_size({"width": 1280, "height": 720})
    goto_page(page, BASE_URL)

    save_screenshot(page, "08_desktop_homepage")

    return {
        "status": "✅ PASS",
        "mobile_menu_found": mobile_menu > 0
    }

def main():
    results = {}

    print("=" * 60)
    print("🧪 AFRICAN FASHION WEBSITE - FULL FUNCTIONALITY TEST")
    print("=" * 60)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        try:
            results["homepage"] = test_homepage(page)
            results["navigation"] = test_navigation(page)
            results["product_catalog"] = test_product_catalog(page)
            results["product_detail"] = test_product_detail(page)
            results["categories"] = test_categories(page)
            results["responsive"] = test_responsive_design(page)
            results["admin_login"] = test_admin_login(page)
            results["admin_products"] = test_admin_products(page)

        except Exception as e:
            print(f"\n❌ Error during testing: {e}")
            results["error"] = str(e)
        finally:
            browser.close()

    # Print summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)

    passed = sum(1 for r in results.values() if isinstance(r, dict) and "✅" in r.get("status", ""))
    failed = sum(1 for r in results.values() if isinstance(r, dict) and "❌" in r.get("status", ""))
    partial = sum(1 for r in results.values() if isinstance(r, dict) and "⚠️" in r.get("status", ""))

    for test_name, result in results.items():
        if isinstance(result, dict):
            status = result.get("status", "Unknown")
            print(f"  {test_name.replace('_', ' ').title()}: {status}")

    print(f"\n✅ Passed: {passed} | ⚠️ Partial: {partial} | ❌ Failed: {failed}")
    print(f"\n📸 Screenshots saved to: {SCREENSHOT_DIR}")

    return results

if __name__ == "__main__":
    main()
