import type { Metadata } from 'next';
import { absoluteSiteUrl } from './siteUrl';
import { SITE_IMAGES } from './siteImages';

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = absoluteSiteUrl(path);
  const images = [absoluteSiteUrl(SITE_IMAGES.whatsappCatalogBanner)];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images, type: 'website', siteName: 'Jack African Fashion' },
    twitter: { card: 'summary_large_image', title, description, images }
  };
}
