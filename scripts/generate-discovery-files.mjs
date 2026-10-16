import { readFile, writeFile } from 'node:fs/promises';
import { buildDiscoveryFiles } from './discovery-content.mjs';

const [site, claims, products] = await Promise.all([
  readJson('data/site-content.json'),
  readJson('data/content-claims.json'),
  readJson('data/products.json')
]);
const generated = buildDiscoveryFiles({ site, claims, products });
const outputs = [
  ['public/llms.txt', generated.llms],
  ['public/llms-full.txt', generated.full]
];

if (process.argv.includes('--check')) {
  const mismatches = [];
  for (const [path, content] of outputs) {
    const existing = await readFile(path, 'utf8').catch(() => '');
    if (existing !== content) mismatches.push(path);
  }
  if (mismatches.length) {
    console.error(`Discovery files are stale: ${mismatches.join(', ')}`);
    process.exitCode = 1;
  } else {
    console.log('Discovery files match canonical site, claim and product data.');
  }
} else {
  await Promise.all(outputs.map(([path, content]) => writeFile(path, content, 'utf8')));
  console.log(`Generated ${outputs.map(([path]) => path).join(' and ')}.`);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}
