'use client';

import { useState } from 'react';
import type { SiteContent } from '@/lib/siteContentTypes';

export function SettingsForm({ initialSettings }: { initialSettings: SiteContent }) {
  const [form, setForm] = useState({
    ...initialSettings,
    heroTrust: initialSettings.heroTrust.join('\n'),
    categories: initialSettings.categories
      .map((category) =>
        [category.name, category.image || '', category.description || ''].join(' | ')
      )
      .join('\n')
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const payload = {
      ...form,
      heroTrust: form.heroTrust
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      categories: form.categories.split('\n').map((line) => {
        const [name = '', image = '', description = ''] = line
          .split('|')
          .map((item) => item.trim());
        return { name, image, description };
      })
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Save failed');
      setMessage('Settings saved.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className='mx-auto max-w-5xl'>
      <div className='mb-6'>
        <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>
          Site content
        </p>
        <h1 className='text-brand-black mt-1 text-2xl font-bold sm:text-3xl'>Settings</h1>
        <p className='text-brand-brown/60 mt-1 text-sm'>
          Edit the storefront hero, contact details, WhatsApp number and social links.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]'>
        <main className='space-y-5'>
          <Panel title='Business contact'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <Field label='Business name'>
                <input
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className='input-control'
                />
              </Field>
              <Field label='Business type'>
                <input
                  value={form.business}
                  onChange={(e) => set('business', e.target.value)}
                  className='input-control'
                />
              </Field>
              <Field label='WhatsApp number' hint='Digits only, country code first'>
                <input
                  value={form.whatsappNumber}
                  onChange={(e) => set('whatsappNumber', e.target.value)}
                  className='input-control'
                />
              </Field>
              <Field label='WhatsApp display'>
                <input
                  value={form.whatsappDisplay}
                  onChange={(e) => set('whatsappDisplay', e.target.value)}
                  className='input-control'
                />
              </Field>
            </div>
            <Field label='Location'>
              <input
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                className='input-control'
              />
            </Field>
            <Field label='Location URL' hint='Google Maps or other map link shown on footer and contact page'>
              <input
                value={form.locationUrl}
                onChange={(e) => set('locationUrl', e.target.value)}
                className='input-control'
                placeholder='https://www.google.com/maps/place/...'
              />
            </Field>
            <Field label='Default WhatsApp message'>
              <textarea
                value={form.defaultWhatsAppMessage}
                onChange={(e) => set('defaultWhatsAppMessage', e.target.value)}
                rows={3}
                className='input-control resize-none'
              />
            </Field>
          </Panel>

          <Panel title='Homepage hero'>
            <Field label='Eyebrow'>
              <input
                value={form.heroEyebrow}
                onChange={(e) => set('heroEyebrow', e.target.value)}
                className='input-control'
              />
            </Field>
            <div className='grid gap-4 sm:grid-cols-2'>
              <Field label='Hero title'>
                <input
                  value={form.heroTitle}
                  onChange={(e) => set('heroTitle', e.target.value)}
                  className='input-control'
                />
              </Field>
              <Field label='Accent words'>
                <input
                  value={form.heroAccent}
                  onChange={(e) => set('heroAccent', e.target.value)}
                  className='input-control'
                />
              </Field>
            </div>
            <Field label='Hero body'>
              <textarea
                value={form.heroBody}
                onChange={(e) => set('heroBody', e.target.value)}
                rows={4}
                className='input-control resize-none'
              />
            </Field>
            <Field label='Trust items' hint='one per line'>
              <textarea
                value={form.heroTrust}
                onChange={(e) => set('heroTrust', e.target.value)}
                rows={4}
                className='input-control resize-none'
              />
            </Field>
          </Panel>

          <Panel title='Categories'>
            <Field label='Category list' hint='one per line: Name | image URL | description'>
              <textarea
                value={form.categories}
                onChange={(e) => set('categories', e.target.value)}
                rows={8}
                className='input-control resize-none font-mono text-xs'
              />
            </Field>
          </Panel>

          <Panel title='Social links'>
            <div className='grid gap-4 sm:grid-cols-3'>
              <Field label='Facebook'>
                <input
                  value={form.socialLinks.facebook}
                  onChange={(e) =>
                    set('socialLinks', { ...form.socialLinks, facebook: e.target.value })
                  }
                  className='input-control'
                />
              </Field>
              <Field label='TikTok'>
                <input
                  value={form.socialLinks.tiktok}
                  onChange={(e) =>
                    set('socialLinks', { ...form.socialLinks, tiktok: e.target.value })
                  }
                  className='input-control'
                />
              </Field>
              <Field label='Instagram'>
                <input
                  value={form.socialLinks.instagram}
                  onChange={(e) =>
                    set('socialLinks', { ...form.socialLinks, instagram: e.target.value })
                  }
                  className='input-control'
                />
              </Field>
            </div>
          </Panel>
        </main>

        <aside className='border-brand-sand h-max border bg-white p-5 lg:sticky lg:top-8'>
          <h2 className='text-brand-black font-bold'>Publish settings</h2>
          <p className='text-brand-brown/65 mt-2 text-sm leading-6'>
            Changes affect the public hero and WhatsApp contact links after save.
          </p>
          {message && (
            <p className='bg-brand-cream text-brand-brown mt-4 rounded-lg p-3 text-sm font-semibold'>
              {message}
            </p>
          )}
          <button
            type='submit'
            disabled={saving}
            className='bg-brand-orange hover:bg-brand-gold mt-5 w-full rounded-lg px-5 py-3 text-sm font-bold text-white disabled:opacity-60'
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className='space-y-4 bg-white p-5 shadow-sm'>
      <h2 className='text-brand-black text-lg font-bold'>{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className='block'>
      <span className='text-brand-brown mb-1 block text-sm font-semibold'>{label}</span>
      {children}
      {hint && <span className='text-brand-brown/50 mt-1 block text-xs'>{hint}</span>}
    </label>
  );
}
