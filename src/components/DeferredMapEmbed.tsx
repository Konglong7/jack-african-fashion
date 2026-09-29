'use client';

import { useState } from 'react';

type DeferredMapEmbedProps = {
  src: string;
  title: string;
};

export function DeferredMapEmbed({ src, title }: DeferredMapEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <button
        type='button'
        onClick={() => setLoaded(true)}
        aria-label={`Load interactive map: ${title}`}
        className='bg-brand-cream text-brand-brown flex h-[340px] w-full flex-col items-center justify-center gap-2 px-6 text-center sm:h-[430px]'
      >
        <span className='text-brand-orange text-sm font-bold tracking-[0.18em] uppercase'>
          Interactive map
        </span>
        <span className='text-brand-black font-bold'>Click to load Google Maps</span>
        <span className='text-brand-brown/70 text-sm'>Loads only when you need directions.</span>
      </button>
    );
  }

  return (
    <iframe
      title={title}
      src={src}
      loading='lazy'
      referrerPolicy='no-referrer-when-downgrade'
      className='h-[340px] w-full sm:h-[430px]'
    />
  );
}
