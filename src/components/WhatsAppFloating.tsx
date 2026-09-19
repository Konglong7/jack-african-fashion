import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';

export function WhatsAppFloating({ siteContent }: { siteContent: SiteContent }) {
  return (
    <a
      href={siteWhatsAppLink(siteContent)}
      target='_blank'
      rel='noopener noreferrer'
      className='group fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-50 rounded-full bg-[#25D366] p-3.5 text-white shadow-xl shadow-green-950/20 transition-all hover:scale-110 hover:bg-[#20BA5A] active:scale-95 md:right-6 md:bottom-6 md:p-4'
      aria-label='Contact on WhatsApp'
    >
      {/* Pulsing online green beacon */}
      <span className='absolute -top-1 -right-1 flex h-3.5 w-3.5'>
        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
        <span className='relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500' />
      </span>

      <svg className='h-7 w-7 sm:h-8 sm:w-8' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
      </svg>
      <span className='text-brand-black pointer-events-none absolute top-1/2 right-full mr-3 hidden -translate-y-1/2 items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-bold whitespace-nowrap opacity-0 shadow-xl ring-1 ring-black/5 transition-opacity group-hover:opacity-100 sm:flex'>
        <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
        Chat with Jack on WhatsApp
      </span>
    </a>
  );
}
