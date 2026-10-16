import { createHash, randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/** Prepare local ownership proof without replacing a deployed or existing key. */
export async function prepareIndexNowKey(file) {
  let created = false;
  try {
    await readFile(file, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await mkdir(dirname(file), { recursive: true });
    try {
      await writeFile(file, randomBytes(16).toString('hex'), {
        encoding: 'utf8',
        flag: 'wx',
        mode: 0o644
      });
      created = true;
    } catch (writeError) {
      if (writeError.code !== 'EEXIST') throw writeError;
    }
  }
  const key = (await readFile(file, 'utf8')).trim();
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
    throw new Error('Existing ownership proof is invalid; no file was replaced.');
  }
  return { file, created, sha256: createHash('sha256').update(key).digest('hex') };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length && (args.length !== 2 || args[0] !== '--file')) {
      throw new Error('Usage: node scripts/prepare-indexnow-key.mjs [--file PATH]');
    }
    const file = args.length
      ? resolve(args[1])
      : fileURLToPath(new URL('../public/indexnow-key.txt', import.meta.url));
    console.log(JSON.stringify(await prepareIndexNowKey(file)));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
