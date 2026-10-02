import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/siteContent';
import { InquiryClient } from './InquiryClient';
import { getProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Inquiry List',
  description: 'Review selected wholesale women fashion styles and send one WhatsApp inquiry.',
  robots: { index: false, follow: false }
};

export default async function InquiryPage() {
  const [siteContent, products] = await Promise.all([getSiteContent(), getProducts()]);
  const minimums = Object.fromEntries(products.map((product) => [product.id, product.moq]));
  return <InquiryClient siteContent={siteContent} minimums={minimums} />;
}
