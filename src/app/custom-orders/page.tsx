import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/siteContent';
import { CustomOrdersClient } from './CustomOrdersClient';
import { pageMetadata } from '@/lib/pageMetadata';

export const metadata: Metadata = pageMetadata('/custom-orders',
  "Custom Women's Clothing Production in Guangzhou",
  'Send reference photos, fabric requirements, sizes and quantity to Jack African Fashion for own-factory custom production, MOQ confirmation and a Guangzhou quotation.'
);

export default async function CustomOrdersPage() {
  const siteContent = await getSiteContent();
  return <CustomOrdersClient initialSiteContent={siteContent} />;
}
