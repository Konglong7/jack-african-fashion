export interface SiteCategory {
  name: string;
  image?: string;
  description?: string;
}

export interface SiteContent {
  name: string;
  slogan: string;
  location: string;
  locationUrl: string;
  business: string;
  whatsappNumber: string;
  whatsappDisplay: string;
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
  name: 'Jack African Fashion',
  slogan: "Guangzhou Women's Fashion Wholesale for African Market",
  location: 'Yulong Fashion Plaza',
  // 通用地图搜索链接（不含具体商户点位）
  locationUrl: 'https://www.google.com/maps/search/?api=1&query=Yulong+Fashion+Plaza+Guangzhou',
  business: "Women's Fashion Wholesale",
  // Demo 示例号码：+86 138 0000 0000（真实号码请在后台「站点设置」中填写）
  whatsappNumber: '8613800000000',
  whatsappDisplay: '+86 138 0000 0000',
  defaultWhatsAppMessage:
    'Hello Jack, please add me on WhatsApp. I want to see current ready-stock styles, real stock photos/video, wholesale prices, and new arrivals.',
  heroEyebrow: 'Guangzhou · African Market Wholesale',
  heroTitle: "Guangzhou Women's Fashion Wholesale for",
  heroAccent: 'African Market',
  heroBody:
    'Professional Guangzhou womenswear wholesale support with ready stock, factory prices, custom styles, quality checking, and export packing for African boutiques and importers.',
  heroTrust: ['Ready Stock', 'Factory Network', 'Export Packing'],
  categories: [
    {
      name: 'Plus Size Dresses',
      image: '/images/site/02-category-plus-size-dresses.png',
      description: 'Loose, flattering fits from XL to 5XL — a top seller across African boutiques.'
    },
    {
      name: 'Two Piece Sets',
      image: '/images/site/03-category-two-piece-sets.png',
      description: 'Matching top and bottom sets that sell fast and photograph beautifully.'
    },
    {
      name: 'Pleated Dresses',
      image: '/images/site/04-category-pleated-styles.png',
      description: 'Stretch pleated styles in rich colours — our most re-ordered category.'
    },
    {
      name: 'Maxi Dresses',
      image: '/images/site/05-category-maxi-dresses.png',
      description: 'Bold African print maxi dresses with full coverage and statement colour.'
    },
    {
      name: 'Jumpsuits',
      image: '/images/site/category-jumpsuits-cover.webp',
      description: 'Easy one-piece statements for everyday and occasion ranges.'
    },
    {
      name: 'Custom Orders',
      image: '/images/site/12-category-custom-orders.png',
      description: 'Send your reference pictures — we quote by fabric, size and quantity.'
    }
  ],
  socialLinks: {
    facebook: 'https://www.facebook.com/',
    tiktok: 'https://www.tiktok.com/',
    instagram: 'https://www.instagram.com/'
  }
};

export function normalizeSiteContent(input: unknown): SiteContent {
  const data = input && typeof input === 'object' ? (input as Record<string, unknown>) : {};
  const social =
    data.socialLinks && typeof data.socialLinks === 'object'
      ? (data.socialLinks as Record<string, unknown>)
      : {};

  return {
    ...DEFAULT_SITE_CONTENT,
    name: text(data.name, DEFAULT_SITE_CONTENT.name),
    slogan: text(data.slogan, DEFAULT_SITE_CONTENT.slogan),
    location: text(data.location, DEFAULT_SITE_CONTENT.location),
    locationUrl: url(data.locationUrl, DEFAULT_SITE_CONTENT.locationUrl),
    business: text(data.business, DEFAULT_SITE_CONTENT.business),
    whatsappNumber: text(data.whatsappNumber, DEFAULT_SITE_CONTENT.whatsappNumber).replace(
      /\D/g,
      ''
    ),
    whatsappDisplay: text(data.whatsappDisplay, DEFAULT_SITE_CONTENT.whatsappDisplay),
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

export function siteWhatsAppLink(content: SiteContent, message = content.defaultWhatsAppMessage) {
  return `https://wa.me/${content.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function url(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return /^(\/|https?:\/\/)/.test(trimmed) ? trimmed : fallback;
}

function stringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const items = value.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  return items.length > 0 ? items : fallback;
}
