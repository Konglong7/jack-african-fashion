'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductImage } from '@/components/ProductImage';
import {
  downloadImageFile,
  downloadMultipleImages,
  getProductImageFilename
} from '@/lib/downloadImage';

import { WhatsAppIcon } from '@/components/Icons';

interface Props {
  images: string[];
  productName: string;
  whatsappLink?: string;
}

export function ProductGalleryClient({ images, productName, whatsappLink }: Props) {
  const [mainIdx, setMainIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [downloadingSingle, setDownloadingSingle] = useState(false);
  const [downloadSavedSingle, setDownloadSavedSingle] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(
    null
  );
  const [batchSaved, setBatchSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const displayImages = useMemo(() => (images.length > 0 ? images : []), [images]);

  const handleDownloadCurrent = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (downloadingSingle) return;
      const currentUrl = displayImages[mainIdx];
      if (!currentUrl) return;

      setDownloadingSingle(true);
      const filename = getProductImageFilename(productName, mainIdx, currentUrl);
      const success = await downloadImageFile(currentUrl, filename);
      setDownloadingSingle(false);

      if (success) {
        setDownloadSavedSingle(true);
        setToastMessage(`Saved photo: ${filename}`);
        setTimeout(() => setDownloadSavedSingle(false), 2200);
        setTimeout(() => setToastMessage(null), 3200);
      }
    },
    [downloadingSingle, displayImages, mainIdx, productName]
  );

  const handleDownloadAll = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (batchProgress !== null || displayImages.length === 0) return;

      const items = displayImages.map((url, idx) => ({
        url,
        filename: getProductImageFilename(productName, idx, url)
      }));

      setBatchProgress({ current: 1, total: items.length });
      const result = await downloadMultipleImages(items, (current, total) => {
        setBatchProgress({ current, total });
      });

      setBatchProgress(null);
      if (result.success > 0) {
        setBatchSaved(true);
        setToastMessage(`Saved ${result.success} photos to your device!`);
        setTimeout(() => setBatchSaved(false), 2600);
        setTimeout(() => setToastMessage(null), 3600);
      }
    },
    [batchProgress, displayImages, productName]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!zoomed) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    },
    [zoomed]
  );

  const nextImage = useCallback(() => {
    setMainIdx((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const prevImage = useCallback(() => {
    setMainIdx((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  }, [displayImages.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Lightbox keyboard navigation (Arrow keys + Escape)
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  if (displayImages.length === 0) {
    return (
      <div className='bg-brand-sand/30 relative aspect-[3/4] overflow-hidden rounded-xl'>
        <ProductImage src='' alt={productName} />
      </div>
    );
  }

  return (
    <>
      {/* Main image with zoom & mobile touch swipe */}
      <motion.div
        className='bg-brand-sand/30 relative mb-4 aspect-[3/4] cursor-zoom-in overflow-hidden rounded-xl select-none'
        onClick={() => setZoomed(!zoomed)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomed(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
      >
        <motion.div
          className='absolute inset-0'
          animate={zoomed ? { scale: 2 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`
          }}
        >
          <ProductImage
            src={displayImages[mainIdx]}
            alt={`${productName} - view ${mainIdx + 1}`}
            priority={mainIdx === 0}
            sizes='(max-width: 1024px) 100vw, 50vw'
          />
        </motion.div>

        {/* Navigation arrows */}
        {displayImages.length > 1 && (
          <>
            <motion.button
              className='absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 shadow-lg backdrop-blur transition-transform active:scale-95'
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label='Previous image'
            >
              <svg
                className='text-brand-black h-5 w-5'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
              >
                <path d='M15 19l-7-7 7-7' />
              </svg>
            </motion.button>
            <motion.button
              className='absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 shadow-lg backdrop-blur transition-transform active:scale-95'
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label='Next image'
            >
              <svg
                className='text-brand-black h-5 w-5'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
              >
                <path d='M9 5l7 7-7 7' />
              </svg>
            </motion.button>
          </>
        )}

        {/* Controls: Download & Expand */}
        <div className='absolute top-3 right-3 z-10 flex items-center gap-2'>
          <motion.button
            className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg backdrop-blur transition-all ${
              downloadSavedSingle
                ? 'bg-emerald-600 text-white'
                : 'text-brand-black bg-white/85 hover:bg-white'
            }`}
            onClick={handleDownloadCurrent}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label='Download high-res photo'
            title='Download high-res photo'
          >
            {downloadingSingle ? (
              <svg className='h-4 w-4 animate-spin' viewBox='0 0 24 24' fill='none'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
            ) : downloadSavedSingle ? (
              <svg
                className='h-5 w-5 text-white'
                fill='none'
                stroke='currentColor'
                strokeWidth={2.5}
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
              </svg>
            ) : (
              <svg
                className='h-5 w-5'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.5V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3'
                />
              </svg>
            )}
          </motion.button>

          <motion.button
            className='text-brand-black flex h-10 w-10 items-center justify-center rounded-full bg-white/85 shadow-lg backdrop-blur transition-all hover:bg-white'
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label='Enlarge image lightbox'
            title='Enlarge image lightbox'
          >
            <svg
              className='h-5 w-5'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              viewBox='0 0 24 24'
            >
              <path d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' />
            </svg>
          </motion.button>
        </div>

        {/* Image counter & mobile swipe dots */}
        <div className='absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur'>
          <span>
            {mainIdx + 1} / {displayImages.length}
          </span>
          {displayImages.length > 1 && displayImages.length <= 8 && (
            <div className='ml-1 flex items-center gap-1 border-l border-white/30 pl-1.5'>
              {displayImages.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    dotIdx === mainIdx ? 'bg-brand-orange w-3' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Zoom hint */}
        {!zoomed && (
          <motion.div
            className='absolute right-3 bottom-3 z-10 hidden items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur sm:flex'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <svg
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              viewBox='0 0 24 24'
            >
              <path d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7' />
            </svg>
            Click to zoom
          </motion.div>
        )}
      </motion.div>

      {/* Thumbnail row (horizontally scrollable on mobile, gridded on desktop) */}
      {displayImages.length > 1 && (
        <motion.div
          className='flex scrollbar-none gap-2.5 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {displayImages.map((imgSrc, i) => (
            <motion.button
              key={i}
              onClick={() => setMainIdx(i)}
              className={`bg-brand-sand/30 relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg transition-all sm:w-auto ${
                i === mainIdx
                  ? 'ring-brand-orange opacity-100 ring-2 ring-offset-2'
                  : 'hover:ring-brand-sand opacity-70 hover:opacity-100 hover:ring-1'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`View ${productName} image ${i + 1}`}
            >
              <ProductImage
                src={imgSrc}
                alt={`${productName} thumbnail ${i + 1}`}
                showName={false}
                sizes='(max-width: 640px) 64px, 10vw'
              />
              {i === mainIdx && (
                <motion.div
                  className='bg-brand-orange/10 absolute inset-0'
                  layoutId='activeThumbnail'
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Wholesale Buyer Photo Kit */}
      <div className='border-brand-sand/70 bg-brand-cream/60 mt-3 flex flex-wrap items-center justify-between gap-2.5 rounded-lg border p-3'>
        <div className='flex items-center gap-2'>
          <span className='bg-brand-orange/15 text-brand-orange inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md'>
            <svg
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
              />
            </svg>
          </span>
          <div>
            <p className='text-brand-black text-xs font-bold'>High-Res Boutique Photos</p>
            <p className='text-brand-brown/70 text-[0.7rem]'>
              Clean images for WhatsApp status, Instagram & customer pre-orders
            </p>
          </div>
        </div>

        <div className='flex w-full items-center gap-2 sm:w-auto'>
          <button
            type='button'
            onClick={handleDownloadCurrent}
            disabled={downloadingSingle}
            className='border-brand-black/20 text-brand-black hover:bg-brand-black inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border bg-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-all hover:text-white active:scale-95 sm:flex-none'
          >
            {downloadingSingle ? (
              <>
                <svg className='h-3.5 w-3.5 animate-spin' viewBox='0 0 24 24' fill='none'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                <span>Saving...</span>
              </>
            ) : downloadSavedSingle ? (
              <>
                <svg
                  className='h-3.5 w-3.5 text-emerald-600'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2.5}
                  viewBox='0 0 24 24'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                </svg>
                <span className='font-bold text-emerald-700'>Saved!</span>
              </>
            ) : (
              <>
                <svg
                  className='h-3.5 w-3.5'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.5V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3'
                  />
                </svg>
                <span>Save Current Photo</span>
              </>
            )}
          </button>

          {displayImages.length > 1 && (
            <button
              type='button'
              onClick={handleDownloadAll}
              disabled={batchProgress !== null}
              className='bg-brand-orange hover:bg-brand-gold inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all active:scale-95 sm:flex-none'
            >
              {batchProgress ? (
                <>
                  <svg className='h-3.5 w-3.5 animate-spin' viewBox='0 0 24 24' fill='none'>
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                  <span>
                    Saving {batchProgress.current}/{batchProgress.total}...
                  </span>
                </>
              ) : batchSaved ? (
                <>
                  <svg
                    className='h-3.5 w-3.5'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2.5}
                    viewBox='0 0 24 24'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                  </svg>
                  <span>All Photos Saved!</span>
                </>
              ) : (
                <>
                  <svg
                    className='h-3.5 w-3.5'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z'
                    />
                  </svg>
                  <span>Save All {displayImages.length} Photos</span>
                </>
              )}
            </button>
          )}

          {whatsappLink && (
            <a
              href={whatsappLink}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#20ba59] active:scale-95 sm:flex-none'
            >
              <WhatsAppIcon className='h-3.5 w-3.5' />
              <span>Ask on WhatsApp</span>
            </a>
          )}
        </div>
      </div>

      {/* Lightbox modal with keyboard and swipe support */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/95'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Lightbox header toolbar */}
            <div className='absolute top-4 right-4 z-20 flex items-center gap-2.5'>
              <button
                type='button'
                className={`flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold shadow-lg backdrop-blur transition-all ${
                  downloadSavedSingle
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
                onClick={handleDownloadCurrent}
                disabled={downloadingSingle}
                aria-label='Download high-res photo'
              >
                {downloadingSingle ? (
                  <>
                    <svg className='h-4 w-4 animate-spin' viewBox='0 0 24 24' fill='none'>
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    <span className='hidden sm:inline'>Saving...</span>
                  </>
                ) : downloadSavedSingle ? (
                  <>
                    <svg
                      className='h-4 w-4 text-white'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2.5}
                      viewBox='0 0 24 24'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                    </svg>
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <svg
                      className='h-4 w-4'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.5V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3'
                      />
                    </svg>
                    <span className='hidden sm:inline'>Download Photo</span>
                  </>
                )}
              </button>

              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white shadow-lg backdrop-blur transition-all hover:bg-[#20ba59] active:scale-95'
                  aria-label='Inquire this style on WhatsApp'
                >
                  <WhatsAppIcon className='h-4 w-4' />
                  <span className='hidden sm:inline'>Inquire on WhatsApp</span>
                </a>
              )}

              <button
                type='button'
                className='flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white shadow-lg backdrop-blur transition-colors hover:bg-white/25'
                onClick={() => setLightboxOpen(false)}
                aria-label='Close lightbox'
              >
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  viewBox='0 0 24 24'
                >
                  <path d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            {displayImages.length > 1 && (
              <>
                <button
                  className='absolute top-1/2 left-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20'
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label='Previous image'
                >
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                  >
                    <path d='M15 19l-7-7 7-7' />
                  </svg>
                </button>
                <button
                  className='absolute top-1/2 right-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20'
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label='Next image'
                >
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                  >
                    <path d='M9 5l7 7-7 7' />
                  </svg>
                </button>
              </>
            )}

            {/* Main image */}
            <motion.div
              className='relative mx-4 h-[80vh] w-full max-w-4xl'
              onClick={(e) => e.stopPropagation()}
              key={mainIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ProductImage
                src={displayImages[mainIdx]}
                alt={`${productName} - view ${mainIdx + 1}`}
                sizes='100vw'
              />
            </motion.div>

            {/* Thumbnail strip */}
            <div className='absolute bottom-4 left-1/2 flex max-w-[90vw] -translate-x-1/2 scrollbar-none gap-2 overflow-x-auto rounded-full bg-black/50 p-2 backdrop-blur'>
              {displayImages.map((imgSrc, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMainIdx(i);
                  }}
                  className={`h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 transition-all ${
                    i === mainIdx
                      ? 'border-brand-orange scale-105'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                  aria-label={`Select photo ${i + 1}`}
                >
                  <ProductImage
                    src={imgSrc}
                    alt={`${productName} thumbnail ${i + 1}`}
                    showName={false}
                    sizes='48px'
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating download feedback toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 350 }}
            className='bg-brand-black/95 border-brand-gold/30 fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full border px-5 py-2.5 text-xs font-medium text-white shadow-2xl backdrop-blur sm:text-sm'
            role='status'
          >
            <span className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400'>
              <svg
                className='h-3.5 w-3.5'
                fill='none'
                stroke='currentColor'
                strokeWidth={2.5}
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
              </svg>
            </span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
