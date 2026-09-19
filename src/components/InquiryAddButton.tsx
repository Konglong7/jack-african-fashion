'use client';

import { useState } from 'react';
import type { Product } from '@/lib/db';
import type { InquiryItem } from '@/lib/inquiry';
import {
  INQUIRY_STORAGE_KEY,
  mergeInquiryItems,
  notifyInquiryUpdated,
  productToInquiryItem
} from '@/lib/inquiry';

import { CheckIcon } from '@/components/Icons';

export function InquiryAddButton({
  product,
  item,
  className,
  children = 'Add to Inquiry'
}: {
  product: Product;
  item?: Partial<InquiryItem>;
  className: string;
  children?: React.ReactNode;
}) {
  const [added, setAdded] = useState(false);

  function addToInquiry() {
    const current = readInquiryItems();
    const nextItem = { ...productToInquiryItem(product), ...item };
    localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(mergeInquiryItems(current, nextItem)));
    notifyInquiryUpdated(window);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type='button'
      onClick={addToInquiry}
      className={`${className} ${
        added ? 'text-brand-emerald ring-1 ring-brand-emerald/40' : ''
      } transition-all duration-200 active:scale-95`}
    >
      {added ? (
        <span className='inline-flex items-center justify-center gap-1.5'>
          <CheckIcon className='h-3.5 w-3.5 text-brand-emerald shrink-0' />
          Added
        </span>
      ) : (
        children
      )}
    </button>
  );
}

function readInquiryItems(): InquiryItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(INQUIRY_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
