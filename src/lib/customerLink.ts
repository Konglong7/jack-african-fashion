export function buildCustomerLink(siteUrl: string, value: string) {
  const alias = value.trim();
  if (!alias) return { url: '', error: 'Enter a customer alias.' };
  if (/^\+?[\d\s()-]{7,}$/.test(alias)) {
    return { url: '', error: 'Use a short alias, not a phone number.' };
  }

  try {
    const url = new URL(siteUrl);
    url.pathname = '/';
    url.search = '';
    url.hash = '';
    url.searchParams.set('utm_source', 'whatsapp');
    url.searchParams.set('utm_campaign', alias.slice(0, 50));
    return { url: url.toString(), error: '' };
  } catch {
    return { url: '', error: 'Website URL is not configured.' };
  }
}
