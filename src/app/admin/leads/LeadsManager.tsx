'use client';

import { useMemo, useState } from 'react';
import type { Lead, LeadSource, LeadStatus } from '@/lib/leadsStore';
const statuses: Record<LeadStatus, string> = {
  new: '新询盘',
  qualified: '有效询盘',
  quoted: '已报价',
  won: '成交',
  closed: '未成交'
};
const sources: Record<LeadSource, string> = {
  unknown: '未知',
  google: 'Google',
  bing: 'Bing',
  chatgpt: 'ChatGPT',
  perplexity: 'Perplexity',
  copilot: 'Copilot',
  claude: 'Claude',
  gemini: 'Gemini',
  grok: 'Grok',
  whatsapp: 'WhatsApp',
  referral: '客户转介绍',
  direct: '直接访问',
  other: '其他'
};
type CatalogStyle = { id: string; code: string; name: string };
const emptyForm = () => ({
  customer: '',
  country: '',
  productIds: [] as string[],
  quantity: '',
  source: 'unknown' as LeadSource,
  sourceEvidence: 'unknown' as Lead['sourceEvidence'],
  landingPath: '',
  notes: '',
  status: 'new' as LeadStatus
});
const fieldClass =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-2 focus:outline-[#112b47]';

export default function LeadsManager({
  initialLeads,
  products
}: {
  initialLeads: Lead[];
  products: CatalogStyle[];
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [styleSearch, setStyleSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [range, setRange] = useState('30');
  const [archived, setArchived] = useState(false);
  const [limit, setLimit] = useState(30);
  const cohort = useMemo(
    () =>
      leads.filter(
        (lead) =>
          range === 'all' || Date.parse(lead.createdAt) >= Date.now() - Number(range) * 86_400_000
      ),
    [leads, range]
  );
  const counts = {
    registered: cohort.length,
    qualified: cohort.filter(
      (lead) => lead.timeline.qualified || lead.timeline.quoted || lead.timeline.won
    ).length,
    quoted: cohort.filter((lead) => lead.timeline.quoted || lead.timeline.won).length,
    won: cohort.filter((lead) => lead.timeline.won).length
  };
  const visible = cohort.filter(
    (lead) =>
      Boolean(lead.archivedAt) === archived &&
      (statusFilter === 'all' || lead.status === statusFilter) &&
      (sourceFilter === 'all' || lead.source === sourceFilter) &&
      `${lead.customer} ${lead.country} ${lead.notes}`.toLowerCase().includes(search.toLowerCase())
  );
  const sourceTotals = Object.entries(sources)
    .map(([source, label]) => ({ label, records: cohort.filter((lead) => lead.source === source) }))
    .filter((item) => item.records.length);
  const styleOptions = products.filter((product) =>
    `${product.code} ${product.name}`.toLowerCase().includes(styleSearch.toLowerCase())
  );

  function startEdit(lead?: Lead) {
    setError('');
    setNotice('');
    setStyleSearch('');
    setEditing(lead?.id || null);
    if (lead) {
      setForm({
        customer: lead.customer,
        country: lead.country,
        productIds: [...lead.productIds],
        quantity: lead.quantity ? String(lead.quantity) : '',
        source: lead.source,
        sourceEvidence: lead.sourceEvidence,
        landingPath: lead.landingPath,
        notes: lead.notes,
        status: lead.status
      });
    } else {
      setForm(emptyForm());
    }
    setOpen(true);
  }
  async function persist(id: string | null, payload: Record<string, unknown>) {
    const response = await fetch(
      id ? `/api/admin/leads/${encodeURIComponent(id)}` : '/api/admin/leads',
      {
        method: id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || '保存失败，请重试');
    const lead = data.lead as Lead;
    setLeads((previous) =>
      [lead, ...previous.filter((item) => item.id !== lead.id)].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      )
    );
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await persist(editing, {
        ...form,
        quantity: form.quantity === '' ? null : Number(form.quantity)
      });
      setOpen(false);
      setNotice('询盘已保存。');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : '保存失败');
    } finally {
      setBusy(false);
    }
  }
  async function archive(lead: Lead) {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await persist(lead.id, { archived: !lead.archivedAt });
      setNotice(lead.archivedAt ? '询盘已恢复。' : '询盘已归档，统计和阶段日期保留。');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : '保存失败');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className='mx-auto max-w-6xl text-slate-900'>
      <div className='mb-6 flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>询盘与成交</h1>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-600'>
            客户通过 WhatsApp
            联系你后，在这里登记实际需求和跟进阶段。来源以客户说明或带标识的链接为准；不能确认时选择“未知”。
          </p>
        </div>
        <button
          type='button'
          onClick={() => startEdit()}
          className='rounded-lg bg-[#112b47] px-5 py-3 text-sm font-semibold text-white'
        >
          登记询盘
        </button>
      </div>
      <div className='mb-5 flex flex-wrap items-center gap-3 text-sm'>
        <label>
          登记时间{' '}
          <select
            aria-label='登记时间范围'
            className='ml-2 rounded border border-slate-300 bg-white px-3 py-2'
            value={range}
            onChange={(e) => {
              setRange(e.target.value);
              setLimit(30);
            }}
          >
            <option value='7'>最近 7 天</option>
            <option value='30'>最近 30 天</option>
            <option value='90'>最近 90 天</option>
            <option value='all'>全部时间</option>
          </select>
        </label>
        <span className='text-slate-500'>统计包含归档记录；各阶段由人工确认。</span>
      </div>
      <div className='mb-6 grid grid-cols-2 gap-3 md:grid-cols-4'>
        {[
          ['登记询盘', counts.registered],
          ['有效询盘', counts.qualified],
          ['已报价', counts.quoted],
          ['成交', counts.won]
        ].map(([label, value]) => (
          <div key={label} className='rounded-xl border border-slate-200 bg-white p-4'>
            <p className='text-3xl font-semibold text-[#112b47]'>{value}</p>
            <p className='mt-2 text-sm text-slate-600'>{label}</p>
          </div>
        ))}
      </div>
      {notice && (
        <p role='status' className='mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800'>
          {notice}
        </p>
      )}
      {error && (
        <p role='alert' className='mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800'>
          {error}
        </p>
      )}
      {open && (
        <section
          aria-label={editing ? '编辑询盘' : '新询盘'}
          className='mb-7 rounded-xl border border-slate-200 bg-white p-5 sm:p-6'
        >
          <div className='mb-4 flex justify-between gap-4'>
            <h2 className='text-lg font-semibold'>{editing ? '编辑询盘' : '新询盘'}</h2>
            <button
              type='button'
              disabled={busy}
              onClick={() => setOpen(false)}
              className='text-sm text-slate-600'
            >
              关闭
            </button>
          </div>
          <form onSubmit={save} className='grid gap-4 sm:grid-cols-2'>
            <label className='text-sm font-medium'>
              客户简称
              <input
                required
                maxLength={100}
                value={form.customer}
                onChange={(e) => setForm({ ...form, customer: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className='text-sm font-medium'>
              国家或市场
              <input
                maxLength={80}
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className='text-sm font-medium'>
              需求数量（件，可留空）
              <input
                type='number'
                min={1}
                max={10000000}
                step={1}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className='text-sm font-medium'>
              当前阶段
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}
                className={fieldClass}
              >
                {Object.entries(statuses).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className='text-sm font-medium'>
              客户来源
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}
                className={fieldClass}
              >
                {Object.entries(sources).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className='text-sm font-medium'>
              来源依据
              <select
                value={form.sourceEvidence}
                onChange={(e) =>
                  setForm({ ...form, sourceEvidence: e.target.value as Lead['sourceEvidence'] })
                }
                className={fieldClass}
              >
                <option value='unknown'>无法确认</option>
                <option value='customer_reported'>客户主动说明</option>
                <option value='campaign_link'>带标识的访问链接</option>
              </select>
            </label>
            <label className='text-sm font-medium sm:col-span-2'>
              客户提及的站内页面（可留空）
              <input
                maxLength={200}
                placeholder='/guides/wholesale-moq'
                value={form.landingPath}
                onChange={(e) => setForm({ ...form, landingPath: e.target.value })}
                className={fieldClass}
              />
            </label>
            <fieldset className='sm:col-span-2'>
              <legend className='text-sm font-medium'>感兴趣款式（最多 20 款）</legend>
              <input
                aria-label='搜索款号或名称'
                placeholder='搜索款号或名称'
                value={styleSearch}
                onChange={(e) => setStyleSearch(e.target.value)}
                className={fieldClass}
              />
              <div className='mt-2 grid max-h-44 gap-2 overflow-y-auto rounded-lg border border-slate-200 p-3 md:grid-cols-2'>
                {styleOptions.map((product) => (
                  <label key={product.id} className='flex items-start gap-2 text-xs leading-5'>
                    <input
                      type='checkbox'
                      className='mt-1'
                      checked={form.productIds.includes(product.id)}
                      disabled={
                        !form.productIds.includes(product.id) && form.productIds.length >= 20
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          productIds: e.target.checked
                            ? [...form.productIds, product.id]
                            : form.productIds.filter((id) => id !== product.id)
                        })
                      }
                    />
                    <span>
                      {product.code} · {product.name}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className='text-sm font-medium sm:col-span-2'>
              跟进备注
              <textarea
                maxLength={1500}
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className={fieldClass}
              />
            </label>
            <div className='flex gap-3 sm:col-span-2'>
              <button
                disabled={busy}
                type='submit'
                className='rounded-lg bg-[#146946] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50'
              >
                {busy ? '正在保存…' : '保存询盘'}
              </button>
              <button
                disabled={busy}
                type='button'
                onClick={() => setOpen(false)}
                className='px-4 text-sm text-slate-600'
              >
                取消
              </button>
            </div>
          </form>
        </section>
      )}
      <section className='rounded-xl border border-slate-200 bg-white p-4 sm:p-5'>
        <div className='mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <input
            aria-label='搜索客户、国家或备注'
            placeholder='搜索客户、国家或备注'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setLimit(30);
            }}
            className={fieldClass}
          />
          <select
            aria-label='按询盘阶段筛选'
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setLimit(30);
            }}
            className={fieldClass}
          >
            <option value='all'>全部阶段</option>
            {Object.entries(statuses).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            aria-label='按客户来源筛选'
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setLimit(30);
            }}
            className={fieldClass}
          >
            <option value='all'>全部来源</option>
            {Object.entries(sources).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <label className='flex items-center gap-2 text-sm'>
            <input
              type='checkbox'
              checked={archived}
              onChange={(e) => {
                setArchived(e.target.checked);
                setLimit(30);
              }}
            />
            查看归档
          </label>
        </div>
        {!visible.length ? (
          <p className='py-8 text-center text-sm text-slate-500'>
            暂无匹配询盘。收到客户消息后，点击“登记询盘”添加记录。
          </p>
        ) : (
          <div className='divide-y divide-slate-200'>
            {visible.slice(0, limit).map((lead) => (
              <article key={lead.id} className='grid gap-3 py-5 lg:grid-cols-[1fr_1fr_auto]'>
                <div>
                  <h3 className='font-semibold'>{lead.customer}</h3>
                  <p className='mt-1 text-sm text-slate-600'>
                    {lead.country || '国家未填写'} ·{' '}
                    {lead.quantity ? `${lead.quantity} 件` : '数量待确认'}
                  </p>
                  <p className='mt-2 text-xs text-slate-500'>
                    {new Date(lead.createdAt).toLocaleDateString('zh-CN', {
                      timeZone: 'Asia/Shanghai'
                    })}{' '}
                    登记
                  </p>
                </div>
                <div className='min-w-0 text-sm'>
                  <p>
                    {sources[lead.source]} · {statuses[lead.status]}
                  </p>
                  <p className='mt-1 break-words text-slate-600'>
                    {lead.productIds
                      .map((id) => products.find((product) => product.id === id)?.code || `#${id}`)
                      .join(', ') || '款式待确认'}
                  </p>
                  {lead.notes && (
                    <p className='mt-2 text-xs leading-5 break-words whitespace-pre-wrap text-slate-500'>
                      {lead.notes}
                    </p>
                  )}
                  <details className='mt-2 text-xs text-slate-500'>
                    <summary className='cursor-pointer'>来源依据与阶段日期</summary>
                    <p className='mt-2'>
                      {lead.sourceEvidence === 'customer_reported'
                        ? '客户主动说明'
                        : lead.sourceEvidence === 'campaign_link'
                          ? '带标识的访问链接'
                          : '来源无法确认'}
                      {lead.landingPath ? ` · ${lead.landingPath}` : ''}
                    </p>
                    {Object.entries(lead.timeline).map(([stage, date]) => (
                      <p className='mt-1' key={stage}>
                        {statuses[stage as LeadStatus]}：
                        {new Date(date!).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
                      </p>
                    ))}
                  </details>
                </div>
                <div className='flex items-start gap-3'>
                  <button
                    disabled={busy}
                    type='button'
                    onClick={() => startEdit(lead)}
                    className='rounded border border-slate-300 px-3 py-2 text-xs'
                  >
                    编辑
                  </button>
                  <button
                    disabled={busy}
                    type='button'
                    onClick={() => archive(lead)}
                    className='px-2 py-2 text-xs text-slate-600'
                  >
                    {lead.archivedAt ? '恢复' : '归档'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        {visible.length > limit && (
          <button
            type='button'
            onClick={() => setLimit(limit + 30)}
            className='mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm'
          >
            显示更多
          </button>
        )}
      </section>
      <section className='mt-6 rounded-xl border border-slate-200 bg-white p-5'>
        <h2 className='font-semibold'>来源与实际结果</h2>
        <p className='mt-1 text-xs text-slate-500'>
          按所选时间内登记的客户统计，包含归档记录。WhatsApp 点击另见首页统计。
        </p>
        {sourceTotals.length ? (
          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            {sourceTotals.map(({ label, records }) => (
              <div
                key={label}
                className='flex flex-wrap justify-between gap-2 border-b border-slate-100 py-2 text-sm'
              >
                <strong>{label}</strong>
                <span>
                  {records.length} 条登记 ·{' '}
                  {
                    records.filter(
                      (lead) => lead.timeline.qualified || lead.timeline.quoted || lead.timeline.won
                    ).length
                  }{' '}
                  条有效 · {records.filter((lead) => lead.timeline.won).length} 条成交
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className='mt-4 text-sm text-slate-500'>登记客户后显示来源结果。</p>
        )}
      </section>
    </div>
  );
}
