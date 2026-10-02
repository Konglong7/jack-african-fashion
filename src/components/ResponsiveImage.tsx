'use client';

import Image, { type ImageProps } from 'next/image';
import imageLoader, { hasPreparedImage } from '../lib/imageLoader';

/** Prepared photos avoid request-time processing; new uploads use Next normally. */
export default function ResponsiveImage(props: ImageProps) {
  const prepared = typeof props.src === 'string' && hasPreparedImage(props.src);
  return <Image {...props} alt={props.alt} {...(prepared ? { loader: imageLoader } : {})} />;
}
