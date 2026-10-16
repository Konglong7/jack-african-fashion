import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const writers = new Map<string, Promise<unknown>>();

export function runtimeDataFile(name: string) {
  if (path.basename(name) !== name) throw new Error('Invalid runtime file name');
  return path.join(
    process.env.JACK_FASHION_RUNTIME_DATA_DIR || path.join(process.cwd(), 'data'),
    name
  );
}

export async function readRuntimeJson<T>(name: string, empty: () => T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(runtimeDataFile(name), 'utf-8')) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return empty();
    throw error;
  }
}

/** One application process, one serialized writer per file; writes replace atomically. */
export async function updateRuntimeJson<T, R>(
  name: string,
  empty: () => T,
  update: (data: T) => R | Promise<R>
): Promise<R> {
  const file = runtimeDataFile(name);
  const previous = writers.get(file) || Promise.resolve();
  const current = previous
    .catch(() => {})
    .then(async () => {
      const data = await readRuntimeJson(name, empty);
      const result = await update(data);
      await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
      const temporary = `${file}.${randomUUID()}.tmp`;
      try {
        await fs.writeFile(temporary, JSON.stringify(data, null, 2), {
          encoding: 'utf-8',
          mode: 0o600
        });
        await fs.rename(temporary, file);
      } finally {
        await fs.unlink(temporary).catch(() => {});
      }
      return result;
    });
  writers.set(file, current);
  const release = () => {
    if (writers.get(file) === current) writers.delete(file);
  };
  current.then(release, release);
  return current;
}
