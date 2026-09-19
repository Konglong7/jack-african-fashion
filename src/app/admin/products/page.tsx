import { getProducts } from '@/lib/db';
import { getSiteContent } from '@/lib/siteContent';
import { ProductsManager } from './ProductsManager';

// Server component: loads products, hands to interactive client component.
export default async function AdminProductsPage() {
  const [products, siteContent] = await Promise.all([getProducts(), getSiteContent()]);
  return (
    <ProductsManager
      initialProducts={products}
      initialCategories={siteContent.categories.map((category) => category.name)}
    />
  );
}
