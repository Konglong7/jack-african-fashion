'use client';

import Image, { type ImageProps } from 'next/image';
import imageLoader, { hasPreparedImage } from '../lib/imageLoader';
import imageDimensions from '../lib/generated/imageDimensions.json';

const dimensions: Record<string, { width: number; height: number }> = imageDimensions;

/** Prepared photos avoid request-time processing; new uploads use Next normally. */
export default function ResponsiveImage(props: ImageProps) {
  const prepared = typeof props.src === 'string' && hasPreparedImage(props.src);
  const intrinsic = typeof props.src === 'string' ? dimensions[props.src] : undefined;
  // Keep the existing reserved container while exposing real intrinsic dimensions.
  // Unknown/new uploads retain Next's fill fallback until the next asset build.
  const layout =
    props.fill && intrinsic
      ? {
        fill: false,
        ...intrinsic,
        style: {
          position: 'absolute' as const,
          height: '100%',
          width: '100%',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          ...props.style
        }
      }
      : {};
  return (
    <Image
      {...props}
      {...layout}
      alt={props.alt}
      fetchPriority={props.fetchPriority ?? (props.priority ? 'high' : undefined)}
      {...(prepared ? { loader: imageLoader } : {})}
    />
  );
}
