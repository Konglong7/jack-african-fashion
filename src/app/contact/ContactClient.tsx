'use client';

import Image from 'next/image';
import { useState } from 'react';
import { DEFAULT_SITE_CONTENT, siteWhatsAppLink, type SiteContent } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';
import { WhatsAppIcon } from '@/components/Icons';

export function ContactClient({
  initialSiteContent = DEFAULT_SITE_CONTENT
}: {
  initialSiteContent?: SiteContent;
}) {
  const [siteContent] = useState<SiteContent>(initialSiteContent);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello Jack, I'm contacting you from your website.\n\nName: ${formData.name}\nCountry: ${formData.country}\nSubject: ${formData.subject}\n\n${formData.message}`;
    setSubmittedMsg(msg);
    window.open(siteWhatsAppLink(siteContent, msg), '_blank');
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className='bg-brand-black py-14 text-white sm:py-20'>
        <div className='mx-auto max-w-7xl px-4 text-center'>
          <span className='text-brand-gold text-sm font-semibold tracking-[0.2em] uppercase'>
            Contact Us
          </span>
          <h1 className='font-display mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl'>
            Get in Touch
          </h1>
          <p className='text-brand-cream/70 mx-auto mt-4 max-w-2xl leading-relaxed'>
            Have a question about our products, wholesale prices, or custom orders? We&apos;re here
            to help. Message us on WhatsApp for the fastest response.
          </p>
        </div>
      </section>

      <section className='bg-brand-cream py-12 sm:py-16'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Contact info */}
            <div className='lg:col-span-1'>
              <div className='mb-6 rounded-2xl bg-white p-6 shadow-sm'>
                <h2 className='font-display text-brand-black mb-6 text-xl font-bold'>
                  Contact Information
                </h2>

                <div className='space-y-5'>
                  <div className='flex items-start gap-4'>
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10'>
                      <WhatsAppIcon className='h-5 w-5 text-[#25D366]' />
                    </div>
                    <div>
                      <p className='text-brand-black text-sm font-semibold'>WhatsApp</p>
                      <a
                        href={siteWhatsAppLink(siteContent, '')}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-brand-orange hover:text-brand-gold text-sm transition-colors'
                      >
                        {siteContent.whatsappDisplay}
                      </a>
                      <p className='text-brand-brown/50 mt-0.5 text-xs'>
                        Fastest response — usually within hours
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-4'>
                    <div className='bg-brand-orange/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full'>
                      <svg
                        className='text-brand-orange h-5 w-5'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth={2}
                        viewBox='0 0 24 24'
                      >
                        <path d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' />
                        <path d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' />
                      </svg>
                    </div>
                    <div>
                      <p className='text-brand-black text-sm font-semibold'>Location</p>
                      <a
                        href={siteContent.locationUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-brand-orange hover:text-brand-gold text-sm transition-colors'
                      >
                        {siteContent.location}
                      </a>
                      <p className='text-brand-brown/50 mt-0.5 text-xs'>
                        Yuexiu District, Guangzhou
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-4'>
                    <div className='bg-brand-orange/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full'>
                      <svg
                        className='text-brand-orange h-5 w-5'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth={2}
                        viewBox='0 0 24 24'
                      >
                        <path d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                    <div>
                      <p className='text-brand-black text-sm font-semibold'>Business Hours</p>
                      <p className='text-brand-brown/70 text-sm'>Mon–Sat, 9:00–18:00 (GMT+8)</p>
                      <p className='text-brand-brown/50 mt-0.5 text-xs'>
                        We reply on WhatsApp outside hours too
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp */}
              <div className='overflow-hidden rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] text-center text-white'>
                <div className='relative aspect-[4/3]'>
                  <Image
                    src={SITE_IMAGES.whatsappContact}
                    alt='WhatsApp contact guide for African fashion wholesale buyers'
                    fill
                    sizes='(max-width: 1024px) 100vw, 33vw'
                    className='object-cover'
                  />
                </div>
                <div className='p-6'>
                  <WhatsAppIcon className='mx-auto mb-3 h-10 w-10' />
                  <h3 className='mb-2 text-lg font-semibold'>Fastest Way to Reach Us</h3>
                  <p className='mb-4 text-sm text-white/80'>
                    Message us on WhatsApp for instant reply
                  </p>
                  <a
                    href={siteWhatsAppLink(siteContent, 'Hello Jack, I have a question.')}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#128C7E] transition-colors hover:bg-white/90'
                  >
                    Chat Now
                  </a>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className='lg:col-span-2'>
              {submitted ? (
                <div className='rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12'>
                  <div className='bg-brand-emerald/15 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                    <svg
                      className='text-brand-emerald h-8 w-8'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' />
                    </svg>
                  </div>
                  <h2 className='font-display text-brand-black mb-3 text-2xl font-bold'>
                    Message Sent!
                  </h2>
                  <p className='text-brand-brown/70 mx-auto mb-6 max-w-md'>
                    We&apos;ve opened WhatsApp with your message. If it didn&apos;t open, please
                    message us directly.
                  </p>
                  <div className='flex flex-col items-center justify-center gap-3 sm:flex-row'>
                    <a
                      href={siteWhatsAppLink(siteContent, submittedMsg || '')}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='bg-brand-orange hover:bg-brand-gold inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-semibold text-white transition-colors'
                    >
                      <WhatsAppIcon className='h-5 w-5' />
                      Open WhatsApp
                    </a>
                    <button
                      type='button'
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                          navigator.clipboard.writeText(submittedMsg);
                          setCopied(true);
                          window.setTimeout(() => setCopied(false), 2000);
                        }
                      }}
                      className='border-brand-sand hover:border-brand-orange hover:text-brand-orange inline-flex items-center justify-center rounded-full border bg-white px-6 py-3.5 font-semibold text-brand-brown transition-colors'
                    >
                      {copied ? 'Copied to Clipboard!' : 'Copy Message Text'}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className='space-y-5 rounded-2xl bg-white p-6 shadow-sm sm:p-8'
                >
                  <h2 className='font-display text-brand-black text-xl font-bold sm:text-2xl'>
                    Send Us a Message
                  </h2>

                  <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                    <div>
                      <label
                        htmlFor='name'
                        className='text-brand-brown mb-1.5 block text-sm font-medium'
                      >
                        Name *
                      </label>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className='border-brand-sand bg-brand-cream/30 focus:border-brand-orange w-full rounded-lg border px-4 py-2.5 focus:outline-none'
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='email'
                        className='text-brand-brown mb-1.5 block text-sm font-medium'
                      >
                        Email (optional)
                      </label>
                      <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        className='border-brand-sand bg-brand-cream/30 focus:border-brand-orange w-full rounded-lg border px-4 py-2.5 focus:outline-none'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                    <div>
                      <label
                        htmlFor='country'
                        className='text-brand-brown mb-1.5 block text-sm font-medium'
                      >
                        Country *
                      </label>
                      <input
                        type='text'
                        id='country'
                        name='country'
                        required
                        placeholder='e.g. Nigeria'
                        value={formData.country}
                        onChange={handleChange}
                        className='border-brand-sand bg-brand-cream/30 focus:border-brand-orange w-full rounded-lg border px-4 py-2.5 focus:outline-none'
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='subject'
                        className='text-brand-brown mb-1.5 block text-sm font-medium'
                      >
                        Subject *
                      </label>
                      <select
                        id='subject'
                        name='subject'
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className='border-brand-sand bg-brand-cream/30 focus:border-brand-orange w-full rounded-lg border px-4 py-2.5 focus:outline-none'
                      >
                        <option value=''>Select subject</option>
                        <option>Wholesale Price Inquiry</option>
                        <option>Ready Stock Order</option>
                        <option>Custom Order</option>
                        <option>Shipping Question</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='message'
                      className='text-brand-brown mb-1.5 block text-sm font-medium'
                    >
                      Message *
                    </label>
                    <textarea
                      id='message'
                      name='message'
                      required
                      rows={5}
                      placeholder='Tell us what you need...'
                      value={formData.message}
                      onChange={handleChange}
                      className='border-brand-sand bg-brand-cream/30 focus:border-brand-orange w-full resize-none rounded-lg border px-4 py-2.5 focus:outline-none'
                    />
                  </div>

                  <button
                    type='submit'
                    className='bg-brand-orange hover:bg-brand-gold inline-flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold text-white transition-colors'
                  >
                    Send Message via WhatsApp
                    <svg
                      className='h-5 w-5'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      viewBox='0 0 24 24'
                    >
                      <path d='M5 12h14M12 5l7 7-7 7' />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div id='faq' className='mt-16'>
            <h2 className='font-display text-brand-black mb-10 text-center text-2xl font-bold sm:text-3xl'>
              Frequently Asked Questions
            </h2>
            <div className='mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2'>
              {[
                {
                  q: 'What is the minimum order quantity (MOQ)?',
                  a: 'For ready stock, MOQ starts from 30–50 pcs depending on the style. For custom production, MOQ is usually 100 pcs per style.'
                },
                {
                  q: 'How long does production take?',
                  a: 'Ready stock ships within 1–3 days. Custom orders typically take 15–30 days depending on complexity and quantity.'
                },
                {
                  q: 'Do you ship to Africa?',
                  a: 'Yes, we ship to Nigeria, Ghana, Kenya, Tanzania, Zimbabwe and other African countries. We work with trusted shipping partners.'
                },
                {
                  q: 'Can I send my own style pictures?',
                  a: "Absolutely! Send us reference pictures on WhatsApp and we'll quote based on fabric, detail and quantity."
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept bank transfer, Western Union, and other common methods. Details are provided after order confirmation.'
                },
                {
                  q: 'Do you offer samples?',
                  a: 'Yes, we can provide samples for custom orders. Sample cost is refundable against bulk order.'
                }
              ].map((faq, i) => (
                <div key={i} className='rounded-xl bg-white p-5 shadow-sm'>
                  <h3 className='text-brand-black mb-2 font-semibold'>{faq.q}</h3>
                  <p className='text-brand-brown/70 text-sm leading-relaxed'>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
