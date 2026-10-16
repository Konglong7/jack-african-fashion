import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/siteContent';
import { CustomOrdersClient } from './CustomOrdersClient';
import { pageMetadata } from '@/lib/pageMetadata';

export const metadata: Metadata = pageMetadata(
  '/custom-orders',
  "Custom Women's Clothing Manufacturing & Wholesale",
  'See Jack Fashion factory cutting, sewing and finishing photos. Discuss custom womenswear, samples, measurements, MOQ and a factory-direct quote with our team.'
);

export default async function CustomOrdersPage() {
  const siteContent = await getSiteContent();
  return <CustomOrdersClient initialSiteContent={siteContent} />;
}
