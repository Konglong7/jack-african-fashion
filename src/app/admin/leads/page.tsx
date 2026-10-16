import { getLeads } from '@/lib/leadsStore';
import { getProducts } from '@/lib/db';
import LeadsManager from './LeadsManager';

export const dynamic = 'force-dynamic';
export default async function LeadsPage() {
  const [leads, products] = await Promise.all([getLeads(), getProducts()]);
  return (
    <LeadsManager
      initialLeads={leads}
      products={products.map((product) => ({
        id: product.id,
        name: product.name,
        code: product.image.match(/(\d{7})\./)?.[1] || product.id
      }))}
    />
  );
}
