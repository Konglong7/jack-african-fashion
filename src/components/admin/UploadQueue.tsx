'use client';

import { useEffect, useMemo } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { useImageMeta } from '@/lib/useImageMeta';

interface UploadQueueProps {
  files: File[];
  onReorder: (files: File[]) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
  onPreview: (index: number) => void;
}

/**
 * Pre-upload queue with drag-to-reorder, a "Cover / 主图" badge on the
 * first item, per-file dimension/size/format meta, and click-to-preview.
 *
 * Object URLs are created via useMemo and revoked on cleanup so re-renders
 * don't leak blob URLs (the previous inline URL.createObjectURL(f) leaked).
 */
export function UploadQueue({ files, onReorder, onRemove, onClear, onPreview }: UploadQueueProps) {
  const objectUrls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  // Revoke all blob URLs when the queue changes or unmounts.
  useEffect(() => {
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [objectUrls]);

  if (files.length === 0) return null;

  return (
    <div className='mt-6 rounded-xl bg-white p-4 shadow-sm'>
      <div className='mb-3 flex items-center justify-between'>
        <span className='text-brand-brown text-sm font-medium'>
          {files.length} file(s) selected · drag to reorder
        </span>
        <button type='button' onClick={onClear} className='text-xs text-red-600 hover:underline'>
          Clear all
        </button>
      </div>

      <Reorder.Group axis='y' values={files} onReorder={onReorder} className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        {files.map((file, i) => (
          <QueueItem
            key={objectUrls[i] || i}
            file={file}
            url={objectUrls[i]}
            index={i}
            isCover={i === 0}
            onRemove={onRemove}
            onPreview={onPreview}
          />
        ))}
      </Reorder.Group>
    </div>
  );
}

function QueueItem({
  file,
  url,
  index,
  isCover,
  onRemove,
  onPreview
}: {
  file: File;
  url: string;
  index: number;
  isCover: boolean;
  onRemove: (index: number) => void;
  onPreview: (index: number) => void;
}) {
  const controls = useDragControls();
  const meta = useImageMeta(url);
  const sizeKb = (file.size / 1024).toFixed(0);
  const ext = file.name.split('.').pop()?.toUpperCase() || '';

  return (
    <Reorder.Item
      value={file}
      dragListener={false}
      dragControls={controls}
      className='group bg-brand-sand relative aspect-[3/4] cursor-pointer overflow-hidden rounded-lg'
      onClick={() => onPreview(index)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={file.name} className='h-full w-full object-cover' />

      {/* Cover badge */}
      {isCover && (
        <span className='absolute top-1 left-1 z-10 rounded bg-brand-gold px-1.5 py-0.5 text-[10px] font-bold text-white'>
          Cover · 主图
        </span>
      )}

      {/* Drag handle */}
      <button
        type='button'
        onPointerDown={(e) => controls.start(e)}
        onClick={(e) => e.stopPropagation()}
        aria-label='Drag to reorder'
        className='absolute top-1 left-1 z-10 flex h-6 w-6 cursor-grab items-center justify-center rounded bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing'
        style={{ left: isCover ? 'auto' : undefined, right: isCover ? undefined : 'auto' }}
      >
        <svg className='h-4 w-4' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
          <path d='M4 8h16M4 16h16' />
        </svg>
      </button>

      {/* Remove */}
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        aria-label='Remove'
        className='absolute top-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100'
      >
        ×
      </button>

      {/* Meta bar */}
      <div className='absolute inset-x-0 bottom-0 bg-black/70 px-1.5 py-1 text-[10px] text-white'>
        {meta.loading ? (
          <span className='opacity-60'>reading…</span>
        ) : meta.width && meta.height ? (
          <span className='font-mono'>
            {meta.width}×{meta.height} · {sizeKb}KB · {ext}
          </span>
        ) : (
          <span className='font-mono'>
            {sizeKb}KB · {ext}
          </span>
        )}
      </div>
    </Reorder.Item>
  );
}
