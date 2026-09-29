import { getProducts } from '@/lib/db';
import { getSiteContent } from '@/lib/siteContent';
import { SITE_IMAGES } from '@/lib/siteImages';
import { ProductCard } from '@/components/ProductCard';
import { SiteImage } from '@/components/SiteImage';
import { pickHomepageProducts } from './homeProducts';
import { PopularProductsClient } from './PopularProductsClient';

export async function PopularProducts() {
  const [all, siteContent] = await Promise.all([getProducts(), getSiteContent()]);
  const featured = pickHomepageProducts(all);

  return (
    <PopularProductsClient
      badge={featured.some((product) => product.isNew) ? 'New Arrivals' : 'Featured Styles'}
      title='Featured Wholesale Styles'
      description='A selection of current product directions. Stock, MOQ, colors and custom options are confirmed per style.'
    >
      <SiteImage
        className='relative mb-8 aspect-[16/7] rounded-xl shadow-sm'
        position='center center'
        src={SITE_IMAGES.africanMarketCollage}
        alt='Featured women clothing wholesale styles for African market inquiries'
        sizes='100vw'
      />
      <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'>
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} siteContent={siteContent} />
        ))}
      </div>
    </PopularProductsClient>
  );
}
