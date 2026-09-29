import { BRAND_ENTITY } from './aioContent';

export function getSiteOrigin(configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || ''): string {
  try {
    const parsed = new URL(configuredUrl || BRAND_ENTITY.website);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return BRAND_ENTITY.website;
    }
    return parsed.origin;
  } catch {
    return BRAND_ENTITY.website;
  }
}

export function absoluteSiteUrl(pathname: string, configuredUrl?: string): string {
  const origin = getSiteOrigin(configuredUrl);
  return new URL(pathname.replace(/^\/+/, ''), `${origin}/`).toString();
}

export function toAbsoluteImageUrl(imageUrl: string, configuredUrl?: string): string {
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return absoluteSiteUrl(imageUrl, configuredUrl);
}
