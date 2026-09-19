import { describe, expect, test } from 'vitest';
import { buildCustomerLink } from '../../lib/customerLink';

describe('customer link generator', () => {
  test('builds a WhatsApp campaign link from a customer alias', () => {
    expect(buildCustomerLink('https://example.com', ' Ghana-Amina ')).toEqual({
      url: 'https://example.com/?utm_source=whatsapp&utm_campaign=Ghana-Amina',
      error: ''
    });
  });

  test('rejects empty aliases and phone numbers', () => {
    expect(buildCustomerLink('https://example.com', '').error).toBe('Enter a customer alias.');
    expect(buildCustomerLink('https://example.com', '+233 55 123 4567').error).toBe(
      'Use a short alias, not a phone number.'
    );
  });
});
