import { describe, expect, test } from 'vitest';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prepareIndexNowKey } from './prepare-indexnow-key.mjs';

describe('IndexNow ownership proof preparation', () => {
  test('creates a valid UTF-8 proof once and never rotates an existing key', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'indexnow-proof-'));
    try {
      const file = join(directory, 'indexnow-key.txt');
      const created = await prepareIndexNowKey(file);
      const key = await readFile(file, 'utf8');
      expect(key).toMatch(/^[a-f0-9]{32}$/);
      expect(created).toMatchObject({ created: true, file });
      expect(JSON.stringify(created)).not.toContain(key);
      expect(await prepareIndexNowKey(file)).toMatchObject({
        created: false,
        sha256: created.sha256
      });
      expect(await readFile(file, 'utf8')).toBe(key);
      await writeFile(file, 'existing-valid-owner-key');
      expect(await prepareIndexNowKey(file)).toMatchObject({ created: false });
      expect(await readFile(file, 'utf8')).toBe('existing-valid-owner-key');
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  test('reports invalid existing proof without replacing its contents', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'indexnow-invalid-proof-'));
    try {
      const file = join(directory, 'indexnow-key.txt');
      await writeFile(file, 'invalid owner key');
      await expect(prepareIndexNowKey(file)).rejects.toThrow('invalid');
      expect(await readFile(file, 'utf8')).toBe('invalid owner key');
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
