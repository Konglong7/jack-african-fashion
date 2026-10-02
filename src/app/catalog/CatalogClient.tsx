'use client';

import { Suspense, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { Product } from '@/lib/db';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { WhatsAppIcon } from '@/components/Icons';
import { ProductCard } from '@/components/ProductCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Styles' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'custom', label: 'Custom Available' }
];

const PAGE_SIZE = 24;

// Only this invisible leaf depends on searchParams. The product grid remains
// server rendered for crawlers and buyers whose JavaScript has not loaded yet.
function CatalogUrlSync({ onChange }: { onChange: (query: string) => void }) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  useEffect(() => onChange(query), [query, onChange]);
  return null;
}

interface Props {
  products: Product[];
  siteContent: SiteContent;
  categories: string[];
}

export function CatalogClient({ products, siteContent, categories }: Props) {
  const pathname = usePathname();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [urlReady, setUrlReady] = useState(false);
  const ownQuery = useRef<string | null>(null);
  const applyUrl = useCallback((query: string) => {
    // Our own URL update must not overwrite text typed during the debounce.
    if (query === ownQuery.current) {
      ownQuery.current = null;
      return;
    }
    const params = new URLSearchParams(query);
    setCategory(params.get('category') || 'All');
    setSort(params.get('sort') || 'newest');
    setSearch(params.get('q') || '');
    setDebouncedSearch(params.get('q') || '');
    setUrlReady(true);
  }, []);
  const [displayLimit, setDisplayLimit] = useState(PAGE_SIZE);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounce search input so URL updates don't fire on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync filter state to the URL (shareable, back-button friendly).
  useEffect(() => {
    if (!urlReady) return;
    setDisplayLimit(PAGE_SIZE);
    const params = new URLSearchParams(window.location.search);
    for (const key of ['category', 'sort', 'q']) params.delete(key);
    if (category !== 'All') params.set('category', category);
    if (sort !== 'newest') params.set('sort', sort);
    if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    if (url !== `${pathname}${window.location.search}`) {
      ownQuery.current = params.toString();
      window.history.replaceState(null, '', url);
    }
  }, [category, sort, debouncedSearch, pathname, urlReady]);

  // Category counts for quick visual reference
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    let result: Product[] = [...products];

    if (category !== 'All') {
      result = result.filter((p) => p.category === category);
    }
    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case 'newest':
        result.sort((a, b) => {
          const aNew = a.isNew ? 1 : 0;
          const bNew = b.isNew ? 1 : 0;
          if (bNew !== aNew) return bNew - aNew;
          return Number(b.id) - Number(a.id);
        });
        break;
      case 'custom':
        result.sort((a, b) => {
          const aCust = a.stockType.includes('Custom') ? 1 : 0;
          const bCust = b.stockType.includes('Custom') ? 1 : 0;
          if (bCust !== aCust) return bCust - aCust;
          return Number(b.id) - Number(a.id);
        });
        break;
      default:
        result.sort((a, b) => {
          const aPop = a.isPopular ? 1 : 0;
          const bPop = b.isPopular ? 1 : 0;
          if (bPop !== aPop) return bPop - aPop;
          return Number(b.id) - Number(a.id);
        });
    }
    return result;
  }, [category, debouncedSearch, sort, products]);

  const visibleProducts = useMemo(() => filtered.slice(0, displayLimit), [filtered, displayLimit]);
  const hasMore = displayLimit < filtered.length;
  const minimumMoq = products.length ? Math.min(...products.map((product) => product.moq)) : null;

  const resetFilters = () => {
    setCategory('All');
    setSearch('');
    setSort('newest');
    setDisplayLimit(PAGE_SIZE);
  };

  return (
    <section className='bg-brand-cream py-8 sm:py-12'>
      <Suspense fallback={null}><CatalogUrlSync onChange={applyUrl} /></Suspense>
      <div className='mx-auto max-w-7xl px-3 sm:px-6 lg:px-8'>
        {/* Wholesale B2B Trust Banner */}
        <div className='mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 p-4 sm:p-6 text-white shadow-xl border border-amber-500/20'>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6 text-left'>
            <div className='flex items-center gap-2.5 sm:gap-3.5'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-bold text-lg'>
                🏭
              </div>
              <div>
                <p className='text-xs font-bold text-amber-300 uppercase tracking-wider'>Guangzhou Direct</p>
                <p className='text-[11px] text-stone-300'>No middleman markup</p>
              </div>
            </div>

            <div className='flex items-center gap-2.5 sm:gap-3.5'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 font-black text-sm'>
                {minimumMoq ?? 'MOQ'}
              </div>
              <div>
                <p className='text-xs font-bold text-amber-300 uppercase tracking-wider'>MOQ by Style</p>
                <p className='text-[11px] text-stone-300'>Confirm quantity for each order</p>
              </div>
            </div>

            <div className='flex items-center gap-2.5 sm:gap-3.5'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-lg'>
                ⚡
              </div>
              <div>
                <p className='text-xs font-bold text-emerald-400 uppercase tracking-wider'>Ready Stock</p>
                <p className='text-[11px] text-stone-300'>Dispatch after confirmation</p>
              </div>
            </div>

            <div className='flex items-center gap-2.5 sm:gap-3.5'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-bold text-lg'>
                🚢
              </div>
              <div>
                <p className='text-xs font-bold text-amber-300 uppercase tracking-wider'>African Cargo</p>
                <p className='text-[11px] text-stone-300'>Nigeria, Ghana, Kenya & more</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:gap-4'>
          <div className='relative flex-1'>
            <svg
              className='text-stone-400 absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              viewBox='0 0 24 24'
            >
              <circle cx='11' cy='11' r='8' />
              <path d='m21 21-4.3-4.3' />
            </svg>
            <input
              type='text'
              placeholder='Search dresses, styles, prints, sizes...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label='Search products'
              disabled={!urlReady}
              className='border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-full border bg-white py-3 pr-10 pl-12 text-sm shadow-sm focus:outline-none'
            />
            {search && (
              <button
                type='button'
                onClick={() => setSearch('')}
                aria-label='Clear search'
                className='text-stone-400 hover:text-stone-700 hover:bg-stone-100 absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 transition-colors'
              >
                <svg className='h-4 w-4' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
                  <path d='M18 6 6 18M6 6l12 12' />
                </svg>
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label='Sort products'
            disabled={!urlReady}
            className='border-stone-200 text-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer rounded-full border bg-white px-5 py-3 text-sm font-semibold shadow-sm focus:outline-none'
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter Pills (Horizontal scrollable rail on mobile) */}
        <div className='mb-6 sm:mb-8'>
          <div className='-mx-4 flex flex-nowrap items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 scrollbar-none'>
            <span className='text-stone-700 shrink-0 text-xs sm:text-sm font-bold uppercase tracking-wider mr-1'>
              Category:
            </span>
            {['All', ...categories].map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  disabled={!urlReady}
                  onClick={() => setCategory(cat)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-stone-950 text-amber-400 shadow-md ring-1 ring-amber-500/40'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200 bg-white shadow-xs'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Tags */}
        {(category !== 'All' || debouncedSearch.trim() || sort !== 'newest') && (
          <div className='mb-6 flex flex-wrap items-center gap-2 text-xs'>
            <span className='text-stone-500 font-bold uppercase tracking-wider text-[11px]'>Active Filters:</span>
            {category !== 'All' && (
              <button
                type='button'
                onClick={() => setCategory('All')}
                className='border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold transition-colors'
              >
                Category: {category}
                <span className='text-amber-700 font-bold'>✕</span>
              </button>
            )}
            {debouncedSearch.trim() && (
              <button
                type='button'
                onClick={() => setSearch('')}
                className='border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold transition-colors'
              >
                Keyword: &quot;{debouncedSearch.trim()}&quot;
                <span className='text-stone-600 font-bold'>✕</span>
              </button>
            )}
            {sort !== 'newest' && (
              <button
                type='button'
                onClick={() => setSort('newest')}
                className='border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold transition-colors'
              >
                Sort: {SORT_OPTIONS.find((s) => s.value === sort)?.label}
                <span className='text-stone-600 font-bold'>✕</span>
              </button>
            )}
            <button
              type='button'
              onClick={resetFilters}
              className='text-amber-700 hover:text-amber-800 ml-1 font-bold underline transition-colors'
            >
              Clear all
            </button>
          </div>
        )}

        {/* Product count stats */}
        <div className='mb-5 flex items-center justify-between text-xs sm:text-sm text-stone-600'>
          <p>
            Showing{' '}
            <span className='text-stone-950 font-bold'>
              {Math.min(displayLimit, filtered.length)}
            </span>{' '}
            of <span className='text-stone-950 font-bold'>{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'wholesale style' : 'wholesale styles'}
          </p>
          <span className='hidden sm:inline-block text-stone-400'>
            {minimumMoq ? `Starting MOQ ${minimumMoq} pcs · Confirm each style` : 'Confirm MOQ by style'}
          </span>
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6 lg:gap-8'>
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 4}
                  siteContent={siteContent}
                />
              ))}
            </div>

            {hasMore && (
              <div className='mt-10 sm:mt-12 text-center'>
                <button
                  type='button'
                  onClick={() => setDisplayLimit((prev) => prev + PAGE_SIZE)}
                  className='border-amber-400/80 bg-white text-stone-900 hover:bg-amber-50 hover:border-amber-500 inline-flex items-center justify-center gap-2 rounded-full border px-8 py-3.5 text-sm font-bold shadow-sm transition-all active:scale-95'
                >
                  Load More Styles ({filtered.length - displayLimit} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className='py-20 text-center rounded-2xl bg-white border border-stone-200/80 p-8'>
            <p className='text-stone-500 mb-4 text-base sm:text-lg'>
              No styles found matching your filters.
            </p>
            <button
              onClick={resetFilters}
              className='bg-stone-900 hover:bg-amber-600 inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white transition-colors shadow-md'
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom CTA for custom sourcing */}
        <div className='mt-14 sm:mt-16 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 p-6 sm:p-12 text-center text-white shadow-xl border border-amber-500/20'>
          <span className='inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 mb-3'>
            Custom Sourcing &amp; Own Factory
          </span>
          <h3 className='font-display mb-3 text-2xl font-bold sm:text-3xl text-white'>
            Looking For Specific Designs or Larger Batches?
          </h3>
          <p className='text-stone-300 mx-auto mb-6 max-w-xl text-xs sm:text-sm leading-relaxed'>
            We have hundreds of offline showroom samples and custom production lines in Guangzhou. Send us your design photos, target fabrics, or tech packs on WhatsApp for fast quotation and MOQ assessment.
          </p>
          <a
            href={siteWhatsAppLink(
              siteContent,
              "Hello Jack, I'm looking for specific styles not in your catalog. Can you help?"
            )}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20BA5A] px-8 py-3.5 sm:py-4 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95'
          >
            <WhatsAppIcon className='h-5 w-5' />
            <span>Ask Custom Inquiry on WhatsApp</span>
          </a>
        </div>

        {/* Back to Top Floater */}
        {showBackToTop && (
          <button
            type='button'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='border-stone-200 text-stone-900 hover:bg-stone-950 hover:text-white fixed right-4 bottom-20 z-40 flex h-11 w-11 items-center justify-center rounded-full border bg-white/95 shadow-xl backdrop-blur transition-all active:scale-95 md:right-8 md:bottom-8'
            aria-label='Scroll to top'
            title='Back to top'
          >
            <svg className='h-5 w-5' fill='none' stroke='currentColor' strokeWidth={2.5} viewBox='0 0 24 24'>
              <path d='M5 15l7-7 7 7' />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
