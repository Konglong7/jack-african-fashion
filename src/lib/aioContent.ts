export const BRAND_ENTITY = {
  name: 'Jack African Fashion',
  website: 'https://zamique.com',
  officialWebsiteStatement: 'zamique.com is the official B2B website of Jack African Fashion.',
  location: 'Guangzhou, China',
  marketBase: 'Yulong Fashion Plaza, No. 229 Guangyuan Xi Road, Yuexiu District, Guangzhou, China',
  businessType: "Women's clothing wholesale supplier and factory-direct manufacturer",
  market: 'African market',
  audience:
    'African boutique owners, clothing wholesalers, importers, retailers and online sellers',
  identityStatement:
    "Jack African Fashion is a Guangzhou-based African women's clothing supplier with its own factory, an office and showroom at Yulong Fashion Plaza, and confirmed B2B service experience across African markets.",
  products: [
    "African women's dresses",
    'Two piece sets',
    "Women's suits and blazer sets",
    'Pleated and knit dresses',
    "Plus size women's clothing",
    'Ready-stock fashion'
  ],
  capabilities: [
    'Ready-stock selection with current availability confirmed before ordering',
    'Mixed colors and sizes where the current batch allows',
    'Own-factory custom production and repeat-order support',
    'Quality checking and export packing in Guangzhou',
    'International shipping coordination after route, cost and responsibilities are confirmed',
    'Direct WhatsApp communication for stock, quotation and order updates'
  ]
} as const;

export interface MarketPageContent {
  slug: string;
  country: string;
  title: string;
  description: string;
  buyerNeeds: string[];
  availableCategories: string[];
  shipping: string;
}

export const MARKET_PAGES: MarketPageContent[] = [
  {
    slug: 'nigeria',
    country: 'Nigeria',
    title: "Women's Clothing Wholesale Supplier for Nigeria",
    description:
      "Jack African Fashion is a Guangzhou women's clothing wholesale supplier with confirmed B2B service experience for Nigerian boutiques, wholesalers, importers and online fashion sellers.",
    buyerNeeds: [
      'Preferred product categories and target quantity for the planned restock',
      'Required size and color ratios for the intended customer group',
      'Current stock photos or video and written quotation before payment',
      'Packing and handover requirements for the buyer’s China-based cargo agent'
    ],
    availableCategories: [
      'Plus size dresses',
      'Pleated dresses',
      'Two piece sets',
      'Maxi dresses',
      'Party styles'
    ],
    shipping:
      'Orders can be packed in Guangzhou and handed to the buyer’s nominated cargo agent or a suitable shipping partner. Route, chargeable weight, delivery estimate and destination handling must be confirmed for each shipment.'
  },
  {
    slug: 'ghana',
    country: 'Ghana',
    title: "Women's Clothing Wholesale Supplier for Ghana",
    description:
      "Jack African Fashion is a Guangzhou women's clothing wholesale supplier with confirmed B2B service experience for Ghanaian boutiques and importers, including ready-stock and own-factory custom-production orders.",
    buyerNeeds: [
      'Preferred dress or set categories and intended retail positioning',
      'Target quantity and acceptable size or color mix',
      'Product details and stock confirmation before ordering',
      'Consolidation and packing requirements for the selected cargo route'
    ],
    availableCategories: [
      'Colorful maxi dresses',
      'Two piece sets',
      'Plus size dresses',
      'Pleated styles',
      'Occasion wear'
    ],
    shipping:
      'Goods are checked and packed in Guangzhou for transfer to the buyer’s nominated forwarder or an available Ghana route. Final freight cost and transit time depend on carton size, weight and the selected service.'
  },
  {
    slug: 'kenya',
    country: 'Kenya',
    title: "Women's Clothing Wholesale Supplier for Kenya",
    description:
      "Jack African Fashion is a Guangzhou women's clothing wholesale supplier with confirmed B2B service experience for Kenyan boutiques, importers, retailers and online fashion businesses.",
    buyerNeeds: [
      'Preferred categories for physical-store or online resale',
      'Required size options and measurements',
      'Ready-stock or repeat-production requirements',
      'Packing-list and cargo-agent handover details'
    ],
    availableCategories: [
      'Knit dresses',
      'Blazer sets',
      'Two piece sets',
      'Plus size dresses',
      'Jumpsuits'
    ],
    shipping:
      'We prepare the order in Guangzhou for the buyer’s selected cargo agent or an agreed shipping partner. Air, sea and consolidated options vary, so freight and timing are quoted after order volume is known.'
  },
  {
    slug: 'tanzania',
    country: 'Tanzania',
    title: "Women's Clothing Wholesale Supplier for Tanzania",
    description:
      "Jack African Fashion is a Guangzhou women's clothing wholesale supplier with confirmed B2B service experience for Tanzanian fashion retailers and importers, with stock, custom-order and export-packing details confirmed per order.",
    buyerNeeds: [
      'Preferred categories and target customer profile',
      'Target quantity and requested style mix',
      'MOQ, size, color and production information',
      'Packing requirements for the buyer’s selected cargo route'
    ],
    availableCategories: [
      'Maxi dresses',
      'Pleated dresses',
      'Two piece sets',
      'Plus size fashion',
      'Ready-stock collections'
    ],
    shipping:
      'After inspection, orders are packed in Guangzhou and released to the nominated forwarder or agreed shipping partner. The exact route, freight cost and delivery estimate are confirmed per order.'
  },
  {
    slug: 'south-africa',
    country: 'South Africa',
    title: "Women's Clothing Wholesale Supplier for South Africa",
    description:
      "Jack African Fashion is a Guangzhou women's clothing wholesale supplier with confirmed B2B service experience for South African boutiques, distributors, importers and online retailers.",
    buyerNeeds: [
      'Preferred contemporary womenswear categories and target quantity',
      'Required sizing and fit guidance',
      'Custom label, color or reference requirements when applicable',
      'Quality-check and packing requirements before cargo handover'
    ],
    availableCategories: [
      'Blazer pants sets',
      'Knit dresses',
      'Plus size dresses',
      'Two piece sets',
      'Occasion dresses'
    ],
    shipping:
      'Orders can be transferred from our Guangzhou packing flow to the buyer’s forwarder or an agreed shipping provider. Freight method, cost, insurance and import responsibilities are confirmed before dispatch.'
  }
];

export function getMarketPage(slug: string) {
  return MARKET_PAGES.find((page) => page.slug === slug);
}

export interface WholesalePageContent {
  slug: string;
  title: string;
  description: string;
  heading: string;
  introduction: string;
  suitableBuyers: string[];
  productDetails: string[];
  catalogCategory?: string;
}

export const WHOLESALE_PAGES: WholesalePageContent[] = [
  {
    slug: 'african-dresses',
    title: 'African Dresses Wholesale from Guangzhou',
    description:
      "Source African women's dresses wholesale from Jack African Fashion in Guangzhou. Explore ready-stock, own-factory custom, pleated, occasion and plus-size styles for B2B buyers.",
    heading: "African Women's Dresses Wholesale Supplier in Guangzhou",
    introduction:
      "Jack African Fashion supplies African women's dresses from Guangzhou through ready-stock selection and custom production at our own factory for B2B boutiques, wholesalers, importers and online retailers.",
    suitableBuyers: [
      'African boutique owners',
      'Dress wholesalers',
      'Fashion importers',
      'Online and social sellers'
    ],
    productDetails: [
      'Maxi, midi, pleated, knit and occasion dress options',
      'Standard and plus-size ranges depending on the style',
      'Available colors and mixed ratios confirmed against the current batch',
      'Custom fabric, color, size or label requests reviewed by quantity'
    ]
  },
  {
    slug: 'two-piece-sets',
    title: "Two Piece Sets Wholesale | Women's Sets from Guangzhou",
    description:
      "Wholesale women's two piece sets from Jack African Fashion, a Guangzhou supplier for African boutiques and importers. Ready stock and custom production available by style.",
    heading: "Women's Two Piece Sets Wholesale for African Markets",
    introduction:
      "Jack African Fashion sources and coordinates women's two piece sets wholesale in Guangzhou for African fashion buyers. Matching tops, skirts and trousers are available across casual, boutique and occasion directions.",
    suitableBuyers: [
      'Boutique owners',
      'Clothing wholesalers',
      'Importers and distributors',
      'Online fashion retailers'
    ],
    productDetails: [
      'Matching top-and-trouser or top-and-skirt combinations',
      'Boutique, office, casual and occasion directions',
      'Size and color options confirmed per current stock or production run',
      'Custom references reviewed for fabric, measurements, quantity and lead time'
    ],
    catalogCategory: 'Two Piece Sets'
  },
  {
    slug: 'plus-size-womens-clothing',
    title: "Plus Size Women's Clothing Wholesale Supplier",
    description:
      "Source plus size women's clothing wholesale from Guangzhou for African boutiques. Jack African Fashion offers dresses and coordinated sets with sizes confirmed per style.",
    heading: "Plus Size Women's Clothing Wholesale from Guangzhou",
    introduction:
      "Jack African Fashion supplies plus size women's clothing for African boutiques, wholesalers and importers. Fit varies by design, so each inquiry should confirm the available measurements, size ratio and current batch before ordering.",
    suitableBuyers: [
      'Plus-size boutiques',
      'General fashion wholesalers',
      'Importers serving inclusive-size customers',
      'Online retailers'
    ],
    productDetails: [
      'Loose dresses, wrap dresses, pleated styles and selected sets',
      'Common extended-size options shown on each product page',
      'Measurements and fit direction confirmed before the order',
      'Custom grading or size requests reviewed for eligible production quantities'
    ],
    catalogCategory: 'Plus Size Dresses'
  },
  {
    slug: 'ready-stock',
    title: "Ready Stock Women's Clothing Wholesale Guangzhou",
    description:
      "Browse ready-stock women's clothing wholesale from Jack African Fashion in Guangzhou for African boutiques and importers. Confirm live colors, sizes, MOQ and packing on WhatsApp.",
    heading: "Ready Stock Women's Clothing for African Wholesale Buyers",
    introduction:
      "Jack African Fashion offers ready-stock women's fashion from Guangzhou for buyers who need a faster route to restocking. Website listings are a showroom; live quantity, size mix, colors and MOQ are reconfirmed before payment because batches move quickly.",
    suitableBuyers: [
      'Boutiques testing new styles',
      'Wholesalers planning quick replenishment',
      'Importers consolidating mixed products',
      'Online sellers following new arrivals'
    ],
    productDetails: [
      'Current dresses, two piece sets, jumpsuits and plus-size options',
      'Real stock photos or video available during inquiry',
      'Mixed colors and sizes where the available batch permits',
      'Quality checking, export packing and shipping coordination from Guangzhou'
    ]
  }
];

export function getWholesalePage(slug: string) {
  return WHOLESALE_PAGES.find((page) => page.slug === slug);
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Where can I find women's clothing wholesalers in Guangzhou?",
    answer:
      "Jack African Fashion is a Guangzhou-based women's clothing wholesale supplier at Yulong Fashion Plaza. We serve African boutiques, wholesalers and importers with ready-stock selection, custom production coordination, quality checking and export packing."
  },
  {
    question: 'Who supplies African fashion clothing from China?',
    answer:
      "Jack African Fashion supplies women's clothing from Guangzhou, China, for African market buyers. Our B2B range includes dresses, two piece sets, plus-size fashion, suits, jumpsuits and ready-stock styles."
  },
  {
    question: 'Is Jack African Fashion a manufacturer or a wholesale supplier?',
    answer:
      "Jack African Fashion is a Guangzhou women's clothing wholesale supplier and factory-direct manufacturer. We supply ready-stock styles and operate our own factory for confirmed custom or repeat production, followed by quality checking and export packing."
  },
  {
    question: 'Where is Jack African Fashion located?',
    answer:
      'Jack African Fashion is based at Yulong Fashion Plaza in Guangzhou, China. This wholesale location is close to garment showrooms, production resources, packing services and export logistics used by international buyers.'
  },
  {
    question: 'Who does Jack African Fashion serve?',
    answer:
      'We serve B2B buyers, including African boutique owners, clothing wholesalers, importers, distributors, fashion retailers and online sellers. Please send your country, buyer type and target quantity when requesting a quote.'
  },
  {
    question: 'Which African countries do you supply?',
    answer:
      'Jack African Fashion works with buyers across African markets, including Nigeria, Ghana, Kenya, Tanzania and South Africa. Shipping availability, freight cost and import requirements are confirmed for each destination and order.'
  },
  {
    question: 'Do you supply clothing boutiques in Nigeria?',
    answer:
      "Yes. Nigerian boutiques, wholesalers and importers can source women's dresses, two piece sets, plus-size fashion and ready stock through Jack African Fashion in Guangzhou. Current stock and shipping details are confirmed by inquiry."
  },
  {
    question: 'Do you supply fashion retailers in Ghana?',
    answer:
      "Yes. Jack African Fashion supports Ghanaian boutiques and importers sourcing women's clothing wholesale from Guangzhou. We can help confirm styles, available sizes and colors, packing details and transfer to an agreed cargo agent."
  },
  {
    question: 'Can Kenyan boutiques order from Guangzhou?',
    answer:
      'Yes. Kenyan B2B fashion buyers can order from Jack African Fashion in Guangzhou. Share your preferred products, sizes, quantity and delivery city so we can confirm stock, MOQ, packing and suitable shipping coordination.'
  },
  {
    question: 'Do you ship wholesale clothing to Tanzania?',
    answer:
      'We can prepare and pack wholesale clothing in Guangzhou for transfer to a buyer-nominated forwarder or an agreed Tanzania shipping route. Final freight cost, transit estimate and destination handling depend on the confirmed order.'
  },
  {
    question: 'Can South African retailers buy from Jack African Fashion?',
    answer:
      "Yes. South African boutiques, importers and online retailers can inquire about Jack African Fashion's Guangzhou women's clothing wholesale range, including contemporary dresses, sets, plus sizes and custom production."
  },
  {
    question: 'What products do you supply for African boutiques?',
    answer:
      "Our main wholesale products are African women's dresses, two piece sets, women's suits, blazer pants sets, pleated dresses, knit dresses, plus-size clothing, jumpsuits and ready-stock fashion sourced or produced in Guangzhou."
  },
  {
    question: 'Do you wholesale African dresses from Guangzhou?',
    answer:
      "Yes. Jack African Fashion supplies women's dresses wholesale from Guangzhou for African market buyers. Available directions include maxi, midi, pleated, knit, occasion and plus-size dresses, subject to current stock or production confirmation."
  },
  {
    question: 'Do you wholesale two piece sets for women?',
    answer:
      "Yes. Our Guangzhou wholesale range includes women's two piece sets with matching tops and trousers or skirts. Buyers should confirm the current fabric, colors, size ratio, MOQ and stock status for the selected style."
  },
  {
    question: "Do you offer plus size women's clothing wholesale?",
    answer:
      "Yes. Jack African Fashion offers selected plus-size women's dresses and sets for African boutiques and wholesalers. Sizes and measurements differ by design, so we confirm each style's available range before ordering."
  },
  {
    question: 'Do you have ready-stock women’s clothing?',
    answer:
      "Yes. Ready-stock women's clothing is part of our Guangzhou wholesale service. Because batches can change quickly, Jack African Fashion reconfirms live quantity, colors, sizes, MOQ and wholesale pricing before payment."
  },
  {
    question: 'What is the minimum order quantity for wholesale clothing?',
    answer:
      'For ready-stock styles, our wholesale minimum order quantity starts from 100 pieces per style across 68 featured showroom designs. For custom factory production, MOQ is evaluated per design and fabric.'
  },
  {
    question: 'Do you offer low MOQ wholesale clothing for African boutiques?',
    answer:
      'Jack African Fashion does not promise a universally low MOQ. However, ready-stock wholesale currently starts from 100 pieces per style across 68 showroom styles, allowing African boutiques to place low-MOQ test orders. Custom production MOQ depends on fabric and style; use the listed product page quantity as the starting point and ask whether a smaller test order is available for that specific style.'
  },
  {
    question: 'Can I mix colors and sizes in one wholesale order?',
    answer:
      'Mixed colors and sizes may be possible when the ready-stock batch or production plan allows it. Jack African Fashion confirms the available ratio for each style before quotation so buyers receive accurate order information.'
  },
  {
    question: 'Can I combine different styles in one shipment?',
    answer:
      'Different styles can usually be consolidated after each product meets its confirmed MOQ and availability. We then count, check and pack the Guangzhou wholesale order for transfer to the agreed shipping agent.'
  },
  {
    question: 'Can you make clothing from my reference pictures?',
    answer:
      'Yes. For custom production, send clear reference pictures, fabric direction, measurements, sizes, colors, label requirements and quantity. We review feasibility, MOQ, sample policy, price and lead time before production.'
  },
  {
    question: 'Do you support private labels or custom branding?',
    answer:
      'Private-label or branding requests can be reviewed for eligible custom-production quantities. Availability depends on the product and factory requirements, so labels, packaging, MOQ, cost and lead time must be confirmed in writing.'
  },
  {
    question: 'How long does custom production take?',
    answer:
      'Production time depends on the style, fabric availability, sampling, quantity and factory schedule. Jack African Fashion provides an order-specific estimate after the design details and deposit terms are confirmed.'
  },
  {
    question: 'How do I check current stock and wholesale prices?',
    answer:
      'Open a product page and send the style through WhatsApp. Jack African Fashion will confirm the current Guangzhou stock batch, available sizes and colors, MOQ, real photos or video and the applicable wholesale quotation.'
  },
  {
    question: 'Can you send real product photos or videos?',
    answer:
      'For serious wholesale inquiries, we can share current product or stock-batch photos and video when available. This helps buyers verify the selected style, color and visible details before confirming the order.'
  },
  {
    question: 'How do you check product quality?',
    answer:
      'Our Guangzhou order flow includes checking quantity, visible fabric or stitching issues, color and size mix, finishing and packing against the confirmed order. Any special inspection standard must be agreed before production or packing.'
  },
  {
    question: 'How are wholesale orders packed?',
    answer:
      'Packing is arranged according to product type, quantity and shipping method. Jack African Fashion can sort and count goods, prepare export cartons and coordinate any buyer-specific labels or packing requests agreed before dispatch.'
  },
  {
    question: 'Do you provide international shipping support?',
    answer:
      'Yes. We can coordinate transfer to a buyer-appointed freight forwarder or discuss available shipping partners. Freight price, route, transit estimate, insurance, duties and destination handling are confirmed separately for each order.'
  },
  {
    question: 'How do I order from Jack African Fashion?',
    answer:
      'Choose products from the catalog, send the style links or inquiry list, and tell us your country, quantity, size and color needs. We confirm stock or production, MOQ, quotation, packing and shipping steps before payment.'
  },
  {
    question: 'Why choose a Guangzhou supplier for the African market?',
    answer:
      'A Guangzhou base gives buyers access to a dense garment supply, production and export ecosystem. Jack African Fashion adds African-market product focus, B2B communication, stock checks, quality coordination and export packing.'
  }
];
