'use client';

import { useRef, useState } from 'react';
import type { Product, Category, StockType } from '@/lib/db';
import { UploadIcon, XIcon } from '@/components/Icons';
import type { ReadinessItem } from '@/lib/productReadiness';
import { getReadinessSummary } from '@/lib/productReadiness';
import { DEFAULT_PRODUCT_COLORS, DEFAULT_PRODUCT_SIZES } from '@/lib/productDefaults';

const TABS = [
  { id: 'basic', label: 'Essentials', helper: 'Name, category, selling copy' },
  { id: 'media', label: 'Media', helper: 'Cover, gallery, detail story' },
  { id: 'purchase', label: 'Buying', helper: 'MOQ, stock, size and color' },
  { id: 'decoration', label: 'Story', helper: 'Specs, sizing, logistics, FAQ' },
  { id: 'seo', label: 'Conversion', helper: 'WhatsApp inquiry copy' }
] as const;

type EditorTab = (typeof TABS)[number]['id'];
type DetailPageDraft = NonNullable<Product['detailPage']>;
type DetailSectionLayout = NonNullable<DetailPageDraft['detailSections']>[number]['layout'];

interface Props {
  product: Product | null;
  categories: string[];
  onClose: () => void;
  onSaved: () => void;
}

export function ProductEditor({ product, categories, onClose, onSaved }: Props) {
  const isNew = !product;
  const [activeTab, setActiveTab] = useState<EditorTab>('basic');
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category: product?.category || (categories[0] as Category) || 'Pleated Dresses',
    image: product?.image || '',
    images: (product?.images || []).join('\n'),
    priceMin: product?.priceMin || '',
    priceMax: product?.priceMax || '',
    moq: product?.moq || 30,
    moqOptions: (product?.moqOptions || [30, 100, 300]).join(', '),
    stockType: product?.stockType || ('Ready Stock & Custom' as StockType),
    tags: (product?.tags || []).join(', '),
    sizes: product?.sizes || DEFAULT_PRODUCT_SIZES,
    colors: product?.colors || DEFAULT_PRODUCT_COLORS,
    description: product?.description || '',
    features: (product?.features || []).join('\n'),
    whatsappMessage: product?.whatsappMessage || '',
    isNew: Boolean(product?.isNew),
    isPopular: Boolean(product?.isPopular),
    detailPage: getInitialDetailPage(product)
  });
  const [customSize, setCustomSize] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryImages = splitLines(form.images);
  const allMediaImages = uniqueValues([form.image.trim(), ...galleryImages].filter(Boolean));
  const draftProduct: Product = {
    id: product?.id || 'draft',
    ...buildProductPayload()
  };
  const readiness = getReadinessSummary(draftProduct);

  function buildProductPayload(): Omit<Product, 'id'> {
    const slug = form.slug.trim() || slugifyLocal(form.name) || 'new-product';
    return {
      slug,
      name: form.name.trim() || 'New product',
      category: form.category,
      image: form.image.trim() || `/images/products/${slug}.jpg`,
      images: galleryImages,
      priceMin: Number(form.priceMin) || undefined,
      priceMax: Number(form.priceMax) || undefined,
      moq: Number(form.moq),
      moqOptions: form.moqOptions
        .split(',')
        .map((item) => Number(item.trim()))
        .filter((item) => item > 0),
      stockType: form.stockType,
      tags: form.tags
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      sizes: form.sizes,
      colors: form.colors.filter((color) => color.name.trim()),
      description: form.description.trim(),
      features: splitLines(form.features),
      whatsappMessage: form.whatsappMessage.trim(),
      isNew: form.isNew,
      isPopular: form.isPopular,
      detailPage: form.detailPage
    };
  }

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setDetail<K extends keyof DetailPageDraft>(key: K, value: DetailPageDraft[K]) {
    setForm((current) => ({
      ...current,
      detailPage: { ...current.detailPage, [key]: value }
    }));
  }

  function toggleSize(size: string) {
    setForm((current) => {
      const hasSize = current.sizes.includes(size);
      return {
        ...current,
        sizes: hasSize ? current.sizes.filter((item) => item !== size) : [...current.sizes, size]
      };
    });
  }

  function addCustomSize() {
    const size = customSize.trim();
    if (size && !form.sizes.includes(size)) {
      set('sizes', [...form.sizes, size]);
      setCustomSize('');
    }
  }

  function updateColor(index: number, field: 'name' | 'hex', value: string) {
    setForm((current) => {
      const colors = [...current.colors];
      colors[index] = { ...colors[index], [field]: value };
      return { ...current, colors };
    });
  }

  function applyTemplate(template: 'ready' | 'custom' | 'plus') {
    const templates = {
      ready: getReadyStockTemplate(),
      custom: getCustomStyleTemplate(),
      plus: getPlusSizeTemplate()
    };
    set('detailPage', templates[template]);
  }

  function setCoverImage(image: string) {
    setForm((current) => {
      const images = uniqueValues([image, ...splitLines(current.images)]);
      return { ...current, image, images: images.join('\n') };
    });
  }

  function removeGalleryImage(image: string) {
    setForm((current) => {
      const images = splitLines(current.images).filter((item) => item !== image);
      const nextCover = current.image === image ? images[0] || '' : current.image;
      return { ...current, image: nextCover, images: images.join('\n') };
    });
  }

  function goToReadinessItem(item: ReadinessItem) {
    setActiveTab(getStepForReadinessItem(item));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const slug = form.slug.trim() || slugifyLocal(form.name);
    if (slug) formData.append('slug', slug);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.ok && data.uploaded?.length) {
        const newUrls = data.uploaded.map((file: { url: string }) => file.url);
        const existing = form.images.split('\n').filter(Boolean);
        set('images', [...existing, ...newUrls].join('\n'));
        if (!form.image.trim() && newUrls[0]) set('image', newUrls[0]);
      } else {
        setError(data.errors?.[0] || 'Upload failed');
      }
    } catch {
      setError('Network error during upload');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!form.name.trim()) {
      setError('Product name is required');
      setSaving(false);
      setActiveTab('basic');
      return;
    }

    const payload = buildProductPayload();

    try {
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${product!.id}`;
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || 'Save failed');
        setSaving(false);
        return;
      }
      onSaved();
    } catch {
      setError('Network error');
      setSaving(false);
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-0 sm:items-center sm:p-4'>
      <div className='min-h-screen w-full overflow-y-auto bg-white shadow-2xl sm:max-h-[92vh] sm:min-h-0 sm:max-w-7xl sm:rounded-xl'>
        <div className='border-brand-sand sticky top-0 z-30 border-b bg-white'>
          <div className='flex items-center justify-between gap-4 px-5 py-4 sm:px-6'>
            <div>
              <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>
                Product publishing
              </p>
              <h2 className='text-brand-black mt-1 text-lg font-bold'>
                {isNew ? 'List a new product' : `Edit ${product.name}`}
              </h2>
              <p className='text-brand-brown/60 text-xs'>
                Build the buyer-facing product sheet from the essentials outward.
              </p>
            </div>
            <button
              onClick={onClose}
              className='text-brand-brown hover:bg-brand-cream hover:text-brand-black rounded-lg p-2'
              aria-label='Close'
            >
              <XIcon className='h-6 w-6' />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='grid lg:grid-cols-[220px_minmax(0,1fr)_280px]'>
          <aside className='border-brand-sand bg-brand-cream/60 border-b p-4 lg:border-r lg:border-b-0'>
            <div className='flex gap-2 overflow-x-auto lg:sticky lg:top-24 lg:block lg:space-y-2 lg:overflow-visible'>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type='button'
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-w-[160px] rounded-lg px-3 py-3 text-left transition-colors lg:w-full ${
                    activeTab === tab.id
                      ? 'bg-brand-black text-white shadow-sm'
                      : 'text-brand-brown hover:bg-brand-sand/60 bg-white'
                  }`}
                >
                  <span className='block text-sm font-bold'>{tab.label}</span>
                  <span
                    className={`mt-0.5 block text-xs ${activeTab === tab.id ? 'text-white/70' : 'text-brand-brown/55'}`}
                  >
                    {tab.helper}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <main className='min-w-0 space-y-5 p-5 sm:p-6 lg:p-8'>
            {error && (
              <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600'>
                {error}
              </div>
            )}

            {activeTab === 'basic' && (
              <Panel
                title='Essentials'
                body='The minimum buyer-facing information needed to create a usable listing.'
              >
                <Field label='Product Name *'>
                  <input
                    type='text'
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    required
                    className='input-control'
                    placeholder='Elegant Pleated Maxi Dress'
                  />
                </Field>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <Field label='Slug (URL)' hint='Auto-generated from name if empty'>
                    <input
                      type='text'
                      value={form.slug}
                      onChange={(e) => set('slug', e.target.value)}
                      className='input-control font-mono'
                      placeholder='auto-generated'
                    />
                  </Field>
                  <Field label='Category *'>
                    <select
                      value={form.category}
                      onChange={(e) => set('category', e.target.value as Category)}
                      className='input-control bg-white'
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label='Tags' hint='comma-separated'>
                  <input
                    type='text'
                    value={form.tags}
                    onChange={(e) => set('tags', e.target.value)}
                    className='input-control'
                    placeholder='Pleated, Maxi, Best Seller'
                  />
                </Field>
                <Field label='Short Description'>
                  <textarea
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    rows={4}
                    className='input-control resize-none'
                  />
                </Field>
                <Field label='Key Features' hint='one per line'>
                  <textarea
                    value={form.features}
                    onChange={(e) => set('features', e.target.value)}
                    rows={4}
                    className='input-control resize-none'
                  />
                </Field>
              </Panel>
            )}

            {activeTab === 'media' && (
              <Panel
                title='Media'
                body='Upload the cover, back, and detail photos here. Pick the cover, then add any long-detail images used in the product story.'
              >
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleUpload}
                  className='hidden'
                />
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className='border-brand-sand text-brand-brown hover:border-brand-orange flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-4 text-sm font-semibold transition-colors disabled:opacity-50'
                >
                  <UploadIcon className='h-5 w-5' />
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </button>
                <MediaManager
                  cover={form.image}
                  images={allMediaImages}
                  onSetCover={setCoverImage}
                  onRemove={removeGalleryImage}
                />
                <div className='border-brand-sand bg-brand-cream/30 rounded-lg border p-4'>
                  <p className='text-brand-black text-sm font-bold'>Advanced image paths</p>
                  <p className='text-brand-brown/60 mt-1 text-xs'>
                    Use this only when pasting image URLs from an existing upload or migration.
                  </p>
                  <div className='mt-4 space-y-4'>
                    <Field label='Main image path'>
                      <input
                        value={form.image}
                        onChange={(e) => set('image', e.target.value)}
                        className='input-control font-mono'
                      />
                    </Field>
                    <Field label='Gallery images' hint='one URL per line'>
                      <textarea
                        value={form.images}
                        onChange={(e) => set('images', e.target.value)}
                        rows={4}
                        className='input-control resize-none font-mono'
                      />
                    </Field>
                  </div>
                </div>
                <DetailSectionsEditor
                  sections={form.detailPage.detailSections || []}
                  onChange={(sections) => setDetail('detailSections', sections)}
                />
              </Panel>
            )}

            {activeTab === 'purchase' && (
              <Panel
                title='Buying'
                body='Wholesale quantities, stock mode, size range, and color cards.'
              >
                <div className='grid gap-4 sm:grid-cols-2'>
                  <Field label='Price Min (USD)'>
                    <input
                      type='number'
                      step='0.01'
                      min={0}
                      value={form.priceMin}
                      onChange={(e) => set('priceMin', e.target.value)}
                      className='input-control'
                      placeholder='6.80'
                    />
                  </Field>
                  <Field label='Price Max (USD)'>
                    <input
                      type='number'
                      step='0.01'
                      min={0}
                      value={form.priceMax}
                      onChange={(e) => set('priceMax', e.target.value)}
                      className='input-control'
                      placeholder='9.50'
                    />
                  </Field>
                </div>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <Field label='MOQ (pcs) *'>
                    <input
                      type='number'
                      value={form.moq}
                      onChange={(e) => set('moq', Number(e.target.value))}
                      min={1}
                      required
                      className='input-control'
                    />
                  </Field>
                  <Field label='MOQ Options' hint='comma-separated: 30, 100, 300'>
                    <input
                      value={form.moqOptions}
                      onChange={(e) => set('moqOptions', e.target.value)}
                      className='input-control'
                    />
                  </Field>
                </div>
                <SizeSelector
                  sizes={form.sizes}
                  customSize={customSize}
                  setCustomSize={setCustomSize}
                  toggleSize={toggleSize}
                  addCustomSize={addCustomSize}
                  removeSize={(size) =>
                    set(
                      'sizes',
                      form.sizes.filter((item) => item !== size)
                    )
                  }
                />
                <ColorEditor
                  colors={form.colors}
                  updateColor={updateColor}
                  addColor={() => set('colors', [...form.colors, { name: '', hex: '#000000' }])}
                  removeColor={(index) =>
                    set(
                      'colors',
                      form.colors.length > 1
                        ? form.colors.filter((_, itemIndex) => itemIndex !== index)
                        : form.colors
                    )
                  }
                />
              </Panel>
            )}

            {activeTab === 'decoration' && (
              <Panel
                title='Product story'
                body='Reusable sections for a stronger Alibaba/1688-style product detail page.'
              >
                <div className='grid gap-3 sm:grid-cols-3'>
                  <TemplateButton
                    label='Ready Stock Dress'
                    onClick={() => applyTemplate('ready')}
                  />
                  <TemplateButton label='Custom Style' onClick={() => applyTemplate('custom')} />
                  <TemplateButton
                    label='Plus Size Bestseller'
                    onClick={() => applyTemplate('plus')}
                  />
                </div>
                <SpecEditor
                  specs={form.detailPage.specs || []}
                  onChange={(specs) => setDetail('specs', specs)}
                />
                <FaqEditor
                  faq={form.detailPage.faq || []}
                  onChange={(faq) => setDetail('faq', faq)}
                />
              </Panel>
            )}

            {activeTab === 'seo' && (
              <Panel title='Conversion' body='Pre-filled inquiry text and page readiness notes.'>
                <Field
                  label='WhatsApp Message'
                  hint='pre-filled when customer clicks Ask for Price'
                >
                  <textarea
                    value={form.whatsappMessage}
                    onChange={(e) => set('whatsappMessage', e.target.value)}
                    rows={4}
                    className='input-control resize-none'
                  />
                </Field>
                <div className='grid gap-3 sm:grid-cols-2'>
                  {getCompletionHints({
                    detailPage: form.detailPage,
                    images: splitLines(form.images),
                    whatsappMessage: form.whatsappMessage
                  }).map((hint) => (
                    <div
                      key={hint.label}
                      className={`border p-4 ${hint.ok ? 'border-brand-emerald/30 bg-brand-emerald/5' : 'border-brand-gold/40 bg-brand-gold/10'}`}
                    >
                      <p
                        className={`text-sm font-bold ${hint.ok ? 'text-brand-emerald' : 'text-brand-brown'}`}
                      >
                        {hint.label}
                      </p>
                      <p className='text-brand-brown/70 mt-1 text-xs'>{hint.message}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            )}
          </main>

          <aside className='border-brand-sand border-t bg-white p-5 lg:border-t-0 lg:border-l'>
            <PublishChecklist readiness={readiness} onJump={goToReadinessItem} />
          </aside>

          <div className='border-brand-sand sticky bottom-0 z-20 col-span-full flex gap-3 border-t bg-white p-4 shadow-[0_-12px_30px_rgba(0,0,0,0.05)]'>
            <button
              type='button'
              onClick={onClose}
              className='border-brand-sand text-brand-brown hover:bg-brand-cream flex-1 rounded-lg border py-3 text-sm font-semibold'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={saving}
              className='bg-brand-orange hover:bg-brand-gold flex-1 rounded-lg py-3 text-sm font-bold text-white transition-colors disabled:opacity-50'
            >
              {saving ? 'Saving...' : isNew ? 'Publish product' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Panel({
  title,
  body,
  children
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section className='space-y-5'>
      <div>
        <h3 className='text-brand-black text-xl font-bold'>{title}</h3>
        <p className='text-brand-brown/60 mt-1 text-sm'>{body}</p>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className='text-brand-brown mb-1 block text-sm font-semibold'>{label}</label>
      {children}
      {hint && <p className='text-brand-brown/50 mt-1 text-xs'>{hint}</p>}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className='flex cursor-pointer items-center gap-2'>
      <input
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className='accent-brand-orange h-4 w-4'
      />
      <span className='text-brand-brown text-sm'>{label}</span>
    </label>
  );
}

function MediaManager({
  cover,
  images,
  onSetCover,
  onRemove
}: {
  cover: string;
  images: string[];
  onSetCover: (image: string) => void;
  onRemove: (image: string) => void;
}) {
  if (images.length === 0) {
    return (
      <div className='border-brand-sand bg-brand-cream/40 text-brand-brown/70 rounded-lg border p-5 text-sm'>
        No product photos yet. Upload images to create the gallery and choose a cover.
      </div>
    );
  }

  return (
    <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
      {images.map((image) => {
        const isCover = image === cover;
        return (
          <div key={image} className='border-brand-sand overflow-hidden rounded-lg border bg-white'>
            <div className='bg-brand-cream relative aspect-[3/4]'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt='' className='h-full w-full object-cover' />
              {isCover && (
                <span className='bg-brand-black absolute top-2 left-2 rounded-full px-2 py-1 text-[11px] font-bold text-white'>
                  Cover
                </span>
              )}
            </div>
            <div className='space-y-2 p-3'>
              <p className='text-brand-brown/60 truncate font-mono text-[11px]'>{image}</p>
              <div className='grid grid-cols-2 gap-2'>
                <button
                  type='button'
                  onClick={() => onSetCover(image)}
                  className='border-brand-sand text-brand-brown hover:border-brand-orange hover:text-brand-orange rounded-md border px-2 py-2 text-xs font-bold'
                >
                  Set cover
                </button>
                <button
                  type='button'
                  onClick={() => onRemove(image)}
                  className='rounded-md border border-red-100 px-2 py-2 text-xs font-bold text-red-600 hover:bg-red-50'
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PublishChecklist({
  readiness,
  onJump
}: {
  readiness: ReturnType<typeof getReadinessSummary>;
  onJump: (item: ReadinessItem) => void;
}) {
  const ready = readiness.status === 'ready';

  return (
    <div className='lg:sticky lg:top-24'>
      <p className='text-brand-brown/50 text-xs font-bold tracking-[0.18em] uppercase'>
        Publish check
      </p>
      <div
        className={`mt-3 rounded-lg border p-4 ${ready ? 'border-brand-emerald/30 bg-brand-emerald/5' : 'border-brand-gold/40 bg-brand-gold/10'}`}
      >
        <p className={`text-sm font-bold ${ready ? 'text-brand-emerald' : 'text-brand-brown'}`}>
          {readiness.label}
        </p>
        <p className='text-brand-brown/70 mt-1 text-xs leading-relaxed'>
          {ready
            ? 'This product has the key information buyers expect before asking for price.'
            : 'Finish the missing tasks below before treating this listing as complete.'}
        </p>
      </div>

      <div className='mt-4 space-y-2'>
        {readiness.missing.length === 0 ? (
          <div className='border-brand-emerald/20 text-brand-emerald rounded-lg border bg-white p-3 text-xs font-semibold'>
            All core publishing tasks are complete.
          </div>
        ) : (
          readiness.missing.map((item) => (
            <button
              key={item.key}
              type='button'
              onClick={() => onJump(item)}
              className='border-brand-sand hover:border-brand-orange w-full rounded-lg border bg-white p-3 text-left'
            >
              <span className='text-brand-black block text-sm font-bold'>{item.label}</span>
              <span className='text-brand-brown/60 mt-1 block text-xs leading-relaxed'>
                {item.message}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function TemplateButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='border-brand-sand bg-brand-cream text-brand-brown hover:border-brand-orange hover:text-brand-orange rounded-lg border px-4 py-3 text-sm font-bold'
    >
      {label}
    </button>
  );
}

function SizeSelector({
  sizes,
  customSize,
  setCustomSize,
  toggleSize,
  addCustomSize,
  removeSize
}: {
  sizes: string[];
  customSize: string;
  setCustomSize: (value: string) => void;
  toggleSize: (size: string) => void;
  addCustomSize: () => void;
  removeSize: (size: string) => void;
}) {
  return (
    <div className='space-y-3'>
      <label className='text-brand-brown block text-sm font-semibold'>Sizes</label>
      <div className='flex flex-wrap gap-2'>
        {DEFAULT_PRODUCT_SIZES.map((size) => (
          <button
            key={size}
            type='button'
            onClick={() => toggleSize(size)}
            className={`min-w-[48px] rounded-lg px-3 py-2 text-sm font-semibold ${sizes.includes(size) ? 'bg-brand-orange text-white' : 'border-brand-sand text-brand-brown hover:border-brand-orange border'}`}
          >
            {size}
          </button>
        ))}
      </div>
      <div className='flex gap-2'>
        <input
          value={customSize}
          onChange={(e) => setCustomSize(e.target.value)}
          className='input-control'
          placeholder='Add custom size'
        />
        <button
          type='button'
          onClick={addCustomSize}
          className='bg-brand-sand text-brand-brown rounded-lg px-4 text-sm font-semibold'
        >
          Add
        </button>
      </div>
      <div className='flex flex-wrap gap-2'>
        {sizes.map((size) => (
          <span
            key={size}
            className='bg-brand-cream text-brand-brown flex items-center gap-2 rounded-full px-3 py-1 text-sm'
          >
            {size}
            <button
              type='button'
              onClick={() => removeSize(size)}
              className='text-brand-brown/50 hover:text-red-600'
            >
              x
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function ColorEditor({
  colors,
  updateColor,
  addColor,
  removeColor
}: {
  colors: Product['colors'];
  updateColor: (index: number, field: 'name' | 'hex', value: string) => void;
  addColor: () => void;
  removeColor: (index: number) => void;
}) {
  return (
    <div className='space-y-3'>
      <label className='text-brand-brown block text-sm font-semibold'>Colors</label>
      {colors.map((color, index) => (
        <div
          key={index}
          className='border-brand-sand flex items-center gap-3 rounded-lg border p-3'
        >
          <input
            type='color'
            value={color.hex}
            onChange={(e) => updateColor(index, 'hex', e.target.value)}
            className='h-10 w-10 cursor-pointer'
          />
          <input
            value={color.name}
            onChange={(e) => updateColor(index, 'name', e.target.value)}
            className='input-control'
            placeholder='Color name'
          />
          {colors.length > 1 && (
            <button type='button' onClick={() => removeColor(index)} className='px-2 text-red-600'>
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type='button'
        onClick={addColor}
        className='border-brand-sand text-brand-brown hover:border-brand-orange w-full rounded-lg border-2 border-dashed py-3 text-sm font-semibold'
      >
        Add Color
      </button>
    </div>
  );
}

function SpecEditor({
  specs,
  onChange
}: {
  specs: NonNullable<DetailPageDraft['specs']>;
  onChange: (specs: NonNullable<DetailPageDraft['specs']>) => void;
}) {
  return (
    <EditorBlock title='Procurement specs'>
      {specs.map((spec, index) => (
        <div key={index} className='grid gap-3 sm:grid-cols-[1fr_1fr_auto]'>
          <input
            value={spec.label}
            onChange={(e) => onChange(replaceAt(specs, index, { ...spec, label: e.target.value }))}
            className='input-control'
            placeholder='Label, e.g. Lead time'
          />
          <input
            value={spec.value}
            onChange={(e) => onChange(replaceAt(specs, index, { ...spec, value: e.target.value }))}
            className='input-control'
            placeholder='Value'
          />
          <button
            type='button'
            onClick={() => onChange(removeAt(specs, index))}
            className='text-sm font-semibold text-red-600'
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type='button'
        onClick={() => onChange([...specs, { label: '', value: '' }])}
        className='small-add-button'
      >
        Add spec
      </button>
    </EditorBlock>
  );
}

function FaqEditor({
  faq,
  onChange
}: {
  faq: NonNullable<DetailPageDraft['faq']>;
  onChange: (faq: NonNullable<DetailPageDraft['faq']>) => void;
}) {
  return (
    <EditorBlock title='FAQ'>
      {faq.map((item, index) => (
        <div key={index} className='grid gap-3'>
          <input
            value={item.question}
            onChange={(e) => onChange(replaceAt(faq, index, { ...item, question: e.target.value }))}
            className='input-control'
            placeholder='Question'
          />
          <textarea
            value={item.answer}
            onChange={(e) => onChange(replaceAt(faq, index, { ...item, answer: e.target.value }))}
            rows={2}
            className='input-control resize-none'
            placeholder='Answer'
          />
          <button
            type='button'
            onClick={() => onChange(removeAt(faq, index))}
            className='justify-self-start text-sm font-semibold text-red-600'
          >
            Remove FAQ
          </button>
        </div>
      ))}
      <button
        type='button'
        onClick={() => onChange([...faq, { question: '', answer: '' }])}
        className='small-add-button'
      >
        Add FAQ
      </button>
    </EditorBlock>
  );
}

function DetailSectionsEditor({
  sections,
  onChange
}: {
  sections: NonNullable<DetailPageDraft['detailSections']>;
  onChange: (sections: NonNullable<DetailPageDraft['detailSections']>) => void;
}) {
  return (
    <EditorBlock title='Long-detail image/text modules'>
      {sections.map((section, index) => (
        <div key={index} className='border-brand-sand/70 space-y-3 border p-4'>
          <div className='flex items-center justify-between gap-3'>
            <Checkbox
              label='Enabled'
              checked={section.enabled !== false}
              onChange={(checked) =>
                onChange(replaceAt(sections, index, { ...section, enabled: checked }))
              }
            />
            <button
              type='button'
              onClick={() => onChange(removeAt(sections, index))}
              className='text-sm font-semibold text-red-600'
            >
              Remove
            </button>
          </div>
          <input
            value={section.title}
            onChange={(e) =>
              onChange(replaceAt(sections, index, { ...section, title: e.target.value }))
            }
            className='input-control'
            placeholder='Module title'
          />
          <textarea
            value={section.body}
            onChange={(e) =>
              onChange(replaceAt(sections, index, { ...section, body: e.target.value }))
            }
            rows={3}
            className='input-control resize-none'
            placeholder='Module text'
          />
          <input
            value={section.image || ''}
            onChange={(e) =>
              onChange(replaceAt(sections, index, { ...section, image: e.target.value }))
            }
            className='input-control font-mono'
            placeholder='/images/products/detail.jpg'
          />
          <select
            value={section.layout || 'image-left'}
            onChange={(e) =>
              onChange(
                replaceAt(sections, index, {
                  ...section,
                  layout: e.target.value as DetailSectionLayout
                })
              )
            }
            className='input-control bg-white'
          >
            <option value='image-left'>Image left</option>
            <option value='image-right'>Image right</option>
            <option value='full-width'>Full width</option>
          </select>
        </div>
      ))}
      <button
        type='button'
        onClick={() =>
          onChange([
            ...sections,
            { enabled: true, title: '', body: '', image: '', layout: 'image-left' }
          ])
        }
        className='small-add-button'
      >
        Add detail module
      </button>
    </EditorBlock>
  );
}

function EditorBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='border-brand-sand/70 bg-brand-cream/30 space-y-3 border p-4'>
      <h4 className='text-brand-black font-bold'>{title}</h4>
      {children}
    </div>
  );
}

function replaceAt<T>(items: T[], index: number, value: T): T[] {
  return items.map((item, itemIndex) => (itemIndex === index ? value : item));
}

function removeAt<T>(items: T[], index: number): T[] {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueValues(values: string[]): string[] {
  return Array.from(new Set(values));
}

function getStepForReadinessItem(item: ReadinessItem): EditorTab {
  if (item.group === 'media') return 'media';
  if (item.key === 'whatsapp') return 'seo';
  return 'decoration';
}

function slugifyLocal(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getInitialDetailPage(product: Product | null): DetailPageDraft {
  return {
    specs: product?.detailPage?.specs || [],
    faq: product?.detailPage?.faq || [],
    detailSections: product?.detailPage?.detailSections || []
  };
}

function getReadyStockTemplate(): DetailPageDraft {
  return {
    specs: [
      { label: 'Lead time', value: 'Ready stock confirmation before shipment' },
      { label: 'Best for', value: 'Boutique restock and market sellers' }
    ],
    faq: [
      { question: 'Can I mix sizes?', answer: 'Yes, send your preferred ratio before quotation.' },
      {
        question: 'Can I check current stock colors?',
        answer: 'Yes, message us on WhatsApp for live stock photos.'
      }
    ],
    detailSections: []
  };
}

function getCustomStyleTemplate(): DetailPageDraft {
  const template = getReadyStockTemplate();
  return {
    ...template,
    specs: [
      { label: 'Custom MOQ', value: '100 pcs per style' },
      { label: 'Custom scope', value: 'Fabric, color, label, and details by quotation' }
    ],
    faq: [
      {
        question: 'Can you make from my picture?',
        answer:
          'Yes, send clear reference photos, quantity, fabric expectations, and target market.'
      },
      {
        question: 'What affects price?',
        answer: 'Fabric, workmanship, size range, quantity, packing, and delivery method.'
      }
    ]
  };
}

function getPlusSizeTemplate(): DetailPageDraft {
  const template = getReadyStockTemplate();
  return {
    ...template,
    specs: [
      { label: 'Size focus', value: 'XL-5XL plus-size market' },
      { label: 'Buyer profile', value: 'African boutique and curvy fashion sellers' }
    ]
  };
}

function getCompletionHints({
  detailPage,
  images,
  whatsappMessage
}: {
  detailPage: DetailPageDraft;
  images: string[];
  whatsappMessage: string;
}) {
  return [
    {
      label: 'Detail images',
      ok: images.length > 1 || Boolean(detailPage.detailSections?.some((section) => section.image)),
      message: 'Use gallery or long-detail images to create a 1688/Taobao style product story.'
    },
    {
      label: 'WhatsApp copy',
      ok: whatsappMessage.trim().length > 0,
      message: 'A specific WhatsApp message improves inquiry quality.'
    }
  ];
}
