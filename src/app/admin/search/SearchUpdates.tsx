'use client';
import { useState } from 'react';
import type { IndexNowState } from '@/lib/indexNow';
export function SearchUpdates({ initial, enabled }: { initial: IndexNowState; enabled: boolean }) {
  const [state, setState] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function retry() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/indexnow', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '更新失败');
      setState(data);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : '更新失败');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5'>
        <p>
          <strong>{state.pending.length}</strong> 个链接待处理 · 通知{enabled ? '已启用' : '未启用'}
        </p>
        <button
          type='button'
          onClick={retry}
          disabled={busy || !enabled || !state.pending.length}
          className='rounded-lg bg-emerald-800 px-4 py-2 text-white disabled:opacity-40'
        >
          {busy ? '处理中…' : '重试待处理通知'}
        </button>
      </div>
      {error && (
        <p role='alert' className='text-red-700'>
          {error}
        </p>
      )}
      <section className='rounded-xl border border-slate-200 bg-white p-5'>
        <h2 className='mb-3 text-lg font-semibold'>待处理链接</h2>
        {state.pending.length ? (
          <ul className='space-y-3 text-sm'>
            {state.pending.map((entry) => (
              <li key={entry.url} className='break-all'>
                {entry.url}
                <p className='text-slate-500'>
                  已尝试 {entry.attempts} 次 · 下次检查{' '}
                  {new Date(entry.retryAt).toLocaleString('zh-CN')}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-sm text-slate-600'>没有待处理链接。</p>
        )}
      </section>
      <section className='rounded-xl border border-slate-200 bg-white p-5'>
        <h2 className='mb-3 text-lg font-semibold'>提交回执</h2>
        {state.receipts.length ? (
          <ul className='space-y-4 text-sm'>
            {state.receipts.map((receipt, index) => (
              <li key={receipt.at + index}>
                <strong>{receipt.state === 'received' ? '已收到' : '待重试'}</strong> ·{' '}
                {receipt.urlCount} 个链接 ·{' '}
                {receipt.httpStatus ? 'HTTP ' + receipt.httpStatus : '未获得响应'} ·{' '}
                {new Date(receipt.at).toLocaleString('zh-CN')}
                {receipt.error && <p className='text-red-700'>{receipt.error}</p>}
                <details className='mt-2'>
                  <summary className='cursor-pointer text-emerald-800'>查看链接</summary>
                  <ul className='mt-2 space-y-1'>
                    {receipt.urls.map((url) => (
                      <li key={url} className='break-all'>
                        {url}
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-sm text-slate-600'>暂无提交回执。</p>
        )}
      </section>
    </div>
  );
}
