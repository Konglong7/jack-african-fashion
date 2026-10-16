import json
import os
import re

target = r'D:\Desktop\code\African Fashion\data\new-70-products.json'
assert os.path.exists(target), 'File does not exist'
with open(target, 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f'Checking {len(products)} products...')
assert len(products) == 70

for idx, p in enumerate(products):
    expected_id = str(69 + idx)
    expected_code = str(1003001 + idx)
    actual_id = p['id']
    assert actual_id == expected_id, f"ID mismatch: got {actual_id}, expected {expected_id}"
    assert p['slug'].endswith(f'-{expected_code}'), f"Slug does not end with {expected_code}: {p['slug']}"
    assert p['image'] == f'/images/products/{expected_code}.png'
    assert p['images'] == [f'/images/products/{expected_code}.png']
    assert p['moq'] == 100
    assert p['moqOptions'] == [100, 500, 1000, 3000]
    assert p['stockType'] == 'Ready Stock'
    assert p['priceMin'] is None
    assert p['priceMax'] is None
    assert p['isNew'] is True
    assert p['isPopular'] is False
    assert p['sizes'] == ['XL', 'XXL', '3XL', '4XL', '5XL']
    
    # Check category distribution
    c_int = int(expected_code)
    if 1003001 <= c_int <= 1003024:
        assert p['category'] == 'Plus Size Dresses', f"Category error for {expected_code}: {p['category']}"
    elif 1003025 <= c_int <= 1003044:
        assert p['category'] == 'Maxi Dresses', f"Category error for {expected_code}: {p['category']}"
    elif 1003045 <= c_int <= 1003060:
        assert p['category'] == 'Two Piece Sets', f"Category error for {expected_code}: {p['category']}"
    elif 1003061 <= c_int <= 1003070:
        assert p['category'] == 'Jumpsuits', f"Category error for {expected_code}: {p['category']}"
    else:
        raise AssertionError('Code out of range')
        
    # Check whatsappMessage
    expected_wa = f"Hi Jack, I want to inquire about Style {expected_code} ({p['name']}). Please share the wholesale quotation, available color mix, and minimum order quantity."
    assert p['whatsappMessage'] == expected_wa, f"WhatsApp mismatch:\nGot: {p['whatsappMessage']}\nExp: {expected_wa}"
    
    # Check 6 colors
    assert len(p['colors']) == 6, f"Expected 6 colors, got {len(p['colors'])}"
    for c in p['colors']:
        assert 'name' in c and 'hex' in c
        assert re.match(r'^#[0-9a-fA-F]{6}$', c['hex']), f"Invalid hex: {c['hex']}"
        
    # Check description and features
    assert len(p['description']) > 50, f"Description too short in {expected_code}"
    assert len(p['features']) >= 4, f"Fewer than 4 features in {expected_code}"
    for feat in p['features']:
        assert len(feat) > 10, f"Feature too short in {expected_code}: {feat}"
        
    # Check image file on disk
    img_file = os.path.join(r'D:\Desktop\code\African Fashion\public', p['image'].lstrip('/'))
    assert os.path.exists(img_file), f"Image file missing on disk: {img_file}"

print('ALL 70 PRODUCTS VERIFIED AND 100% COMPLIANT WITH ALL REQUIREMENTS!')
