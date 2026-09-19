import type { Product, ProductDetailSection } from '@/lib/db';
import { ProductImage } from '@/components/ProductImage';
import { CheckIcon } from '@/components/Icons';

interface Props {
  product: Product;
}

const NAV_ITEMS = [
  { href: '#overview', label: 'Hot Style' },
  { href: '#stock-check', label: 'Ready Stock' },
  { href: '#faq', label: 'FAQ' },
  { href: '#similar-styles', label: 'Similar Styles' }
];

export function ProductDetailNav() {
  return (
    <div className='sticky top-16 z-30 border-y border-brand-sand/70 bg-white/95 backdrop-blur'>
      <div className='mx-auto max-w-7xl overflow-x-auto px-4'>
        <nav className='flex min-w-max items-center gap-1 py-3' aria-label='Product details'>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className='rounded-full px-4 py-2 text-sm font-semibold text-brand-brown transition-colors hover:bg-brand-cream hover:text-brand-black'
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function ProductDetailSections({ product }: Props) {
  const detail = product.detailPage;
  const specs = detail?.specs && detail.specs.length > 0 ? detail.specs : getFallbackSpecs(product);
  const detailSections =
    detail?.detailSections?.filter((section) => section.enabled !== false) || [];
  const sizeChart = detail?.sizeChart?.enabled === false ? undefined : detail?.sizeChart;
  const faq = detail?.faq && detail.faq.length > 0 ? detail.faq : getFallbackFaq(product);

  return (
    <section className='bg-brand-cream/70 py-10 sm:py-14'>
      <div className='mx-auto max-w-7xl space-y-8 px-4'>
        <section id='overview' className='scroll-mt-32 bg-white p-5 shadow-sm sm:p-8'>
          <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-xs font-bold uppercase text-brand-orange'>
                Professional ready-stock supply
              </p>
              <h2 className='font-display text-2xl font-bold text-brand-black sm:text-3xl'>
                A showroom page built to start serious buyer conversations
              </h2>
            </div>
            <p className='max-w-2xl text-sm leading-6 text-brand-brown/70'>
              Use the photos to choose styles your customers may want. WhatsApp is where we confirm
              ready-stock batches, real photos/video, size mix, colors, packing, delivery, and
              wholesale price.
            </p>
          </div>

          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            {specs.map((spec) => (
              <div key={`${spec.label}-${spec.value}`} className='border border-brand-sand/70 p-4'>
                <p className='text-xs font-semibold uppercase text-brand-brown/50'>{spec.label}</p>
                <p className='mt-1 text-sm font-semibold text-brand-black'>{spec.value}</p>
              </div>
            ))}
          </div>
        </section>

        {detailSections.length > 0 ? (
          <section className='space-y-5'>
            {detailSections.map((section, index) => (
              <DetailStoryBlock key={`${section.title}-${index}`} section={section} index={index} />
            ))}
          </section>
        ) : (
          <section className='bg-white p-5 shadow-sm sm:p-8'>
            <p className='text-xs font-bold uppercase text-brand-orange'>Selling points</p>
            <h3 className='font-display mt-2 text-2xl font-bold text-brand-black'>
              Why this style can help your boutique get attention
            </h3>
            <p className='mt-3 leading-7 text-brand-brown/75'>{product.description}</p>
            <ul className='mt-5 space-y-3'>
              {product.features.map((feature) => (
                <li key={feature} className='flex gap-3 text-sm text-brand-brown/75'>
                  <CheckIcon className='mt-0.5 h-4 w-4 shrink-0 text-brand-emerald' />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id='stock-check' className='scroll-mt-32 bg-white p-5 shadow-sm sm:p-8'>
          <SectionHeader
            eyebrow='Ready-stock check'
            title='Talk on WhatsApp for reliable stock details'
            body='Ready-stock batches move quickly, so this website works as the display window. Send the style on WhatsApp and we will discuss current photos/video, available size mix, color options, MOQ, packing, delivery, and wholesale quote.'
          />
          {sizeChart && sizeChart.rows.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='min-w-full border-collapse text-sm'>
                <thead>
                  <tr className='bg-brand-cream text-left text-xs uppercase text-brand-brown/60'>
                    <th className='px-4 py-3'>Size</th>
                    <th className='px-4 py-3'>Bust</th>
                    <th className='px-4 py-3'>Waist</th>
                    <th className='px-4 py-3'>Hip</th>
                    <th className='px-4 py-3'>Length</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-brand-sand/70'>
                  {sizeChart.rows.map((row) => (
                    <tr key={row.size} className='text-brand-brown'>
                      <td className='px-4 py-3 font-semibold text-brand-black'>{row.size}</td>
                      <td className='px-4 py-3'>{row.bust || '-'}</td>
                      <td className='px-4 py-3'>{row.waist || '-'}</td>
                      <td className='px-4 py-3'>{row.hip || '-'}</td>
                      <td className='px-4 py-3'>{row.length || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sizeChart.note && <p className='mt-3 text-xs text-brand-brown/60'>{sizeChart.note}</p>}
            </div>
          ) : (
            <div className='grid gap-3 sm:grid-cols-3'>
              <StockCheckCard label='Common size range' value={product.sizes.join(' / ')} />
              <StockCheckCard label='Color options' value='Ready batch update' />
              <StockCheckCard label='Private proof' value='Photos or video on WhatsApp' />
            </div>
          )}
        </section>

        <section id='faq' className='scroll-mt-32 bg-white p-5 shadow-sm sm:p-8'>
          <SectionHeader
            eyebrow='FAQ'
            title='Add WhatsApp for serious wholesale follow-up'
            body='The website shows attractive styles. WhatsApp is where we give professional support, confirm real stock, send new arrivals, and help you choose the styles worth ordering.'
          />
          <div className='grid gap-3 md:grid-cols-2'>
            {faq.map((item, idx) => (
              <details
                key={item.question}
                open={idx < 2}
                className='group border border-brand-sand/70 bg-white p-4 transition-all open:border-brand-orange/60 open:shadow-sm'
              >
                <summary className='flex cursor-pointer items-center justify-between font-semibold text-brand-black list-none select-none'>
                  <span>{item.question}</span>
                  <span className='ml-3 text-brand-orange font-bold text-lg shrink-0 transition-transform duration-200 group-open:rotate-45'>
                    +
                  </span>
                </summary>
                <p className='mt-3 border-t border-brand-sand/40 pt-2 text-sm leading-6 text-brand-brown/70'>
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function DetailStoryBlock({
  section,
  index
}: {
  section: ProductDetailSection;
  index: number;
}) {
  const imageFirst = section.layout === 'image-left' || (section.layout !== 'full-width' && index % 2 === 1);

  return (
    <article
      className={`grid overflow-hidden bg-white shadow-sm ${
        section.layout === 'full-width' ? '' : 'lg:grid-cols-2'
      }`}
    >
      {section.image && (
        <div className={`relative min-h-[360px] bg-brand-sand/30 ${imageFirst ? 'lg:order-first' : 'lg:order-last'}`}>
          <ProductImage src={section.image} alt={section.title || 'Product detail'} sizes='(max-width: 1024px) 100vw, 50vw' />
        </div>
      )}
      <div className='flex min-h-[320px] flex-col justify-center p-6 sm:p-10'>
        <p className='text-xs font-bold uppercase text-brand-orange'>Detail story</p>
        <h3 className='font-display mt-2 text-2xl font-bold text-brand-black sm:text-3xl'>{section.title}</h3>
        <p className='mt-4 max-w-2xl leading-7 text-brand-brown/75'>{section.body}</p>
      </div>
    </article>
  );
}

function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className='mb-6 max-w-3xl'>
      <p className='text-xs font-bold uppercase text-brand-orange'>{eyebrow}</p>
      <h2 className='font-display mt-2 text-2xl font-bold text-brand-black sm:text-3xl'>{title}</h2>
      <p className='mt-3 text-sm leading-6 text-brand-brown/70'>{body}</p>
    </div>
  );
}

function StockCheckCard({ label, value }: { label: string; value: string }) {
  return (
    <div className='border border-brand-sand/70 bg-brand-cream p-4'>
      <p className='text-xs font-semibold uppercase text-brand-brown/50'>{label}</p>
      <p className='mt-2 text-sm font-bold text-brand-black'>{value}</p>
    </div>
  );
}

function getFallbackSpecs(product: Product) {
  return [
    { label: 'MOQ', value: `${product.moq} pcs` },
    { label: 'Stock status', value: 'Ready-stock check' },
    { label: 'Best for', value: product.category },
    { label: 'Quote by', value: 'WhatsApp detail talk' }
  ];
}

function getFallbackFaq(product: Product) {
  return [
    {
      question: 'Why should I contact you on WhatsApp?',
      answer: `WhatsApp is where we give professional buying support for ${product.name}: real stock photos/video, current colors, available size mix, new arrivals, and wholesale price.`
    },
    {
      question: 'Do you have ready stock for serious buyers?',
      answer: 'We focus on ready-stock and repeat wholesale styles. Because batches move fast, we confirm the current available stock privately before you decide.'
    },
    {
      question: 'Can you support repeat orders and stable new arrivals?',
      answer: 'Yes. After you add WhatsApp, we can keep sharing suitable new arrivals and similar styles for your market when batches are available.'
    },
    {
      question: 'Can we discuss packing, delivery, and market fit?',
      answer: 'Yes. Send your country, target quantity, size ratio, and customer type. We can discuss the buying details before quotation.'
    }
  ];
}
