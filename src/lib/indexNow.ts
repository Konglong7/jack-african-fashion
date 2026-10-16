import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import path from 'node:path';
import { getSiteOrigin } from './siteUrl';
import { readRuntimeJson, updateRuntimeJson } from './runtimeData';

interface PendingChange {
  url: string;
  token: string;
  attempts: number;
  queuedAt: string;
  retryAt: string;
}
interface Receipt {
  at: string;
  state: 'received' | 'retry';
  httpStatus?: number;
  error?: string;
  urlCount: number;
  urls: string[];
}
export interface IndexNowState {
  schemaVersion: 1;
  pending: PendingChange[];
  receipts: Receipt[];
  successful: Record<string, { token: string; at: string }>;
}
const file = 'indexnow.json';
const empty = (): IndexNowState => ({
  schemaVersion: 1,
  pending: [],
  receipts: [],
  successful: {}
});
let flushing: Promise<IndexNowState> | undefined;
export function getIndexNowState() {
  return readRuntimeJson(file, empty);
}
export async function enqueueIndexNow(paths: string[], change: string) {
  const origin = getSiteOrigin();
  if (!change) throw new Error('A content revision is required');
  const token = createHash('sha256').update(change).digest('hex');
  const urls = [
    ...new Set(
      paths.map((value) => {
        const url = new URL(value, origin);
        if (
          url.origin !== origin ||
          url.protocol !== 'https:' ||
          url.search ||
          url.hash ||
          /^(\/admin|\/api|\/inquiry|\/_next)(\/|$)/.test(url.pathname)
        ) {
          throw new Error('Only canonical public HTTPS URLs may be notified');
        }
        return url.toString();
      })
    )
  ];
  await updateRuntimeJson(file, empty, (data) => {
    const now = new Date().toISOString();
    for (const url of urls) {
      if (data.successful[url]?.token === token) continue;
      const existing = data.pending.find((item) => item.url === url);
      if (existing?.token === token) continue;
      const entry = { url, token, queuedAt: now, retryAt: now, attempts: 0 };
      if (existing) Object.assign(existing, entry);
      else data.pending.push(entry);
    }
  });
}
export function flushIndexNow(options: { force?: boolean } = {}) {
  if (flushing) return flushing;
  const job = flush(options);
  flushing = job;
  const done = () => {
    if (flushing === job) flushing = undefined;
  };
  job.then(done, done);
  return job;
}
async function flush({ force = false }: { force?: boolean }) {
  const data = await getIndexNowState();
  if (process.env.JACK_FASHION_INDEXNOW_ENABLED !== '1') return data;
  const batch = data.pending
    .filter((item) => force || Date.parse(item.retryAt) <= Date.now())
    .slice(0, 1_000);
  if (!batch.length) return data;
  let httpStatus: number | undefined;
  let error: string | undefined;
  try {
    const keyFile =
      process.env.JACK_FASHION_INDEXNOW_KEY_FILE ||
      path.join(process.cwd(), 'public', 'indexnow-key.txt');
    const key = (await fs.readFile(keyFile, 'utf8')).trim();
    if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error('Ownership key file is invalid');
    const origin = getSiteOrigin();
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'JackFashionOwnerSEO/1.0'
      },
      body: JSON.stringify({
        host: new URL(origin).host,
        key,
        keyLocation: origin + '/indexnow-key.txt',
        urlList: batch.map((item) => item.url)
      }),
      signal: AbortSignal.timeout(4_500)
    });
    httpStatus = response.status;
    if (![200, 202].includes(httpStatus)) error = 'HTTP ' + httpStatus;
  } catch {
    error = 'Notification could not be sent; check ownership configuration or network.';
  }
  const received = !error && httpStatus !== undefined && [200, 202].includes(httpStatus);
  await updateRuntimeJson(file, empty, (state) => {
    const at = new Date().toISOString();
    state.receipts.unshift({
      at,
      state: received ? 'received' : 'retry',
      httpStatus,
      error,
      urlCount: batch.length,
      urls: batch.map((item) => item.url)
    });
    state.receipts = state.receipts.slice(0, 100);
    for (const submitted of batch) {
      const current = state.pending.find(
        (item) => item.url === submitted.url && item.token === submitted.token
      );
      if (received) {
        state.successful[submitted.url] = { token: submitted.token, at };
        if (current) state.pending = state.pending.filter((item) => item !== current);
      } else if (current) {
        current.attempts += 1;
        current.retryAt = new Date(
          Date.now() + Math.min(86_400_000, 60_000 * 2 ** Math.min(current.attempts - 1, 10))
        ).toISOString();
      }
    }
  });
  return getIndexNowState();
}
/** Notification errors cannot change the result of an already completed product save. */
export async function notifyPublicChanges(paths: string[], change: string) {
  try {
    await enqueueIndexNow(paths, change);
    await flushIndexNow();
  } catch {
    console.error('IndexNow update could not be queued; product data has already been saved.');
  }
}
