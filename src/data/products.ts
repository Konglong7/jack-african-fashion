// Type definitions re-exported from the data layer.
// Product data now lives in data/products.json (read/written at runtime via src/lib/db.ts),
// so the admin panel can edit it without rebuilding.

export type { Category, StockType, Product } from '@/lib/db';
