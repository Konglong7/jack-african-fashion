'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_SITE_CONTENT, siteWhatsAppLink, type SiteContent } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';
import { WhatsAppIcon, UploadIcon, XIcon } from '@/components/Icons';

export function CustomOrdersClient({
  initialSiteContent = DEFAULT_SITE_CONTENT
}: {
  initialSiteContent?: SiteContent;
}) {
  const [siteContent] = useState<SiteContent>(initialSiteContent);
  const [submitted, setSubmitted] = useState(false);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    whatsapp: '',
    category: '',
    quantity: '',
    message: ''
  });

  // Create preview URLs safely and revoke them on cleanup to prevent memory leaks
  const previewUrls = useMemo(
    () => referenceFiles.map((file) => URL.createObjectURL(file)),
    [referenceFiles]
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setReferenceFiles((prev) => [...prev, ...files].slice(0, 5));
  };

  const removeFile = (idx: number) => {
    setReferenceFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const [submittedMsg, setSubmittedMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refImagesNote =
      referenceFiles.length > 0
        ? `\n\nReference images attached: ${referenceFiles.map((f) => f.name).join(', ')}`
        : '';
    const whatsappMsg = `Hello Jack, I want to make a custom order.\n\nName: ${formData.name}\nCountry: ${formData.country}\nWhatsApp: ${formData.whatsapp}\nCategory: ${formData.category}\nQuantity: ${formData.quantity}\n\n${formData.message}${refImagesNote}`;
    setSubmittedMsg(whatsappMsg);
    window.open(siteWhatsAppLink(siteContent, whatsappMsg), '_blank');
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className='bg-brand-black py-14 text-white sm:py-20'>
        <div className='mx-auto max-w-7xl px-4 text-center'>
          <span className='text-brand-gold text-sm font-semibold tracking-[0.2em] uppercase'>
            Custom Production
          </span>
          <h1 className='font-display mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl'>
            Custom Women&apos;s Fashion Orders
          </h1>
          <p className='text-brand-cream/70 mx-auto mt-4 max-w-2xl leading-relaxed'>
            Tell us what style you need. Send us pictures, size details and quantity. We will check
            fabric, production cost and give you a suitable wholesale quote.
          </p>
        </div>
      </section>

      <section className='bg-brand-cream py-12 sm:py-16'>
        <div className='mx-auto max-w-3xl px-4'>
          <div className='bg-brand-black relative mb-8 aspect-[16/10] overflow-hidden rounded-2xl shadow-sm'>
            <Image
              src={SITE_IMAGES.customOrders}
              alt='Custom women fashion order reference styles and production service'
              fill
              priority
              sizes='(max-width: 768px) 100vw, 768px'
              className='object-cover'
            />
          </div>

          {/* MOQ notice */}
          <div className='bg-brand-gold/10 border-brand-gold/30 mb-8 rounded-xl border p-5 text-center'>
            <p className='text-brand-brown text-sm font-medium sm:text-base'>
              For custom production, MOQ is usually{' '}
              <span className='font-bold'>100 pcs per style</span>. For ready stock, small wholesale
              orders are also available.
            </p>
          </div>

          {submitted ? (
            <div className='rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12'>
              <div className='bg-brand-emerald/15 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                <svg className='text-brand-emerald h-8 w-8' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' />
                </svg>
              </div>
              <h2 className='font-display text-brand-black mb-3 text-2xl font-bold'>
                Inquiry Sent!
              </h2>
              <p className='text-brand-brown/70 mx-auto mb-6 max-w-md'>
                We&apos;ve opened WhatsApp with your details pre-filled. If it didn&apos;t open
                automatically, please message us directly.
              </p>
              <div className='flex flex-col items-center justify-center gap-3 sm:flex-row'>
                <a
                  href={siteWhatsAppLink(
                    siteContent,
                    submittedMsg || 'Hello Jack, I want to make a custom order.'
                  )}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-brand-orange hover:bg-brand-gold inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-semibold text-white transition-colors'
                >
                  <WhatsAppIcon className='h-5 w-5' />
                  Open WhatsApp Again
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
                  {copied ? 'Copied to Clipboard!' : 'Copy Order Text'}
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className='space-y-5 rounded-2xl bg-white p-6 shadow-sm sm:p-8'
            >
              <h2 className='font-display text-brand-black text-xl font-bold sm:text-2xl'>
                Send Your Inquiry
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
              </div>

              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                <div>
                  <label
                    htmlFor='whatsapp'
                    className='text-brand-brown mb-1.5 block text-sm font-medium'
                  >
                    WhatsApp Number *
                  </label>
                  <input
                    type='tel'
                    id='whatsapp'
                    name='whatsapp'
                    required
                    placeholder='e.g. +234 800 000 0000'
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className='border-brand-sand bg-brand-cream/30 focus:border-brand-orange w-full rounded-lg border px-4 py-2.5 focus:outline-none'
                  />
                </div>
                <div>
                  <label
                    htmlFor='category'
                    className='text-brand-brown mb-1.5 block text-sm font-medium'
                  >
                    Product Category *
                  </label>
                  <select
                    id='category'
                    name='category'
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className='border-brand-sand bg-brand-cream/30 focus:border-brand-orange w-full rounded-lg border px-4 py-2.5 focus:outline-none'
                  >
                    <option value=''>Select category</option>
                    {siteContent.categories.map((category) => (
                      <option key={category.name}>{category.name}</option>
                    ))}
                    <option>Other / Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor='quantity'
                  className='text-brand-brown mb-1.5 block text-sm font-medium'
                >
                  Quantity (pcs) *
                </label>
                <input
                  type='number'
                  id='quantity'
                  name='quantity'
                  required
                  min='1'
                  placeholder='e.g. 200'
                  value={formData.quantity}
                  onChange={handleChange}
                  className='border-brand-sand bg-brand-cream/30 focus:border-brand-orange w-full rounded-lg border px-4 py-2.5 focus:outline-none'
                />
              </div>

              {/* Reference image upload */}
              <div>
                <label className='text-brand-brown mb-1.5 block text-sm font-medium'>
                  Upload Reference Images (optional, up to 5)
                </label>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleFilePick}
                  className='hidden'
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files).filter((f) =>
                      f.type.startsWith('image/')
                    );
                    setReferenceFiles((prev) => [...prev, ...files].slice(0, 5));
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className='border-brand-sand bg-brand-cream/30 hover:border-brand-orange w-full cursor-pointer rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors'
                >
                  <UploadIcon className='text-brand-brown/40 mx-auto mb-2 h-8 w-8' />
                  <p className='text-brand-brown/60 text-sm'>
                    Click to upload or drag reference images here
                  </p>
                  <p className='text-brand-brown/40 mt-1 text-xs'>JPG, PNG, WebP — max 5 images</p>
                </div>
                {referenceFiles.length > 0 && (
                  <div className='mt-3 grid grid-cols-5 gap-2'>
                    {referenceFiles.map((file, idx) => (
                      <div
                        key={previewUrls[idx] || idx}
                        className='bg-brand-sand group relative aspect-square overflow-hidden rounded-lg'
                      >
                        {/* Blob previews cannot be optimized by next/image. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrls[idx]}
                          alt={file.name}
                          className='h-full w-full object-cover'
                        />
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className='absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100'
                          aria-label='Remove image'
                        >
                          <XIcon className='h-3 w-3' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className='text-brand-brown/50 mt-2 text-xs'>
                  Tip: After submitting, you&apos;ll also send these images via WhatsApp for faster
                  response.
                </p>
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
                  rows={4}
                  placeholder='Describe the style, fabric, colours and sizes you need...'
                  value={formData.message}
                  onChange={handleChange}
                  className='border-brand-sand bg-brand-cream/30 focus:border-brand-orange w-full resize-none rounded-lg border px-4 py-2.5 focus:outline-none'
                />
              </div>

              <button
                type='submit'
                className='bg-brand-orange hover:bg-brand-gold inline-flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold text-white transition-colors'
              >
                Submit Inquiry
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

              <div className='relative my-2'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='border-brand-sand w-full border-t' />
                </div>
                <div className='relative flex justify-center'>
                  <span className='text-brand-brown/50 bg-white px-4 text-sm'>or</span>
                </div>
              </div>

              <a
                href={siteWhatsAppLink(
                  siteContent,
                  'Hello Jack, I want to make a custom order. I will send reference pictures.'
                )}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-4 text-base font-semibold text-white transition-colors hover:bg-[#20BA5A]'
              >
                <WhatsAppIcon className='h-5 w-5' />
                Send Pictures on WhatsApp
              </a>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
