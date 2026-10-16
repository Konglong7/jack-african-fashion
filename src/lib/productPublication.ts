import { createHash } from 'node:crypto';
import type { Product } from './db';
import { MARKET_PAGES, WHOLESALE_PAGES } from './aioContent';
import { MARKET_REGIONS } from './marketRegions';
import { BUYER_GUIDES } from './buyerGuides';
import { relatedProducts } from './productCollections';
import { pickHomepageProducts } from '../components/home/homeProducts';
import { enqueueIndexNow, flushIndexNow, getIndexNowState, notifyPublicChanges } from './indexNow';
import { getSiteOrigin } from './siteUrl';
import { readRuntimeJson, updateRuntimeJson } from './runtimeData';

interface ProductIndexSnapshot {
  schemaVersion: 1;
  fingerprints: Record<string, string>;
}

const productIndexSnapshotFile = 'indexnow-products.json';
const emptyProductIndexSnapshot = (): ProductIndexSnapshot => ({
  schemaVersion: 1,
  fingerprints: {}
});

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function fingerprint(value: unknown) {
  return createHash('sha256').update(stableJson(value)).digest('hex');
}

/** Compare the product selections rendered by each public page before notifying it. */
export function changedProductPages(before: Product[], after: Product[]) {
  const paths = new Set<string>();
  const differs = (a: unknown, b: unknown) => JSON.stringify(a) !== JSON.stringify(b);
  if (!differs(before, after)) return [];
  paths.add('/catalog');
  const home = (all: Product[]) => [
    pickHomepageProducts(all),
    ...['Maxi Dresses', 'Two Piece Sets'].map((category) =>
      [...all].reverse().find((item) => item.category === category)
    )
  ];
  if (differs(home(before), home(after))) paths.add('/');
  for (const page of WHOLESALE_PAGES) {
    const select = (all: Product[]) =>
      all
        .filter((item) =>
          page.catalogCategory
            ? item.category === page.catalogCategory
            : page.slug === 'african-dresses'
              ? /Dress/.test(item.category)
              : true
        )
        .slice(-6)
        .reverse();
    if (differs(select(before), select(after))) paths.add('/wholesale/' + page.slug);
  }
  for (const page of [
    ...MARKET_PAGES.map((market) => ({
      slug: market.slug,
      categories: market.availableCategories
    })),
    ...MARKET_REGIONS
  ]) {
    const select = (all: Product[]) =>
      all
        .filter((item) => page.categories.includes(item.category))
        .slice(-6)
        .reverse();
    if (differs(select(before), select(after))) paths.add('/markets/' + page.slug);
  }
  for (const guide of BUYER_GUIDES) {
    const select = (all: Product[]) =>
      all
        .filter((item) => item.category === guide.category)
        .slice(-3)
        .reverse();
    if (differs(select(before), select(after))) paths.add('/guides/' + guide.slug);
  }
  const previous = new Map(before.map((item) => [item.id, item]));
  const current = new Map(after.map((item) => [item.id, item]));
  for (const id of new Set([...previous.keys(), ...current.keys()])) {
    const a = previous.get(id),
      b = current.get(id);
    if (differs(a, b)) {
      if (a) paths.add('/products/' + a.slug);
      if (b) paths.add('/products/' + b.slug);
    } else if (a && b && differs(relatedProducts(a, before), relatedProducts(b, after))) {
      paths.add('/products/' + b.slug);
    }
  }
  return [...paths];
}
export async function publishProductChanges(
  before: Product[],
  after: Product[],
  revalidate: (path: string) => void
) {
  const paths = changedProductPages(before, after);
  paths.forEach(revalidate);
  revalidate('/sitemap.xml');
  if (paths.length) await notifyPublicChanges(paths, JSON.stringify(after));
}

/**
 * Reconcile file-based/bulk product releases with the durable IndexNow queue.
 * The first run migrates from prior receipts, so already submitted product URLs
 * are recorded without being sent again.
 */
export async function reconcileProductIndexNow(products: Product[]) {
  const snapshot = await readRuntimeJson(productIndexSnapshotFile, emptyProductIndexSnapshot);
  const state = await getIndexNowState();
  const origin = getSiteOrigin();
  const current = Object.fromEntries(
    products.map((product) => [`/products/${product.slug}`, fingerprint(product)])
  );
  const bootstrap = Object.keys(snapshot.fingerprints).length === 0;
  const changedPaths: string[] = [];

  for (const [path, revision] of Object.entries(current)) {
    const wasSubmitted = Boolean(state.successful[new URL(path, origin).toString()]);
    if ((bootstrap && !wasSubmitted) || (!bootstrap && snapshot.fingerprints[path] !== revision)) {
      changedPaths.push(path);
    }
  }
  if (!bootstrap) {
    for (const path of Object.keys(snapshot.fingerprints)) {
      if (!(path in current)) changedPaths.push(path);
    }
  }

  for (const path of changedPaths) {
    await enqueueIndexNow(
      [path],
      current[path] ? `product:${current[path]}` : `deleted-product:${snapshot.fingerprints[path]}`
    );
  }
  if (changedPaths.length) {
    await enqueueIndexNow(['/catalog'], `catalog:${fingerprint(Object.entries(current))}`);
  }
  await flushIndexNow();
  await updateRuntimeJson(productIndexSnapshotFile, emptyProductIndexSnapshot, (next) => {
    next.fingerprints = current;
  });
  return changedPaths;
}
