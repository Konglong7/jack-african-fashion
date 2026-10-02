'use client';

import Image from './ResponsiveImage';
import { useState } from 'react';
import type { ImageProps } from 'next/image';
import { isSupportedImageSource } from '../lib/imageSource';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Sizes attribute for responsive image loading. */
  sizes?: string;
  /** Show the product name overlay on placeholder (default true). */
  showName?: boolean;
  /** Mark as above-the-fold for the LCP image. */
  priority?: boolean;
  /** Product photos default to contain so every aspect ratio stays visible. */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  /** Image position within container, e.g. 'object-top' or 'object-center'. */
  objectPosition?: string;
  onLoad?: ImageProps['onLoad'];
}

/**
 * Product image with automatic placeholder fallback.
 *
 * Uses next/image so the browser gets responsive, AVIF/WebP-optimized
 * variants sized to the slot — the optimizer is already enabled in
 * next.config.ts. If the photo is missing (404), it falls back to a
 * branded gradient placeholder showing the product name, so the site
 * always looks complete even before real photos are added.
 *
 * Usage: drop the real photo into the path defined in products.ts
 * (e.g. /images/products/elegant-pleated-maxi-dress.webp) and it will
 * appear automatically on next refresh.
 */
export function ProductImage({
  src,
  alt,
  className = '',
  sizes = '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw',
  showName = true,
  priority = false,
  objectFit = 'contain',
  objectPosition,
  onLoad
}: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  // ponytail: next/image rejects src that isn't a root-relative path or absolute URL,
  // and that rejection crashes the whole page (one bad product shouldn't take down the
  // home grid). Treat anything else as missing → placeholder.
  const isValidSrc = isSupportedImageSource(src);

  if (failedSrc !== src && isValidSrc) {
    const hasExplicitFit = /object-(cover|contain|fill|none)/.test(className);
    const fitClass = hasExplicitFit
      ? ''
      : objectFit === 'contain'
        ? 'object-contain'
        : objectFit === 'fill'
          ? 'object-fill'
          : objectFit === 'none'
            ? 'object-none'
            : 'object-cover';

    const posClass = objectPosition
      ? objectPosition.startsWith('object-')
        ? objectPosition
        : `object-${objectPosition}`
      : '';

    return (
      <Image
        key={src}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={85}
        onError={() => setFailedSrc(src)}
        onLoad={onLoad}
        className={[fitClass, posClass, className].filter(Boolean).join(' ')}
      />
    );
  }

  // Placeholder fallback when the real photo is not yet uploaded
  return (
    <div
      className={`from-brand-sand/40 to-brand-sand/20 absolute inset-0 flex items-center justify-center bg-gradient-to-br ${className}`}
    >
      <div className='px-4 text-center'>
        <div className='bg-brand-orange/10 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full'>
          <svg
            className='text-brand-orange h-8 w-8'
            fill='none'
            stroke='currentColor'
            strokeWidth={1.5}
            viewBox='0 0 24 24'
          >
            <path d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' />
          </svg>
        </div>
        {showName && <p className='text-brand-brown/60 line-clamp-2 text-xs font-medium'>{alt}</p>}
      </div>
    </div>
  );
}
