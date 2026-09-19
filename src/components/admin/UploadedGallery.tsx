'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useImageMeta } from '@/lib/useImageMeta';

interface UploadedFile {
  name: string;
  url: string;
  size?: number;
}

interface UploadedGalleryProps {
  uploaded: UploadedFile[];
  errors: string[];
  onPreview: (index: number) => void;
}

/**
 * Post-upload gallery: thumbnail grid + filename + Copy URL (with "Copied!"
 * feedback) + View button. Replaces the old plain-text list.
 */
export function UploadedGallery({ uploaded, errors, onPreview }: UploadedGalleryProps) {
  const [copiedName, setCopiedName] = useState<string | null>(null);

  if (uploaded.length === 0 && errors.length === 0) return null;

  async function copyUrl(url: string, name: string) {
    try {
      await navigator.clipboard.writeText(new URL(url, window.location.origin).toString());
      setCopiedName(name);
      setTimeout(() => setCopiedName((current) => (current === name ? null : current)), 1500);
    } catch {
      // Clipboard unavailable — silently ignore
    }
  }

  return (
    <div className='mt-6 rounded-xl bg-white p-4 shadow-sm'>
      {uploaded.length > 0 && (
        <div className='mb-4'>
          <p className='text-brand-emerald mb-3 text-sm font-medium'>
            ✅ {uploaded.length} image(s) uploaded successfully
          </p>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            {uploaded.map((f, i) => (
              <UploadedItem
                key={f.name}
                file={f}
                copied={copiedName === f.name}
                onPreview={() => onPreview(i)}
                onCopy={() => copyUrl(f.url, f.name)}
              />
            ))}
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className='mt-4 rounded-lg border border-red-100 bg-red-50 p-3'>
          <p className='mb-2 text-sm font-medium text-red-600'>
            ❌ {errors.length} file(s) could not be uploaded
          </p>
          <ul className='space-y-1 text-xs text-red-600'>
            {errors.map((e) => (
              <li key={e} className='font-mono'>
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function UploadedItem({
  file,
  copied,
  onPreview,
  onCopy
}: {
  file: UploadedFile;
  copied: boolean;
  onPreview: () => void;
  onCopy: () => void;
}) {
  const meta = useImageMeta(file.url);
  const sizeKb = file.size ? `${(file.size / 1024).toFixed(0)}KB` : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='bg-brand-sand group relative overflow-hidden rounded-lg'
    >
      <button
        type='button'
        onClick={onPreview}
        className='block aspect-[3/4] w-full'
        aria-label={`Preview ${file.name}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={file.url} alt={file.name} className='h-full w-full object-cover' />
      </button>

      {/* Meta bar */}
      <div className='absolute inset-x-0 bottom-8 bg-black/70 px-1.5 py-1 text-[10px] text-white'>
        {meta.loading ? (
          <span className='opacity-60'>…</span>
        ) : meta.width && meta.height ? (
          <span className='font-mono'>
            {meta.width}×{meta.height}
            {sizeKb ? ` · ${sizeKb}` : ''}
          </span>
        ) : (
          <span className='font-mono'>{sizeKb}</span>
        )}
      </div>

      {/* Filename + actions */}
      <div className='flex items-center justify-between gap-1 bg-white px-2 py-1.5'>
        <code className='text-brand-brown truncate font-mono text-[10px]'>{file.name}</code>
        <div className='flex shrink-0 items-center gap-1'>
          <button
            type='button'
            onClick={onCopy}
            className='text-brand-brown hover:text-brand-orange rounded p-1 transition-colors'
            aria-label='Copy URL'
          >
            {copied ? (
              <svg className='h-3.5 w-3.5 text-brand-emerald' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' />
              </svg>
            ) : (
              <svg className='h-3.5 w-3.5' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
                <path d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h6a2 2 0 002-2M8 5a2 2 0 012-2h6a2 2 0 012 2v0M16 17h2a2 2 0 002-2V7a2 2 0 00-2-2' />
              </svg>
            )}
          </button>
          <button
            type='button'
            onClick={onPreview}
            className='text-brand-brown hover:text-brand-orange rounded p-1 transition-colors'
            aria-label='View'
          >
            <svg className='h-3.5 w-3.5' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
              <path d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
              <path d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
            </svg>
          </button>
        </div>
      </div>
      {copied && (
        <span className='text-brand-emerald absolute right-1 bottom-1 rounded bg-brand-cream/90 px-1.5 py-0.5 text-[9px] font-semibold'>
          Copied!
        </span>
      )}
    </motion.div>
  );
}
