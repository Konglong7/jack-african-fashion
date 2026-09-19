'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { UploadQueue } from '@/components/admin/UploadQueue';
import { UploadedGallery } from '@/components/admin/UploadedGallery';
import { ImageLightbox } from '@/components/admin/ImageLightbox';

interface UploadResult {
  uploaded: { name: string; url: string; size: number }[];
  errors: string[];
}

// Drag & drop + file picker for batch image uploads.
// Files are POSTed to /api/admin/upload and saved to public/images/products/.
// Preview UX mirrors 1688 / Shopify: drag-to-reorder queue with a cover badge,
// per-file meta, a lightbox, and a post-upload gallery with copy-URL.
export default function AdminUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [slug, setSlug] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      /\.(jpg|jpeg|png|webp)$/i.test(f.name)
    );
    setFiles((prev) => [...prev, ...dropped]);
    setResult(null);
  }

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []).filter((f) =>
      /\.(jpg|jpeg|png|webp)$/i.test(f.name)
    );
    setFiles((prev) => [...prev, ...picked]);
    setResult(null);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (files.length === 0) return;
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    if (slug.trim()) formData.append('slug', slug.trim());

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setResult(data);
      if (data.ok && data.uploaded?.length) {
        setFiles([]);
        setSlug('');
      }
    } catch {
      setResult({ uploaded: [], errors: ['Network error'] });
    } finally {
      setUploading(false);
    }
  }

  // Safely manage blob URLs for file previews and revoke on cleanup
  const filePreviewUrls = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );

  useEffect(() => {
    return () => {
      filePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviewUrls]);

  // Lightbox shows the relevant set depending on what's being previewed.
  const lightboxImages =
    lightboxIndex !== null && result?.uploaded?.length
      ? result.uploaded.map((f) => f.url)
      : filePreviewUrls;

  return (
    <div className='mx-auto max-w-3xl'>
      <div className='mb-6'>
        <h1 className='text-brand-black text-2xl font-bold sm:text-3xl'>Upload Images</h1>
        <p className='text-brand-brown/60 mt-1 text-sm'>
          Drag & drop or select product photos. Reorder before uploading — the first image becomes
          the cover.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className='border-brand-sand hover:border-brand-orange cursor-pointer rounded-xl border-2 border-dashed bg-white p-8 text-center transition-colors'
      >
        <input
          ref={inputRef}
          type='file'
          accept='.jpg,.jpeg,.png,.webp'
          multiple
          onChange={handlePick}
          className='hidden'
        />
        <svg
          className='text-brand-sand mx-auto h-12 w-12'
          fill='none'
          stroke='currentColor'
          strokeWidth={1}
          viewBox='0 0 24 24'
        >
          <path d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v12' />
        </svg>
        <p className='text-brand-brown mt-3 text-sm font-medium'>
          Drop images here or click to select
        </p>
        <p className='text-brand-brown/50 mt-1 text-xs'>JPG, PNG, WebP up to 8MB each</p>
      </div>

      {/* Slug prefix */}
      <div className='mt-4'>
        <label className='text-brand-brown mb-1 block text-sm font-medium'>
          Filename prefix (optional)
        </label>
        <input
          type='text'
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder='e.g. elegant-pleated-maxi-dress'
          className='border-brand-sand focus:ring-brand-orange text-brand-black w-full rounded-lg border px-4 py-2.5 font-mono text-sm focus:ring-2 focus:outline-none'
        />
        <p className='text-brand-brown/50 mt-1 text-xs'>
          With prefix, files become: <code>prefix.jpg</code>, <code>prefix-2.jpg</code>, etc.
        </p>
      </div>

      {/* Pre-upload queue */}
      <UploadQueue
        files={files}
        onReorder={setFiles}
        onRemove={removeFile}
        onClear={() => setFiles([])}
        onPreview={setLightboxIndex}
      />

      {/* Upload button */}
      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className='bg-brand-orange hover:bg-brand-gold mt-4 w-full rounded-lg py-3 font-semibold text-white transition-colors disabled:opacity-50'
        >
          {uploading ? 'Uploading...' : `Upload ${files.length} Image(s)`}
        </button>
      )}

      {/* Post-upload gallery */}
      {result && (
        <UploadedGallery
          uploaded={result.uploaded}
          errors={result.errors}
          onPreview={setLightboxIndex}
        />
      )}

      {/* Tip */}
      <div className='bg-brand-cream mt-8 rounded-xl p-5'>
        <h3 className='text-brand-black mb-2 text-sm font-semibold'>💡 Tips for batch uploads</h3>
        <ul className='text-brand-brown space-y-1.5 text-xs'>
          <li>
            • Use the prefix field to match a product slug (e.g.{' '}
            <code>elegant-pleated-maxi-dress</code>)
          </li>
          <li>• Drag the first image to the top — it becomes the main product photo</li>
          <li>• Recommended size: 1200×1600 px (3:4 ratio), under 500KB each</li>
        </ul>
      </div>

      <ImageLightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
