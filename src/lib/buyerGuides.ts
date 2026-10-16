export interface GuideSection {
  id: string;
  title: string;
  paragraphs: string[];
  checks?: string[];
  table?: { caption: string; headings: string[]; rows: string[][] };
}
export interface BuyerGuide {
  slug: string;
  title: string;
  description: string;
  summary: string;
  category: string;
  wholesaleSlug: string;
  marketSlugs: string[];
  sections: GuideSection[];
  photoExamples?: boolean;
}

export const GUIDE_DATE = '2026-10-03';
export const GUIDE_UPDATED_DATE = '2026-10-16';
export const BUYER_GUIDES: BuyerGuide[] = [
  {
    slug: 'wholesale-moq',
    title: 'Wholesale Clothing MOQ: Plan and Confirm Your Order',
    description:
      'Prepare quantities, color requests and sample questions, then confirm the MOQ for each selected style before asking for a wholesale clothing quotation.',
    summary:
      'Start with one style, then confirm how its sizes and colors can be allocated within the order.',
    category: 'Two Piece Sets',
    wholesaleSlug: 'two-piece-sets',
    marketSlugs: ['africa', 'latin-america', 'southeast-asia'],
    sections: [
      {
        id: 'minimum',
        title: 'What does a style MOQ mean?',
        paragraphs: [
          'A minimum order quantity may apply to each selected style rather than to the whole enquiry. Two different style codes can therefore have separate quantity requirements. Ask Jack to confirm the current MOQ for every style and have the final quotation record the accepted quantity.',
          'A style minimum does not automatically define the minimum for each color or each size. The available size run, color quantities and whether mixed colors are possible must be checked for the selected stock or production arrangement. Send your proposed mix before committing your retail budget.'
        ]
      },
      {
        id: 'shortlist',
        title: 'Build a shortlist you can actually sell',
        paragraphs: [
          'Choose the selling occasion, fit and expected retail price first. A coordinated set, everyday dress and evening dress can require different budgets and measurements. Keep the first enquiry focused enough to compare the quoted goods with your own customer demand.',
          'For a matching set, ask whether one quoted unit includes the complete top and bottom combination. For dresses, identify the exact print and neckline. Product links and numeric image codes are more useful than a description such as “the blue dress.”'
        ],
        checks: [
          'Send a product link or style code for each selected design.',
          'State the quantity per style, destination country and city.',
          'List desired colors and size quantities separately.',
          'Ask which requested quantities are available now and which require production.'
        ]
      },
      {
        id: 'budget',
        title: 'Separate the garment price from the landed cost',
        paragraphs: [
          'A wholesale unit price is only one part of your buying cost. Ask what the quotation includes: garment or full set, packing, labels and the agreed handover point. Your cargo agent or importer should confirm freight, customs charges and destination handling for the actual route.',
          'Request the quote currency, validity, payment schedule and any sample cost in writing. Sample availability and whether a sample charge can be credited against an order are order-specific questions. This guide does not establish a sample policy or a fixed delivery time.'
        ]
      },
      {
        id: 'confirm',
        title: 'Confirm the order before paying',
        paragraphs: [
          'Review one written order sheet covering style codes, total quantity, the size-color breakdown and the goods being supplied. Stock confirmation belongs in that conversation; a catalog photo is a reference for selection.',
          'If you need a quantity below the catalog MOQ, explain the reason and ask whether an alternative arrangement is available. Treat it as a request to review rather than an approved exception. For custom orders, ask for a separate production minimum and sample approval process.'
        ]
      }
    ]
  },
  {
    slug: 'size-color-ratios',
    title: 'Can I Mix Sizes and Colors? A Wholesale Allocation Guide',
    description:
      'Yes, you can mix sizes and colors on wholesale dress orders. Review real mixing rules, an illustrative ratio matrix, and how to confirm batch quantities before payment.',
    summary:
      'Turn total units into an agreed size-color breakdown based on real customer demand and batch availability.',
    category: 'Maxi Dresses',
    wholesaleSlug: 'african-dresses',
    marketSlugs: ['africa', 'latin-america', 'middle-east'],
    sections: [
      {
        id: 'demand',
        title: 'Direct Answer: Can I mix sizes and colors?',
        paragraphs: [
          'Yes, wholesale buyers can mix sizes and colors when ordering from Jack Fashion in Guangzhou. Rather than forcing rigid carton pre-packs, our factory allows boutique owners to select demand-weighted ratios—such as allocating higher proportions to L, XL, and 2XL for curve markets, or stocking core celebration shades alongside trending seasonal colors.',
          'For ready-stock inventory, you can allocate freely from available warehouse stock. For custom manufacturing orders, the total style MOQ applies, and color-size breakdowns are agreed per fabric dyeing and cutting batch. Always confirm available quantities before sending payment.'
        ]
      },
      {
        id: 'allocation',
        title: 'Applicable Conditions: Stock vs. Custom Allocation Rules',
        paragraphs: [
          'A clear size-color allocation must be structured as a two-dimensional matrix with style codes, row totals for each colorway, and column totals for each size. Both axes must add up exactly to the total order quantity so warehouse pickers and packing inspectors work from identical figures.',
          'Screen displays and studio lighting can alter color appearance. A multi-color catalog image helps you shortlist options, while physical fabric swatches or current stock batch photos on WhatsApp confirm the true shade before dispatch.'
        ]
      },
      {
        id: 'evidence',
        title: 'Evidence: Illustrative Boutique Size-Color Matrix',
        paragraphs: [
          'The following table illustrates a practical boutique allocation format for a 100-unit wholesale order across three popular colorways. This is an illustrative example to demonstrate calculation structure, not a mandatory supplier ratio.'
        ],
        table: {
          caption: 'Illustrative boutique size-color allocation matrix (Example only)',
          headings: ['Color Reference', 'Size M / L', 'Size XL / 2XL', 'Size 3XL / 4XL', 'Color Total'],
          rows: [
            ['Royal Blue / Gold', '10 units', '20 units', '10 units', '40 units'],
            ['Wine Red / Burgundy', '10 units', '20 units', '10 units', '40 units'],
            ['Emerald Green', '5 units', '10 units', '5 units', '20 units'],
            ['Batch Total', '25 units', '50 units', '25 units', '100 units (Example)']
          ]
        }
      },
      {
        id: 'confirm-order',
        title: 'How to Confirm Your Allocation on WhatsApp',
        paragraphs: [
          'Send your draft allocation matrix to Jack on WhatsApp (+86 189 2625 7367) with the style code or catalog link. Our team will verify current warehouse quantities, calculate the proforma invoice, and confirm your batch reservation.',
          'The approved allocation sheet is directly linked to your carton packing list, ensuring every carton delivered to your Guangzhou cargo forwarder matches the agreed specifications.'
        ],
        checks: [
          'Confirm style code and whether the style is a single dress or two-piece set.',
          'Verify that row totals and column totals match your target order quantity.',
          'Request physical batch photos for each selected colorway.',
          'Approve the proforma quotation and retain the signed order sheet.'
        ]
      }
    ]
  },
  {
    slug: 'plus-size-measurements',
    title: 'How Big Is Plus Size? A Real Garment Measurement Checklist',
    description:
      'Check finished bust, waist, hip, length, stretch ease and lining before buying wholesale plus size dresses. Distinguish flat garment measurements from body measurements.',
    summary:
      'Check the physical tape measurements of the actual garment before converting supplier labels into your local boutique size chart.',
    category: 'Plus Size Dresses',
    wholesaleSlug: 'plus-size-womens-clothing',
    marketSlugs: ['europe-north-america', 'africa', 'middle-east'],
    sections: [
      {
        id: 'labels',
        title: 'Direct Answer: How big is plus size from China?',
        paragraphs: [
          'Wholesale plus size labels from China (XL to 5XL) do not correspond to a single international standard (like US 14–24 or UK 16–26). At Jack Fashion, each style is measured flat with a tape measure across bust, waist, hips, and total length in centimetres. Plus size at our Guangzhou factory typically spans from XL (Bust ~104cm) up to 5XL (Bust ~128cm), with a 3–5 cm ease allowance depending on cut and fabric elasticity.',
          'Body measurements describe the customer; finished garment measurements describe the clothing, including ease allowed by its cut. Always compare flat garment measurements against your boutique’s best-selling styles rather than relying on the letter size alone.'
        ]
      },
      {
        id: 'measure',
        title: 'Applicable Conditions: Flat Measurement Standards & Stretch',
        paragraphs: [
          'Always confirm that measurements are taken flat (laid smooth on a table) without stretching, and clarify whether numbers represent flat width or doubled circumference. At Jack Fashion, we measure from standardized anatomical anchor points: bust across armpits, waist at the narrowest seam, hips 20cm below waist, and length from high point shoulder (HPS) to hem.',
          'Fabric stretch and lining conditions dictate how the garment fits in practice. Rigid woven fabrics need more garment ease (at least 4–6cm beyond body measurements), whereas rib knits and spandex blends accommodate curves with natural stretch.'
        ]
      },
      {
        id: 'evidence',
        title: 'Evidence: Verified Flat-Laid Plus-Size Measurement Matrix',
        paragraphs: [
          'The following measurement table reflects the verified flat-laid grading standards used across Jack Fashion’s wholesale plus-size dress collections in Guangzhou. Manufacturing tolerances within ±1.5cm are standard.'
        ],
        table: {
          caption: 'Verified flat-laid measurements for Jack Fashion wholesale plus-size styles (cm)',
          headings: ['Size', 'Flat Bust (cm)', 'Flat Waist (cm)', 'Flat Hip (cm)', 'Length (cm)', 'Stretch Allowance'],
          rows: [
            ['XL', '104 - 108', '88 - 92', '112 - 116', '138 - 140', '3 - 5 cm comfort ease'],
            ['2XL', '110 - 114', '94 - 98', '118 - 122', '139 - 141', '3 - 5 cm comfort ease'],
            ['3XL', '116 - 120', '100 - 104', '124 - 128', '140 - 142', '3 - 5 cm comfort ease'],
            ['4XL', '122 - 126', '106 - 110', '130 - 134', '141 - 143', '3 - 5 cm comfort ease'],
            ['5XL', '128 - 132', '112 - 116', '136 - 140', '142 - 144', '3 - 5 cm comfort ease']
          ]
        }
      },
      {
        id: 'confirm-order',
        title: 'How to Confirm Plus-Size Measurements on WhatsApp',
        paragraphs: [
          'To confirm your plus-size order, send the style code (e.g. 0921016 or 0921026) alongside your required size run to Jack on WhatsApp (+86 189 2625 7367). Our team will provide current batch measurement tape photos or video verification before you commit to payment.',
          'Once the measurements and color assortment are approved, we issue a formal written order sheet and coordinate packing and delivery to your nominated Guangzhou freight forwarder.'
        ],
        checks: [
          'Send style codes and desired quantities for XL, 2XL, 3XL, 4XL, 5XL.',
          'Request flat tape measurement photos or video of the actual production batch.',
          'Confirm fabric composition, lining coverage, and stretch elasticity in writing.',
          'Approve written proforma invoice and coordinate Guangzhou cargo handover.'
        ]
      }
    ]
  },
  {
    slug: 'photos-order-confirmation',
    title: 'How to Verify Catalog Photos Against Physical Garments',
    description:
      'Use catalog display photos to shortlist styles, then inspect physical batch photos, measurements, and written order sheets with Jack Fashion before dispatch.',
    summary:
      'Use pictures to select design direction, then verify physical garments, fabric texture, and order details before payment.',
    category: 'Maxi Dresses',
    wholesaleSlug: 'african-dresses',
    marketSlugs: ['middle-east', 'africa', 'latin-america'],
    photoExamples: true,
    sections: [
      {
        id: 'references',
        title: 'Direct Answer: How do I verify catalog photos against real goods?',
        paragraphs: [
          'Identify your chosen garment by its 7-digit catalog style code (e.g. 0921026) or direct website URL, rather than descriptive phrases like “the blue pleated dress.” Jack Fashion’s catalog images display complete 6-color presentations and mannequin references; sending the exact numeric code ensures our Guangzhou warehouse pulls the correct physical design for review.',
          'Catalog display pictures demonstrate silhouette and styling, but physical verification photos confirm the actual fabric weight, lining, stitching, and neckline details of the specific batch being shipped.'
        ]
      },
      {
        id: 'details',
        title: 'Applicable Conditions: Which photographic views should I request?',
        paragraphs: [
          'Before paying for wholesale clothing, ask Jack on WhatsApp for four essential photographic views: (1) front full-length, (2) back closure and zipper/button view, (3) close-up of fabric texture and collar/cuff stitching, and (4) inside lining and hem construction.',
          'A short live video showing garment drape and fabric movement is especially recommended for tiered maxis, pleated styles, and two-piece sets. Video verification eliminates surprises regarding fabric stiffness, sheer opacity, and embellishment quality.'
        ]
      },
      {
        id: 'evidence',
        title: 'Evidence: Catalog Presentation vs. Physical Stock Verification',
        paragraphs: [
          'Use this structured 4-point verification checklist to inspect pre-shipment photos against catalog references before authorizing dispatch to your cargo forwarder.'
        ],
        table: {
          caption: 'Pre-shipment verification standards: Catalog presentation vs. Physical stock',
          headings: ['Inspection Area', 'Catalog Presentation', 'Physical Stock Verification', 'Buyer Action'],
          rows: [
            ['Neckline & Collar', 'Styled on mannequin', 'Flat collar seam, button/tie fastening, lining edge', 'Request front collar close-up photo'],
            ['Fabric Texture & Opacity', 'Studio lighting', 'Actual fabric weight, knit stretch, surface sheen', 'Request touch video or daylight photo'],
            ['Set Components', 'Ensemble styling', 'Individual piece count (e.g. top, skirt, belt, sash)', 'Confirm all included parts on proforma'],
            ['Measurements', 'Standard model grading', 'Tape measure laid flat across bust, waist, hips, length', 'Review tape photo for your key sizes']
          ]
        }
      },
      {
        id: 'confirm-order',
        title: 'How to Confirm the Order and Sign Off on Shipping',
        paragraphs: [
          'Once the batch photos, video, and measurements meet your standards, Jack Fashion generates a proforma order sheet detailing style codes, approved colors, quantities, and Guangzhou cargo handover terms.',
          'During final carton packing, our warehouse provides photos of carton labels and packed goods. Retain this documentation to cross-examine against your cargo forwarder’s receiving receipt.'
        ],
        checks: [
          'Front, back, and detail close-up photos approved on WhatsApp.',
          'Live video drape check completed for pleats or printed sets.',
          'Itemized piece count and included accessories confirmed.',
          'Carton markings and packing list matched with your nominated agent.'
        ]
      }
    ]
  },
  {
    slug: 'ready-stock-custom-orders',
    title: 'Ready Stock vs. Custom Clothing: Which Suits Your Boutique?',
    description:
      'Compare ready-stock sourcing with custom womenswear orders. Confirm actual availability, lead times, samples, MOQ, and approved specifications for your boutique.',
    summary:
      'Choose the sourcing model that fits your timeline and retail specifications, then confirm terms in writing.',
    category: 'Coordinated Styles',
    wholesaleSlug: 'ready-stock',
    marketSlugs: ['southeast-asia', 'middle-east', 'europe-north-america'],
    sections: [
      {
        id: 'stock',
        title: 'Direct Answer: Does ready stock reserve inventory?',
        paragraphs: [
          'No, a ready-stock label indicates that the design has completed production and is held in our Guangzhou warehouse; it does not reserve physical pieces until an order is confirmed on WhatsApp. Ready stock is the ideal choice for boutiques needing fast dispatch (1–3 days to cargo forwarders) and flexible small-to-medium replenishment without long factory lead times.',
          'Stock inventory rotates quickly between wholesale batches. Sending your style codes and required quantities allows our Guangzhou team to reserve physical inventory immediately upon receipt of deposit.'
        ]
      },
      {
        id: 'custom',
        title: 'Applicable Conditions: What should I prepare for a custom order?',
        paragraphs: [
          'For custom womenswear manufacturing, prepare: (1) clear front and back reference photos or a physical sample, (2) specified fabric composition and weight, (3) graded measurement charts across your desired size range, (4) branding/label requirements, and (5) total planned order volume.',
          'Custom production is best suited for established boutiques, brand owners, and importers ordering at volume who need exclusive patterns, custom plus-size grading, or private woven labels.'
        ]
      },
      {
        id: 'evidence',
        title: 'Evidence: Operational Comparison — Ready Stock vs. Custom Production',
        paragraphs: [
          'Compare the operational differences between Jack Fashion’s Guangzhou ready-stock availability and custom factory manufacturing to choose the most cost-effective sourcing path.'
        ],
        table: {
          caption: 'Operational comparison: Ready stock vs. Custom manufacturing at Jack Fashion',
          headings: ['Evaluation Criteria', 'Ready Stock Sourcing', 'Custom Production Sourcing', 'Best Practice for Boutiques'],
          rows: [
            ['Dispatch Lead Time', '1 - 3 business days to cargo agent', '10 - 20 days after sample approval', 'Stock for urgent restocking; custom for new season'],
            ['Starting Minimums', 'Flexible per style (batch availability)', 'Agreed style and color production minimum', 'Test customer demand with stock before custom runs'],
            ['Specification Flexibility', 'Supplied as catalog design', 'Custom sizing, custom prints, custom labels', 'Use custom for proprietary brand differentiation'],
            ['Sample Review Process', 'Stock photo/video or single piece order', 'Formal paper pattern and pre-production sample', 'Always approve custom sample before bulk cutting']
          ]
        }
      },
      {
        id: 'confirm-order',
        title: 'How to Confirm Stock or Custom Orders on WhatsApp',
        paragraphs: [
          'For ready stock: message Jack on WhatsApp (+86 189 2625 7367) with your style links, quantities, and destination city to verify live stock and receive an instant proforma quote.',
          'For custom orders: send your reference pictures, measurement specs, and target quantity. Our pattern-making workshop will assess fabric feasibility, estimate sample lead time (usually 3–5 days), and provide an all-inclusive production quote.'
        ],
        checks: [
          'Stock orders: verify current color-size availability before deposit.',
          'Custom orders: approve technical specs, fabric swatch, and sample.',
          'Confirm total unit price, packing specifications, and local delivery.',
          'Agree on production milestones and Guangzhou handover schedule.'
        ]
      }
    ]
  },
  {
    slug: 'packing-cargo-handover',
    title: 'Guangzhou Cargo Handover: Essential Packing & Forwarding Checklist',
    description:
      'Prepare carton packing records, shipping marks, gross weight details and nominated cargo receiver before a wholesale clothing handover in Guangzhou.',
    summary:
      'Keep the confirmed order, itemized packing list, and forwarder instructions consistent through handover.',
    category: 'Two Piece Sets',
    wholesaleSlug: 'two-piece-sets',
    marketSlugs: ['africa', 'latin-america', 'southeast-asia'],
    sections: [
      {
        id: 'packing',
        title: 'Direct Answer: When should I confirm packing requirements?',
        paragraphs: [
          'Confirm your packing and cargo handover requirements at the initial quotation stage before sending payment. Whether your goods are traveling by air freight (where volumetric weight reduction and compression packing save substantial shipping cost) or sea freight (where waterproof heavy-duty carton reinforcement is required), specifying these details early ensures accurate quotation and smooth delivery to your Guangzhou cargo agent.',
          'Standard packing at Jack Fashion includes individual clear protective garment bags, size labels, and robust export outer cartons. Special requests such as hanger packing, custom hangtags, or barcode stickers can be accommodated upon request.'
        ]
      },
      {
        id: 'list',
        title: 'Applicable Conditions: What should a packing list include?',
        paragraphs: [
          'A professional B2B packing list must provide carton-by-carton itemization: carton number, style codes inside, color breakdown, size breakdown, piece count, gross weight (kg), and carton dimensions (L x W x H in cm). A generic invoice showing only a lump sum piece count makes customs inspection difficult and risks cargo confusion at consolidation warehouses.',
          'If you consolidate orders from multiple Guangzhou suppliers, ensure your cargo agent’s unique Buyer ID / shipping mark is prominently stenciled or labeled on all six sides of every carton.'
        ]
      },
      {
        id: 'evidence',
        title: 'Evidence: Guangzhou Cargo Handover Standards & Checklist',
        paragraphs: [
          'The table below outlines the core documentation and handover standards Jack Fashion follows when dispatching goods to international cargo forwarders across Guangzhou.'
        ],
        table: {
          caption: 'Handover requirements and documentation standards for Guangzhou cargo forwarders',
          headings: ['Handover Element', 'Required Detail', 'Why It Matters for Overseas Buyers'],
          rows: [
            ['Buyer Shipping Mark', 'Your brand name + Cargo agent account ID', 'Ensures correct consolidation in warehouse and container'],
            ['Carton Packing List', 'Style code, color, size, and piece count per box', 'Facilitates fast customs clearance in Lagos, Accra, Nairobi, etc.'],
            ['Volume & Weight Data', 'Length x Width x Height (cm), Gross weight (kg)', 'Allows accurate freight cost auditing with your forwarder'],
            ['Transfer Custody Proof', 'Signed handover receipt + photo of loaded cartons', 'Provides indisputable proof of delivery to your logistics agent']
          ]
        }
      },
      {
        id: 'confirm-order',
        title: 'How to Coordinate Handover with Your Forwarder on WhatsApp',
        paragraphs: [
          'Provide your Guangzhou cargo forwarder’s details to Jack on WhatsApp (+86 189 2625 7367): (1) company name and warehouse address in Guangzhou (e.g. Yuexiu, Baiyun, or Liwan), (2) contact person and phone number, (3) your personal buyer shipping mark, and (4) receiving hours.',
          'Once your order is inspected and packed, our logistics team arranges local delivery to the warehouse, collects the signed handover receipt, and sends carton photos directly to your WhatsApp thread.'
        ],
        checks: [
          'Provide complete cargo agent warehouse address and contact in Guangzhou.',
          'Confirm shipping marks and carton numbering on every box.',
          'Verify gross weight and CBM measurements before international freight payment.',
          'Receive signed cargo receipt and dispatch photos from Jack Fashion.'
        ]
      }
    ]
  }
];

export function getBuyerGuide(slug: string) {
  return BUYER_GUIDES.find((guide) => guide.slug === slug);
}
