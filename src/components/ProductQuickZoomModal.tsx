'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useModalDialog } from '@/lib/useModalDialog';
import Link from 'next/link';
import Image from './ResponsiveImage';
import { WhatsAppIcon } from './Icons';
import { siteWhatsAppLink, type SiteContent, DEFAULT_SITE_CONTENT } from '@/lib/siteContentTypes';
import { downloadImageFile, getProductImageFilename } from '@/lib/downloadImage';
import { ImageViewerModal } from './ImageViewerModal';
import type { Product } from '@/lib/db';

interface ProductQuickZoomModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  siteContent?: SiteContent;
  variant?: 'default' | 'home';
}

export function ProductQuickZoomModal({
  product,
  isOpen,
  onClose,
  siteContent = DEFAULT_SITE_CONTENT,
  variant = 'default'
}: ProductQuickZoomModalProps) {
  const isHome = variant === 'home';
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isFullScreenViewerOpen, setIsFullScreenViewerOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  useModalDialog(isOpen && Boolean(product), dialogRef);

  // Reset active image when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setIsFullScreenViewerOpen(false);
  }, [product]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isFullScreenViewerOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullScreenViewerOpen, onClose]);

  if (!isOpen || !product || typeof document === 'undefined') return null;

  const images =
    product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = images[activeImageIndex] || product.image;

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (downloading || !activeImage) return;

    setDownloading(true);
    const filename = getProductImageFilename(product.name, activeImageIndex, activeImage);
    const ok = await downloadImageFile(activeImage, filename);
    setDownloading(false);

    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    }
  };

  const whatsappMessage = `Hello Jack, I saw ${product.name} (MOQ: ${product.moq} pcs) in your catalog. Please send real stock photos, available colors, sizes, and today's wholesale price.`;
  const whatsappUrl = siteWhatsAppLink(siteContent, whatsappMessage);

  return createPortal(
    <>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className='fixed inset-0 z-[70] flex items-center justify-center p-2.5 sm:p-6 bg-black/80 backdrop-blur-sm transition-opacity duration-200'
        onClick={onClose}
        role='dialog'
        aria-modal='true'
        aria-label={`${product.name} Quick View`}
      >
        <div
          className='relative flex flex-col md:flex-row w-full max-w-4xl max-h-[94vh] overflow-hidden rounded-2xl bg-white shadow-2xl transition-all'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type='button'
            onClick={onClose}
            aria-label='Close preview'
            className={`absolute top-3 right-3 z-30 flex ${isHome ? 'h-11 w-11' : 'h-9 w-9'} items-center justify-center rounded-full bg-stone-900/80 text-white backdrop-blur hover:bg-stone-950 transition-colors`}
          >
            <svg className='h-5 w-5' fill='none' stroke='currentColor' strokeWidth={2.5} viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>

          {/* Left Column: Image Showcase (Zero-crop responsive display with click to pinch/zoom) */}
          <div
            data-product-preview-image
            className='relative flex flex-col items-center justify-center bg-white md:w-3/5 overflow-hidden h-[48vh] sm:h-[55vh] md:h-auto md:min-h-[500px] cursor-zoom-in group/img'
            onClick={() => setIsFullScreenViewerOpen(true)}
          >
            {/* 100% Uncropped Image Viewport */}
            <div className='relative h-full w-full p-2 flex items-center justify-center'>
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className='object-contain transition-opacity duration-300 pointer-events-none select-none'
                sizes='(max-width: 768px) 100vw, 60vw'
                priority
              />
            </div>

            {/* Image Navigation Dots / Thumbnails if multiple */}
            {images.length > 1 && (
              <div
                className='absolute bottom-3 right-3 z-20 flex gap-1.5 overflow-x-auto py-1 scrollbar-none'
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, idx) => (
                  <button
                    key={img + idx}
                    type='button'
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative ${isHome ? 'h-11 w-11' : 'h-10 w-9'} shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                      idx === activeImageIndex
                        ? 'border-amber-400 scale-105 shadow-md'
                        : 'border-white/30 opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <Image src={img} alt='' fill className='object-contain' sizes='36px' />
                  </button>
                ))}
              </div>
            )}


          </div>

          {/* Right Column: Wholesale Specifications & Action */}
          <div className='flex flex-col justify-between p-3.5 sm:p-6 md:w-2/5 overflow-y-auto bg-white flex-1'>
            <div className='space-y-2.5 sm:space-y-4'>
              {/* Category & Status Badges */}
              <div className='flex flex-wrap items-center gap-2'>
                <span className='rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-900'>
                  {product.category}
                </span>
                {product.stockType.includes('Ready') && (
                  <span className='flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200'>
                    <span className={`h-1.5 w-1.5 rounded-full bg-emerald-500 ${isHome ? '' : 'animate-pulse'}`} />
                    Ready Stock
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h2 className='text-base sm:text-xl font-bold text-stone-900 leading-tight'>
                {product.name}
              </h2>

              {/* Wholesale Highlights Box */}
              <div className='rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/70 to-orange-50/40 p-3 space-y-2 sm:p-3.5 sm:space-y-2.5'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold uppercase text-stone-600 tracking-wider'>
                    Wholesale MOQ
                  </span>
                  <span className='rounded-full bg-gradient-to-r from-amber-600 to-amber-500 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-extrabold text-stone-950 shadow-sm'>
                    {product.moq} pcs per style
                  </span>
                </div>
                <div className='flex items-center justify-between text-xs text-stone-600 border-t border-amber-200/60 pt-1.5 sm:pt-2'>
                  <span>Size Range</span>
                  <span className='font-bold text-stone-900'>
                    {product.sizes && product.sizes.length > 0
                      ? `${product.sizes[0]} – ${product.sizes[product.sizes.length - 1]}`
                      : 'Standard Wholesale Range'}
                  </span>
                </div>
                <div className='flex items-center justify-between text-xs text-stone-600 border-t border-amber-200/60 pt-1.5 sm:pt-2'>
                  <span>Guangzhou Dispatch</span>
                  <span className='font-bold text-emerald-700'>Confirm by order</span>
                </div>
              </div>

              {/* Product description excerpt */}
              {product.description && (
                <p className='text-xs sm:text-sm text-stone-600 line-clamp-2 sm:line-clamp-3 leading-relaxed'>
                  {product.description}
                </p>
              )}

              {/* Selling highlights */}
              <div className='hidden sm:block space-y-1.5 text-xs text-stone-600'>
                <div className='flex items-center gap-2'>
                  <span className='text-amber-600 font-bold'>✓</span>
                  <span>Real photos &amp; video verification on WhatsApp</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-amber-600 font-bold'>✓</span>
                  <span>Direct cargo delivery to Nigeria, Ghana, Kenya, South Africa</span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className='mt-3 sm:mt-6 space-y-2 sm:space-y-2.5 pt-2.5 sm:pt-3 border-t border-stone-100'>
              <a
                href={whatsappUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl ${isHome ? 'bg-[#0B7A3C] hover:bg-[#165C45]' : 'bg-[#25D366] hover:bg-[#20BA5A]'} px-4 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]`}
              >
                <WhatsAppIcon className='h-4 w-4 shrink-0' />
                <span>Ask Stock &amp; Price on WhatsApp</span>
              </a>

              <div className='flex flex-wrap gap-2'>
                <button
                  type='button'
                  onClick={handleDownload}
                  disabled={downloading}
                  className={`${isHome ? 'min-h-11' : ''} flex-1 min-w-20 rounded-xl border border-stone-300 bg-stone-50 px-2 py-2.5 text-xs font-semibold text-stone-800 hover:bg-stone-100 disabled:opacity-50`}
                >
                  {downloading ? 'Saving…' : saved ? 'Saved!' : 'Save Photo'}
                </button>
                <button
                  type='button'
                  onClick={() => setIsFullScreenViewerOpen(true)}
                  className={`${isHome ? 'min-h-11' : ''} flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 px-3 py-2.5 text-xs font-semibold text-stone-800 transition-colors`}
                  title='Pinch and zoom into fabric and stitch details'
                >
                  <svg className='h-3.5 w-3.5 text-amber-600' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
                    <circle cx='11' cy='11' r='8' />
                    <path d='m21 21-4.3-4.3' />
                    <path d='M11 8v6M8 11h6' strokeLinecap='round' />
                  </svg>
                  <span>Zoom Details</span>
                </button>

                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className={`${isHome ? 'min-h-11' : ''} flex-1 flex items-center justify-center rounded-xl border border-stone-900 bg-stone-900 hover:bg-stone-800 px-3 py-2.5 text-xs font-semibold text-white transition-colors text-center`}
                >
                  Full Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen Pinch-to-Zoom & Zero-crop Gesture Viewer */}
      <ImageViewerModal
        images={images}
        initialIndex={activeImageIndex}
        productName={product.name}
        isOpen={isFullScreenViewerOpen}
        onClose={() => setIsFullScreenViewerOpen(false)}
        whatsappLink={whatsappUrl}
        variant={variant}
      />
    </>,
    document.body
  );
}
