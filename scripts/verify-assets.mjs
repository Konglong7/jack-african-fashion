import { readdir, readFile, stat } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

function collectImageReferences(value, references = []) {
  if (!value || typeof value !== 'object') {
    return references;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectImageReferences(item, references);
    }
    return references;
  }

  for (const [key, child] of Object.entries(value)) {
    if (key === 'image' && typeof child === 'string') {
      references.push(child);
    } else if (key === 'images' && Array.isArray(child)) {
      for (const image of child) {
        if (typeof image === 'string') {
          references.push(image);
        }
      }
    }
    collectImageReferences(child, references);
  }

  return references;
}

function isInsideDirectory(directory, candidate) {
  const relativePath = relative(directory, candidate);
  return relativePath === '' || (!relativePath.startsWith(`..${sep}`) && !isAbsolute(relativePath));
}

async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

export async function verifyAssetManifest({
  publicDir,
  productFile,
  batchPattern = /^0921.*\.png$/i
}) {
  const publicRoot = resolve(publicDir);
  const products = JSON.parse(await readFile(productFile, 'utf8'));
  const references = [...new Set(collectImageReferences(products))];
  const missing = [];
  const invalidLocal = [];
  const externalReferences = [];
  const referencedLocalFiles = new Set();

  for (const imagePath of references) {
    if (/^https?:\/\//i.test(imagePath)) {
      externalReferences.push(imagePath);
      continue;
    }

    if (!imagePath.startsWith('/')) {
      invalidLocal.push(imagePath);
      continue;
    }

    const candidate = resolve(publicRoot, imagePath.slice(1));
    if (!isInsideDirectory(publicRoot, candidate)) {
      invalidLocal.push(imagePath);
      continue;
    }

    referencedLocalFiles.add(candidate);
    if (!(await isFile(candidate))) {
      missing.push(imagePath);
    }
  }

  const batchDirectory = join(publicRoot, 'images', 'products');
  const unregisteredBatch = [];
  try {
    const entries = await readdir(batchDirectory, { withFileTypes: true });
    for (const entry of entries) {
      const candidate = join(batchDirectory, entry.name);
      if (entry.isFile() && batchPattern.test(entry.name) && !referencedLocalFiles.has(candidate)) {
        unregisteredBatch.push(entry.name);
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  return {
    referencedCount: references.length,
    missing,
    invalidLocal,
    externalCount: externalReferences.length,
    unregisteredBatch: unregisteredBatch.sort()
  };
}

async function main() {
  const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const result = await verifyAssetManifest({
    publicDir: join(repositoryRoot, 'public'),
    productFile: join(repositoryRoot, 'data', 'products.json')
  });

  console.log(`Asset references checked: ${result.referencedCount}`);
  console.log(`External references skipped: ${result.externalCount}`);
  if (result.missing.length > 0) {
    console.error('Missing local assets:');
    result.missing.forEach((imagePath) => console.error(`- ${imagePath}`));
  }
  if (result.invalidLocal.length > 0) {
    console.error('Invalid local asset paths:');
    result.invalidLocal.forEach((imagePath) => console.error(`- ${imagePath}`));
  }
  if (result.unregisteredBatch.length > 0) {
    console.warn(`Unregistered 0921 batch assets (${result.unregisteredBatch.length}):`);
    result.unregisteredBatch.forEach((fileName) => console.warn(`- ${fileName}`));
  }

  if (result.missing.length > 0 || result.invalidLocal.length > 0) {
    process.exitCode = 1;
  }
}

const entryFile = process.argv[1] ? resolve(process.argv[1]) : null;
if (entryFile && entryFile === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
