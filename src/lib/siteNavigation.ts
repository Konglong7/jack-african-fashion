import type { SiteCategory } from './siteContentTypes';

export interface SiteLink {
  label: string;
  href: string;
}

const COMPANY_LINKS: SiteLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Custom Orders', href: '/custom-orders' },
  { label: 'Inquiry List', href: '/inquiry' },
  { label: 'Wholesale Catalog', href: '/catalog' }
];

const HELP_LINKS: SiteLink[] = [
  { label: 'Wholesale FAQ', href: '/faq' },
  { label: 'Contact Supplier', href: '/contact' },
  { label: 'Wholesale Catalog', href: '/catalog' }
];

const WHOLESALE_LINKS: SiteLink[] = [
  { label: 'African Dresses', href: '/wholesale/african-dresses' },
  { label: 'Two Piece Sets', href: '/wholesale/two-piece-sets' },
  { label: 'Plus Size Clothing', href: '/wholesale/plus-size-womens-clothing' },
  { label: 'Ready Stock', href: '/wholesale/ready-stock' }
];

const MARKET_LINKS: SiteLink[] = [
  { label: 'Nigeria', href: '/markets/nigeria' },
  { label: 'Ghana', href: '/markets/ghana' },
  { label: 'Kenya', href: '/markets/kenya' },
  { label: 'Tanzania', href: '/markets/tanzania' },
  { label: 'South Africa', href: '/markets/south-africa' }
];

const SHORT_CATEGORY_LABELS = new Map([
  ['Plus Size Dresses', 'Plus Size'],
  ['Pleated Dresses', 'Pleated Styles']
]);

export function buildNavLinks(categories: SiteCategory[]): SiteLink[] {
  return [
    { label: 'New Arrivals', href: '/catalog?sort=newest' },
    ...productCategoryLinks(categories),
    { label: 'Custom Orders', href: '/custom-orders' },
    { label: 'About Us', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' }
  ];
}

export function buildFooterLinks(_categories: SiteCategory[]) {
  return {
    company: COMPANY_LINKS,
    products: WHOLESALE_LINKS,
    markets: MARKET_LINKS,
    help: HELP_LINKS
  };
}

function productCategoryLinks(categories: SiteCategory[]): SiteLink[] {
  return categories
    .filter((category) => category.name.toLowerCase() !== 'custom orders')
    .slice(0, 4)
    .map((category) => ({
      label: SHORT_CATEGORY_LABELS.get(category.name) || category.name,
      href: `/catalog?category=${encodeURIComponent(category.name)}`
    }));
}
