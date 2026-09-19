import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/siteContent';
import { CustomOrdersClient } from './CustomOrdersClient';

export const metadata: Metadata = {
  title: "Custom Women's Fashion Orders | Factory Production Guangzhou",
  description:
    'Send reference photos, fabric requirements, sizes, and quantity to Jack African Fashion. Direct factory quotes and custom production for African boutiques and importers.'
};

export default async function CustomOrdersPage() {
  const siteContent = await getSiteContent();
  return <CustomOrdersClient initialSiteContent={siteContent} />;
}
