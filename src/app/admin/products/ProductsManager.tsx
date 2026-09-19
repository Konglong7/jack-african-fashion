'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/db';
import type { ReadinessStatus } from '@/lib/productReadiness';
import { getReadinessSummary } from '@/lib/productReadiness';
import { ProductEditor } from './ProductEditor';

/**
 * Client-side manager for the product table:
 * - Search / filter
 * - Add / edit (via modal editor)
 * - Delete with confirm
 * - Image-first grid with right-click category quick-assign
 * - Re-syncs from server after every mutation
 */
export function ProductsManager({
  initialProducts,
  initialCategories
}: {
  initialProducts: Product[];
  initialCategories: string[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState<ReadinessStatus | ''>('');
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [savingCategoryId, setSavingCategoryId] = useState('');
  const [categoryMenu, setCategoryMenu] = useState<{
    product: Product;
    x: number;
    y: number;
  } | null>(null);

  const categories = Array.from(
    new Set([...initialCategories, ...products.map((p) => p.category)])
  );

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.category === filterCat;
    const matchStatus = !filterStatus || getReadinessSummary(p).status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  // Close the category menu on Escape, scroll, or any click outside the menu.
  useEffect(() => {
    if (!categoryMenu) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setCategoryMenu(null);
    }
    function onScroll() {
      setCategoryMenu(null);
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [categoryMenu]);

  async function refresh() {
    setError('');
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to refresh products');
      if (data.products) setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh products');
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    setError('');
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error || 'Failed to delete product');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setDeletingId('');
    }
  }

  async function updateCategory(product: Product, category: string) {
    if (product.category === category) {
      setCategoryMenu(null);
      return;
    }

    setSavingCategoryId(product.id);
    setError('');
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, category })
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || 'Failed to update category');
      }
      setProducts((current) =>
        current.map((item) => (item.id === product.id ? { ...item, category } : item))
      );
      setCategoryMenu(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setSavingCategoryId('');
    }
  }

  function handleSaved() {
    setEditing(null);
    refresh();
  }

  return (
    <div className='mx-auto max-w-7xl'>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>
            Merchandising
          </p>
          <h1 className='text-brand-black mt-1 text-2xl font-bold sm:text-3xl'>Products</h1>
          <p className='text-brand-brown/60 mt-1 text-sm'>
            {products.length} total · {filtered.length} shown · right-click a card to reclassify
          </p>
        </div>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <button
            onClick={refresh}
            className='border-brand-sand text-brand-brown hover:border-brand-orange hover:text-brand-orange inline-flex items-center justify-center rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold whitespace-nowrap'
          >
            Refresh
          </button>
          <button
            onClick={() => setEditing('new')}
            className='bg-brand-orange hover:bg-brand-gold inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors'
          >
            <svg
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              viewBox='0 0 24 24'
            >
              <path d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {error && (
        <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600'>
          {error}
        </div>
      )}

      <div className='mb-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px]'>
        <input
          type='text'
          placeholder='Search by name or slug...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='border-brand-sand text-brand-black focus:ring-brand-orange flex-1 rounded-lg border bg-white px-4 py-2.5 text-sm focus:ring-2 focus:outline-none'
        />
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className='border-brand-sand text-brand-black focus:ring-brand-orange rounded-lg border bg-white px-4 py-2.5 text-sm focus:ring-2 focus:outline-none'
        >
          <option value=''>All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ReadinessStatus | '')}
          className='border-brand-sand text-brand-black focus:ring-brand-orange rounded-lg border bg-white px-4 py-2.5 text-sm focus:ring-2 focus:outline-none'
        >
          <option value=''>All statuses</option>
          <option value='ready'>Ready</option>
          <option value='needs-info'>Needs info</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className='text-brand-brown/50 rounded-xl bg-white py-16 text-center text-sm'>
          No products found.
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
          {filtered.map((p) => (
            <ProductAdminCard
              key={p.id}
              product={p}
              savingCategory={savingCategoryId === p.id}
              onContextMenu={(event) => {
                event.preventDefault();
                setCategoryMenu({ product: p, x: event.clientX, y: event.clientY });
              }}
              onOpenCategoryMenu={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                setCategoryMenu({ product: p, x: rect.left, y: rect.bottom + 8 });
              }}
              onEdit={() => setEditing(p)}
              onDelete={() => handleDelete(p.id, p.name)}
              deleting={deletingId === p.id}
            />
          ))}
        </div>
      )}

      {categoryMenu && (
        <CategoryMenu
          product={categoryMenu.product}
          x={categoryMenu.x}
          y={categoryMenu.y}
          categories={categories}
          savingCategory={savingCategoryId === categoryMenu.product.id}
          onPick={(category) => updateCategory(categoryMenu.product, category)}
          onClose={() => setCategoryMenu(null)}
        />
      )}

      {/* Editor modal */}
      {editing && (
        <ProductEditor
          key={editing === 'new' ? 'new' : editing.id}
          product={editing === 'new' ? null : editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

function ProductAdminCard({
  product,
  savingCategory,
  deleting,
  onContextMenu,
  onOpenCategoryMenu,
  onEdit,
  onDelete
}: {
  product: Product;
  savingCategory: boolean;
  deleting: boolean;
  onContextMenu: (event: React.MouseEvent) => void;
  onOpenCategoryMenu: (event: React.MouseEvent) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className='bg-brand-sand/30 overflow-hidden rounded-xl bg-white shadow-sm'>
      <div
        className='group relative cursor-pointer bg-brand-sand/40'
        onContextMenu={onContextMenu}
        onClick={onOpenCategoryMenu}
        title='Right-click to change category'
      >
        <div className='relative aspect-[3/4]'>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'
            className='object-cover'
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = '0.3';
            }}
          />
        </div>
        <div className='bg-brand-black/70 absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-2 opacity-0 transition-opacity group-hover:opacity-100'>
          <span className='text-[11px] font-medium text-white/90'>Change category</span>
          <span className='text-brand-gold text-xs'>▾</span>
        </div>
      </div>

      <div className='space-y-2 p-3'>
        <div className='min-w-0'>
          <p className='text-brand-black truncate text-sm font-semibold'>{product.name}</p>
          <p className='text-brand-brown/50 truncate text-xs'>{product.slug}</p>
        </div>

        <span className='bg-brand-cream text-brand-brown inline-block max-w-full truncate rounded-full px-2 py-0.5 text-xs font-medium'>
          {product.category}
        </span>

        <PublishingStatus product={product} />

        <div className='flex flex-wrap gap-1.5 pt-1'>
          <Link
            href={`/products/${product.slug}`}
            target='_blank'
            className='text-brand-brown hover:text-brand-orange hover:bg-brand-sand/30 rounded-lg px-2 py-1 text-xs font-bold transition-colors'
          >
            Open
          </Link>
          <button
            onClick={onOpenCategoryMenu}
            disabled={savingCategory}
            className='text-brand-orange hover:bg-brand-sand/30 rounded-lg px-2 py-1 text-xs font-bold transition-colors disabled:opacity-50'
          >
            {savingCategory ? 'Saving' : 'Category'}
          </button>
          <button
            onClick={onEdit}
            className='text-brand-brown hover:text-brand-orange hover:bg-brand-sand/30 rounded-lg px-2 py-1 text-xs font-bold transition-colors'
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            className='text-brand-brown/60 hover:bg-red-50 hover:text-red-600 rounded-lg px-2 py-1 text-xs font-bold transition-colors disabled:opacity-50'
            aria-label='Delete'
          >
            {deleting ? '…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryMenu({
  product,
  x,
  y,
  categories,
  savingCategory,
  onPick,
  onClose
}: {
  product: Product;
  x: number;
  y: number;
  categories: string[];
  savingCategory: boolean;
  onPick: (category: string) => void;
  onClose: () => void;
}) {
  // ponytail: client-only clamp; this menu only renders on interaction.
  const left = Math.min(x, window.innerWidth - 260);
  const top = Math.min(y, window.innerHeight - 320);

  return (
    <div
      className='fixed z-50 w-60 overflow-hidden rounded-xl border border-brand-sand bg-white shadow-xl'
      style={{ left, top }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className='border-brand-sand flex items-center justify-between border-b px-3 py-2'>
        <div className='min-w-0'>
          <p className='text-brand-black truncate text-sm font-bold'>{product.name}</p>
          <p className='text-brand-brown/60 truncate text-xs'>Now: {product.category}</p>
        </div>
        <button
          onClick={onClose}
          className='text-brand-brown/60 hover:text-brand-black shrink-0 px-1 text-lg leading-none'
          aria-label='Close'
        >
          ×
        </button>
      </div>
      <ul className='max-h-64 overflow-y-auto py-1'>
        {categories.map((category) => {
          const active = category === product.category;
          return (
            <li key={category}>
              <button
                onClick={() => onPick(category)}
                disabled={savingCategory}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors disabled:opacity-50 ${
                  active
                    ? 'bg-brand-cream text-brand-black font-bold'
                    : 'text-brand-brown hover:bg-brand-cream/60'
                }`}
              >
                <span className='truncate'>{category}</span>
                {active && <span className='text-brand-emerald shrink-0'>✓</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PublishingStatus({ product }: { product: Product }) {
  const summary = getReadinessSummary(product);
  const ready = summary.status === 'ready';

  return (
    <div className='space-y-1'>
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          ready
            ? 'bg-brand-emerald/10 text-brand-emerald'
            : 'bg-brand-gold/10 text-brand-brown'
        }`}
      >
        {summary.label}
      </span>
      {summary.missing.length > 0 && (
        <p className='text-brand-brown/55 max-w-[220px] text-xs leading-relaxed'>
          Next:{' '}
          {summary.missing
            .slice(0, 2)
            .map((item) => item.label)
            .join(', ')}
          {summary.missing.length > 2 ? ` +${summary.missing.length - 2}` : ''}
        </p>
      )}
    </div>
  );
}
