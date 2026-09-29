import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createSnapshot, listSnapshots, restoreSnapshot } from './data-snapshot.mjs';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true }))
  );
});

async function createProject({ includeSiteContent = true } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'jack-data-'));
  temporaryRoots.push(root);
  const projectRoot = join(root, 'project');
  const backupRoot = join(root, 'backups', 'data');
  await mkdir(join(projectRoot, 'data'), { recursive: true });
  await writeFile(join(projectRoot, 'data', 'products.json'), '{"version":1}', 'utf8');
  if (includeSiteContent) {
    await writeFile(join(projectRoot, 'data', 'site-content.json'), '{"headline":"Hello"}', 'utf8');
  }
  await writeFile(join(projectRoot, 'data', 'analytics.json'), '{"private":true}', 'utf8');
  return { projectRoot, backupRoot };
}

describe('data snapshots', () => {
  it('creates a timestamped snapshot with supported files and hashes', async () => {
    const fixture = await createProject();

    const snapshot = await createSnapshot({
      ...fixture,
      now: new Date('2026-09-24T12:34:56.000Z')
    });

    expect(snapshot.files).toEqual(['products.json', 'site-content.json']);
    expect(await readFile(join(snapshot.snapshotDir, 'manifest.json'), 'utf8')).toContain('sha256');
    expect(await readdir(snapshot.snapshotDir)).not.toContain('analytics.json');
  });

  it('requires confirmation before restoring and restores confirmed snapshots', async () => {
    const fixture = await createProject();
    const snapshot = await createSnapshot(fixture);
    const productsFile = join(fixture.projectRoot, 'data', 'products.json');
    await writeFile(productsFile, '{"version":2}', 'utf8');

    await expect(
      restoreSnapshot({ ...fixture, snapshotName: snapshot.name, confirm: false })
    ).rejects.toThrow('confirm');
    expect(await readFile(productsFile, 'utf8')).toBe('{"version":2}');

    await restoreSnapshot({ ...fixture, snapshotName: snapshot.name, confirm: true });
    expect(await readFile(productsFile, 'utf8')).toBe('{"version":1}');
  });

  it('rejects a tampered snapshot before changing the current data', async () => {
    const fixture = await createProject();
    const snapshot = await createSnapshot(fixture);
    const productsFile = join(fixture.projectRoot, 'data', 'products.json');
    await writeFile(join(snapshot.snapshotDir, 'products.json'), '{"version":99}', 'utf8');
    await writeFile(productsFile, '{"version":2}', 'utf8');

    await expect(
      restoreSnapshot({ ...fixture, snapshotName: snapshot.name, confirm: true })
    ).rejects.toThrow('hash');
    expect(await readFile(productsFile, 'utf8')).toBe('{"version":2}');
  });

  it('rejects traversal snapshot names and allows a missing optional site-content file', async () => {
    const fixture = await createProject({ includeSiteContent: false });
    const snapshot = await createSnapshot(fixture);

    expect(snapshot.files).toEqual(['products.json']);
    await expect(
      restoreSnapshot({ ...fixture, snapshotName: `../${snapshot.name}`, confirm: true })
    ).rejects.toThrow('snapshot');
  });

  it('lists snapshots with manifest validity without exposing data fields', async () => {
    const fixture = await createProject();
    await createSnapshot(fixture);

    const snapshots = await listSnapshots(fixture);

    expect(snapshots).toHaveLength(1);
    expect(snapshots[0]).toMatchObject({ valid: true, fileCount: 2 });
    expect(JSON.stringify(snapshots)).not.toContain('Hello');
  });
});
