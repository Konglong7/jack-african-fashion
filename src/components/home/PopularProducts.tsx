import { getProducts } from '@/lib/db';
import { getSiteContent } from '@/lib/siteContent';
import { SITE_IMAGES } from '@/lib/siteImages';
import { ProductCard } from '@/components/ProductCard';
import { SiteImage } from '@/components/SiteImage';
import { pickHomepageProducts } from './homeProducts';
import { PopularProductsClient } from './PopularProductsClient';

export async function PopularProducts() {
  const [all, siteContent] = await Promise.all([
    getProducts(),
    getSiteContent()
  ]);
  const featured = pickHomepageProducts(all);

  return (
    <PopularProductsClient
      badge={featured.some((product) => product.isNew) ? 'New Arrivals' : 'Featured Styles'}
      title='Popular Wholesale Styles'
      description='These are the styles African buyers order most. Ready stock and custom options available.'
    >
      <SiteImage
        className='relative mb-8 aspect-[16/7] rounded-xl shadow-sm'
        position='center center'
        src={SITE_IMAGES.africanMarketCollage}
        alt='African market women fashion collage with bestselling wholesale styles'
        sizes='100vw'
      />
      <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'>
        {featured.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            siteContent={siteContent}
          />
        ))}
      </div>
    </PopularProductsClient>
  );
}
