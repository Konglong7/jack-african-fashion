import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn()
  }
}));

describe('getProducts', () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns an empty list when products.json contains a non-array JSON value', async () => {
    const { promises: fs } = await import('fs');
    vi.mocked(fs.readFile).mockResolvedValueOnce('{"products": []}');

    const { getProducts } = await import('./db');
    const products = await getProducts();

    expect(products).toEqual([]);
  });
});
