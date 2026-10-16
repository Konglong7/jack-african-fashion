import { Hero } from '@/components/home/Hero';
import { MarketCollections } from '@/components/home/MarketCollections';
import { getProducts } from '@/lib/db';
import { Categories } from '@/components/home/Categories';
import { PopularProducts } from '@/components/home/PopularProducts';
import { SupplierSupport } from '@/components/home/SupplierSupport';
import { CustomOrderProcess } from '@/components/home/CustomOrderProcess';
import { BuyerHelp } from '@/components/home/BuyerHelp';
import { ShowroomProof } from '@/components/home/ShowroomProof';
import { WholesaleContact } from '@/components/home/WholesaleContact';
import { getSiteContent } from '@/lib/siteContent';
import { pageMetadata } from '@/lib/pageMetadata';
import { GarmentExamples } from '@/components/GarmentExamples';
import { BuyingIllustrations } from '@/components/BuyingIllustrations';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { toPublicProduct } from '@/lib/productPublicFacts';
import { FactoryGallery } from '@/components/FactoryGallery';
import { TrustMetricBar } from '@/components/home/TrustMetricBar';
import { ProductionProcess } from '@/components/home/ProductionProcess';
import { CargoProofGallery } from '@/components/home/CargoProofGallery';
import { BuyerToolkit } from '@/components/home/BuyerToolkit';

export const metadata = pageMetadata(
  '/',
  "Jack Fashion | Guangzhou Women's Clothing Wholesale Supplier",
  "Guangzhou women's clothing wholesale supplier with own factory. Source factory-direct dresses, two-piece matching sets, and plus size fashion for boutiques and importers. Showrooms at Yulong Fashion Plaza and LIUHUA Market."
);

// Keep admin-added products visible without changing the homepage cache policy.
export const revalidate = 60;

export default async function HomePage() {
  const [siteContent, products] = await Promise.all([getSiteContent(), getProducts()]);
  const heroProducts = [
    [...products].reverse().find((product) => product.category === 'Maxi Dresses'),
    [...products].reverse().find((product) => product.category === 'Two Piece Sets')
  ]
    .filter((product): product is NonNullable<typeof product> => Boolean(product))
    .map((product) => toPublicProduct(product));
  return (
    <>
      <Hero siteContent={siteContent} products={heroProducts} />
      <TrustMetricBar />
      <Categories categories={siteContent.categories} />
      <PopularProducts />
      <ProductionProcess />
      <CargoProofGallery />
      <MarketCollections />
      <GarmentExamples />
      <SupplierSupport siteContent={siteContent} />
      <FactoryGallery path='/' compact />
      <CustomOrderProcess siteContent={siteContent} />
      <BuyingIllustrations whatsAppHref={siteWhatsAppLink(siteContent)} compact />
      <BuyerToolkit />
      <BuyerHelp siteContent={siteContent} />
      <ShowroomProof siteContent={siteContent} />
      <WholesaleContact siteContent={siteContent} />
    </>
  );
}
