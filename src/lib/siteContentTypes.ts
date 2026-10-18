export interface SiteCategory {
  name: string;
  image?: string;
  description?: string;
}

export interface WhatsAppContact {
  link: string;
  number: string;
  display: string;
}

export const WHATSAPP_ROTATION_PATH = '/api/whatsapp';

export interface SiteLocation {
  name: string;
  address: string;
  mapUrl: string;
}

export interface SiteContent {
  name: string;
  slogan: string;
  location: string;
  locationUrl: string;
  additionalLocations?: SiteLocation[];
  business: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  whatsappLink: string;
  whatsappContacts?: WhatsAppContact[];
  defaultWhatsAppMessage: string;
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroBody: string;
  heroTrust: string[];
  categories: SiteCategory[];
  socialLinks: {
    facebook: string;
    tiktok: string;
    instagram: string;
  };
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  name: 'Jack Fashion',
  slogan: "Women's Clothing Wholesale · Guangzhou",
  location:
    'Shop 3063, Building 2, Yulong Fashion Plaza, No. 229 Guangyuan Xi Road, Yuexiu District, Guangzhou, China',
  locationUrl: 'https://www.google.com/maps/search/?api=1&query=Yulong+Fashion+Plaza+Guangzhou',
  additionalLocations: [
    {
      name: 'LIUHUA Market',
      address: 'Shop 0081, LIUHUA Market, Guangzhou, China',
      mapUrl:
        'https://www.google.com/maps/search/?api=1&query=LIUHUA+Fashion+Wholesale+Market+Guangzhou'
    }
  ],
  business:
    "One of Guangzhou's largest factory-direct womenswear manufacturers and wholesale suppliers, featuring 50,000+ ready stock, high-volume custom production, and global export fulfillment",
  whatsappNumber: '8618926257367',
  whatsappDisplay: '+86 189 2625 7367',
  whatsappLink: 'https://wa.me/message/3N5VOJCFAQIGO1',
  whatsappContacts: [
    {
      link: 'https://wa.me/message/3N5VOJCFAQIGO1',
      number: '8618926257367',
      display: '+86 189 2625 7367'
    }
  ],
  defaultWhatsAppMessage:
    'Hello Jack Fashion team, I want to see current ready-stock styles, stock photos/video, factory-direct wholesale prices and custom production options.',
  heroEyebrow: 'Premier Manufacturer · 15+ Yrs Industry Leader · Guangzhou Wholesale Hub',
  heroTitle: 'Guangzhou premier womenswear wholesale,',
  heroAccent: 'direct from factory.',
  heroBody:
    'One of Guangzhou’s leading women\'s clothing manufacturers with our own factory and 50,000+ ready-to-ship stock. Supplying 2,000+ global boutiques and wholesalers with factory-direct dresses, two-piece sets, and African plus-size styles. Visit our flagship showroom at Yulong Building 2 Shop 3063 or connect with Founder Jack.',
  heroTrust: [
    'Own Factory & Supply Chain',
    '50,000+ Ready-to-Ship Inventory',
    'Flagship Showroom: Yulong Bldg 2 #3063',
    '2,000+ Global Wholesale Clients'
  ],
  categories: [
    {
      name: 'Plus Size Dresses',
      image: '/images/products/0921056.webp',
      description:
        'Dress options for extended-size sourcing. Confirm the actual measurements and size run for each design.'
    },
    {
      name: 'Two Piece Sets',
      image: '/images/products/0921051.webp',
      description:
        'Matching top and bottom styles. Confirm the pieces included and measure each piece separately.'
    },
    {
      name: 'Maxi Dresses',
      image: '/images/products/0921053.webp',
      description:
        'Full-length silhouettes. Ask about dress length, lining, coverage and actual stock colors.'
    },
    {
      name: 'Jumpsuits',
      image: '/images/products/0921037.webp',
      description:
        'One-piece looks. Confirm construction, waist, hip and rise measurements before choosing sizes.'
    },
    {
      name: 'Coordinated Styles',
      image: '/images/products/0921047.webp',
      description:
        'Coordinated looks with the exact pieces and garment construction confirmed during enquiry.'
    },
    {
      name: 'Custom Orders',
      image: '/images/products/0921051.webp',
      description:
        'Send references, measurements, material expectations and quantity for a production review.'
    }
  ],
  socialLinks: {
    facebook: 'https://www.facebook.com/people/Jack-African-Fashion-Wholesale/61593615337827/',
    tiktok: 'https://www.tiktok.com/@jackafricanfashion',
    instagram: 'https://www.instagram.com/jack.africanfashion/'
  }
};

export function normalizeSiteContent(input: unknown): SiteContent {
  const data = input && typeof input === 'object' ? (input as Record<string, unknown>) : {};
  const social =
    data.socialLinks && typeof data.socialLinks === 'object'
      ? (data.socialLinks as Record<string, unknown>)
      : {};
  const contacts = Array.isArray(data.whatsappContacts)
    ? normalizeWhatsAppContacts(data.whatsappContacts)
    : typeof data.whatsappLink === 'string' || typeof data.whatsappNumber === 'string'
      ? []
      : DEFAULT_SITE_CONTENT.whatsappContacts || [];
  const primaryContact = contacts[0];

  return {
    ...DEFAULT_SITE_CONTENT,
    name: text(data.name, DEFAULT_SITE_CONTENT.name),
    slogan: text(data.slogan, DEFAULT_SITE_CONTENT.slogan),
    location: text(data.location, DEFAULT_SITE_CONTENT.location),
    locationUrl: url(data.locationUrl, DEFAULT_SITE_CONTENT.locationUrl),
    additionalLocations: normalizeAdditionalLocations(
      data.additionalLocations ?? (data.location ? [] : DEFAULT_SITE_CONTENT.additionalLocations)
    ),
    business: text(data.business, DEFAULT_SITE_CONTENT.business),
    whatsappNumber:
      primaryContact?.number ||
      text(data.whatsappNumber, DEFAULT_SITE_CONTENT.whatsappNumber).replace(/\D/g, ''),
    whatsappDisplay:
      primaryContact?.display || text(data.whatsappDisplay, DEFAULT_SITE_CONTENT.whatsappDisplay),
    whatsappLink:
      primaryContact?.link || whatsappUrl(data.whatsappLink, DEFAULT_SITE_CONTENT.whatsappLink),
    whatsappContacts: contacts,
    defaultWhatsAppMessage: text(
      data.defaultWhatsAppMessage,
      DEFAULT_SITE_CONTENT.defaultWhatsAppMessage
    ),
    heroEyebrow: text(data.heroEyebrow, DEFAULT_SITE_CONTENT.heroEyebrow),
    heroTitle: text(data.heroTitle, DEFAULT_SITE_CONTENT.heroTitle),
    heroAccent: text(data.heroAccent, DEFAULT_SITE_CONTENT.heroAccent),
    heroBody: text(data.heroBody, DEFAULT_SITE_CONTENT.heroBody),
    heroTrust: stringArray(data.heroTrust, DEFAULT_SITE_CONTENT.heroTrust),
    categories: categories(data.categories),
    socialLinks: {
      facebook: text(social.facebook, DEFAULT_SITE_CONTENT.socialLinks.facebook),
      tiktok: text(social.tiktok, DEFAULT_SITE_CONTENT.socialLinks.tiktok),
      instagram: text(social.instagram, DEFAULT_SITE_CONTENT.socialLinks.instagram)
    }
  };
}

function categories(value: unknown): SiteCategory[] {
  if (!Array.isArray(value)) return DEFAULT_SITE_CONTENT.categories;
  const normalized = value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = typeof record.name === 'string' ? record.name.trim() : '';
      if (!name) return null;
      const category: SiteCategory = {
        name,
        description: typeof record.description === 'string' ? record.description.trim() : ''
      };
      const image = imagePath(record.image);
      if (image) category.image = image;
      return category;
    })
    .filter((item): item is SiteCategory => Boolean(item));
  return normalized.length > 0 ? normalized : DEFAULT_SITE_CONTENT.categories;
}

function imagePath(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return /^(\/|https?:\/\/)/.test(trimmed) ? trimmed : undefined;
}

export function siteWhatsAppLink(content: SiteContent, message?: string): string {
  if (message) return siteWhatsAppMessageLink(content, message);
  if (getWhatsAppContacts(content).length > 1) return WHATSAPP_ROTATION_PATH;
  if (content.whatsappLink) return content.whatsappLink;
  return `https://wa.me/${content.whatsappNumber}?text=${encodeURIComponent(content.defaultWhatsAppMessage)}`;
}

/** Business short links have fixed greetings; preserve buyer-written form text
 * by using the configured sales number for inquiry messages. */
export function siteWhatsAppMessageLink(content: SiteContent, message: string) {
  if (getWhatsAppContacts(content).length > 1) {
    return `${WHATSAPP_ROTATION_PATH}?text=${encodeURIComponent(message)}`;
  }
  const number = content.whatsappNumber.replace(/\D/g, '');
  if (!/^[1-9]\d{7,14}$/.test(number)) return siteWhatsAppLink(content);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppContacts(content: SiteContent): WhatsAppContact[] {
  const contacts = normalizeWhatsAppContacts(content.whatsappContacts);
  // Explicit single-link overrides remain compatible with existing callers.
  if (contacts.length && contacts[0].link === content.whatsappLink) return contacts;
  return [
    { link: content.whatsappLink, number: content.whatsappNumber, display: content.whatsappDisplay }
  ];
}

export function siteWhatsAppDisplay(content: SiteContent): string {
  return getWhatsAppContacts(content)
    .map((contact) => contact.display)
    .join(' / ');
}

export function getSiteLocations(content: SiteContent): SiteLocation[] {
  const locations: SiteLocation[] = [
    {
      name: 'Guangzhou wholesale showroom',
      address: content.location,
      mapUrl: content.locationUrl
    }
  ];
  for (const location of normalizeAdditionalLocations(content.additionalLocations)) {
    if (!locations.some((item) => item.address.toLowerCase() === location.address.toLowerCase())) {
      locations.push(location);
    }
  }
  return locations;
}

function normalizeAdditionalLocations(value: unknown): SiteLocation[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const record = item as Record<string, unknown>;
    const address = typeof record.address === 'string' ? record.address.trim() : '';
    if (!address) return [];
    const fallback = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    const mapUrl =
      typeof record.mapUrl === 'string' && /^https:\/\//.test(record.mapUrl.trim())
        ? record.mapUrl.trim()
        : fallback;
    return [{ name: text(record.name, 'Additional wholesale showroom'), address, mapUrl }];
  });
}

function normalizeWhatsAppContacts(value: unknown): WhatsAppContact[] {
  if (!Array.isArray(value)) return [];
  const contacts: WhatsAppContact[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;
    const link = whatsappUrl(record.link, '');
    const number = typeof record.number === 'string' ? record.number.replace(/\D/g, '') : '';
    if (
      !link ||
      !/^[1-9]\d{7,14}$/.test(number) ||
      contacts.some((contact) => contact.number === number)
    ) {
      continue;
    }
    contacts.push({ link, number, display: text(record.display, `+${number}`) });
  }
  return contacts;
}
const SOCIAL_PLATFORM_HOME_PATHS = new Set([
  'facebook.com/',
  'www.facebook.com/',
  'tiktok.com/',
  'www.tiktok.com/',
  'instagram.com/',
  'www.instagram.com/'
]);

export function isConfiguredSocialLink(value: string): boolean {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    const key = `${parsed.hostname.toLowerCase()}${parsed.pathname.replace(/\/+$/, '/')}`;
    return !SOCIAL_PLATFORM_HOME_PATHS.has(key);
  } catch {
    return false;
  }
}

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function url(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return /^(\/|https?:\/\/)/.test(trimmed) ? trimmed : fallback;
}

function whatsappUrl(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'https:' && parsed.hostname === 'wa.me'
      ? parsed.toString()
      : fallback;
  } catch {
    return fallback;
  }
}
function stringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const items = value.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  return items.length > 0 ? items : fallback;
}
