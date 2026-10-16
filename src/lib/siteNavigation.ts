import type { SiteCategory } from './siteContentTypes';

export interface SiteLink {
  label: string;
  href: string;
}

const COMPANY_LINKS: SiteLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Custom Orders', href: '/custom-orders' },
  { label: 'Wholesale Catalog', href: '/catalog' }
];

const HELP_LINKS: SiteLink[] = [
  { label: 'Wholesale FAQ', href: '/faq' },
  { label: 'Contact Supplier', href: '/contact' },
  { label: 'Buying Guide', href: '/buying-guide' },
  { label: 'Buyer Checklists', href: '/guides' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Wholesale Terms', href: '/terms' }
];

const WHOLESALE_LINKS: SiteLink[] = [
  { label: 'African Dresses', href: '/wholesale/african-dresses' },
  { label: 'Maxi Dresses', href: '/wholesale/maxi-dresses' },
  { label: 'Jumpsuits', href: '/wholesale/jumpsuits' },
  { label: 'Two Piece Sets', href: '/wholesale/two-piece-sets' },
  { label: 'Plus Size Clothing', href: '/wholesale/plus-size-womens-clothing' },
  { label: 'Ready Stock', href: '/wholesale/ready-stock' }
];

const MARKET_LINKS: SiteLink[] = [
  { label: 'Africa', href: '/markets/africa' },
  { label: 'Middle East', href: '/markets/middle-east' },
  { label: 'Europe & North America', href: '/markets/europe-north-america' },
  { label: 'Latin America', href: '/markets/latin-america' },
  { label: 'Southeast Asia', href: '/markets/southeast-asia' }
];

const SHORT_CATEGORY_LABELS = new Map([
  ['Plus Size Dresses', 'Plus Size'],
  ['Pleated Dresses', 'Pleated Styles']
]);

export function buildNavLinks(categories: SiteCategory[], contactHref = '/contact'): SiteLink[] {
  return [
    { label: 'New Arrivals', href: '/catalog?sort=newest' },
    { label: 'Buying Markets', href: '/markets' },
    ...productCategoryLinks(categories),
    { label: 'Custom Orders', href: '/custom-orders' },
    { label: 'About Us', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: contactHref }
  ];
}

export function buildFooterLinks(_categories: SiteCategory[], contactHref = '/contact') {
  return {
    company: COMPANY_LINKS.map((link) =>
      link.href === '/contact' ? { ...link, href: contactHref } : link
    ),
    products: WHOLESALE_LINKS,
    markets: MARKET_LINKS,
    help: HELP_LINKS.map((link) =>
      link.href === '/contact' ? { ...link, href: contactHref } : link
    )
  };
}

export function categoryHref(name: string): string {
  if (name === 'Maxi Dresses') return '/wholesale/maxi-dresses';
  if (name === 'Jumpsuits') return '/wholesale/jumpsuits';
  return `/catalog?category=${encodeURIComponent(name)}`;
}

function productCategoryLinks(categories: SiteCategory[]): SiteLink[] {
  return categories
    .filter((category) => category.name.toLowerCase() !== 'custom orders')
    .slice(0, 4)
    .map((category) => ({
      label: SHORT_CATEGORY_LABELS.get(category.name) || category.name,
      href: categoryHref(category.name)
    }));
}
