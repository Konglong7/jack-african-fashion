'use client';

import { useEffect, useState } from 'react';

interface ImageMeta {
  width: number | null;
  height: number | null;
  loading: boolean;
}

/**
 * Reads the natural pixel dimensions of an image URL.
 * Returns { width, height, loading } so upload/gallery thumbnails can show
 * a "1920×2560" meta line without blocking first paint. Dimensions resolve
 * async via a hidden Image() — the thumbnail renders immediately and the
 * meta fills in once the image decodes.
 */
export function useImageMeta(url: string): ImageMeta {
  const [meta, setMeta] = useState<ImageMeta>({
    width: null,
    height: null,
    loading: true
  });

  useEffect(() => {
    if (!url) {
      setMeta({ width: null, height: null, loading: false });
      return;
    }

    setMeta({ width: null, height: null, loading: true });

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      setMeta({ width: img.naturalWidth, height: img.naturalHeight, loading: false });
    };
    img.onerror = () => {
      if (cancelled) return;
      setMeta({ width: null, height: null, loading: false });
    };
    img.src = url;

    return () => {
      cancelled = true;
    };
  }, [url]);

  return meta;
}
