import { describe, expect, test } from 'vitest';
import { buildFooterLinks, buildNavLinks } from './siteNavigation';

const categories = [
  { name: 'Linen Dresses' },
  { name: 'Two Piece Sets' },
  { name: 'Plus Size Dresses' },
  { name: 'Custom Orders' },
  { name: 'New Boutique Range' }
];

describe('site navigation helpers', () => {
  test('builds header links from editable categories', () => {
    expect(buildNavLinks(categories)).toEqual([
      { label: 'New Arrivals', href: '/catalog?sort=newest' },
      { label: 'Linen Dresses', href: '/catalog?category=Linen%20Dresses' },
      { label: 'Two Piece Sets', href: '/catalog?category=Two%20Piece%20Sets' },
      { label: 'Plus Size', href: '/catalog?category=Plus%20Size%20Dresses' },
      { label: 'New Boutique Range', href: '/catalog?category=New%20Boutique%20Range' },
      { label: 'Custom Orders', href: '/custom-orders' },
      { label: 'About Us', href: '/about' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' }
    ]);
  });

  test('builds footer links for crawlable wholesale and market landing pages', () => {
    const footer = buildFooterLinks(categories);
    expect(footer.products).toEqual([
      { label: 'African Dresses', href: '/wholesale/african-dresses' },
      { label: 'Two Piece Sets', href: '/wholesale/two-piece-sets' },
      { label: 'Plus Size Clothing', href: '/wholesale/plus-size-womens-clothing' },
      { label: 'Ready Stock', href: '/wholesale/ready-stock' }
    ]);
    expect(footer.markets).toHaveLength(5);
    expect(footer.help[0]).toEqual({ label: 'Wholesale FAQ', href: '/faq' });
  });
});
