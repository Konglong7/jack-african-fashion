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
import { getPublicProductFacts, type PublicProduct } from '@/lib/productPublicFacts';

interface ProductQuickZoomModalProps {
  product: PublicProduct | null;
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

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = images[activeImageIndex] || product.image;
  const facts = getPublicProductFacts(product);

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

  const whatsappMessage = `Hello Jack, I saw ${product.name} in your catalog. Please confirm the MOQ and send current stock photos, available colors, sizes, and today's wholesale price.`;
  const whatsappUrl = siteWhatsAppLink(siteContent, whatsappMessage);

  return createPortal(
    <>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className='fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-2.5 backdrop-blur-sm transition-opacity duration-200 sm:p-6'
        onClick={onClose}
        role='dialog'
        aria-modal='true'
        aria-label={`${product.name} Quick View`}
      >
        <div
          className='relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all md:flex-row'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type='button'
            onClick={onClose}
            aria-label='Close preview'
            className={`absolute top-3 right-3 z-30 flex ${isHome ? 'h-11 w-11' : 'h-9 w-9'} items-center justify-center rounded-full bg-stone-900/80 text-white backdrop-blur transition-colors hover:bg-stone-950`}
          >
            <svg
              className='h-5 w-5'
              fill='none'
              stroke='currentColor'
              strokeWidth={2.5}
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>

          {/* Left Column: Image Showcase (Zero-crop responsive display with click to pinch/zoom) */}
          <div
            data-product-preview-image
            className='group/img relative flex h-[48vh] cursor-zoom-in flex-col items-center justify-center overflow-hidden bg-white sm:h-[55vh] md:h-auto md:min-h-[500px] md:w-3/5'
            onClick={() => setIsFullScreenViewerOpen(true)}
          >
            {/* 100% Uncropped Image Viewport */}
            <div className='relative flex h-full w-full items-center justify-center p-2'>
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className='pointer-events-none object-contain transition-opacity duration-300 select-none'
                sizes='(max-width: 768px) 100vw, 60vw'
                priority
              />
            </div>

            {/* Image Navigation Dots / Thumbnails if multiple */}
            {images.length > 1 && (
              <div
                className='absolute right-3 bottom-3 z-20 flex scrollbar-none gap-1.5 overflow-x-auto py-1'
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, idx) => (
                  <button
                    key={img + idx}
                    type='button'
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative ${isHome ? 'h-11 w-11' : 'h-10 w-9'} shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                      idx === activeImageIndex
                        ? 'scale-105 border-amber-400 shadow-md'
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
          <div className='flex flex-1 flex-col justify-between overflow-y-auto bg-white p-3.5 sm:p-6 md:w-2/5'>
            <div className='space-y-2.5 sm:space-y-4'>
              {/* Category & Status Badges */}
              <div className='flex flex-wrap items-center gap-2'>
                <span className='rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold tracking-wider text-amber-900 uppercase'>
                  {product.category}
                </span>
                <span className='flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800'>
                  <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                  Stock: {facts.stock}
                </span>
              </div>

              {/* Product Title */}
              <h2 className='text-base leading-tight font-bold text-stone-900 sm:text-xl'>
                {product.name}
              </h2>

              {/* Wholesale Highlights Box */}
              <div className='space-y-2 rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/70 to-orange-50/40 p-3 sm:space-y-2.5 sm:p-3.5'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold tracking-wider text-stone-600 uppercase'>
                    Wholesale MOQ
                  </span>
                  <span className='rounded-full bg-gradient-to-r from-amber-600 to-amber-500 px-2.5 py-0.5 text-xs font-extrabold text-stone-950 shadow-sm sm:px-3 sm:py-1'>
                    {facts.moq}
                  </span>
                </div>
                <div className='flex items-center justify-between border-t border-amber-200/60 pt-1.5 text-xs text-stone-600 sm:pt-2'>
                  <span>Listed size references</span>
                  <span className='font-bold text-stone-900'>
                    {facts.sizes}
                  </span>
                </div>
                <div className='flex items-center justify-between border-t border-amber-200/60 pt-1.5 text-xs text-stone-600 sm:pt-2'>
                  <span>Guangzhou Dispatch</span>
                  <span className='font-bold text-emerald-700'>Confirm by order</span>
                </div>
              </div>

              {/* Product description excerpt */}
              {facts.description && (
                <p className='line-clamp-2 text-xs leading-relaxed text-stone-600 sm:line-clamp-3 sm:text-sm'>
                  {facts.description}
                </p>
              )}

              {/* Selling highlights */}
              <div className='hidden space-y-1.5 text-xs text-stone-600 sm:block'>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-amber-600'>✓</span>
                  <span>Real photos &amp; video verification on WhatsApp</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-amber-600'>✓</span>
                  <span>Cargo handover and shipping confirmed for your destination</span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className='mt-3 space-y-2 border-t border-stone-100 pt-2.5 sm:mt-6 sm:space-y-2.5 sm:pt-3'>
              <a
                href={whatsappUrl}
                data-product-id={product.id}
                data-cta-location='product-preview'
                target='_blank'
                rel='noopener noreferrer'
                className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl ${isHome ? 'bg-[#0B7A3E] hover:bg-[#086532]' : 'bg-[#0B7A3E] hover:bg-[#086532]'} px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98]`}
              >
                <WhatsAppIcon className='h-4 w-4 shrink-0' />
                <span>Chat on WhatsApp</span>
              </a>

              <div className='flex flex-wrap gap-2'>
                <button
                  type='button'
                  onClick={handleDownload}
                  disabled={downloading}
                  className={`${isHome ? 'min-h-11' : ''} min-w-20 flex-1 rounded-xl border border-stone-300 bg-stone-50 px-2 py-2.5 text-xs font-semibold text-stone-800 hover:bg-stone-100 disabled:opacity-50`}
                >
                  {downloading ? 'Saving…' : saved ? 'Saved!' : 'Save Photo'}
                </button>
                <button
                  type='button'
                  onClick={() => setIsFullScreenViewerOpen(true)}
                  className={`${isHome ? 'min-h-11' : ''} flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-xs font-semibold text-stone-800 transition-colors hover:bg-stone-100`}
                  title='Pinch and zoom into fabric and stitch details'
                >
                  <svg
                    className='h-3.5 w-3.5 text-amber-600'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                  >
                    <circle cx='11' cy='11' r='8' />
                    <path d='m21 21-4.3-4.3' />
                    <path d='M11 8v6M8 11h6' strokeLinecap='round' />
                  </svg>
                  <span>Zoom Details</span>
                </button>

                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className={`${isHome ? 'min-h-11' : ''} flex flex-1 items-center justify-center rounded-xl border border-stone-900 bg-stone-900 px-3 py-2.5 text-center text-xs font-semibold text-white transition-colors hover:bg-stone-800`}
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
        productId={product.id}
        isOpen={isFullScreenViewerOpen}
        onClose={() => setIsFullScreenViewerOpen(false)}
        whatsappLink={whatsappUrl}
        variant={variant}
      />
    </>,
    document.body
  );
}
