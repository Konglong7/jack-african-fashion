'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Product } from '@/lib/db';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { WhatsAppIcon } from '@/components/Icons';
import { ProductCard } from '@/components/ProductCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'custom', label: 'Custom Available' }
];

const PAGE_SIZE = 24;

interface Props {
  products: Product[];
  siteContent: SiteContent;
  categories: string[];
}

export function CatalogClient({
  products,
  siteContent,
  categories
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialSearch = searchParams.get('q') || '';
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
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

  // Header / breadcrumb links navigate to this same page with different
  // search params (e.g. /catalog?category=Plus+Size+Dresses). Because this
  // client component is NOT remounted on searchParams-only changes, useState
  // keeps the stale filter and the URL-sync effect below would then strip the
  // new param. Re-seed local state from the URL-derived initial values
  // whenever they change so the inbound filter actually applies.
  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSort(initialSort);
  }, [initialSort]);

  useEffect(() => {
    setSearch(initialSearch);
    setDebouncedSearch(initialSearch);
  }, [initialSearch]);

  // Sync filter state to the URL (shareable, back-button friendly).
  useEffect(() => {
    setDisplayLimit(PAGE_SIZE);
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (sort !== 'newest') params.set('sort', sort);
    if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(url, { scroll: false });
  }, [category, sort, debouncedSearch, router, pathname]);

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

  const visibleProducts = useMemo(
    () => filtered.slice(0, displayLimit),
    [filtered, displayLimit]
  );
  const hasMore = displayLimit < filtered.length;

  const resetFilters = () => {
    setCategory('All');
    setSearch('');
    setSort('newest');
    setDisplayLimit(PAGE_SIZE);
  };

  return (
    <section className='bg-brand-cream py-10 sm:py-12'>
      <div className='mx-auto max-w-7xl px-4'>
        {/* Search & sort */}
        <div className='mb-8 flex flex-col gap-4 sm:flex-row'>
          <div className='relative flex-1'>
            <svg
              className='text-brand-brown/40 absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2'
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
              placeholder='Search styles, categories, tags...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label='Search products'
              className='border-brand-sand text-brand-black placeholder:text-brand-brown/40 focus:border-brand-orange w-full rounded-full border bg-white py-3 pr-10 pl-12 text-sm focus:outline-none'
            />
            {search && (
              <button
                type='button'
                onClick={() => setSearch('')}
                aria-label='Clear search'
                className='text-brand-brown/40 hover:text-brand-brown hover:bg-brand-sand/30 absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 transition-colors'
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
            onChange={(e) => setSort(e.target.value)}
            aria-label='Sort products'
            className='border-brand-sand text-brand-black focus:border-brand-orange cursor-pointer rounded-full border bg-white px-5 py-3 text-sm font-medium focus:outline-none'
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filters */}
        <div className='mb-6 sm:mb-8'>
          <div className='-mx-4 flex flex-nowrap items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0'>
            <span className='text-brand-brown shrink-0 text-sm font-semibold'>Category:</span>
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors ${
                  category === cat
                    ? 'bg-brand-black text-white'
                    : 'text-brand-brown hover:bg-brand-sand/50 border-brand-sand border bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter badges */}
        {(category !== 'All' || debouncedSearch.trim() || sort !== 'newest') && (
          <div className='mb-6 flex flex-wrap items-center gap-2 text-xs'>
            <span className='text-brand-brown/70 font-semibold'>Filtered by:</span>
            {category !== 'All' && (
              <button
                type='button'
                onClick={() => setCategory('All')}
                className='border-brand-sand bg-brand-sand/40 hover:bg-brand-sand inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium text-brand-black transition-colors'
              >
                Category: {category}
                <span className='text-brand-brown/60 font-bold'>✕</span>
              </button>
            )}
            {debouncedSearch.trim() && (
              <button
                type='button'
                onClick={() => setSearch('')}
                className='border-brand-sand bg-brand-sand/40 hover:bg-brand-sand inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium text-brand-black transition-colors'
              >
                Search: &quot;{debouncedSearch.trim()}&quot;
                <span className='text-brand-brown/60 font-bold'>✕</span>
              </button>
            )}
            {sort !== 'newest' && (
              <button
                type='button'
                onClick={() => setSort('newest')}
                className='border-brand-sand bg-brand-sand/40 hover:bg-brand-sand inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium text-brand-black transition-colors'
              >
                Sort: {SORT_OPTIONS.find((s) => s.value === sort)?.label}
                <span className='text-brand-brown/60 font-bold'>✕</span>
              </button>
            )}
            <button
              type='button'
              onClick={resetFilters}
              className='text-brand-orange hover:text-brand-gold ml-1 font-semibold underline'
            >
              Clear all
            </button>
          </div>
        )}

        <p className='text-brand-brown/70 mb-6 text-sm'>
          Showing{' '}
          <span className='text-brand-black font-semibold'>
            {Math.min(displayLimit, filtered.length)}
          </span>{' '}
          of <span className='text-brand-black font-semibold'>{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'style' : 'styles'}
        </p>

        {filtered.length > 0 ? (
          <>
            <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'>
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
              <div className='mt-10 text-center'>
                <button
                  type='button'
                  onClick={() => setDisplayLimit((prev) => prev + PAGE_SIZE)}
                  className='border-brand-sand text-brand-black hover:border-brand-orange hover:text-brand-orange inline-flex items-center justify-center gap-2 rounded-full border bg-white px-8 py-3.5 text-sm font-bold shadow-sm transition-colors'
                >
                  Load More Styles ({filtered.length - displayLimit} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className='py-20 text-center'>
            <p className='text-brand-brown/60 mb-4 text-lg'>
              No styles found matching your filters.
            </p>
            <button
              onClick={resetFilters}
              className='bg-brand-orange hover:bg-brand-gold inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-colors'
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className='from-brand-brown to-brand-black mt-16 rounded-2xl bg-gradient-to-r p-8 text-center sm:p-12'>
          <h3 className='font-display mb-3 text-2xl font-bold text-white sm:text-3xl'>
            Can&apos;t Find What You Need?
          </h3>
          <p className='text-brand-cream/70 mx-auto mb-6 max-w-xl'>
            We have more styles not listed here. Message us your requirements and we&apos;ll source
            or produce them for you.
          </p>
          <a
            href={siteWhatsAppLink(
              siteContent,
              "Hello Jack, I'm looking for specific styles not in your catalog. Can you help?"
            )}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#20BA5A]'
          >
            <WhatsAppIcon className='h-5 w-5' />
            Ask on WhatsApp
          </a>
        </div>

        {showBackToTop && (
          <button
            type='button'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='border-brand-sand/80 bg-white/95 text-brand-black hover:bg-brand-black hover:text-white fixed right-4 bottom-20 z-40 flex h-10 w-10 items-center justify-center rounded-full border shadow-xl backdrop-blur transition-all active:scale-95 md:right-8 md:bottom-8'
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
