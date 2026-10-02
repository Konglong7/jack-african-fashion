'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from './ResponsiveImage';
import { createPortal } from 'react-dom';
import { useModalDialog } from '@/lib/useModalDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { WhatsAppIcon } from './Icons';
import { downloadImageFile, getProductImageFilename } from '@/lib/downloadImage';

interface ImageViewerModalProps {
  images: string[];
  initialIndex?: number;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  whatsappLink?: string;
  onDownload?: (index: number) => Promise<boolean | void> | void;
  variant?: 'default' | 'home';
}

const MIN_SCALE = 1.0;
const MAX_SCALE = 4.0;
const DOUBLE_TAP_SCALE = 2.5;

/**
 * Mobile-first, zero-crop, high-performance image viewer modal.
 *
 * Key features:
 * - 100% complete image display without cropping (object-contain across all aspect ratios & screen sizes)
 * - Multi-touch pinch-to-zoom (1.0x - 4.0x) with anchor point tracking
 * - Double-tap to zoom into details (2.5x) / double-tap to reset (1x)
 * - Free-pan / drag when zoomed with boundary clamping
 * - Single-finger horizontal swipe between multi-angle photos when at 1x
 * - Pull-down to dismiss when at 1x
 * - Desktop mouse wheel zoom, click & drag pan, keyboard navigation (Escape, Left, Right)
 * - One-tap high-res photo download & WhatsApp wholesale inquiry
 */
export function ImageViewerModal({
  images,
  initialIndex = 0,
  productName,
  isOpen,
  onClose,
  whatsappLink,
  onDownload,
  variant = 'default'
}: ImageViewerModalProps) {
  const isHome = variant === 'home';
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(MIN_SCALE);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSaved, setDownloadSaved] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Touch and drag refs
  const stageRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useModalDialog(isOpen && images.length > 0, dialogRef);
  const touchStartRef = useRef<{
    time: number;
    x: number;
    y: number;
    dist: number;
    scale: number;
    translateX: number;
    translateY: number;
    isPinching: boolean;
    isPanning: boolean;
  }>({
    time: 0,
    x: 0,
    y: 0,
    dist: 0,
    scale: 1,
    translateX: 0,
    translateY: 0,
    isPinching: false,
    isPanning: false
  });
  const lastTapRef = useRef<{ time: number; x: number; y: number }>({ time: 0, x: 0, y: 0 });
  const mouseDragRef = useRef<{ isDown: boolean; startX: number; startY: number; initX: number; initY: number }>({
    isDown: false,
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0
  });

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, images.length - 1)));
      setScale(MIN_SCALE);
      setTranslate({ x: 0, y: 0 });
      setShowHint(true);
      const timer = setTimeout(() => setShowHint(false), 2800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialIndex, images.length]);

  // Reset zoom & pan when image changes
  useEffect(() => {
    setScale(MIN_SCALE);
    setTranslate({ x: 0, y: 0 });
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && images.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
      if (e.key === 'ArrowLeft' && images.length > 1) {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  // Clamp translation based on container dimensions & current scale
  const clampTranslate = useCallback((x: number, y: number, currentScale: number) => {
    if (!stageRef.current || currentScale <= 1) return { x: 0, y: 0 };
    const rect = stageRef.current.getBoundingClientRect();
    const maxX = (rect.width * (currentScale - 1)) / 2;
    const maxY = (rect.height * (currentScale - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y))
    };
  }, []);

  const handleResetZoom = useCallback(() => {
    setScale(MIN_SCALE);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => {
      const next = Math.min(MAX_SCALE, prev + 0.75);
      setTranslate((t) => clampTranslate(t.x, t.y, next));
      return next;
    });
  }, [clampTranslate]);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => {
      const next = Math.max(MIN_SCALE, prev - 0.75);
      setTranslate((t) => (next <= 1.05 ? { x: 0, y: 0 } : clampTranslate(t.x, t.y, next)));
      return next;
    });
  }, [clampTranslate]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touches = e.touches;
    const now = Date.now();

    if (touches.length === 2) {
      // Pinch start
      const dist = Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );
      touchStartRef.current = {
        time: now,
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
        dist,
        scale,
        translateX: translate.x,
        translateY: translate.y,
        isPinching: true,
        isPanning: false
      };
      setIsDragging(true);
      return;
    }

    if (touches.length === 1) {
      const touch = touches[0];
      const timeSinceLastTap = now - lastTapRef.current.time;
      const distFromLastTap = Math.hypot(
        touch.clientX - lastTapRef.current.x,
        touch.clientY - lastTapRef.current.y
      );

      // Double-tap detection
      if (timeSinceLastTap < 300 && distFromLastTap < 35) {
        e.preventDefault();
        if (scale > 1.15) {
          // Reset to 1x
          handleResetZoom();
        } else {
          // Zoom into double-tap location
          if (stageRef.current) {
            const rect = stageRef.current.getBoundingClientRect();
            const clickOffsetX = touch.clientX - (rect.left + rect.width / 2);
            const clickOffsetY = touch.clientY - (rect.top + rect.height / 2);
            const targetScale = DOUBLE_TAP_SCALE;
            const targetX = -clickOffsetX * (targetScale - 1);
            const targetY = -clickOffsetY * (targetScale - 1);
            setScale(targetScale);
            setTranslate(clampTranslate(targetX, targetY, targetScale));
          }
        }
        lastTapRef.current = { time: 0, x: 0, y: 0 };
        return;
      }

      lastTapRef.current = { time: now, x: touch.clientX, y: touch.clientY };

      touchStartRef.current = {
        time: now,
        x: touch.clientX,
        y: touch.clientY,
        dist: 0,
        scale,
        translateX: translate.x,
        translateY: translate.y,
        isPinching: false,
        isPanning: scale > 1
      };
      setIsDragging(scale > 1);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touches = e.touches;

    if (touches.length === 2 && touchStartRef.current.isPinching) {
      e.preventDefault();
      const dist = Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );
      const ratio = dist / (touchStartRef.current.dist || 1);
      const newScale = Math.max(0.85, Math.min(MAX_SCALE + 0.5, touchStartRef.current.scale * ratio));
      setScale(newScale);

      // Adjust translation proportionally
      const currentCenterX = (touches[0].clientX + touches[1].clientX) / 2;
      const currentCenterY = (touches[0].clientY + touches[1].clientY) / 2;
      const deltaCenterX = currentCenterX - touchStartRef.current.x;
      const deltaCenterY = currentCenterY - touchStartRef.current.y;

      setTranslate({
        x: touchStartRef.current.translateX + deltaCenterX,
        y: touchStartRef.current.translateY + deltaCenterY
      });
      return;
    }

    if (touches.length === 1 && touchStartRef.current.isPanning && scale > 1) {
      e.preventDefault();
      const deltaX = touches[0].clientX - touchStartRef.current.x;
      const deltaY = touches[0].clientY - touchStartRef.current.y;
      setTranslate(
        clampTranslate(
          touchStartRef.current.translateX + deltaX,
          touchStartRef.current.translateY + deltaY,
          scale
        )
      );
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(false);

    if (touchStartRef.current.isPinching) {
      touchStartRef.current.isPinching = false;
      if (scale < 1.05) {
        handleResetZoom();
      } else if (scale > MAX_SCALE) {
        setScale(MAX_SCALE);
        setTranslate((t) => clampTranslate(t.x, t.y, MAX_SCALE));
      } else {
        setTranslate((t) => clampTranslate(t.x, t.y, scale));
      }
      return;
    }

    // Single finger swipe or pull-down when scale === 1
    if (scale <= 1.05 && e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
      const elapsed = Date.now() - touchStartRef.current.time;

      // Vertical pull-down to close
      if (deltaY > 80 && Math.abs(deltaY) > Math.abs(deltaX) * 1.5 && elapsed < 500) {
        onClose();
        return;
      }

      // Horizontal swipe to switch image
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) && images.length > 1) {
        if (deltaX < 0) {
          // Swipe left -> Next image
          setCurrentIndex((prev) => (prev + 1) % images.length);
        } else {
          // Swipe right -> Prev image
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }
      }
    }
  };

  // Mouse wheel zoom for desktop
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Mouse drag for desktop when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    mouseDragRef.current = {
      isDown: true,
      startX: e.clientX,
      startY: e.clientY,
      initX: translate.x,
      initY: translate.y
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseDragRef.current.isDown || scale <= 1) return;
    const deltaX = e.clientX - mouseDragRef.current.startX;
    const deltaY = e.clientY - mouseDragRef.current.startY;
    setTranslate(
      clampTranslate(
        mouseDragRef.current.initX + deltaX,
        mouseDragRef.current.initY + deltaY,
        scale
      )
    );
  };

  const handleMouseUp = () => {
    mouseDragRef.current.isDown = false;
    setIsDragging(false);
  };

  // Download photo handler
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloading) return;
    const currentUrl = images[currentIndex];
    if (!currentUrl) return;

    setDownloading(true);
    setDownloadSaved(false);
    let success = false;
    try {
      if (onDownload) {
        success = (await onDownload(currentIndex)) === true;
      } else {
        const filename = getProductImageFilename(productName, currentIndex, currentUrl);
        success = await downloadImageFile(currentUrl, filename);
      }
    } catch {
      success = false;
    } finally {
      setDownloading(false);
    }
    setDownloadSaved(success);
    setTimeout(() => setDownloadSaved(false), 2200);
  };

  if (!isOpen || images.length === 0 || typeof document === 'undefined') return null;

  const currentImage = images[currentIndex];

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        className='fixed inset-0 z-[80] flex flex-col justify-between bg-stone-100 select-none touch-none'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role='dialog'
        aria-modal='true'
        aria-label={`${productName} image preview`}
        onWheel={handleWheel}
        onMouseUp={handleMouseUp}
      >
        {/* Top Header Controls Bar */}
        <div className='relative z-30 flex items-center justify-between px-3 py-3 sm:px-6 sm:py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent'>
          {/* Image index badge & Zoom Level pill */}
          <div className='flex items-center gap-2'>
            <span className='rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur'>
              {currentIndex + 1} / {images.length}
            </span>
            {scale > 1.05 && (
              <button
                type='button'
                onClick={handleResetZoom}
                className={`flex ${isHome ? 'min-h-11 min-w-11' : ''} items-center gap-1 rounded-full bg-amber-500/90 hover:bg-amber-400 px-2.5 py-1 text-xs font-bold text-stone-950 transition-colors shadow-sm`}
                title='Reset zoom to 1x'
              >
                <span>{scale.toFixed(1)}×</span>
                <span className='text-[10px] underline ml-0.5'>Reset</span>
              </button>
            )}
          </div>

          {/* Action buttons: Zoom in/out, Download, WhatsApp, Close */}
          <div className='flex items-center gap-1.5 sm:gap-2.5'>
            {/* Desktop Zoom Out */}
            <button
              type='button'
              onClick={handleZoomOut}
              disabled={scale <= 1.05}
              className='hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25 disabled:opacity-30 disabled:hover:bg-white/15 transition-colors'
              aria-label='Zoom out'
              title='Zoom out'
            >
              <svg className='h-4 w-4' fill='none' stroke='currentColor' strokeWidth={2.5} viewBox='0 0 24 24'>
                <path strokeLinecap='round' d='M5 12h14' />
              </svg>
            </button>

            {/* Desktop Zoom In */}
            <button
              type='button'
              onClick={handleZoomIn}
              disabled={scale >= MAX_SCALE}
              className='hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25 disabled:opacity-30 disabled:hover:bg-white/15 transition-colors'
              aria-label='Zoom in'
              title='Zoom in'
            >
              <svg className='h-4 w-4' fill='none' stroke='currentColor' strokeWidth={2.5} viewBox='0 0 24 24'>
                <path strokeLinecap='round' d='M12 5v14m-7-7h14' />
              </svg>
            </button>

            {/* Save High-Res Photo Button */}
            <button
              type='button'
              onClick={handleDownload}
              disabled={downloading}
              className={`flex ${isHome ? 'h-11 min-w-11 justify-center' : 'h-9'} items-center gap-1.5 rounded-full px-3 text-xs font-bold backdrop-blur transition-all active:scale-95 ${
                downloadSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              aria-label='Save high resolution photo'
              title='Save photo'
            >
              {downloading ? (
                <svg className='h-3.5 w-3.5 animate-spin' viewBox='0 0 24 24' fill='none'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                </svg>
              ) : downloadSaved ? (
                <>
                  <svg className='h-3.5 w-3.5 text-white' fill='none' stroke='currentColor' strokeWidth={2.5} viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                  </svg>
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <svg className='h-3.5 w-3.5' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.5V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3' />
                  </svg>
                  <span className='hidden sm:inline'>Save Photo</span>
                </>
              )}
            </button>

            {/* WhatsApp Inquiry Button */}
            {whatsappLink && (
              <a
                href={whatsappLink}
                target='_blank'
                rel='noopener noreferrer'
                className={`flex ${isHome ? 'h-11 min-w-11 justify-center bg-[#0B7A3C] hover:bg-[#165C45]' : 'h-9 bg-[#25D366] hover:bg-[#20ba59]'} items-center gap-1.5 rounded-full px-3 text-xs font-bold text-white shadow-md transition-all active:scale-95`}
                aria-label='Inquire about this style on WhatsApp'
              >
                <WhatsAppIcon className='h-3.5 w-3.5' />
                <span className='hidden sm:inline'>WhatsApp</span>
              </a>
            )}

            {/* Close Button */}
            <button
              type='button'
              onClick={onClose}
              className={`flex ${isHome ? 'h-11 w-11' : 'h-9 w-9'} items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30 transition-colors`}
              aria-label='Close preview'
            >
              <svg className='h-5 w-5' fill='none' stroke='currentColor' strokeWidth={2.5} viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
        </div>

        {/* Central Image Viewport (Zero-crop, Touch & Pan Gesture Area) */}
        <div
          ref={stageRef}
          className='relative min-h-0 flex-1 w-full flex items-center justify-center overflow-hidden'
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          {/* Previous / Next Arrow buttons for desktop and tablets */}
          {images.length > 1 && scale <= 1.05 && (
            <>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
                }}
                className='absolute left-3 top-1/2 z-20 hidden md:flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white/90 hover:bg-black/90 hover:text-white transition-all shadow-lg backdrop-blur'
                aria-label='Previous photo'
              >
                <svg className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth={2.5} viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
                </svg>
              </button>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev + 1) % images.length);
                }}
                className='absolute right-3 top-1/2 z-20 hidden md:flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white/90 hover:bg-black/90 hover:text-white transition-all shadow-lg backdrop-blur'
                aria-label='Next photo'
              >
                <svg className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth={2.5} viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </>
          )}

          {/* Scalable & Pannable Image Canvas */}
          <div
            className='absolute inset-0 flex items-center justify-center'
            style={{
              transform: `translate3d(${translate.x}px, ${translate.y}px, 0px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.24s cubic-bezier(0.2, 0, 0.2, 1)'
            }}
          >
            <div className='relative h-full w-full max-h-[100dvh] max-w-[100dvw] p-2 sm:p-4'>
              <Image
                src={currentImage}
                alt={`${productName} view ${currentIndex + 1}`}
                fill
                priority
                sizes='100vw'
                className='object-contain pointer-events-none select-none'
                quality={85}
              />
            </div>
          </div>

          {/* Mobile Gestures Floating Hint */}
          <AnimatePresence>
            {showHint && scale <= 1.05 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className='pointer-events-none absolute bottom-5 z-20 flex items-center gap-1.5 rounded-full bg-black/75 px-3.5 py-1.5 text-xs text-white/90 shadow-lg backdrop-blur border border-white/10'
              >
                <svg className='h-3.5 w-3.5 text-amber-400' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
                  <circle cx='11' cy='11' r='8' />
                  <path d='m21 21-4.3-4.3' />
                  <path d='M11 8v6M8 11h6' strokeLinecap='round' />
                </svg>
                <span>Pinch or double-tap to zoom • Swipe for next</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Thumbnail Strip & Caption */}
        <div className={`relative z-30 transition-opacity duration-300 ${scale > 1.2 ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <div className='bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pt-3 pb-4 sm:px-6'>
            {/* Title display */}
            <div className='mb-2 text-center text-xs font-semibold text-white/80 line-clamp-1'>
              {productName}
            </div>

            {/* Thumbnail carousel if multiple images */}
            {images.length > 1 && (
              <div className='flex justify-center gap-2 overflow-x-auto py-1 scrollbar-none'>
                {images.map((img, idx) => (
                  <button
                    key={img + idx}
                    type='button'
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative h-12 ${isHome ? 'w-11' : 'w-10'} shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                      idx === currentIndex
                        ? 'border-amber-400 scale-105 shadow-md ring-1 ring-amber-400'
                        : 'border-white/30 opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <Image src={img} alt='' fill className='object-contain' sizes='40px' />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
