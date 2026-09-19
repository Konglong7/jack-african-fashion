'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DEFAULT_SITE_CONTENT, siteWhatsAppLink, type SiteContent } from '@/lib/siteContentTypes';
import { ProductImage } from './ProductImage';
import { WhatsAppIcon } from './Icons';
import { InquiryAddButton } from './InquiryAddButton';
import { downloadImageFile, getProductImageFilename } from '@/lib/downloadImage';
import type { Product } from '@/lib/db';

interface ProductCardProps {
  product: Product;
  /** Mark as above-the-fold for the LCP image (first 4 items in a grid). */
  priority?: boolean;
  /** Responsive image sizes attribute. */
  sizes?: string;
  siteContent?: SiteContent;
}

export function ProductCard({
  product,
  priority = false,
  sizes,
  siteContent = DEFAULT_SITE_CONTENT
}: ProductCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleQuickDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (downloading) return;
    if (!product.image) return;

    setDownloading(true);
    const filename = getProductImageFilename(product.name, undefined, product.image);
    const ok = await downloadImageFile(product.image, filename);
    setDownloading(false);

    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className='group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.99]'>
      {/* Image container */}
      <div className='bg-brand-sand/30 relative block aspect-[3/4] overflow-hidden'>
        <Link
          href={`/products/${product.slug}`}
          className='absolute inset-0 block'
          aria-label={`View details for ${product.name}`}
        >
          <div className='absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105'>
            <ProductImage
              src={product.image}
              alt={product.name}
              priority={priority}
              sizes={sizes || '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'}
            />
          </div>

          {/* Hover overlay */}
          <div className='absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10' />

          {/* Quick view label on hover — non-interactive */}
          <div className='pointer-events-none absolute right-4 bottom-4 left-4 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
            <div className='text-brand-black block w-full rounded-lg bg-white/95 py-2.5 text-center text-xs font-semibold backdrop-blur sm:py-3 sm:text-sm'>
              Quick View
            </div>
          </div>
        </Link>

        {/* Quick download button at top-right */}
        <button
          type='button'
          onClick={handleQuickDownload}
          disabled={downloading}
          className={`absolute top-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full shadow-md backdrop-blur transition-all ${
            saved
              ? 'bg-emerald-600 text-white opacity-100 scale-110'
              : 'bg-white/90 text-brand-black opacity-85 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-white hover:scale-105 active:scale-95'
          }`}
          aria-label={`Save ${product.name} photo`}
          title='Save photo for WhatsApp status or reselling'
        >
          {downloading ? (
            <svg className='h-3.5 w-3.5 animate-spin' viewBox='0 0 24 24' fill='none'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
            </svg>
          ) : saved ? (
            <svg className='h-4 w-4 text-white' fill='none' stroke='currentColor' strokeWidth={2.5} viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
            </svg>
          ) : (
            <svg className='h-4 w-4' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.5V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3' />
            </svg>
          )}
        </button>
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col p-3 sm:p-4'>
        <Link href={`/products/${product.slug}`}>
          <h3 className='mb-1.5 min-h-10 text-sm font-semibold text-brand-black line-clamp-2 transition-colors group-hover:text-brand-orange sm:text-base sm:min-h-12'>
            {product.name}
          </h3>
        </Link>

        <p className='mb-1.5 min-h-4 text-xs font-semibold text-brand-brown/70 line-clamp-1'>
          {product.stockType.includes('Ready') ? 'Ready Stock' : product.stockType} ·{' '}
          {product.category}
        </p>

        <p className='mb-3 min-h-10 text-xs leading-5 text-brand-brown/70'>
          MOQ <span className='font-bold text-brand-black'>{product.moq} pcs</span> · Colors and
          sizes confirmed on WhatsApp
        </p>

        {/* CTA */}
        <div className='mt-auto grid gap-2 pt-1'>
          <a
            href={siteWhatsAppLink(siteContent, product.whatsappMessage)}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={`Ask for ${product.name} price on WhatsApp`}
            className='bg-brand-black hover:bg-brand-orange active:scale-[0.98] inline-flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs sm:text-sm font-semibold text-white transition-all'
          >
            <WhatsAppIcon className='h-4 w-4 shrink-0' />
            <span className='truncate'>Ask Stock on WhatsApp</span>
          </a>
          <InquiryAddButton
            product={product}
            className='text-brand-brown hover:text-brand-orange active:scale-[0.98] inline-flex w-full items-center justify-center py-1.5 text-xs font-bold transition-all'
          />
        </div>
      </div>
    </div>
  );
}
