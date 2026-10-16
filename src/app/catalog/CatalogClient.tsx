'use client';

import { Suspense, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { PublicProduct } from '@/lib/productPublicFacts';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { WhatsAppIcon } from '@/components/Icons';
import { ProductCard } from '@/components/ProductCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Styles' },
  { value: 'popular', label: 'Most Popular' }
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
  products: PublicProduct[];
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
    const requestedSort = params.get('sort');
    setSort(SORT_OPTIONS.some((option) => option.value === requestedSort) ? requestedSort! : 'newest');
    setSearch(params.get('q') || '');
    setDebouncedSearch(params.get('q') || '');
    setUrlReady(true);
  }, []);

  // Ensure client-side filter is immediately interactive on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !urlReady) {
      if (window.location.search) {
        applyUrl(window.location.search.replace(/^\?/, ''));
      } else {
        setUrlReady(true);
      }
    }
  }, [urlReady, applyUrl]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setUrlReady(true);
  };

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
    let result: PublicProduct[] = [...products];

    if (category !== 'All') {
      result = result.filter((p) => p.category === category);
    }
    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
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

  const resetFilters = () => {
    setCategory('All');
    setSearch('');
    setSort('newest');
    setDisplayLimit(PAGE_SIZE);
  };

  return (
    <section className='bg-brand-cream py-8 sm:py-12'>
      <Suspense fallback={null}>
        <CatalogUrlSync onChange={applyUrl} />
      </Suspense>
      <div className='mx-auto max-w-7xl px-3 sm:px-6 lg:px-8'>
        {/* Wholesale B2B Trust Banner */}
        <div className='mb-8 overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 p-4 text-white shadow-xl sm:p-6'>
          <div className='grid grid-cols-2 gap-3 text-left sm:grid-cols-4 sm:gap-6'>
            <div className='flex items-center gap-2.5 sm:gap-3.5'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-lg font-bold text-amber-400'>
                🏭
              </div>
              <div>
                <p className='text-xs font-bold tracking-wider text-amber-300 uppercase'>
                  Guangzhou Direct
                </p>
                <p className='text-[11px] text-stone-300'>Talk directly with Jack</p>
              </div>
            </div>

            <div className='flex items-center gap-2.5 sm:gap-3.5'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-sm font-black text-amber-300'>
                MOQ
              </div>
              <div>
                <p className='text-xs font-bold tracking-wider text-amber-300 uppercase'>
                  MOQ by Style
                </p>
                <p className='text-[11px] text-stone-300'>Confirm quantity for each order</p>
              </div>
            </div>

            <div className='flex items-center gap-2.5 sm:gap-3.5'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-lg font-bold text-emerald-400'>
                ⚡
              </div>
              <div>
                <p className='text-xs font-bold tracking-wider text-emerald-400 uppercase'>
                  Stock Status
                </p>
                <p className='text-[11px] text-stone-300'>Confirm the current batch</p>
              </div>
            </div>

            <div className='flex items-center gap-2.5 sm:gap-3.5'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-lg font-bold text-amber-400'>
                🚢
              </div>
              <div>
                <p className='text-xs font-bold tracking-wider text-amber-300 uppercase'>
                  Cargo handover
                </p>
                <p className='text-[11px] text-stone-300'>Confirm for your destination</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:gap-4'>
          <div className='relative flex-1'>
            <svg
              className='absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-stone-400'
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
              onChange={(e) => {
                setSearch(e.target.value);
                setUrlReady(true);
              }}
              aria-label='Search products'
              className='w-full rounded-full border border-stone-200 bg-white py-3 pr-10 pl-12 text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none'
            />
            {search && (
              <button
                type='button'
                onClick={() => setSearch('')}
                aria-label='Clear search'
                className='absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700'
              >
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  viewBox='0 0 24 24'
                >
                  <path d='M18 6 6 18M6 6l12 12' />
                </svg>
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setUrlReady(true);
            }}
            aria-label='Sort products'
            className='cursor-pointer rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none'
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
          <div className='-mx-3 flex scrollbar-none flex-nowrap items-center gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:px-0'>
            <span className='mr-1 shrink-0 text-xs font-bold tracking-wider text-stone-700 uppercase sm:text-sm'>
              Category:
            </span>
            {['All', ...categories].map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  type='button'
                  onClick={() => handleCategoryChange(cat)}
                  className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all sm:text-sm ${
                    isActive
                      ? 'bg-stone-950 text-amber-400 shadow-md ring-1 ring-amber-500/40'
                      : 'border border-stone-200 bg-white text-stone-700 shadow-xs hover:bg-stone-100 hover:text-stone-900'
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
            <span className='text-[11px] font-bold tracking-wider text-stone-500 uppercase'>
              Active Filters:
            </span>
            {category !== 'All' && (
              <button
                type='button'
                onClick={() => setCategory('All')}
                className='inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 font-semibold text-amber-900 transition-colors hover:bg-amber-100'
              >
                Category: {category}
                <span className='font-bold text-amber-700'>✕</span>
              </button>
            )}
            {debouncedSearch.trim() && (
              <button
                type='button'
                onClick={() => setSearch('')}
                className='inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-stone-100 px-3 py-1 font-semibold text-stone-800 transition-colors hover:bg-stone-200'
              >
                Keyword: &quot;{debouncedSearch.trim()}&quot;
                <span className='font-bold text-stone-600'>✕</span>
              </button>
            )}
            {sort !== 'newest' && (
              <button
                type='button'
                onClick={() => setSort('newest')}
                className='inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-stone-100 px-3 py-1 font-semibold text-stone-800 transition-colors hover:bg-stone-200'
              >
                Sort: {SORT_OPTIONS.find((s) => s.value === sort)?.label}
                <span className='font-bold text-stone-600'>✕</span>
              </button>
            )}
            <button
              type='button'
              onClick={resetFilters}
              className='ml-1 font-bold text-amber-700 underline transition-colors hover:text-amber-800'
            >
              Clear all
            </button>
          </div>
        )}

        {/* Product count stats */}
        <div className='mb-5 flex items-center justify-between text-xs text-stone-600 sm:text-sm'>
          <p>
            Showing{' '}
            <span className='font-bold text-stone-950'>
              {Math.min(displayLimit, filtered.length)}
            </span>{' '}
            of <span className='font-bold text-stone-950'>{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'wholesale style' : 'wholesale styles'}
          </p>
          <span className='hidden text-stone-400 sm:inline-block'>
            Confirm MOQ by style and current batch
          </span>
        </div>

        {/* Product Grid */}
        <h2 className='sr-only'>Browse Wholesale Styles</h2>
        {filtered.length > 0 ? (
          <>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8'>
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} siteContent={siteContent} />
              ))}
            </div>

            {hasMore && (
              <div className='mt-10 text-center sm:mt-12'>
                <button
                  type='button'
                  onClick={() => setDisplayLimit((prev) => prev + PAGE_SIZE)}
                  className='inline-flex items-center justify-center gap-2 rounded-full border border-amber-400/80 bg-white px-8 py-3.5 text-sm font-bold text-stone-900 shadow-sm transition-all hover:border-amber-500 hover:bg-amber-50 active:scale-95'
                >
                  Load More Styles ({filtered.length - displayLimit} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className='rounded-2xl border border-stone-200/80 bg-white p-8 py-20 text-center'>
            <p className='mb-4 text-base text-stone-500 sm:text-lg'>
              No styles found matching your filters.
            </p>
            <button
              onClick={resetFilters}
              className='inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 font-bold text-white shadow-md transition-colors hover:bg-amber-600'
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom CTA for custom sourcing */}
        <div className='mt-14 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 p-6 text-center text-white shadow-xl sm:mt-16 sm:p-12'>
          <span className='mb-3 inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold tracking-wider text-amber-300 uppercase'>
            Custom Sourcing from Guangzhou
          </span>
          <h2 className='font-display mb-3 text-2xl font-bold text-white sm:text-3xl'>
            Looking For Specific Designs or Larger Batches?
          </h2>
          <p className='mx-auto mb-6 max-w-xl text-xs leading-relaxed text-stone-300 sm:text-sm'>
            Send your reference photos, target fabrics, size requirements and quantity on WhatsApp.
            Jack will confirm sourcing options, sample requirements and the MOQ for your proposed
            order before quoting.
          </p>
          <a
            href={siteWhatsAppLink(
              siteContent,
              "Hello Jack, I'm looking for specific styles not in your catalog. Can you help?"
            )}
            target='_blank'
            rel='noopener noreferrer'
            data-cta-location='catalog-custom-sourcing'
            className='inline-flex items-center justify-center gap-2 rounded-full bg-[#0B7A3E] px-8 py-3.5 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#086532] active:scale-95 sm:py-4'
          >
            <WhatsAppIcon className='h-5 w-5' />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Back to Top Floater */}
        {showBackToTop && (
          <button
            type='button'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='fixed right-4 bottom-20 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white/95 text-stone-900 shadow-xl backdrop-blur transition-all hover:bg-stone-950 hover:text-white active:scale-95 md:right-8 md:bottom-8'
            aria-label='Scroll to top'
            title='Back to top'
          >
            <svg
              className='h-5 w-5'
              fill='none'
              stroke='currentColor'
              strokeWidth={2.5}
              viewBox='0 0 24 24'
            >
              <path d='M5 15l7-7 7 7' />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
