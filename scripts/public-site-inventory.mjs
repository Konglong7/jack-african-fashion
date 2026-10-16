import { readFile, writeFile } from 'node:fs/promises';
const manifest = JSON.parse(await readFile('.next/prerender-manifest.json', 'utf8'));
const paths = Object.keys(manifest.routes)
  .filter(
    (value) =>
      !/^\/(?:_|admin|api|inquiry)/.test(value) &&
      !/\.(?:xml|txt|webmanifest|ico|svg|png|jpe?g|webp)$/.test(value)
  )
  .sort();
if (!paths.includes('/') || !paths.includes('/guides'))
  throw new Error('Public build inventory is incomplete');
const report = { count: paths.length, paths };
if (process.argv[2]) await writeFile(process.argv[2], JSON.stringify(report, null, 2));
console.log(
  JSON.stringify({
    public_pages: paths.length,
    products: paths.filter((value) => value.startsWith('/products/')).length,
    guides: paths.filter((value) => value.startsWith('/guides/')).length
  })
);
