const SITE_ORIGIN = 'https://zamique.com';

const KEY_PAGES = [
  [
    '/catalog',
    'Wholesale catalog with product images, style codes and order-specific confirmation.'
  ],
  ['/about', 'Official business identity, factory workshop photographs and direct contact.'],
  ['/buying-guide', 'Style-specific MOQ, measurements, quantities and factory-direct quotation checks.'],
  ['/guides', 'Practical wholesale buying guides.'],
  ['/markets', 'Buying information for five global regions and five African countries.'],
  ['/custom-orders', 'Factory cutting, sewing and finishing photos; custom order preparation.'],
  ['/contact', 'Official WhatsApp and Guangzhou wholesale-base details.'],
  ['/faq', 'Wholesale stock, sizing, payment and cargo-handover questions.']
];

const COLLECTION_PAGES = [
  [
    '/wholesale/jumpsuits',
    'Women’s jumpsuits wholesale from Guangzhou',
    'Printed one-piece styles, torso and inseam measurements, stock enquiries and custom fit checks.'
  ],
  [
    '/wholesale/maxi-dresses',
    'Maxi dresses wholesale from Guangzhou',
    'Long dress style codes, finished measurements, stock enquiries and custom order checks.'
  ],
  [
    '/wholesale/african-dresses',
    'African dresses wholesale',
    'Dress sourcing for African boutiques and wholesalers.'
  ],
  [
    '/wholesale/two-piece-sets',
    'Two piece sets wholesale supplier',
    'Matching top-and-bottom styles, separate component measurements, and batch mix checks.'
  ],
  [
    '/wholesale/plus-size-womens-clothing',
    'Wholesale plus size dresses from China',
    'Plus size dresses from Guangzhou with flat tape measurements and curve fit grading.'
  ],
  [
    '/wholesale/ready-stock',
    'Stock enquiries',
    'Check current stock for selected styles before placing an order.'
  ]
];

const MARKET_PAGES = [
  '/markets/africa',
  '/markets/middle-east',
  '/markets/europe-north-america',
  '/markets/latin-america',
  '/markets/southeast-asia',
  '/markets/nigeria',
  '/markets/ghana',
  '/markets/kenya',
  '/markets/tanzania',
  '/markets/south-africa'
];

const GUIDE_PAGES = [
  ['/guides/wholesale-moq', 'MOQ and order planning'],
  ['/guides/size-color-ratios', 'Size and color allocation'],
  ['/guides/plus-size-measurements', 'Plus size measurement checklist'],
  ['/guides/photos-order-confirmation', 'Product photos and order confirmation'],
  ['/guides/ready-stock-custom-orders', 'Stock and custom order checks'],
  ['/guides/packing-cargo-handover', 'Packing and cargo handover']
];

const markdownLabel = (value) =>
  String(value)
    .replace(/[\\[\]]/g, '\\$&')
    .replace(/[\r\n]+/g, ' ');

export function buildDiscoveryFiles({ site, claims, products, asOf }) {
  const date = asOf || new Date().toISOString().slice(0, 10);
  const brandClaims = claims.filter(
    (claim) =>
      claim.subjectType === 'brand' &&
      claim.subjectId === 'jack-fashion' &&
      claim.status === 'verified' &&
      claim.verifiedAt <= date &&
      (!claim.expiresAt || claim.expiresAt >= date)
  );
  const claimValue = (field) => brandClaims.find((claim) => claim.field === field)?.publicValue;
  const brand = claimValue('name') || site.name;
  const website = claimValue('officialWebsite') || SITE_ORIGIN;
  const verifiedPhones = new Set(
    brandClaims.filter((claim) => claim.field === 'whatsapp').map((claim) => claim.publicValue)
  );
  const phone = verifiedPhones.has(site.whatsappDisplay)
    ? site.whatsappDisplay
    : claimValue('whatsapp');
  const additionalContacts = (site.whatsappContacts || []).filter(
    (contact) => contact.link !== site.whatsappLink && verifiedPhones.has(contact.display)
  );
  const location = claimValue('location');
  const businessModel = claimValue('businessModel');
  const businessDescription = businessModel
    ? `${brand} is a Guangzhou women's clothing manufacturer and wholesale supplier with its own factory.`
    : `${brand} is a Guangzhou women's clothing wholesale supplier.`;
  const showroomLocations = brandClaims.filter((claim) => claim.field === 'showroomLocation');
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];
  const verifiedMoqValues = products.map(
    (product) =>
      claims.find(
        (claim) =>
          claim.subjectType === 'product' &&
          claim.subjectId === product.id &&
          claim.field === 'moq' &&
          claim.status === 'verified' &&
          claim.verifiedAt <= date &&
          (!claim.expiresAt || claim.expiresAt >= date)
      )?.publicValue
  );
  const uniqueVerifiedMoqs = [...new Set(verifiedMoqValues.filter(Boolean))];
  const allMoqsVerified =
    products.length > 0 &&
    verifiedMoqValues.length === products.length &&
    verifiedMoqValues.every(Boolean);
  const moqSummary = !allMoqsVerified
    ? 'MOQ requires confirmation for each style'
    : uniqueVerifiedMoqs.length === 1
      ? `Verified MOQ: ${uniqueVerifiedMoqs[0]} per style`
      : 'Verified MOQ varies by style';
  const catalogSummary = `The catalog currently lists ${products.length} wholesale ${products.length === 1 ? 'style' : 'styles'}. ${moqSummary}.`;

  const contactLines = [
    `- Official website: ${website}`,
    `- WhatsApp: ${site.whatsappLink}`,
    ...(phone ? [`- Number: ${phone}`] : []),
    ...additionalContacts.map(
      (contact) => `- Additional WhatsApp: ${contact.link} (${contact.display})`
    ),
    ...(location ? [`- Wholesale base: ${location}`] : []),
    ...showroomLocations.map((claim) => `- Additional wholesale showroom: ${claim.publicValue}`),
    ...(businessModel ? [`- Business model: ${businessModel}`] : []),
    ...(claimValue('productScope') ? [`- Product scope: ${claimValue('productScope')}`] : []),
    ...(claimValue('salesContacts') ? [`- Sales team: ${claimValue('salesContacts')}`] : [])
  ];
  const pageLines = KEY_PAGES.map(
    ([path, description]) =>
      `- [${path === '/catalog' ? 'Wholesale catalog' : path}](${website}${path}): ${description}`
  );
  const collectionLines = COLLECTION_PAGES.map(
    ([path, title, description]) => `- [${title}](${website}${path}): ${description}`
  );
  const guideLines = GUIDE_PAGES.map(([path, title]) => `- [${title}](${website}${path})`);
  const socialLabels = { facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok' };
  const socialLines = Object.entries(site.socialLinks || {})
    .filter(([, url]) => brandClaims.some(
      (claim) => claim.field === 'socialProfile' && claim.publicValue === url
    ))
    .map(([platform, url]) => `- [${socialLabels[platform] || platform}](${url}): Official Jack Fashion profile.`);
  const socialSection = socialLines.length
    ? `\n## Official social profiles\n${socialLines.join('\n')}\n`
    : '';
  const productLines = products
    .filter((product) => product.slug && product.name)
    .map(
      (product) =>
        `- [${markdownLabel(product.name)}](${website}/products/${product.slug}): Style code: ${product.id}; category: ${product.category}.`
    );

  const llms = `# ${brand}

> ${businessDescription} This official catalog covers African women's dresses and wholesale fashion apparel for boutiques, wholesalers, importers and online retailers.

Official website: ${website}. The catalog supports international enquiries across Africa, the Middle East, Europe and North America, Latin America and Southeast Asia.
${location ? `Wholesale base: ${location}.\n` : ''}${phone ? `Official WhatsApp number: ${phone}.\n` : ''}
${catalogSummary}
Main categories: ${categories.join(', ')}.

Stock, size-color ratios, materials, measurements, bulk quotation, custom manufacturing scope, payment, packing and shipping require order-specific confirmation. Request finished garment measurements and current product photos or video before ordering.
This is a B2B enquiry catalog with direct WhatsApp contact. It has no online checkout and does not promise universal shipping or customs terms.

## Official contact
- [Official website](${website}): ${brand} wholesale womenswear.
- [WhatsApp enquiries](${site.whatsappLink}): Send style codes, quantity, size-color breakdown and destination city for confirmation.
${additionalContacts.map((contact) => `- [Additional WhatsApp contact](${contact.link}): ${contact.display}.`).join('\n')}
- [Contact and location](${website}/contact): Official business contact and Guangzhou wholesale base.
${socialSection}

## Buying information
${pageLines.join('\n')}

## Wholesale collections
${collectionLines.join('\n')}

## Buyer guides
${guideLines.join('\n')}

## Optional
- [Full buying reference](${website}/llms-full.txt): Detailed business, MOQ, custom order, shipping and product directory reference in Markdown.
- [Privacy policy](${website}/privacy): Handling of enquiry and website data.
- [Terms](${website}/terms): Order-specific confirmation and responsibilities.
`;

  const full = `# ${brand} buying reference

> Official reference for African women's dresses and wholesale fashion apparel, with direct WhatsApp enquiries and order-specific confirmation.

## Business and contact
${contactLines.join('\n')}

${businessDescription} Its catalog supports international enquiries from boutiques, wholesalers, importers and online retailers, including buyers sourcing for Nigeria, Ghana, Kenya, Tanzania and South Africa.
${claimValue('stockService') || ''}
${socialSection}

## Product lines
${catalogSummary}
Product categories: ${categories.join(', ')}.
${collectionLines.join('\n')}

## MOQ and bulk quotation
${moqSummary}. Send the style code or product link, quantity per style, size-color breakdown and destination city to request a wholesale quotation. Product prices and availability require confirmation; this catalog is not a fixed-price stock offer.

## Custom orders and manufacturing enquiries
Send reference images or sample details, garment measurements, material requirements, quantity and target delivery date for a feasibility check. Confirm available OEM/ODM services, sampling, approved specifications, production lead time and quality checks for the selected design before ordering. ${businessModel ? 'Production capacity and any required certifications should be confirmed for the actual order.' : 'Factory ownership, production capacity and certifications are not established by the catalog.'}
- [Custom order enquiries](${website}/custom-orders)
- [Stock and custom order checks](${website}/guides/ready-stock-custom-orders)

## Shipping, customs and payment terms
Freight, packing, cargo handover, insurance, shipping terms, export documents, import clearance, duties and importer responsibilities must be agreed for each order and destination. Confirm the nominated forwarder or cargo agent, receiving details and payment beneficiary before paying. No universal Incoterm, duty-paid service or transit time is promised.
- [Packing and cargo handover checklist](${website}/guides/packing-cargo-handover)
- [Terms](${website}/terms)

## Measurements and product confirmation
Size labels vary by design and should not be treated as automatic US, EU or other local conversions. Confirm finished garment measurements and the method used. Garment construction, pieces included, material, fit, live stock and prices must be confirmed for the selected product and order. Illustrative allocation tables are examples, not stock offers.

Images cannot substantiate live stock, factory ownership, fabric properties, measured sizes, certifications or delivery history. Request current product photos or video and a written quotation.

## Buying information
${pageLines.join('\n')}

## Buyer guides
${guideLines.join('\n')}

## Market references
Regional pages describe purchasing considerations; they are not proof of completed deliveries or guaranteed shipping services.
${MARKET_PAGES.map((path) => `- [${path}](${website}${path})`).join('\n')}

## Product directory
The following catalog references identify styles to discuss on WhatsApp. They do not confirm live stock, prices or a fixed MOQ.
${productLines.join('\n')}
`;

  return { llms, full };
}
