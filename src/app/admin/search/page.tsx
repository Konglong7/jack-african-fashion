import Link from 'next/link';
import { getIndexNowState } from '@/lib/indexNow';
import { SearchUpdates } from './SearchUpdates';
export const dynamic = 'force-dynamic';
export default async function SearchPage() {
  return (
    <div className='mx-auto max-w-6xl'>
      <h1 className='text-2xl font-bold'>搜索更新通知</h1>
      <p className='my-4 max-w-3xl text-sm leading-relaxed text-slate-600'>
        IndexNow 通知搜索平台哪些公开页面发生变化。回执表示请求已收到，收录、曝光和 AI
        引用需要在各平台报告中分别查看。失败记录会保留，并每 5 分钟检查到期重试。
      </p>
      <SearchUpdates
        initial={await getIndexNowState()}
        enabled={process.env.JACK_FASHION_INDEXNOW_ENABLED === '1'}
      />
      <div className='mt-6 flex flex-wrap gap-5 text-sm text-emerald-800'>
        <a
          href='https://search.google.com/search-console'
          target='_blank'
          rel='noopener noreferrer'
        >
          Google Search Console
        </a>
        <a href='https://www.bing.com/webmasters' target='_blank' rel='noopener noreferrer'>
          Bing Webmaster Tools
        </a>
        <Link href='/admin/leads'>有效询盘与成交记录</Link>
      </div>
    </div>
  );
}
