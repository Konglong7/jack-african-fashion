import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { afterEach, describe, expect, it } from 'vitest';
import { verifyAssetManifest } from './verify-assets.mjs';

const temporaryRoots: string[] = [];
const execFileAsync = promisify(execFile);

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true }))
  );
});

async function createFixture(products: unknown, files: string[] = []) {
  const root = await mkdtemp(join(tmpdir(), 'jack-assets-'));
  temporaryRoots.push(root);
  const publicDir = join(root, 'public');
  const productFile = join(root, 'products.json');
  await mkdir(join(publicDir, 'images', 'products'), { recursive: true });
  await writeFile(productFile, JSON.stringify(products), 'utf8');
  await Promise.all(
    files.map(async (file) => {
      const target = join(publicDir, file.replace(/^\//, ''));
      await mkdir(join(target, '..'), { recursive: true });
      await writeFile(target, 'fixture', 'utf8');
    })
  );
  return { publicDir, productFile };
}

describe('verifyAssetManifest', () => {
  it('collects nested local images, counts external URLs, and warns on unregistered batch files', async () => {
    const fixture = await createFixture(
      [
        {
          image: '/images/products/hero.webp',
          images: ['/images/products/hero.webp', 'https://cdn.example.com/remote.webp'],
          detailPage: { detailSections: [{ image: '/images/products/detail.webp' }] }
        }
      ],
      [
        'images/products/hero.webp',
        'images/products/detail.webp',
        'images/products/0921001.png',
        'images/products/0921002.png'
      ]
    );

    const result = await verifyAssetManifest(fixture);

    expect(result.referencedCount).toBe(3);
    expect(result.externalCount).toBe(1);
    expect(result.missing).toEqual([]);
    expect(result.invalidLocal).toEqual([]);
    expect(result.unregisteredBatch).toEqual(['0921001.png', '0921002.png']);
  });

  it('reports missing local files', async () => {
    const fixture = await createFixture([{ image: '/images/products/missing.webp' }]);

    const result = await verifyAssetManifest(fixture);

    expect(result.missing).toEqual(['/images/products/missing.webp']);
  });

  it('rejects local paths that escape the public directory', async () => {
    const fixture = await createFixture([{ image: '/../secret.webp' }]);

    const result = await verifyAssetManifest(fixture);

    expect(result.invalidLocal).toEqual(['/../secret.webp']);
    expect(result.missing).toEqual([]);
  });

  it('runs the command-line report when invoked as a Node script', async () => {
    const scriptPath = join(process.cwd(), 'scripts', 'verify-assets.mjs');
    const { stdout } = await execFileAsync(process.execPath, [scriptPath], {
      cwd: process.cwd()
    });

    expect(stdout).toContain('Asset references checked:');
  });
});
