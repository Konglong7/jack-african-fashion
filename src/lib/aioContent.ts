export const BRAND_ENTITY = {
  name: 'Jack Fashion',
  website: 'https://zamique.com',
  officialWebsiteStatement: 'zamique.com is the official B2B website of Jack Fashion.',
  location: 'Guangzhou, China',
  marketBase: 'Yulong Fashion Plaza, No. 229 Guangyuan Xi Road, Yuexiu District, Guangzhou, China',
  businessType: "Women's clothing manufacturer and wholesale supplier",
  market: 'International wholesale, with an African womenswear focus',
  audience:
    'Boutique owners, clothing wholesalers, importers, retailers and online sellers worldwide',
  identityStatement:
    'Jack Fashion is a Guangzhou women’s clothing manufacturer and wholesale supplier with its own factory. We offer factory-direct dresses, matching sets and plus-size styles, with ready-stock options and custom production. Visit our wholesale showrooms at Yulong Fashion Plaza or Shop 0081 in LIUHUA Market by appointment.',
  products: [
    "Women's dresses",
    'Two piece sets',
    'Pleated styles',
    "Plus size women's clothing",
    'Ready-stock fashion'
  ],
  capabilities: [
    'Own factory and factory-direct womenswear wholesale',
    'Ready-stock selection alongside custom production',
    'Style selection and current-stock confirmation before ordering',
    'Size and color mixes confirmed per style and batch',
    'Custom production enquiries reviewed by reference, quantity and specifications',
    'Quality-check and packing requirements agreed for the order',
    'Cargo handover and shipping coordination subject to destination and order confirmation',
    'Direct WhatsApp communication for quotation and order details'
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
    title: 'Sourcing Womenswear from China to Nigeria | Guangzhou Wholesale Supplier',
    description:
      'Factory-direct guide for sourcing womenswear from China to Nigeria. Jack Fashion helps Nigeria boutiques with style selection, batch confirmation, and Guangzhou cargo handover.',
    buyerNeeds: [
      'Style selection: Choose verified style codes, silhouettes and size runs suited for Nigerian boutiques and celebratory events.',
      'Order confirmation: Confirm physical garment measurements, actual batch colors, fabric opacity, and a written proforma quotation before payment.',
      'Pre-shipment verification: Review real photos or video of packed goods and check the itemized packing list with carton marks.',
      'Guangzhou cargo handover: Coordinate delivery to your nominated Lagos, Abuja, or Kano cargo agent in Guangzhou (Yuexiu or Baiyun districts).'
    ],
    availableCategories: [
      'Plus Size Dresses',
      'Two Piece Sets',
      'Coordinated Styles',
      'Maxi Dresses',
      'Midi Dresses'
    ],
    shipping:
      'We coordinate delivery directly with your nominated air or sea cargo agent in Guangzhou. Provide your agent’s warehouse address, buyer mark/ID, and packing instructions. Final carton count, chargeable weight, freight receipt, and handover confirmation are documented before dispatch to Nigeria.'
  },
  {
    slug: 'ghana',
    country: 'Ghana',
    title: 'Ghana Boutique Womenswear Sourcing | Guangzhou Factory-Direct',
    description:
      'Guangzhou factory-direct womenswear for Ghana boutiques. Curated dress and matching set selections, physical size verification, and seamless first-order handover.',
    buyerNeeds: [
      'Boutique product selection: Shortlist fast-selling maxi dresses, pleated styles, and two-piece sets tailored for boutique retail in Accra, Kumasi, and Takoradi.',
      'Physical size & fit verification: Check flat-laid garment measurements in centimetres (bust, waist, hips, length) against Ghanaian customer preferences.',
      'First-order collaboration process: Start with a flexible test order across key styles, approve stock photos/video, and confirm batch colors in writing.',
      'Cargo consolidation & handover: Provide your cargo forwarder’s Guangzhou warehouse address and buyer mark for prompt local handover and transit to Ghana.'
    ],
    availableCategories: [
      'Maxi Dresses',
      'Midi Dresses',
      'Two Piece Sets',
      'Plus Size Dresses',
      'Coordinated Styles'
    ],
    shipping:
      'Packing and delivery to your agreed Ghana freight forwarder in Guangzhou are coordinated once your style list and quantities are finalized. Itemized packing lists with carton numbers and gross weights are provided for customs clearance in Tema or Kotoka Airport.'
  },
  {
    slug: 'kenya',
    country: 'Kenya',
    title: "Women's Clothing Wholesale for Kenya Buyers",
    description:
      'Source wholesale dresses and matching sets from Jack Fashion in Guangzhou for Kenya boutiques. Explore ready-stock styles and custom production.',
    buyerNeeds: [
      'Send the categories, codes and intended retail occasions for your collection.',
      'Confirm fabric, lining, fit and measurements from actual stock details.',
      'Ask about samples or a confirmed size run before selecting your order mix.',
      'Agree packing-list details and your nominated agent’s receiving and handover instructions.'
    ],
    availableCategories: [
      'Two Piece Sets',
      'Plus Size Dresses',
      'Jumpsuits',
      'Maxi Dresses',
      'Midi Dresses'
    ],
    shipping:
      'Tell us the delivery city in Kenya and the agent or shipping arrangement you want to use. Air, sea or consolidated cargo availability, freight and delivery estimates are confirmed for each order.'
  },
  {
    slug: 'tanzania',
    country: 'Tanzania',
    title: "Women's Clothing Wholesale for Tanzania Buyers",
    description:
      'Factory-direct dresses and sets from Guangzhou for Tanzania boutiques. Ask Jack Fashion about ready stock, custom production and wholesale quantities.',
    buyerNeeds: [
      'Select codes and quantities for your shop or wholesale assortment.',
      'Check dress length, sleeve coverage and lining for your intended customers.',
      'Request current stock photos, available color-size quantities and a written quote.',
      'Share your Tanzania receiving city and any consolidation, marking or packing instructions.'
    ],
    availableCategories: [
      'Maxi Dresses',
      'Midi Dresses',
      'Coordinated Styles',
      'Two Piece Sets',
      'Plus Size Dresses'
    ],
    shipping:
      'Goods and packing requirements are agreed for the confirmed order. The forwarder, route, freight cost, transit estimate and destination handling responsibilities must be confirmed before dispatch to Tanzania.'
  },
  {
    slug: 'south-africa',
    country: 'South Africa',
    title: "Women's Clothing Wholesale for South Africa Buyers",
    description:
      'Wholesale dresses, matching sets and plus-size styles for South Africa buyers. Discuss ready stock and factory-direct custom production with Jack Fashion.',
    buyerNeeds: [
      'Choose the dress or set styles and intended retail price positioning for your range.',
      'Use garment measurements to prepare your size guide; do not assume labels equal local sizes.',
      'Review material, care and labeling requirements with your importer.',
      'Confirm quantity, quality-check instructions, carton breakdown and the agreed delivery arrangement.'
    ],
    availableCategories: [
      'Two Piece Sets',
      'Plus Size Dresses',
      'Maxi Dresses',
      'Midi Dresses',
      'Jumpsuits'
    ],
    shipping:
      'Share your delivery city and nominated cargo agent or preferred shipping arrangement. Confirm freight, insurance where required, delivery estimates and import responsibilities in writing before dispatch.'
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
  updatedDate?: string;
}

export const WHOLESALE_PAGES: WholesalePageContent[] = [
  {
    slug: 'african-dresses',
    title: 'African Dresses Wholesale from Guangzhou',
    description:
      'Explore dresses for African boutiques and wholesalers from Jack Fashion. Browse full catalog images and ask about stock, garment measurements, MOQ and prices.',
    heading: 'Dresses for African boutiques and wholesalers',
    introduction:
      'Choose dresses by silhouette, coverage and your customers’ fit needs. Our Guangzhou catalog is a starting point for building a boutique or wholesale range; actual stock, fabric, sizes and colors are confirmed by style.',
    suitableBuyers: [
      'African boutiques',
      'Dress wholesalers',
      'Fashion importers',
      'Online and social sellers'
    ],
    productDetails: [
      'Dress length, neckline, sleeves and lining',
      'Finished garment measurements and the available size run',
      'Actual stock colors and permitted size-color ratios',
      'Order quantity, quoted price and packing requirements'
    ]
  },
  {
    slug: 'maxi-dresses',
    title: 'Maxi Dresses Wholesale from Guangzhou',
    description:
      'Browse maxi dresses wholesale from Jack Fashion in Guangzhou. Own factory, ready-stock enquiries and custom production; confirm style codes, measurements and quotes.',
    heading: 'Long dresses for overseas boutiques and wholesalers',
    introduction:
      'Jack Fashion is a Guangzhou womenswear manufacturer and wholesale supplier with its own factory. Shortlist maxi dresses by silhouette, neckline, sleeves and print, then send the style codes for a factory-direct quotation. For a long dress, check finished garment length against your customers’ height and intended footwear; a catalog picture alone cannot establish the fit. Confirm ready-stock colors, size runs, lining and slit details for each selected design. Custom production can be reviewed using reference pictures or a sample, measurements and your planned quantity.',
    suitableBuyers: [
      'African boutiques building a long-dress collection',
      'Dress wholesalers and clothing importers',
      'Overseas fashion retailers',
      'Online and social sellers'
    ],
    productDetails: [
      'Finished dress length, bust, waist and hip measurements for each size',
      'Neckline, sleeves, slit position, lining and fabric opacity',
      'Current stock colors and the confirmed size-color quantities',
      'Style-specific MOQ, factory-direct quotation and packing requirements',
      'Custom reference, size grading and sample requirements, subject to review'
    ],
    catalogCategory: 'Maxi Dresses',
    updatedDate: '2026-10-14'
  },
  {
    slug: 'jumpsuits',
    title: "Women's Jumpsuits Wholesale from Guangzhou",
    description:
      'Source women’s jumpsuits wholesale from Jack Fashion in Guangzhou. Own factory, ready-stock enquiries and custom production; confirm fit, style MOQ and quotes.',
    heading: 'One-piece outfits for international boutiques and wholesalers',
    introduction:
      'Jack Fashion supplies women’s jumpsuits from Guangzhou, with its own factory for custom production enquiries. Browse the current printed jumpsuit and overall styles, then send the style codes and quantities for a factory-direct quotation. One-piece garments need more than a bust and waist check: confirm torso length, rise, inseam and hip ease for your customers. Check the fastening, sleeve coverage, fabric stretch and lining on the actual garment before selecting a size run. Ready-stock colors and quantities are confirmed by style; custom fabric, fit or design requirements are reviewed with your reference pictures or sample.',
    suitableBuyers: [
      'African boutiques adding printed one-piece outfits',
      'Womenswear wholesalers and clothing importers',
      'International boutiques selecting measured size runs',
      'Online and social fashion sellers'
    ],
    productDetails: [
      'Torso length, rise, inseam and finished bust, waist and hip measurements',
      'Neckline, sleeves, fastening, lining and fabric stretch',
      'Current stock colors, size run and quantity for each style code',
      'Style-specific MOQ, factory-direct quotation and packing requirements',
      'Custom fit, fabric and sample requirements, subject to review'
    ],
    catalogCategory: 'Jumpsuits',
    updatedDate: '2026-10-14'
  },
  {
    slug: 'two-piece-sets',
    title: 'Two Piece Sets Wholesale Supplier | Matching Outfits Guangzhou',
    description:
      'Two piece sets wholesale supplier in Guangzhou. Factory-direct matching top-and-trouser and top-and-skirt sets. Confirm pieces included, separate measurements, and mix-and-match rules.',
    heading: 'Two Piece Sets Wholesale Supplier: Top & Bottom Specifications',
    introduction:
      'As a direct Guangzhou womenswear manufacturer and two piece sets wholesale supplier, Jack Fashion provides matching top-and-trouser, top-and-skirt, and vest-and-pant sets for boutiques and clothing distributors. When sourcing matching sets, confirming the exact pieces included (such as top, bottom, belt, or sash) is vital. Because tops and bottoms fit differently, our factory provides separate flat measurements for each component. We also clarify batch-specific mix rules for colors and sizes before quotation, ensuring your boutique receives a balanced, high-sell-through assortment.',
    suitableBuyers: [
      'Boutique owners building coordinated capsule collections',
      'Clothing wholesalers and regional fashion distributors',
      'Overseas fashion importers and trading houses',
      'Online and social boutique fashion retailers'
    ],
    productDetails: [
      'Exact pieces included in each quoted set (top + pants, vest + skirt, included belt)',
      'Separate flat measurements for tops (bust, shoulder, length) and bottoms (waist, hips, rise, inseam/length)',
      'Fabric composition, lining opacity, stretch elasticity, and waist fastening (elastic vs. zip)',
      'Flexible color and size mixing conditions per batch for wholesale orders',
      'Ready-stock availability alongside custom matching set production'
    ],
    catalogCategory: 'Two Piece Sets'
  },
  {
    slug: 'plus-size-womens-clothing',
    title: 'Wholesale Plus Size Dresses from China | Guangzhou Supplier',
    description:
      'Source wholesale plus size dresses from China with Jack Fashion in Guangzhou. Factory-direct curved fits, flat tape measurements, fabric stretch and size run guidance for boutiques.',
    heading: 'Wholesale Plus Size Dresses from China: Measured Fit & Factory Sourcing',
    introduction:
      'Sourcing wholesale plus size dresses from China requires verified measurements rather than generic size labels. Jack Fashion produces factory-direct plus size dresses in Guangzhou tailored for fuller curves, including XL to 5XL options. Every design features flat-laid measurements across bust, waist, hips, and length, alongside clear notes on fabric stretch, ease allowance, lining, and sleeve comfort. Use our catalog to shortlist key styles, review physical batch measurements, and confirm your size-color assortment directly on WhatsApp.',
    suitableBuyers: [
      'Plus-size and curve boutiques seeking reliable fit grading',
      'Womenswear wholesalers and African boutique importers',
      'Inclusive-size retail store chains and department buyers',
      'Online curve fashion sellers requiring accurate sizing charts'
    ],
    productDetails: [
      'Flat-laid measurements: finished bust, waist, hip, and length in cm for XL to 5XL',
      'Silhouette cut: A-line, wrap-front, pleated, empire waist, peplum and kaftan styles',
      'Stretch level, ease allowance, lining opacity, and movement comfort',
      'Confirmed size runs and permitted color-size ratios per order batch',
      'Sample review and custom size-grading options for boutique collections'
    ],
    catalogCategory: 'Plus Size Dresses'
  },
  {
    slug: 'ready-stock',
    title: "Ready Stock Women's Clothing Wholesale Guangzhou",
    description:
      'Factory-direct ready-stock womenswear from Jack Fashion in Guangzhou. Confirm style codes, size-color quantities, wholesale prices and cargo handover.',
    heading: 'Factory-direct ready-stock womenswear from Guangzhou',
    introduction:
      'We offer a broad ready-stock selection alongside custom production at our own factory. Stock changes between batches, so select your styles from the catalog and send the codes to our team. Confirm the actual garments, size-color quantities, factory-direct quotation and order terms before arranging payment.',
    suitableBuyers: [
      'Boutiques planning a restock',
      'Clothing wholesalers',
      'Importers consolidating orders',
      'Online retailers'
    ],
    productDetails: [
      'Real stock photos or video for the selected styles',
      'Available colors, sizes and quantity breakdown',
      'MOQ for the selected style, confirmed with your quote',
      'Packing, cargo handover and any shipping charges'
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
    question: 'What does Jack Fashion supply?',
    answer:
      'Jack Fashion is a Guangzhou women’s clothing manufacturer and wholesaler with its own factory. We supply dresses, matching sets and plus-size styles, with ready-stock options and custom production for international buyers.'
  },
  {
    question: 'Do you have your own factory and accept custom clothing orders?',
    answer:
      'Yes. Jack Fashion has its own factory and offers factory-direct wholesale and custom production. Send a reference image or sample details, fabric requirements, measurements and quantity. Our team confirms feasibility, sampling, MOQ, quotation and the production schedule for your design.'
  },
  {
    question: 'Who handles WhatsApp enquiries?',
    answer:
      'Jack is available on +86 189 2625 7367 and Amber on +86 186 6505 5946. Website WhatsApp buttons connect you with our sales team. Send your product codes, quantity and destination for a factory-direct quote.'
  },
  {
    question: 'Where is Jack Fashion based?',
    answer:
      'We operate two Guangzhou wholesale showrooms: Yulong Fashion Plaza, No. 229 Guangyuan Xi Road, Yuexiu District, and Shop 0081 in LIUHUA Market. Arrange your visit on WhatsApp and confirm which showroom, appointment time and selected styles you want to see.'
  },
  {
    question: 'Can buyers outside Africa enquire?',
    answer:
      'Yes. We welcome wholesale enquiries from the Middle East, Europe, North America, Latin America and Southeast Asia, alongside Africa. Share your selling market, selected styles and destination so suitability and delivery arrangements can be reviewed.'
  },
  {
    question: 'How do I get a wholesale quotation?',
    answer:
      'Send the style codes or product links, quantity per style, required sizes and colors, and destination city on WhatsApp. We confirm stock and prepare order-specific product, packing, payment and delivery terms.'
  },
  {
    question: 'What is Jack Fashion’s minimum order quantity (MOQ)?',
    answer:
      'Confirm the MOQ for each selected style on WhatsApp before ordering. Jack Fashion does not publish one fixed minimum for all catalog styles or custom orders. Send your style codes, quantity and size-color mix for a factory-direct quotation. Ready-stock quantities depend on the actual batch; custom-production minimums depend on the design, fabric and sampling requirements. The accepted quantity and price are confirmed in writing for your order.'
  },
  {
    question: 'Do you offer low MOQ wholesale clothing?',
    answer:
      'Jack Fashion does not promise a universally low MOQ. Check the product page quantity and ask whether a smaller test order is available for the specific style. The final accepted quantity and price must be confirmed in writing.'
  },
  {
    question: 'How do I confirm current stock?',
    answer:
      'Send the style codes, sizes, colors and quantities you need on WhatsApp. Our team will confirm current availability, garment measurements and the quotation for your order.'
  },
  {
    question: 'Can I mix colors and sizes?',
    answer:
      'Ask for the available quantities by color and size for each selected style. Mixed ratios depend on the current batch or production plan. Agree the complete order breakdown before confirming the quote.'
  },
  {
    question: 'Do XL to 5XL labels match US or EU sizes?',
    answer:
      'Do not assume that a size label matches a US, EU or other local standard. Ask for finished bust, waist, hip and length measurements in centimetres, the measurement method and any stretch or grading details for your selected design.'
  },
  {
    question: 'Can I request samples or real stock video?',
    answer:
      'Ask Jack about sample availability and cost for your selected style, plus current garment photos or video. Confirm sample details, freight and the relationship to the intended production batch before paying.'
  },
  {
    question: 'Can I enquire about OEM/ODM or private-label clothing?',
    answer:
      'OEM/ODM and private-label requirements are reviewed case by case. Send reference pictures, material expectations, measurements, labels and quantity so feasibility, sampling, MOQ, costs and the production timeline can be confirmed before a custom order proceeds.'
  },
  {
    question: 'Which payment methods and currencies can I use?',
    answer:
      'Payment method, currency, deposit, balance and beneficiary details are confirmed with your written order. The website is a wholesale enquiry catalog and does not offer an online checkout. Verify payment instructions directly with Jack on the official WhatsApp contact.'
  },
  {
    question: 'Can you hand goods to my Guangzhou cargo agent?',
    answer:
      'Share your nominated agent’s receiving details and packing instructions. The quote should define the handover point, carton information, freight charges, delivery estimates and which party handles insurance and import clearance.'
  },
  {
    question: 'What happens if an order has a problem?',
    answer:
      'Keep the written order, packing list and delivery evidence. Contact Jack on the official WhatsApp number with the style code, quantity and clear photos or video. Inspection, discrepancy handling and any return or refund terms should be agreed before payment.'
  }
];
