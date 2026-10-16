export interface MarketRegion {
  slug: string;
  name: string;
  title: string;
  description: string;
  introduction: string;
  countries: string[];
  categories: string[];
  sourcingFocus: string;
  buyingChecks: { title: string; body: string }[];
  whatsappMessage: string;
}

// Countries are examples of enquiry destinations, not a record of completed deliveries.
export const MARKET_REGIONS: MarketRegion[] = [
  {
    slug: 'africa',
    name: 'Africa',
    title: 'Wholesale Womenswear Sourcing for Africa',
    description:
      'Explore dresses and coordinated sets for everyday, boutique and occasion ranges. Confirm measurements, colors, quantities and forwarding terms for your destination.',
    introduction:
      'Jack Fashion supports wholesale sourcing enquiries for Africa, including destinations such as Nigeria, Ghana, Kenya and South Africa. Share your selling occasion, preferred fit and selected styles so we can discuss the specifications for your order.',
    countries: ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Tanzania'],
    categories: [
      'Plus Size Dresses',
      'Two Piece Sets',
      'Coordinated Styles',
      'Maxi Dresses',
      'Midi Dresses'
    ],
    sourcingFocus: 'Dresses and sets for everyday retail, boutique ranges and celebration wear.',
    buyingChecks: [
      {
        title: 'Style and color mix',
        body: 'Share product codes, preferred colors and the occasion you are buying for. Ask which colors and quantities are available for each style before building your assortment.'
      },
      {
        title: 'Fit and finished measurements',
        body: 'Confirm bust, waist, hip and finished length for each selected size. Check stretch, sleeve coverage and lining from available product details or requested photos.'
      },
      {
        title: 'Order and agent handover',
        body: 'Confirm MOQ per style and color, packing, payment terms and the shipping or Guangzhou agent handover arrangement for this order. Agree export documents and responsibilities before payment.'
      }
    ],
    whatsappMessage:
      'Hi Jack Fashion, I am sourcing womenswear for Africa. My destination is [country/city] and my estimated quantity is [quantity]. Please help confirm selected styles, garment measurements, available colors, MOQ and shipping or agent handover terms.'
  },
  {
    slug: 'middle-east',
    name: 'Middle East',
    title: 'Wholesale Dresses and Sets for Middle East Buyers',
    description:
      'Discuss maxi dresses and coordinated sets for boutique and occasion ranges. Check length, neckline, sleeves and lining on each selected style.',
    introduction:
      'Jack Fashion supports sourcing enquiries for Middle East destinations such as the United Arab Emirates, Saudi Arabia and Qatar. Use the current dress and set selection as a starting point, then confirm the coverage, fit and fabric your customers need on each style.',
    countries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman'],
    categories: [
      'Maxi Dresses',
      'Midi Dresses',
      'Coordinated Styles',
      'Two Piece Sets',
      'Plus Size Dresses'
    ],
    sourcingFocus: 'Long dresses and sets, with coverage and occasion details checked by style.',
    buyingChecks: [
      {
        title: 'Coverage and occasion details',
        body: 'Check sleeve length, neckline, dress length, slit position and lining for every selected style. Request detail photos to assess opacity and coverage for your intended wearing occasion.'
      },
      {
        title: 'Fabric and size specifications',
        body: 'Ask about fabric composition, stretch and care information. Confirm bust, waist, hip and finished length for each size, including the separate top and bottom measurements for sets.'
      },
      {
        title: 'Order and export arrangements',
        body: 'Confirm stock, MOQ, color quantities, packing and payment terms for the order. Discuss your agent or export handover point, required documents and importer responsibilities before payment.'
      }
    ],
    whatsappMessage:
      'Hi Jack Fashion, I am sourcing dresses and sets for the Middle East. My destination is [country/city] and my estimated quantity is [quantity]. Please help confirm length, sleeve and lining details, size measurements, available colors, MOQ and export or agent handover terms.'
  },
  {
    slug: 'europe-north-america',
    name: 'Europe & North America',
    title: 'Plus Size Wholesale Sourcing for Europe & North America',
    description:
      'Explore plus size dresses, sets and jumpsuits for your retail range. Discuss garment measurements, size grading, material details and order specifications.',
    introduction:
      'Jack Fashion supports plus size sourcing enquiries for destinations such as the United Kingdom, Germany, the United States and Canada. Start with selected styles and your fit requirements, then confirm garment measurements and size grading before preparing your local size guide.',
    countries: ['United Kingdom', 'France', 'Germany', 'United States', 'Canada'],
    categories: ['Plus Size Dresses', 'Two Piece Sets', 'Jumpsuits'],
    sourcingFocus: 'Plus size ranges selected through garment measurements and fit requirements.',
    buyingChecks: [
      {
        title: 'Measured fit and size grading',
        body: 'Size labels are style-specific. Request bust, waist, hip and length measurements, stretch details and the grading between sizes. Ask about sample availability to assess fit before choosing a size pack.'
      },
      {
        title: 'Material and product information',
        body: 'Ask for available fabric composition and care details, and confirm lining and opacity. Review your destination labeling requirements with your importer and agree the product information needed for the order.'
      },
      {
        title: 'Order and importer handover',
        body: 'Confirm stock, MOQ, the size-color packing breakdown and payment terms. Agree shipping or agent handover, export documents and importer responsibilities for this order before payment.'
      }
    ],
    whatsappMessage:
      'Hi Jack Fashion, I am sourcing plus size womenswear for Europe or North America. My destination is [country/city] and my estimated quantity is [quantity]. Please help confirm garment measurements, size grading, material details, available sizes, MOQ and shipping or agent handover terms.'
  },
  {
    slug: 'latin-america',
    name: 'Latin America',
    title: 'Wholesale Dresses, Sets and Jumpsuits for Latin America',
    description:
      'Discuss dresses, coordinated sets and jumpsuits for boutique, everyday and occasion ranges. Confirm fit, fabric, color mix and the details of your order.',
    introduction:
      'Jack Fashion supports womenswear sourcing enquiries for Latin America, with Brazil, Mexico and Colombia among the destination examples. Share the everyday or occasion range you are planning, your preferred silhouettes and product codes so we can discuss style and order specifications.',
    countries: ['Brazil', 'Mexico', 'Colombia', 'Chile', 'Peru'],
    categories: [
      'Two Piece Sets',
      'Maxi Dresses',
      'Midi Dresses',
      'Jumpsuits',
      'Coordinated Styles'
    ],
    sourcingFocus: 'Dresses, coordinated sets and jumpsuits for everyday and occasion assortments.',
    buyingChecks: [
      {
        title: 'Silhouette and color selection',
        body: 'Share the silhouettes, colors and selling occasions you want to cover. Confirm available colors and quantities by product code, including how tops and bottoms are paired in each set.'
      },
      {
        title: 'Fit and construction details',
        body: 'Confirm bust, waist, hip and length measurements, plus rise and inseam for jumpsuits. Ask about stretch, lining, closures and slit positions before selecting the size mix.'
      },
      {
        title: 'Quantity and forwarding terms',
        body: 'Confirm MOQ, stock, the size-color packing breakdown and payment terms for the order. Agree the shipping or agent handover arrangement, export documents and importer responsibilities before payment.'
      }
    ],
    whatsappMessage:
      'Hi Jack Fashion, I am sourcing dresses, sets and jumpsuits for Latin America. My destination is [country/city] and my estimated quantity is [quantity]. Please help confirm selected styles, fit measurements, fabric details, available colors, MOQ and forwarding or agent handover terms.'
  },
  {
    slug: 'southeast-asia',
    name: 'Southeast Asia',
    title: 'Wholesale Womenswear Sourcing for Southeast Asia',
    description:
      'Explore sets and dresses for everyday, boutique and occasion ranges. Discuss fabric feel, opacity, coverage, size quantities and forwarding arrangements.',
    introduction:
      'Jack Fashion supports sourcing enquiries for Southeast Asian destinations such as Malaysia, Indonesia and the Philippines. Share your preferred fabric feel, coverage and selling occasion, then confirm those details on selected styles along with the quantities for your order.',
    countries: ['Malaysia', 'Indonesia', 'Philippines', 'Thailand', 'Vietnam'],
    categories: ['Two Piece Sets', 'Coordinated Styles', 'Maxi Dresses', 'Midi Dresses'],
    sourcingFocus:
      'Sets and dresses chosen for fabric feel, practical coverage and wearing occasion.',
    buyingChecks: [
      {
        title: 'Fabric feel and opacity',
        body: 'Ask about composition, fabric weight where available, stretch and lining. Request close-up photos or ask about sample availability to assess fabric feel and opacity for your retail range.'
      },
      {
        title: 'Coverage and size mix',
        body: 'Confirm neckline, sleeve length and finished garment length by style. Request bust, waist and hip measurements, including separate top and bottom specifications for sets, before choosing size quantities.'
      },
      {
        title: 'Order and consolidation details',
        body: 'Confirm stock, MOQ, color quantities, packing and payment terms for this order. Agree shipping or consolidation with your agent, the export handover point and document responsibilities before payment.'
      }
    ],
    whatsappMessage:
      'Hi Jack Fashion, I am sourcing womenswear for Southeast Asia. My destination is [country/city] and my estimated quantity is [quantity]. Please help confirm fabric, lining and coverage details, size measurements, available colors, MOQ and shipping or agent consolidation terms.'
  }
];

export function getMarketRegion(slug: string): MarketRegion | undefined {
  return MARKET_REGIONS.find((region) => region.slug === slug);
}
