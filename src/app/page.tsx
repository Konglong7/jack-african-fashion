import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { PopularProducts } from '@/components/home/PopularProducts';
import { SupplierSupport } from '@/components/home/SupplierSupport';
import { CustomOrderProcess } from '@/components/home/CustomOrderProcess';
import { BuyerHelp } from '@/components/home/BuyerHelp';
import { WholesaleContact } from '@/components/home/WholesaleContact';
import { getSiteContent } from '@/lib/siteContent';
import { pageMetadata } from '@/lib/pageMetadata';

export const metadata = pageMetadata(
  '/',
  "Guangzhou African Women's Clothing Supplier",
  "Jack African Fashion supplies African boutiques, wholesalers and importers with women's dresses, plus sizes, two piece sets, ready stock and custom production."
);

// Keep admin-added products visible without changing the homepage cache policy.
export const revalidate = 60;

export default async function HomePage() {
  const siteContent = await getSiteContent();
  return (
    <>
      <Hero siteContent={siteContent} />
      <Categories categories={siteContent.categories} />
      <PopularProducts />
      <SupplierSupport siteContent={siteContent} />
      <CustomOrderProcess siteContent={siteContent} />
      <BuyerHelp />
      <WholesaleContact siteContent={siteContent} />
    </>
  );
}
