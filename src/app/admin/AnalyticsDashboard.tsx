import Link from 'next/link';
import { chinaDay, type AnalyticsEvent, type AnalyticsSummary } from '@/lib/analyticsStore';
import type { Product } from '@/lib/db';
import { CustomerLinkGenerator } from './CustomerLinkGenerator';

export function AnalyticsDashboard({
  analytics,
  products,
  siteUrl
}: {
  analytics: AnalyticsSummary;
  products: Product[];
  siteUrl: string;
}) {
  const today = chinaDay();
  const todayEvents = analytics.recent.filter((event) => chinaDay(new Date(event.at)) === today);
  const todayVisitors = uniqueVisitors(todayEvents.filter((event) => event.event === 'page_view'));
  const productViewers = uniqueVisitors(
    todayEvents.filter((event) => event.event === 'page_view' && event.path.startsWith('/products/'))
  );
  const whatsappVisitors = uniqueVisitors(
    todayEvents.filter((event) => event.event === 'whatsapp_click')
  );
  const whatsappRate = todayVisitors ? Math.round((whatsappVisitors / todayVisitors) * 100) : 0;
  const trend = sevenDayWhatsAppTrend(analytics.recent);
  const clickEvents = analytics.recent.filter((event) => event.event === 'whatsapp_click');
  const bestSources = rank(clickEvents.map(sourceLabel));
  const productNames = new Map(products.map((product) => [product.slug, product.name]));
  const bestProducts = rank(clickEvents.map((event) => productLabel(event.path, productNames)));
  const highIntent = analytics.recent
    .filter((event) => event.event === 'whatsapp_click' || event.path.startsWith('/products/'))
    .slice(0, 8);
  const returningVisitors = repeatedVisitorIds(analytics.recent);

  return (
    <section className='mb-8'>
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-brand-orange text-xs font-bold uppercase'>Visitor Snapshot</p>
          <h2 className='text-brand-black mt-1 text-xl font-bold sm:text-2xl'>Sales Contact Dashboard</h2>
          <p className='text-brand-brown/60 mt-1 text-sm'>Beijing time · masked IP · conversion focused</p>
        </div>
        <div className='flex items-center gap-3'>
          {analytics.updatedAt && (
            <p className='text-brand-brown/50 text-xs'>Updated {formatChinaTime(analytics.updatedAt)}</p>
          )}
          <Link
            href='/admin'
            className='border-brand-sand text-brand-black rounded-lg border bg-white px-3 py-2 text-xs font-bold hover:border-brand-orange'
          >
            Refresh
          </Link>
        </div>
      </div>

      <div className='border-brand-sand/60 mb-4 grid grid-cols-2 border bg-white sm:grid-cols-4'>
        <LifetimeStat label='Lifetime visitors' value={analytics.knownVisitors.length} />
        <LifetimeStat label='Total page views' value={analytics.totals.page_view} />
        <LifetimeStat label='Total WhatsApp clicks' value={analytics.totals.whatsapp_click} />
        <LifetimeStat
          label='Tracking since'
          value={analytics.statsStartedAt ? formatChinaDate(analytics.statsStartedAt) : 'Not started'}
        />
      </div>

      <div className='mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4'>
        <Kpi label='Today visitors' value={todayVisitors} tone='black' />
        <Kpi label='Product viewers' value={productViewers} tone='orange' />
        <Kpi label='WhatsApp customers' value={whatsappVisitors} tone='green' />
        <Kpi label='WhatsApp rate' value={`${whatsappRate}%`} tone='orange' />
      </div>

      <div className='mb-4 grid gap-4 lg:grid-cols-2'>
        <Panel title='Customer journey' note='Today'>
          <div className='space-y-4'>
            <FunnelRow label='Website visitors' value={todayVisitors} total={todayVisitors} tone='black' />
            <FunnelRow label='Product viewers' value={productViewers} total={todayVisitors} tone='orange' />
            <FunnelRow label='WhatsApp' value={whatsappVisitors} total={todayVisitors} tone='green' />
          </div>
        </Panel>

        <Panel title='7-day WhatsApp trend' note='Unique visitors'>
          <TrendBars items={trend} />
        </Panel>
      </div>

      <div className='mb-4 grid gap-4 lg:grid-cols-2'>
        <RankPanel title='Best lead sources' note='Last 30 days' items={bestSources} />
        <RankPanel title='Best contact products' note='Last 30 days' items={bestProducts} />
      </div>

      <div className='mb-4 border-brand-sand/60 border bg-white'>
        <div className='border-brand-sand/60 flex items-center justify-between border-b px-5 py-4'>
          <h3 className='text-brand-black text-sm font-bold'>High-intent activity</h3>
          <span className='text-brand-brown/50 text-xs'>Latest product and WhatsApp actions</span>
        </div>
        {highIntent.length ? (
          <div className='divide-brand-sand/50 divide-y'>
            {highIntent.map((event, index) => (
              <ActivityRow
                key={`${event.at}-${event.event}-${event.path}-${index}`}
                event={event}
                product={productLabel(event.path, productNames)}
              />
            ))}
          </div>
        ) : (
          <Empty text='No product interest or WhatsApp activity yet.' />
        )}
      </div>

      <div className='mb-4'>
        <CustomerLinkGenerator siteUrl={siteUrl} />
      </div>

      <details className='border-brand-sand/60 overflow-hidden border bg-white'>
        <summary className='text-brand-black cursor-pointer px-5 py-4 text-sm font-bold'>
          Recent Customer Activity · detailed visitor trail
        </summary>
        {analytics.recent.length ? (
          <div className='divide-brand-sand/50 border-brand-sand/60 divide-y border-t'>
            {analytics.recent.slice(0, 50).map((event, index) => (
              <DetailRow
                key={`${event.at}-${event.event}-${event.path}-${index}`}
                event={event}
                returning={Boolean(event.visitorId && returningVisitors.has(event.visitorId))}
              />
            ))}
          </div>
        ) : (
          <Empty text='No visitor activity yet.' />
        )}
      </details>
    </section>
  );
}

function LifetimeStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className='border-brand-sand/60 border-r border-b p-4 last:border-r-0 sm:border-b-0'>
      <p className='text-brand-black text-xl font-bold'>{value}</p>
      <p className='text-brand-brown/55 mt-1 text-xs'>{label}</p>
    </div>
  );
}

function Kpi({
  label,
  value,
  tone
}: {
  label: string;
  value: number | string;
  tone: 'black' | 'orange' | 'green';
}) {
  const color = tone === 'green' ? 'text-brand-emerald' : tone === 'orange' ? 'text-brand-orange' : 'text-brand-black';
  return (
    <div className='rounded-lg bg-white p-4 shadow-sm sm:p-5'>
      <p className={`${color} text-2xl font-bold sm:text-3xl`}>{value}</p>
      <p className='text-brand-brown/60 mt-1 text-xs sm:text-sm'>{label}</p>
    </div>
  );
}

function Panel({
  title,
  note,
  children
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className='border-brand-sand/60 bg-white p-5 shadow-sm'>
      <div className='mb-5 flex items-center justify-between gap-3'>
        <h3 className='text-brand-black text-sm font-bold'>{title}</h3>
        <span className='text-brand-brown/50 text-xs'>{note}</span>
      </div>
      {children}
    </div>
  );
}

function FunnelRow({
  label,
  value,
  total,
  tone
}: {
  label: string;
  value: number;
  total: number;
  tone: 'black' | 'orange' | 'green';
}) {
  const color = tone === 'green' ? 'bg-brand-emerald' : tone === 'orange' ? 'bg-brand-orange' : 'bg-brand-black';
  const width = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className='grid grid-cols-[100px_minmax(0,1fr)_36px] items-center gap-3 text-xs sm:grid-cols-[120px_minmax(0,1fr)_40px]'>
      <span className='text-brand-brown font-semibold'>{label}</span>
      <div className='bg-brand-cream h-3 overflow-hidden'>
        <div className={`${color} h-full`} style={{ width: `${width}%` }} />
      </div>
      <strong className='text-brand-black text-right'>{value}</strong>
    </div>
  );
}

function TrendBars({ items }: { items: Array<{ day: string; label: string; value: number }> }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <div className='grid h-40 grid-cols-7 items-end gap-2'>
      {items.map((item) => (
        <div key={item.day} className='flex h-full min-w-0 flex-col items-center justify-end gap-1'>
          <span className='text-brand-black text-[10px] font-bold'>{item.value}</span>
          <div className='flex h-24 w-full items-end bg-brand-cream'>
            <div
              className='bg-brand-emerald w-full'
              style={{ height: item.value ? `${Math.max((item.value / max) * 100, 8)}%` : '2px' }}
            />
          </div>
          <span className='text-brand-brown/55 text-[9px]'>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function RankPanel({
  title,
  note,
  items
}: {
  title: string;
  note: string;
  items: Array<[string, number]>;
}) {
  return (
    <Panel title={title} note={note}>
      {items.length ? (
        <div className='space-y-2'>
          {items.slice(0, 5).map(([label, value], index) => (
            <div key={label} className='border-brand-sand/50 flex items-center gap-3 border-b py-2 last:border-0'>
              <span className='text-brand-orange w-5 text-xs font-bold'>{index + 1}</span>
              <span className='text-brand-brown min-w-0 flex-1 truncate text-sm'>{label}</span>
              <strong className='text-brand-black text-sm'>{value}</strong>
            </div>
          ))}
        </div>
      ) : (
        <Empty text='No WhatsApp contacts in this period.' compact />
      )}
    </Panel>
  );
}

function ActivityRow({ event, product }: { event: AnalyticsEvent; product: string }) {
  const whatsapp = event.event === 'whatsapp_click';
  return (
    <div className='grid gap-2 px-5 py-3 sm:grid-cols-[140px_130px_minmax(0,1fr)_150px] sm:items-center'>
      <span className='text-brand-brown/60 text-xs'>{formatChinaTime(event.at)}</span>
      <span className='text-brand-black font-mono text-xs font-bold'>{event.visitorId || 'Legacy'}</span>
      <Link href={event.path} target='_blank' className='text-brand-black hover:text-brand-orange truncate text-sm font-semibold'>
        {product}
      </Link>
      <span className={`w-max rounded px-2 py-1 text-[10px] font-bold ${whatsapp ? 'bg-green-100 text-green-800' : 'bg-brand-cream text-brand-brown'}`}>
        {whatsapp ? 'WhatsApp click' : 'Product view'}
      </span>
    </div>
  );
}

function DetailRow({ event, returning }: { event: AnalyticsEvent; returning: boolean }) {
  return (
    <div className='grid gap-2 px-5 py-3 text-xs sm:grid-cols-[150px_160px_minmax(0,1fr)_170px] sm:items-center'>
      <span className='text-brand-brown/60'>{formatChinaTime(event.at)}</span>
      <span className='text-brand-black font-mono font-bold'>
        {event.visitorId || 'Legacy'} {returning ? '· Returning' : ''}
      </span>
      <span className='text-brand-brown truncate'>{event.path} · {event.device} · {event.ip}</span>
      <span className='text-brand-black truncate sm:text-right'>{sourceLabel(event)}</span>
    </div>
  );
}

function Empty({ text, compact = false }: { text: string; compact?: boolean }) {
  return <p className={`text-brand-brown/50 text-sm ${compact ? 'py-5' : 'px-5 py-8 text-center'}`}>{text}</p>;
}

function sevenDayWhatsAppTrend(events: AnalyticsEvent[]) {
  const now = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getTime() - (6 - index) * 86_400_000);
    const day = chinaDay(date);
    return {
      day,
      label: day.slice(5),
      value: uniqueVisitors(events.filter((event) => event.event === 'whatsapp_click' && chinaDay(new Date(event.at)) === day))
    };
  });
}

function uniqueVisitors(events: AnalyticsEvent[]) {
  return new Set(events.map((event) => event.visitorId).filter(Boolean)).size;
}

function repeatedVisitorIds(events: AnalyticsEvent[]) {
  const counts = new Map<string, number>();
  for (const event of events) {
    if (event.visitorId) counts.set(event.visitorId, (counts.get(event.visitorId) || 0) + 1);
  }
  return new Set([...counts].filter(([, count]) => count > 1).map(([visitorId]) => visitorId));
}

function rank(labels: string[]) {
  const counts = new Map<string, number>();
  for (const label of labels.filter(Boolean)) counts.set(label, (counts.get(label) || 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1]);
}

function sourceLabel(event: AnalyticsEvent) {
  return event.campaign || event.source || event.referrer || 'Direct';
}

function productLabel(path: string, products: Map<string, string>) {
  const match = path.match(/^\/products\/([^/?]+)/);
  if (!match) return path === '/' ? 'Homepage' : path;
  return products.get(match[1]) || match[1].replace(/-/g, ' ');
}

function formatChinaDate(value: string) {
  return chinaDay(new Date(value));
}

function formatChinaTime(value: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(new Date(value));
  const part = (type: string) => parts.find((item) => item.type === type)?.value || '';
  return `${part('year')}-${part('month')}-${part('day')} ${part('hour')}:${part('minute')}:${part('second')}`;
}
