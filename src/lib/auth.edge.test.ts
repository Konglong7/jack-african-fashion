import { readFile } from 'fs/promises';
import { describe, expect, it } from 'vitest';

describe('auth edge compatibility', () => {
  it('does not import Node-only crypto APIs used by middleware', async () => {
    const source = await readFile(new URL('./auth.ts', import.meta.url), 'utf-8');

    expect(source).not.toContain("from 'crypto'");
    expect(source).not.toContain('Buffer.');
  });
});
