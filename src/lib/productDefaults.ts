import type { Product } from './db';

/**
 * Product Detail FAQ generator that creates lightweight, question-focused FAQ items.
 * For the image-led inquiry workflow, FAQs should complement WhatsApp conversations
 * rather than replace them.
 */
export function DEFAULT_PRODUCT_FAQ(productName: string): Array<{ question: string; answer: string }> {
  return [
    {
      question: 'Can I mix colors and sizes?',
      answer: `Yes. For ${productName}, send your preferred color and size ratio on WhatsApp before quotation.`
    },
    {
      question: 'Can you produce a similar style from my picture?',
      answer: 'Yes. Send reference photos, target quantity, fabric expectations, and destination market. We can produce custom orders for most styles at reasonable quantities.'
    },
    {
      question: 'How do I get the best wholesale price?',
      answer: "Share quantity, size ratio, colors, shipping destination, and whether you need ready stock or custom production. We'll provide a competitive quote within 24 hours."
    },
    {
      question: 'Do you check quality before shipping?',
      answer: 'Yes. Fabric, stitching, size mix, and packing can be checked before dispatch. We accept photos or video upon request.'
    }
  ];
}

/**
 * Default sizes for product listings.
 * Broad range suitable for African womenswear, with Free Size as the primary option.
 */
export const DEFAULT_PRODUCT_SIZES = [
  'Free Size',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  '3XL',
  '4XL',
  '5XL',
  '6XL'
];

/**
 * Default colors for product listings.
 * Common colors that work well across African fashion buyers.
 */
export const DEFAULT_PRODUCT_COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Ivory', hex: '#f8f1e7' },
  { name: 'Beige', hex: '#d8c3a5' },
  { name: 'Brown', hex: '#7a4a28' },
  { name: 'Chocolate', hex: '#4b2418' },
  { name: 'Red', hex: '#c1121f' },
  { name: 'Wine', hex: '#7b1e3b' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Purple', hex: '#7e22ce' },
  { name: 'Royal Blue', hex: '#1e3a8a' },
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Green', hex: '#15803d' },
  { name: 'Emerald', hex: '#0f766e' },
  { name: 'Yellow', hex: '#facc15' },
  { name: 'Gold', hex: '#d4a017' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Grey', hex: '#6b7280' },
  { name: 'Navy', hex: '#0f172a' },
  { name: 'Multi Print', hex: '#c2410c' }
];

/**
 * Size requirement note text for product detail pages.
 */
export const SIZE_REQUIREMENT_NOTE = (
  'Available sizes are shown above. Send your preferred size ratio on WhatsApp before quotation.'
);

/**
 * Gets product-specific sizes, falling back to default broad sizes.
 */
export function getProductSizes(sizes?: Product['sizes']): Array<string> {
  if (!sizes || sizes.length === 0) return DEFAULT_PRODUCT_SIZES;
  return sizes;
}

/**
 * Gets product-specific colors, falling back to default common colors.
 */
export function getProductColors(colors?: Product['colors']): Array<{ name: string; hex: string }> {
  if (!colors || colors.length === 0) return DEFAULT_PRODUCT_COLORS;
  return colors;
}
