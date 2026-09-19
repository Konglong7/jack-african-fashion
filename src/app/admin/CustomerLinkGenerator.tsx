'use client';

import { useState } from 'react';
import { buildCustomerLink } from '@/lib/customerLink';

export function CustomerLinkGenerator({ siteUrl = '' }: { siteUrl?: string }) {
  const [alias, setAlias] = useState('');
  const [result, setResult] = useState({ url: '', error: '' });
  const [copied, setCopied] = useState(false);

  function generate(event: React.FormEvent) {
    event.preventDefault();
    setCopied(false);
    setResult(buildCustomerLink(siteUrl || window.location.origin, alias));
  }

  async function copyLink() {
    if (!result.url) return;
    await navigator.clipboard.writeText(result.url);
    setCopied(true);
  }

  return (
    <form onSubmit={generate} className='border-brand-sand/60 rounded-lg border p-4'>
      <h3 className='text-brand-black text-sm font-bold'>Customer link generator</h3>
      <p className='text-brand-brown/60 mt-1 text-xs leading-5'>
        Use a short alias such as Ghana-Amina. Do not enter a phone number.
      </p>
      <div className='mt-3 flex flex-col gap-2 sm:flex-row'>
        <input
          value={alias}
          onChange={(event) => setAlias(event.target.value)}
          maxLength={50}
          placeholder='Ghana-Amina'
          aria-label='Customer alias'
          className='border-brand-sand text-brand-black min-w-0 flex-1 rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-brand-orange'
        />
        <button
          type='submit'
          className='bg-brand-black hover:bg-brand-orange rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors'
        >
          Generate link
        </button>
      </div>
      {result.error && <p className='mt-2 text-xs font-semibold text-red-600'>{result.error}</p>}
      {result.url && (
        <div className='mt-3 flex flex-col gap-2 sm:flex-row'>
          <input
            readOnly
            value={result.url}
            aria-label='Generated customer link'
            className='bg-brand-cream text-brand-brown min-w-0 flex-1 rounded-lg px-3 py-2 text-xs'
          />
          <button
            type='button'
            onClick={copyLink}
            className='border-brand-sand text-brand-black rounded-lg border px-4 py-2 text-sm font-bold hover:border-brand-orange'
          >
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      )}
    </form>
  );
}
