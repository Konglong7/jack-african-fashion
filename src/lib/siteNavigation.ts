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
  { label: 'Size Guide', href: '/contact#size-guide' },
  { label: 'Shipping Info', href: '/contact#shipping' },
  { label: 'FAQ', href: '/contact#faq' },
  { label: 'Privacy Policy', href: '/contact#privacy' }
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
    { label: 'Contact', href: '/contact' }
  ];
}

export function buildFooterLinks(categories: SiteCategory[]) {
  return {
    company: COMPANY_LINKS,
    products: productCategoryLinks(categories),
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
