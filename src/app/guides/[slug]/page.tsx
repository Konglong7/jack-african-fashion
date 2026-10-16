import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BUYER_GUIDES, GUIDE_DATE, GUIDE_UPDATED_DATE, getBuyerGuide } from '@/lib/buyerGuides';
import { getBuyerGuideFaq } from '@/lib/buyerGuideFaq';
import { buildFaqJsonLd } from '@/lib/faqJsonLd';
import { getProducts } from '@/lib/db';
import { getSiteContent } from '@/lib/siteContent';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { pageMetadata } from '@/lib/pageMetadata';
import { absoluteSiteUrl } from '@/lib/siteUrl';
import { MARKET_REGIONS } from '@/lib/marketRegions';
import { GARMENT_EXAMPLES } from '@/lib/garmentExamples';
import { GarmentExamples } from '@/components/GarmentExamples';
import { WhatsAppIcon } from '@/components/Icons';
import styles from '../guides.module.css';

export const revalidate = 60;
export const dynamicParams = false;
export function generateStaticParams() {
  return BUYER_GUIDES.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getBuyerGuide((await params).slug);
  if (!guide) return {};
  return pageMetadata('/guides/' + guide.slug, guide.title, guide.description);
}
export default async function BuyerGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getBuyerGuide((await params).slug);
  if (!guide) notFound();
  const [site, products] = await Promise.all([getSiteContent(), getProducts()]);
  const examples = products
    .filter((product) => product.category === guide.category)
    .slice(-3)
    .reverse();
  const url = absoluteSiteUrl('/guides/' + guide.slug);
  const faq = getBuyerGuideFaq(guide);
  const organization = { '@id': `${absoluteSiteUrl('/')}#organization` };
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.description,
      mainEntityOfPage: url,
      url,
      datePublished: GUIDE_DATE,
      dateModified: GUIDE_UPDATED_DATE,
      inLanguage: 'en',
      author: organization,
      publisher: organization,
      ...(guide.photoExamples
        ? { image: GARMENT_EXAMPLES.map((photo) => absoluteSiteUrl(photo.image)) }
        : {})
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteSiteUrl('/') },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Buyer guides',
          item: absoluteSiteUrl('/guides')
        },
        { '@type': 'ListItem', position: 3, name: guide.title, item: url }
      ]
    },
    { '@context': 'https://schema.org', ...buildFaqJsonLd(url, faq) }
  ];
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
      <section className={styles.intro}>
        <div className={styles.container}>
          <nav aria-label='Breadcrumb' className={styles.crumb}>
            <Link href='/'>Home</Link>
            <span>/</span>
            <Link href='/guides'>Buyer guides</Link>
            <span>/</span>
            <span>{guide.title}</span>
          </nav>
          <p className={styles.eyebrow}>
            Jack Fashion buying notes · Updated{' '}
            {new Date(GUIDE_UPDATED_DATE).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: 'UTC'
            })}
          </p>
          <h1 className={'font-display ' + styles.title}>{guide.title}</h1>
          <p className={styles.summary}>{guide.summary}</p>
          <div className={styles.actions}>
            <a
              href={siteWhatsAppLink(site)}
              data-cta-location='guide-intro'
              data-guide-slug={guide.slug}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.button}
            >
              <WhatsAppIcon className='h-5 w-5 shrink-0' />
              Chat on WhatsApp
            </a>
            <Link href='/catalog'>Choose your styles →</Link>
          </div>
        </div>
      </section>
      <div className={styles.container}>
        <div className={styles.articleLayout}>
          <nav className={styles.contents} aria-label='On this page'>
            <h2>In this guide</h2>
            <ol>
              {guide.sections.map((section) => (
                <li key={section.id}>
                  <a href={'#' + section.id}>{section.title}</a>
                </li>
              ))}
              <li>
                <a href='#faq'>Questions about this guide</a>
              </li>
            </ol>
          </nav>
          <article className={styles.body}>
            {guide.sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className='font-display'>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.checks && (
                  <ul>
                    {section.checks.map((check) => (
                      <li key={check}>{check}</li>
                    ))}
                  </ul>
                )}
                {section.table && (
                  <div
                    className={styles.tableWrap}
                    tabIndex={0}
                    role='region'
                    aria-label={section.table.caption}
                  >
                    <table>
                      <caption>{section.table.caption}</caption>
                      <thead>
                        <tr>
                          {section.table.headings.map((heading) => (
                            <th key={heading} scope='col'>
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row) => (
                          <tr key={row[0]}>
                            {row.map((cell, index) =>
                              index === 0 ? (
                                <th key={index} scope='row'>
                                  {cell}
                                </th>
                              ) : (
                                <td key={index}>{cell}</td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
            <section id='faq'>
              <h2 className='font-display'>Questions about this guide</h2>
              {faq.map((item) => (
                <div key={item.question} className='mt-6'>
                  <h3 className='mb-2 text-lg font-semibold'>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </section>
            <section className={styles.support}>
              <h2 className='font-display'>Put the checks into your enquiry</h2>
              <p>
                Send your selected styles, quantity per style, proposed size-color mix and
                destination. Ask Jack to confirm the current goods and the order terms before
                payment.
              </p>
              <div className={styles.actions}>
                <a
                  href={siteWhatsAppLink(site)}
                  data-cta-location='guide-conclusion'
                  data-guide-slug={guide.slug}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.button}
                >
                  <WhatsAppIcon className='h-5 w-5 shrink-0' />
                  Chat on WhatsApp
                </a>
              </div>
              <div className={styles.links}>
                <Link href={'/wholesale/' + guide.wholesaleSlug}>Explore this wholesale range</Link>
                {guide.marketSlugs.map((slug) => (
                  <Link key={slug} href={'/markets/' + slug}>
                    {MARKET_REGIONS.find((market) => market.slug === slug)?.name}
                  </Link>
                ))}
              </div>
              <ul className={styles.productLinks}>
                {examples.map((product) => (
                  <li key={product.id}>
                    <Link href={'/products/' + product.slug}>
                      {product.name} — view the style and MOQ
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <aside className={styles.related}>
              <h2 className='font-display'>Continue your buying checklist</h2>
              <div className={styles.links}>
                {BUYER_GUIDES.filter((other) => other.slug !== guide.slug).map((other) => (
                  <Link key={other.slug} href={'/guides/' + other.slug}>
                    {other.title}
                  </Link>
                ))}
              </div>
              <div className={styles.links}>
                <Link href='/buying-guide'>Buying overview</Link>
                <Link href='/faq'>Wholesale FAQ</Link>
                <Link href='/terms'>Order terms</Link>
              </div>
            </aside>
          </article>
        </div>
      </div>
      {guide.photoExamples && <GarmentExamples all />}
    </>
  );
}
