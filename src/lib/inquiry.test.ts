import { describe, expect, test } from 'vitest';
import type { InquiryItem } from './inquiry';
import {
  buildInquiryMessage,
  getInquiryItemCount,
  INQUIRY_STORAGE_KEY,
  INQUIRY_UPDATED_EVENT,
  mergeInquiryItems,
  normalizeInquiryItems,
  notifyInquiryUpdated
} from './inquiry';

describe('inquiry helpers', () => {
  const dress: InquiryItem = {
    id: '1',
    name: 'Pleated Maxi Dress',
    slug: 'pleated-maxi-dress',
    image: '/images/products/dress.jpg',
    quantity: 50,
    color: 'Black',
    size: 'XL'
  };

  test('merges the same product instead of duplicating it', () => {
    const merged = mergeInquiryItems([dress], { ...dress, quantity: 120, color: 'Wine' });

    expect(merged).toHaveLength(1);
    expect(merged[0]).toMatchObject({ quantity: 120, color: 'Wine' });
  });

  test('builds a buyer-ready whatsapp inquiry message', () => {
    expect(buildInquiryMessage([dress])).toContain('Pleated Maxi Dress');
    expect(buildInquiryMessage([dress])).toContain('Style No: pleated-maxi-dress');
    expect(buildInquiryMessage([dress])).toContain(
      'Requested quantity: 50 pcs (subject to MOQ confirmation)'
    );
  });

  test('drops legacy unverified MOQ data while preserving the buyer request', () => {
    const saved = { ...dress, moq: 500, quantity: 600 };
    const normalized = normalizeInquiryItems([saved]);

    expect(normalized[0]).toMatchObject({ quantity: 600, color: 'Black', size: 'XL' });
    expect(normalized[0]).not.toHaveProperty('moq');
  });

  test('counts selected styles from local storage', () => {
    const storage = {
      getItem: (key: string) =>
        key === INQUIRY_STORAGE_KEY ? JSON.stringify([dress, dress]) : null
    };

    expect(getInquiryItemCount(storage)).toBe(2);
  });

  test('treats empty or invalid storage as an empty inquiry cart', () => {
    expect(getInquiryItemCount({ getItem: () => null })).toBe(0);
    expect(getInquiryItemCount({ getItem: () => 'not json' })).toBe(0);
  });

  test('dispatches the inquiry update event', () => {
    const events: string[] = [];
    const target = {
      dispatchEvent: (event: Event) => {
        events.push(event.type);
        return true;
      }
    };

    notifyInquiryUpdated(target);

    expect(events).toEqual([INQUIRY_UPDATED_EVENT]);
  });
});
