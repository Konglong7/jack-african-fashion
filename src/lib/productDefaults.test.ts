import { describe, expect, test } from 'vitest';
import { SIZE_REQUIREMENT_NOTE, getProductSizes } from './productDefaults';

describe('product defaults', () => {
  test('keeps size guidance aligned with visible product sizes', () => {
    expect(SIZE_REQUIREMENT_NOTE).toBe(
      'Available sizes are shown above. Send your preferred size ratio on WhatsApp before quotation.'
    );
    expect(getProductSizes(['M', 'L'])).toEqual(['M', 'L']);
  });
});
