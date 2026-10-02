import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

let snapshot: { key: string; slugs: Set<string> } | undefined;

// Middleware has its own module instance. Observe the atomic data-file changes
// instead of reusing the page store's process-local cache after admin updates.
export async function hasProductSlug(
  slug: string,
  filename = path.join(process.cwd(), 'data', 'products.json')
): Promise<boolean> {
  const info = await stat(filename);
  const key = `${filename}:${info.ino}:${info.size}:${info.mtimeMs}`;
  if (snapshot?.key !== key) {
    const products: unknown = JSON.parse(await readFile(filename, 'utf8'));
    if (!Array.isArray(products)) throw new Error('Product route data must be an array');
    snapshot = {
      key,
      slugs: new Set(products.map((product: { slug?: string }) => product.slug).filter(
        (value): value is string => typeof value === 'string'
      ))
    };
  }
  return snapshot.slugs.has(slug);
}
