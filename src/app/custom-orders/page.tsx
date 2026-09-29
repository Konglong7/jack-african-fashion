import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/siteContent';
import { CustomOrdersClient } from './CustomOrdersClient';

export const metadata: Metadata = {
  title: "Custom Women's Fashion Orders | Own Factory Guangzhou",
  description:
    'Send reference photos, fabric requirements, sizes and quantity to Jack African Fashion for own-factory custom production, MOQ confirmation and quotation from Guangzhou.'
};

export default async function CustomOrdersPage() {
  const siteContent = await getSiteContent();
  return <CustomOrdersClient initialSiteContent={siteContent} />;
}
