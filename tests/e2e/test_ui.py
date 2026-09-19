import os
from pathlib import Path

from playwright.sync_api import sync_playwright

# Screenshots always land in <repo>/test_screenshots, whatever the working directory is.
output_dir = str(Path(__file__).resolve().parent.parent.parent / "test_screenshots")
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.set_viewport_size({"width": 1280, "height": 900})

    # Navigate to admin products page
    print("Navigating to admin products page...")
    page.goto('http://localhost:3005/admin/products')
    page.wait_for_load_state('networkidle')

    # Take screenshot of products list
    page.screenshot(path=os.path.join(output_dir, 'admin_products_list.png'), full_page=True)
    print("Screenshot saved: admin_products_list.png")

    # Click "Add Product" button
    print("Looking for Add Product button...")
    add_btn = page.locator('button:has-text("Add Product"), a:has-text("Add Product")')
    if add_btn.count() > 0:
        add_btn.first.click()
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1000)  # Wait for modal to fully render

        # Take screenshot of the Add Product modal
        page.screenshot(path=os.path.join(output_dir, 'add_product_modal.png'), full_page=True)
        print("Screenshot saved: add_product_modal.png")

        # Scroll down to see Size and Color selectors
        page.evaluate('window.scrollTo(0, document.body.scrollHeight / 2)')
        page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(output_dir, 'size_color_section.png'), full_page=True)
        print("Screenshot saved: size_color_section.png")

        # Close modal
        close_btn = page.locator('button[aria-label="Close"], button:has-text("Cancel")')
        if close_btn.count() > 0:
            close_btn.first.click()
            page.wait_for_timeout(500)
    else:
        # Try clicking Edit on first product
        print("No Add Product button found, looking for Edit button...")
        edit_btn = page.locator('button:has-text("Edit"), a:has-text("Edit")')
        if edit_btn.count() > 0:
            edit_btn.first.click()
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(1000)

            page.screenshot(path=os.path.join(output_dir, 'edit_product_modal.png'), full_page=True)
            print("Screenshot saved: edit_product_modal.png")

            # Scroll to Size/Color section
            page.evaluate('window.scrollTo(0, document.body.scrollHeight / 2)')
            page.wait_for_timeout(500)
            page.screenshot(path=os.path.join(output_dir, 'size_color_section.png'), full_page=True)
            print("Screenshot saved: size_color_section.png")

    browser.close()
    print(f"\nScreenshots saved to: {output_dir}")