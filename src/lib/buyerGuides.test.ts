import { describe, expect, test } from 'vitest';
import { BUYER_GUIDES } from './buyerGuides';

describe('buyer guide claim safety', () => {
  test('does not present an unverified universal catalog MOQ', () => {
    const published = JSON.stringify(BUYER_GUIDES);

    expect(published).not.toMatch(/100[- ]piece/i);
    expect(published).not.toMatch(/catalog minimum (?:is|of) \d+/i);
    expect(published).toContain('confirm');
  });
});
