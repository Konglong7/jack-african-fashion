'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { InquiryItem } from '@/lib/inquiry';
import { buildInquiryMessage, INQUIRY_STORAGE_KEY, notifyInquiryUpdated } from '@/lib/inquiry';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { WhatsAppIcon } from '@/components/Icons';

export function InquiryClient({ siteContent }: { siteContent: SiteContent }) {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setItems(readItems());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(items));
    notifyInquiryUpdated(window);
  }, [items, loaded]);

  const message = useMemo(() => buildInquiryMessage(items), [items]);
  const totalPieces = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || item.moq), 0),
    [items]
  );

  function updateItem(id: string, patch: Partial<InquiryItem>) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, ...patch, quantity: Math.max(item.moq, patch.quantity || item.quantity) }
          : item
      )
    );
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function handleCopyMessage() {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleClearList() {
    if (
      typeof window !== 'undefined' &&
      window.confirm('Are you sure you want to clear your inquiry list?')
    ) {
      setItems([]);
    }
  }

  return (
    <section className='bg-brand-cream py-10 sm:py-14'>
      <div className='mx-auto max-w-5xl px-4'>
        <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>
              Wholesale inquiry
            </p>
            <h1 className='font-display text-brand-black mt-2 text-3xl font-bold sm:text-4xl'>
              Inquiry List
            </h1>
            <p className='text-brand-brown/70 mt-2 max-w-2xl text-sm'>
              Confirm color, size and quantity before sending everything to WhatsApp.
            </p>
          </div>
          <Link
            href='/catalog'
            className='border-brand-sand text-brand-brown hover:border-brand-orange hover:text-brand-orange inline-flex items-center justify-center rounded-full border bg-white px-5 py-2.5 text-sm font-bold shadow-sm transition-colors'
          >
            Add More Styles
          </Link>
        </div>

        {items.length === 0 ? (
          <div className='bg-white px-6 py-16 text-center shadow-sm'>
            <h2 className='text-brand-black text-xl font-bold'>No styles selected yet</h2>
            <p className='text-brand-brown/65 mx-auto mt-2 max-w-md text-sm'>
              Browse the catalog and add styles you want to quote together.
            </p>
            <Link
              href='/catalog'
              className='bg-brand-black hover:bg-brand-orange mt-6 inline-flex rounded-full px-6 py-3 text-sm font-bold text-white transition-colors'
            >
              View Products
            </Link>
          </div>
        ) : (
          <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]'>
            <div className='space-y-3'>
              {items.map((item, index) => (
                <article
                  key={item.id}
                  className='grid gap-4 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-[88px_minmax(0,1fr)]'
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className='bg-brand-sand/40 relative aspect-[3/4] overflow-hidden rounded-lg'
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      priority={index === 0}
                      sizes='88px'
                      className='object-cover'
                    />
                  </Link>
                  <div className='min-w-0'>
                    <div className='mb-3 flex items-start justify-between gap-3'>
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className='text-brand-black hover:text-brand-orange font-bold transition-colors'
                        >
                          {item.name}
                        </Link>
                        <p className='text-brand-brown/55 mt-1 text-xs'>Style No: {item.slug}</p>
                      </div>
                      <button
                        type='button'
                        onClick={() => removeItem(item.id)}
                        className='text-brand-brown/45 hover:text-red-600 text-sm font-bold transition-colors'
                      >
                        Remove
                      </button>
                    </div>
                    <div className='grid gap-3 sm:grid-cols-3'>
                      <Field label='Color'>
                        <input
                          value={item.color || ''}
                          onChange={(e) => updateItem(item.id, { color: e.target.value })}
                          placeholder='To confirm'
                          className='input-control'
                        />
                      </Field>
                      <Field label='Size'>
                        <input
                          value={item.size || ''}
                          onChange={(e) => updateItem(item.id, { size: e.target.value })}
                          placeholder='To confirm'
                          className='input-control'
                        />
                      </Field>
                      <Field label={`Qty (MOQ ${item.moq})`}>
                        <div className='border-brand-sand flex items-center overflow-hidden rounded-lg border bg-white'>
                          <button
                            type='button'
                            onClick={() =>
                              updateItem(item.id, {
                                quantity: Math.max(item.moq, (item.quantity || item.moq) - 10)
                              })
                            }
                            disabled={item.quantity <= item.moq}
                            className='hover:bg-brand-sand/30 text-brand-brown px-3 py-2 text-base font-bold transition-colors select-none disabled:opacity-30'
                            aria-label='Decrease quantity by 10'
                          >
                            −
                          </button>
                          <input
                            type='number'
                            min={item.moq}
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, { quantity: Number(e.target.value) })
                            }
                            className='border-brand-sand focus:bg-brand-cream/40 w-full border-x py-2 text-center text-sm font-semibold text-brand-black focus:outline-none'
                          />
                          <button
                            type='button'
                            onClick={() =>
                              updateItem(item.id, {
                                quantity: (item.quantity || item.moq) + 10
                              })
                            }
                            className='hover:bg-brand-sand/30 text-brand-brown px-3 py-2 text-base font-bold transition-colors select-none'
                            aria-label='Increase quantity by 10'
                          >
                            +
                          </button>
                        </div>
                      </Field>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className='bg-brand-black h-max rounded-2xl p-5 text-white shadow-sm lg:sticky lg:top-28'>
              <p className='text-brand-gold text-xs font-bold tracking-[0.18em] uppercase'>
                Ready to quote
              </p>
              <h2 className='mt-2 text-xl font-bold'>
                {items.length} selected style{items.length > 1 ? 's' : ''} · {totalPieces} pcs
              </h2>
              <p className='text-brand-cream/70 mt-2 text-sm'>
                Sends product names, style numbers, quantity, color and size in one message.
              </p>
              <a
                href={siteWhatsAppLink(siteContent, message)}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#20BA5A]'
              >
                <WhatsAppIcon className='h-5 w-5' />
                Send WhatsApp Inquiry
              </a>
              <button
                type='button'
                onClick={handleCopyMessage}
                className='mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20'
              >
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  viewBox='0 0 24 24'
                >
                  <rect width='14' height='14' x='8' y='8' rx='2' ry='2' />
                  <path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
                </svg>
                {copied ? 'Copied to Clipboard!' : 'Copy Inquiry Summary'}
              </button>
              <button
                type='button'
                onClick={handleClearList}
                className='mt-3 w-full rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white'
              >
                Clear List
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className='block'>
      <span className='text-brand-brown/65 mb-1 block text-xs font-bold'>{label}</span>
      {children}
    </label>
  );
}

function readItems(): InquiryItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(INQUIRY_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
