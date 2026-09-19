'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageLightboxProps {
  images: string[];
  /** null = closed. Otherwise the index into `images` currently shown. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

/**
 * Full-screen image preview with keyboard navigation (← → ESC).
 * Used by both the upload queue (pre-upload previews) and the uploaded
 * gallery (post-upload previews). Clicking the backdrop or pressing ESC
 * closes; arrow keys wrap around.
 */
export function ImageLightbox({ images, index, onClose, onIndexChange }: ImageLightboxProps) {
  const open = index !== null && index >= 0 && index < images.length;

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && index !== null) {
        onIndexChange((index - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowRight' && index !== null) {
        onIndexChange((index + 1) % images.length);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, index, images.length, onClose, onIndexChange]);

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Close */}
          <button
            type='button'
            onClick={onClose}
            aria-label='Close preview'
            className='absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20'
          >
            <svg className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
              <path d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  onIndexChange((index - 1 + images.length) % images.length);
                }}
                aria-label='Previous image'
                className='absolute top-1/2 left-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20'
              >
                <svg className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
                  <path d='M15 19l-7-7 7-7' />
                </svg>
              </button>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  onIndexChange((index + 1) % images.length);
                }}
                aria-label='Next image'
                className='absolute top-1/2 right-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20'
              >
                <svg className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
                  <path d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </>
          )}

          <motion.img
            key={images[index]}
            src={images[index]}
            alt='Preview'
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className='max-h-[85vh] max-w-[90vw] rounded-lg object-contain'
            onClick={(e) => e.stopPropagation()}
          />

          {/* Counter */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white'>
            {index + 1} / {images.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
