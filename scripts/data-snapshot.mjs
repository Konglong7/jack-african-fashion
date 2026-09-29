import { copyFile, mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SUPPORTED_FILES = ['products.json', 'site-content.json'];

function assertInside(directory, candidate, label) {
  const relativePath = relative(directory, candidate);
  if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    throw new Error(`${label} path escapes its allowed directory`);
  }
}

function resolveSnapshotDirectory(backupRoot, snapshotName) {
  if (!snapshotName || snapshotName !== basename(snapshotName) || snapshotName.includes('..')) {
    throw new Error('Invalid snapshot name');
  }
  const root = resolve(backupRoot);
  const snapshotDir = resolve(root, snapshotName);
  assertInside(root, snapshotDir, 'Snapshot');
  return snapshotDir;
}

function basename(value) {
  return value.split(/[\\/]/).pop();
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function sha256(filePath) {
  const content = await readFile(filePath);
  return {
    size: content.byteLength,
    sha256: createHash('sha256').update(content).digest('hex')
  };
}

async function readAndValidateManifest(snapshotDir) {
  const manifestPath = join(snapshotDir, 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (!Array.isArray(manifest.files)) {
    throw new Error('Invalid snapshot manifest');
  }

  const seen = new Set();
  for (const record of manifest.files) {
    if (
      !record ||
      !SUPPORTED_FILES.includes(record.name) ||
      seen.has(record.name) ||
      typeof record.size !== 'number' ||
      typeof record.sha256 !== 'string'
    ) {
      throw new Error('Invalid snapshot manifest');
    }
    seen.add(record.name);
    const filePath = resolve(snapshotDir, record.name);
    assertInside(snapshotDir, filePath, 'Snapshot file');
    if (!(await exists(filePath))) {
      throw new Error(`Snapshot file is missing: ${record.name}`);
    }
    const actual = await sha256(filePath);
    if (actual.size !== record.size || actual.sha256 !== record.sha256) {
      throw new Error(`Snapshot file hash mismatch: ${record.name}`);
    }
  }

  return manifest;
}

export async function createSnapshot({ projectRoot, backupRoot, now = new Date() }) {
  const dataRoot = resolve(projectRoot, 'data');
  const snapshotRoot = resolve(backupRoot);
  await mkdir(snapshotRoot, { recursive: true });
  const snapshotName = now.toISOString().replace(/[:.]/g, '-');
  const snapshotDir = resolveSnapshotDirectory(snapshotRoot, snapshotName);
  await mkdir(snapshotDir);

  const files = [];
  for (const fileName of SUPPORTED_FILES) {
    const source = resolve(dataRoot, fileName);
    if (!(await exists(source))) {
      continue;
    }
    const sourceStat = await stat(source);
    if (!sourceStat.isFile()) {
      throw new Error(`Data path is not a file: ${fileName}`);
    }
    const target = resolve(snapshotDir, fileName);
    assertInside(snapshotDir, target, 'Snapshot file');
    await copyFile(source, target);
    const checksum = await sha256(target);
    files.push({ name: fileName, ...checksum });
  }

  await writeFile(
    join(snapshotDir, 'manifest.json'),
    `${JSON.stringify({ createdAt: now.toISOString(), files }, null, 2)}\n`,
    'utf8'
  );
  return { name: snapshotName, snapshotDir, files: files.map(({ name }) => name) };
}

export async function listSnapshots({ backupRoot }) {
  const root = resolve(backupRoot);
  if (!(await exists(root))) {
    return [];
  }
  const entries = await readdir(root, { withFileTypes: true });
  const snapshots = [];
  for (const entry of entries
    .filter((item) => item.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))) {
    const snapshotDir = resolveSnapshotDirectory(root, entry.name);
    try {
      const manifest = await readAndValidateManifest(snapshotDir);
      snapshots.push({ name: entry.name, valid: true, fileCount: manifest.files.length });
    } catch {
      snapshots.push({ name: entry.name, valid: false, fileCount: 0 });
    }
  }
  return snapshots;
}

export async function restoreSnapshot({ projectRoot, backupRoot, snapshotName, confirm }) {
  if (confirm !== true) {
    throw new Error('Restore requires --confirm');
  }
  const snapshotDir = resolveSnapshotDirectory(backupRoot, snapshotName);
  const manifest = await readAndValidateManifest(snapshotDir);
  const dataRoot = resolve(projectRoot, 'data');
  await mkdir(dataRoot, { recursive: true });

  const staged = [];
  try {
    for (const record of manifest.files) {
      const source = resolve(snapshotDir, record.name);
      const target = resolve(dataRoot, record.name);
      assertInside(dataRoot, target, 'Data file');
      const temporary = join(dataRoot, `.${record.name}.${randomUUID()}.tmp`);
      await copyFile(source, temporary);
      staged.push({ temporary, target });
    }
    for (const { temporary, target } of staged) {
      await rename(temporary, target);
    }
  } finally {
    await Promise.all(staged.map(({ temporary }) => rm(temporary, { force: true })));
  }

  return { files: manifest.files.map(({ name }) => name) };
}

async function main() {
  const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const projectRoot = repositoryRoot;
  const backupRoot = join(repositoryRoot, 'backups', 'data');
  const [command, snapshotName, confirmation] = process.argv.slice(2);

  if (command === 'backup') {
    const snapshot = await createSnapshot({ projectRoot, backupRoot });
    console.log(`Created snapshot: ${snapshot.name}`);
    console.log(`Files: ${snapshot.files.join(', ') || 'none'}`);
    return;
  }
  if (command === 'list') {
    const snapshots = await listSnapshots({ backupRoot });
    if (snapshots.length === 0) {
      console.log('No data snapshots found');
      return;
    }
    snapshots.forEach((snapshot) =>
      console.log(
        `${snapshot.name} | ${snapshot.valid ? 'valid' : 'invalid'} | ${snapshot.fileCount} files`
      )
    );
    return;
  }
  if (command === 'restore') {
    const result = await restoreSnapshot({
      projectRoot,
      backupRoot,
      snapshotName,
      confirm: confirmation === '--confirm'
    });
    console.log(`Restored: ${result.files.join(', ') || 'none'}`);
    return;
  }

  throw new Error(
    'Usage: node scripts/data-snapshot.mjs backup | list | restore <snapshot-name> --confirm'
  );
}

const entryFile = process.argv[1] ? resolve(process.argv[1]) : null;
if (entryFile && entryFile === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
