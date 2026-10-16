import type { ProductDetailSection } from '@/lib/db';
import { ProductImage } from '@/components/ProductImage';
import { CheckIcon } from '@/components/Icons';
import { getPublicProductFaq } from '@/lib/productFaq';
import {
  getPublicProductFacts,
  type PublicProduct,
  type PublicProductFacts
} from '@/lib/productPublicFacts';

interface Props {
  product: PublicProduct;
}

const NAV_ITEMS = [
  { href: '#overview', label: 'Hot Style' },
  { href: '#stock-check', label: 'Stock Check' },
  { href: '#faq', label: 'FAQ' },
  { href: '#similar-styles', label: 'Similar Styles' }
];

export function ProductDetailNav() {
  return (
    <div className='border-brand-sand/70 sticky top-16 z-30 border-y bg-white/95 backdrop-blur'>
      <div className='mx-auto max-w-7xl overflow-x-auto px-4'>
        <nav className='flex min-w-max items-center gap-1 py-3' aria-label='Product details'>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className='text-brand-brown hover:bg-brand-cream hover:text-brand-black rounded-full px-4 py-2 text-sm font-semibold transition-colors'
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
  const facts = getPublicProductFacts(product);
  const detail = product.detailPage;
  const specs =
    facts.allowDetailedContent && detail?.specs && detail.specs.length > 0
      ? detail.specs
      : getFallbackSpecs(facts);
  const detailSections = facts.allowDetailedContent
    ? detail?.detailSections?.filter((section) => section.enabled !== false) || []
    : [];
  const sizeChart = facts.allowDetailedContent
    ? detail?.sizeChart?.enabled === false
      ? undefined
      : detail?.sizeChart
    : undefined;
  const faq = getPublicProductFaq(product, facts.allowDetailedContent);

  return (
    <section className='bg-brand-cream/70 py-10 sm:py-14'>
      <div className='mx-auto max-w-7xl space-y-8 px-4'>
        <section id='overview' className='scroll-mt-32 bg-white p-5 shadow-sm sm:p-8'>
          <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-brand-orange text-xs font-bold uppercase'>
                Product facts to confirm
              </p>
              <h2 className='font-display text-brand-black text-2xl font-bold sm:text-3xl'>
                What are the MOQ, stock and wholesale price?
              </h2>
            </div>
            <p className='text-brand-brown/70 max-w-2xl text-sm leading-6'>
              MOQ, current availability and bulk price are confirmed for this style on WhatsApp.
              Send the product code, quantity and destination to request current garment photos,
              measurements and a written quotation.
            </p>
          </div>

          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            {specs.map((spec) => (
              <div key={`${spec.label}-${spec.value}`} className='border-brand-sand/70 border p-4'>
                <p className='text-brand-brown/50 text-xs font-semibold uppercase'>{spec.label}</p>
                <p className='text-brand-black mt-1 text-sm font-semibold'>{spec.value}</p>
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
            <p className='text-brand-orange text-xs font-bold uppercase'>Selling points</p>
            <h3 className='font-display text-brand-black mt-2 text-2xl font-bold'>
              What to confirm for this style
            </h3>
            <p className='text-brand-brown/75 mt-3 leading-7'>{facts.description}</p>
            <ul className='mt-5 space-y-3'>
              {facts.features.map((feature) => (
                <li key={feature} className='text-brand-brown/75 flex gap-3 text-sm'>
                  <CheckIcon className='text-brand-emerald mt-0.5 h-4 w-4 shrink-0' />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id='stock-check' className='scroll-mt-32 bg-white p-5 shadow-sm sm:p-8'>
          <SectionHeader
            eyebrow='Ready-stock check'
            title='How do I confirm sizes, colors and availability?'
            body='Send the style code and your required size-color quantities on WhatsApp. Ask for current batch photos or video and finished measurements before confirming the available mix, MOQ and quotation.'
          />
          {sizeChart && sizeChart.rows.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='min-w-full border-collapse text-sm'>
                <thead>
                  <tr className='bg-brand-cream text-brand-brown/60 text-left text-xs uppercase'>
                    <th className='px-4 py-3'>Size</th>
                    <th className='px-4 py-3'>Bust</th>
                    <th className='px-4 py-3'>Waist</th>
                    <th className='px-4 py-3'>Hip</th>
                    <th className='px-4 py-3'>Length</th>
                  </tr>
                </thead>
                <tbody className='divide-brand-sand/70 divide-y'>
                  {sizeChart.rows.map((row) => (
                    <tr key={row.size} className='text-brand-brown'>
                      <td className='text-brand-black px-4 py-3 font-semibold'>{row.size}</td>
                      <td className='px-4 py-3'>{row.bust || '-'}</td>
                      <td className='px-4 py-3'>{row.waist || '-'}</td>
                      <td className='px-4 py-3'>{row.hip || '-'}</td>
                      <td className='px-4 py-3'>{row.length || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sizeChart.note && (
                <p className='text-brand-brown/60 mt-3 text-xs'>{sizeChart.note}</p>
              )}
            </div>
          ) : (
            <div className='grid gap-3 sm:grid-cols-3'>
              <StockCheckCard label='Size range' value={facts.sizes} />
              <StockCheckCard label='Color options' value={facts.colors} />
              <StockCheckCard label='Private proof' value='Photos or video on WhatsApp' />
            </div>
          )}
        </section>

        <section id='faq' className='scroll-mt-32 bg-white p-5 shadow-sm sm:p-8'>
          <SectionHeader
            eyebrow='FAQ'
            title='Wholesale questions about this style'
            body='Confirm MOQ, bulk price, available sizes and colors for the style you select. Use the answers below to prepare your enquiry, then agree the current goods and order terms with Jack on WhatsApp.'
          />
          <div className='grid gap-3 md:grid-cols-2'>
            {faq.map((item, idx) => (
              <details
                key={item.question}
                open={idx < 2}
                className='group border-brand-sand/70 open:border-brand-orange/60 border bg-white p-4 transition-all open:shadow-sm'
              >
                <summary className='text-brand-black flex cursor-pointer list-none items-center justify-between font-semibold select-none'>
                  <span>{item.question}</span>
                  <span className='text-brand-orange ml-3 shrink-0 text-lg font-bold transition-transform duration-200 group-open:rotate-45'>
                    +
                  </span>
                </summary>
                <p className='border-brand-sand/40 text-brand-brown/70 mt-3 border-t pt-2 text-sm leading-6'>
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

function DetailStoryBlock({ section, index }: { section: ProductDetailSection; index: number }) {
  const imageFirst =
    section.layout === 'image-left' || (section.layout !== 'full-width' && index % 2 === 1);

  return (
    <article
      className={`grid overflow-hidden bg-white shadow-sm ${
        section.layout === 'full-width' ? '' : 'lg:grid-cols-2'
      }`}
    >
      {section.image && (
        <div
          className={`bg-brand-sand/30 relative min-h-[360px] ${imageFirst ? 'lg:order-first' : 'lg:order-last'}`}
        >
          <ProductImage
            src={section.image}
            alt={section.title || 'Product detail'}
            sizes='(max-width: 1024px) 100vw, 50vw'
          />
        </div>
      )}
      <div className='flex min-h-[320px] flex-col justify-center p-6 sm:p-10'>
        <p className='text-brand-orange text-xs font-bold uppercase'>Detail story</p>
        <h3 className='font-display text-brand-black mt-2 text-2xl font-bold sm:text-3xl'>
          {section.title}
        </h3>
        <p className='text-brand-brown/75 mt-4 max-w-2xl leading-7'>{section.body}</p>
      </div>
    </article>
  );
}

function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className='mb-6 max-w-3xl'>
      <p className='text-brand-orange text-xs font-bold uppercase'>{eyebrow}</p>
      <h2 className='font-display text-brand-black mt-2 text-2xl font-bold sm:text-3xl'>{title}</h2>
      <p className='text-brand-brown/70 mt-3 text-sm leading-6'>{body}</p>
    </div>
  );
}

function StockCheckCard({ label, value }: { label: string; value: string }) {
  return (
    <div className='border-brand-sand/70 bg-brand-cream border p-4'>
      <p className='text-brand-brown/50 text-xs font-semibold uppercase'>{label}</p>
      <p className='text-brand-black mt-2 text-sm font-bold'>{value}</p>
    </div>
  );
}

function getFallbackSpecs(facts: PublicProductFacts) {
  return [
    { label: 'MOQ', value: facts.moq },
    { label: 'Stock status', value: facts.stock },
    { label: 'Suitable buyers', value: 'Boutiques, wholesalers & importers' },
    { label: 'Sizes', value: facts.sizes },
    { label: 'Colors', value: facts.colors },
    { label: 'Fabric', value: 'Confirm composition for this style' },
    { label: 'Custom options', value: 'Ask for feasibility and quantity' },
    { label: 'Shipping', value: 'Confirm packing and cargo handover' }
  ];
}
