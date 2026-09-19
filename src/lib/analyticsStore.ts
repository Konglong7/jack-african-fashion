import { createHmac } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { isIP } from 'node:net';
import path from 'node:path';

export type AnalyticsEventName = 'page_view' | 'whatsapp_click';

export interface AnalyticsEvent {
  event: AnalyticsEventName;
  path: string;
  source: string;
  campaign: string;
  timezone: string;
  language: string;
  referrer: string;
  at: string;
  visitorId: string;
  ip: string;
  device: 'Mobile' | 'Tablet' | 'Desktop' | 'Unknown';
}

export interface AnalyticsSummary {
  updatedAt: string;
  totals: Record<AnalyticsEventName, number>;
  days: Record<string, Record<AnalyticsEventName, number>>;
  pages: Record<string, number>;
  whatsappPages: Record<string, number>;
  campaigns: Record<string, number>;
  knownVisitors: string[];
  statsStartedAt: string;
  recent: AnalyticsEvent[];
}

interface AnalyticsMeta {
  ip?: string;
  userAgent?: string;
  now?: Date;
  secret?: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'analytics.json');
const MAX_RECENT_EVENTS = 5_000;
const RETENTION_MS = 30 * 86_400_000;
const DUPLICATE_WINDOW_MS = 10_000;
let writeLock = false;

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    return normalizeAnalyticsSummary(JSON.parse(await fs.readFile(DATA_FILE, 'utf-8')));
  } catch {
    return emptySummary();
  }
}

export async function recordAnalyticsEvent(input: unknown, meta: AnalyticsMeta = {}) {
  const event = buildAnalyticsEvent(input, meta);
  if (!event) return false;

  while (writeLock) await new Promise((resolve) => setTimeout(resolve, 25));
  writeLock = true;
  try {
    const summary = await getAnalyticsSummary();
    if (isRapidDuplicate(event, summary.recent)) return false;

    rememberVisitor(summary, event);
    summary.updatedAt = event.at;
    summary.totals[event.event] += 1;
    const day = chinaDay(new Date(event.at));
    summary.days[day] ||= { page_view: 0, whatsapp_click: 0 };
    summary.days[day][event.event] += 1;

    if (event.event === 'page_view') summary.pages[event.path] = (summary.pages[event.path] || 0) + 1;
    if (event.event === 'whatsapp_click') {
      summary.whatsappPages[event.path] = (summary.whatsappPages[event.path] || 0) + 1;
    }
    const campaignKey = [event.source, event.campaign].filter(Boolean).join(' / ');
    if (campaignKey) summary.campaigns[campaignKey] = (summary.campaigns[campaignKey] || 0) + 1;

    summary.recent = retainRecentEvents([event, ...summary.recent], new Date(event.at));

    await mkdir(path.dirname(DATA_FILE), { recursive: true });
    await writeFile(DATA_FILE + '.tmp', JSON.stringify(summary, null, 2), 'utf-8');
    await fs.rename(DATA_FILE + '.tmp', DATA_FILE);
    return true;
  } finally {
    writeLock = false;
  }
}

export function getClientIp(headers: Headers) {
  return (
    clean(headers.get('cf-connecting-ip'), 80) ||
    clean(headers.get('x-forwarded-for')?.split(',')[0], 80) ||
    clean(headers.get('x-real-ip'), 80) ||
    'local'
  );
}

export function maskIp(value: string) {
  let ip = value.trim().replace(/^"|"$/g, '');
  if (ip.startsWith('::ffff:')) ip = ip.slice(7);
  if (ip === 'local' || ip === '::1' || ip === '127.0.0.1') return 'Local';

  if (isIP(ip) === 4) {
    const [first, second] = ip.split('.');
    return `${first}.${second}.*.*`;
  }
  if (isIP(ip) === 6) return `${ip.split(':').filter(Boolean).slice(0, 3).join(':')}:*`;
  return 'Unknown';
}

export function buildAnalyticsEvent(input: unknown, meta: AnalyticsMeta = {}): AnalyticsEvent | null {
  if (!input || typeof input !== 'object') return null;
  const data = input as Record<string, unknown>;
  const event: AnalyticsEventName | null =
    data.event === 'whatsapp_click' ? 'whatsapp_click' : data.event === 'page_view' ? 'page_view' : null;
  if (!event) return null;

  const now = meta.now || new Date();
  const ip = meta.ip || 'local';
  const userAgent = meta.userAgent || '';
  const visitorHash = createHmac('sha256', meta.secret || process.env.ADMIN_SECRET || 'local-analytics')
    .update(`${ip}|${userAgent}`)
    .digest('hex')
    .slice(0, 8)
    .toUpperCase();

  return {
    event,
    path: cleanPath(data.path),
    source: clean(data.source, 60),
    campaign: clean(data.campaign, 80),
    timezone: clean(data.timezone, 50),
    language: clean(data.language, 20),
    referrer: cleanReferrer(data.referrer),
    at: now.toISOString(),
    visitorId: `V-${visitorHash}`,
    ip: maskIp(ip),
    device: classifyDevice(userAgent)
  };
}

export function retainRecentEvents(events: AnalyticsEvent[], now = new Date()) {
  const cutoff = now.getTime() - RETENTION_MS;
  const seen = new Map<string, number>();

  return events
    .filter((event) => Number.isFinite(Date.parse(event.at)) && Date.parse(event.at) >= cutoff)
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
    .filter((event) => {
      if (!event.visitorId) return true;
      const key = `${event.visitorId}|${event.event}|${event.path}`;
      const timestamp = Date.parse(event.at);
      const previous = seen.get(key);
      seen.set(key, timestamp);
      return previous === undefined || previous - timestamp > DUPLICATE_WINDOW_MS;
    })
    .slice(0, MAX_RECENT_EVENTS);
}

export function normalizeAnalyticsSummary(input: unknown, now = new Date()): AnalyticsSummary {
  const data = input && typeof input === 'object' ? (input as Partial<AnalyticsSummary>) : {};
  const recent = Array.isArray(data.recent)
    ? data.recent.map(normalizeStoredEvent).filter((event): event is AnalyticsEvent => event !== null)
    : [];
  const retained = retainRecentEvents(recent, now);
  const knownVisitors = Array.isArray(data.knownVisitors)
    ? data.knownVisitors.filter((value): value is string => typeof value === 'string' && Boolean(value))
    : [];
  for (const event of retained) {
    if (event.visitorId && !knownVisitors.includes(event.visitorId)) knownVisitors.push(event.visitorId);
  }
  const firstIdentifiableEvent = retained
    .filter((event) => event.visitorId)
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))[0];

  return {
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : '',
    totals: {
      page_view: Number(data.totals?.page_view) || 0,
      whatsapp_click: Number(data.totals?.whatsapp_click) || 0
    },
    days: data.days && typeof data.days === 'object' ? data.days : {},
    pages: data.pages && typeof data.pages === 'object' ? data.pages : {},
    whatsappPages: data.whatsappPages && typeof data.whatsappPages === 'object' ? data.whatsappPages : {},
    campaigns: data.campaigns && typeof data.campaigns === 'object' ? data.campaigns : {},
    knownVisitors: [...new Set(knownVisitors)],
    statsStartedAt:
      typeof data.statsStartedAt === 'string' && Number.isFinite(Date.parse(data.statsStartedAt))
        ? data.statsStartedAt
        : firstIdentifiableEvent?.at || '',
    recent: retained
  };
}

export function rememberVisitor(summary: AnalyticsSummary, event: AnalyticsEvent) {
  if (!event.visitorId) return;
  // ponytail: linear lookup is enough for this low-traffic JSON store; move to a DB index if it reaches 50k IDs.
  if (!summary.knownVisitors.includes(event.visitorId)) summary.knownVisitors.push(event.visitorId);
  if (!summary.statsStartedAt) summary.statsStartedAt = event.at;
}

export function chinaDay(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value || '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

function isRapidDuplicate(event: AnalyticsEvent, recent: AnalyticsEvent[]) {
  return recent.some(
    (item) =>
      item.visitorId === event.visitorId &&
      item.event === event.event &&
      item.path === event.path &&
      Math.abs(Date.parse(event.at) - Date.parse(item.at)) <= DUPLICATE_WINDOW_MS
  );
}

function normalizeStoredEvent(input: unknown): AnalyticsEvent | null {
  if (!input || typeof input !== 'object') return null;
  const data = input as Record<string, unknown>;
  if (data.event !== 'page_view' && data.event !== 'whatsapp_click') return null;
  if (typeof data.at !== 'string' || !Number.isFinite(Date.parse(data.at))) return null;

  return {
    event: data.event,
    path: cleanPath(data.path),
    source: clean(data.source, 60),
    campaign: clean(data.campaign, 80),
    timezone: clean(data.timezone, 50),
    language: clean(data.language, 20),
    referrer: clean(data.referrer, 120),
    at: data.at,
    visitorId: clean(data.visitorId, 24),
    ip: clean(data.ip, 80) || 'Unknown',
    device:
      data.device === 'Mobile' || data.device === 'Tablet' || data.device === 'Desktop'
        ? data.device
        : 'Unknown'
  };
}

function emptySummary(): AnalyticsSummary {
  return {
    updatedAt: '',
    totals: { page_view: 0, whatsapp_click: 0 },
    days: {},
    pages: {},
    whatsappPages: {},
    campaigns: {},
    knownVisitors: [],
    statsStartedAt: '',
    recent: []
  };
}

function cleanPath(value: unknown) {
  const pathValue = clean(value, 300).split('?')[0] || '/';
  return (pathValue.startsWith('/') ? pathValue : '/').slice(0, 160);
}

function cleanReferrer(value: unknown) {
  const referrer = clean(value, 300);
  if (!referrer) return '';
  try {
    return new URL(referrer).hostname.replace(/^www\./, '').slice(0, 120);
  } catch {
    return referrer.slice(0, 120);
  }
}

function classifyDevice(userAgent: string): AnalyticsEvent['device'] {
  if (!userAgent) return 'Unknown';
  if (/ipad|tablet|android(?!.*mobile)/i.test(userAgent)) return 'Tablet';
  if (/mobile|iphone|ipod/i.test(userAgent)) return 'Mobile';
  return 'Desktop';
}

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().replace(/[<>]/g, '').slice(0, maxLength) : '';
}
