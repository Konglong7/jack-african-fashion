export function resolveAttribution(search: string, stored: string | null, referrer = '') {
  const params = new URLSearchParams(search);
  if (params.has('utm_source') || params.has('utm_campaign')) {
    return result(params.get('utm_source'), params.get('utm_campaign'));
  }

  try {
    const saved = JSON.parse(stored || '') as { source?: unknown; campaign?: unknown };
    if (saved && (saved.source || saved.campaign)) {
      return result(saved.source, saved.campaign);
    }
  } catch {}

  // Detect AI answer engine & search referrers (e.g. ChatGPT, Perplexity, Claude)
  if (referrer) {
    const source = referralSource(referrer);
    if (source) {
      return result(source, ['google', 'bing'].includes(source) ? 'organic_search' : 'ai_referral');
    }
  }

  return result('', '');
}

export function referralSource(referrer: string): string {
  try {
    const url = new URL(referrer.includes('://') ? referrer : `https://${referrer}`);
    if (!['http:', 'https:', 'android-app:'].includes(url.protocol)) return '';
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    const domains: Record<string, string> = {
      'chatgpt.com': 'chatgpt',
      'chat.openai.com': 'chatgpt',
      'com.openai.chatgpt': 'chatgpt',
      'perplexity.ai': 'perplexity',
      'perplexity.com': 'perplexity',
      'claude.ai': 'claude',
      'copilot.microsoft.com': 'copilot',
      'gemini.google.com': 'gemini',
      'grok.com': 'grok'
    };
    if (domains[host]) return domains[host];
    if (host === 'bing.com' || host.endsWith('.bing.com')) return 'bing';
    if (
      /^google\.(com|co\.uk|com\.br|com\.mx|co\.za|co\.ke|com\.ng|com\.gh|ca|fr|de|it|es|com\.au|co\.in|co\.id|com\.my|com\.sa|ae|com\.ar|com\.tr|com\.sg)$/.test(
        host
      )
    ) {
      return 'google';
    }
  } catch {}
  return '';
}

function result(sourceValue: unknown, campaignValue: unknown) {
  const source = canonicalSource(clean(sourceValue, 60));
  const campaign = clean(campaignValue, 80);
  return {
    source,
    campaign,
    serialized: source || campaign ? JSON.stringify({ source, campaign }) : ''
  };
}

function canonicalSource(value: string): string {
  const normalized = value.toLowerCase();
  const sources: Record<string, string> = {
    'chatgpt.com': 'chatgpt',
    'chat.openai.com': 'chatgpt',
    chatgpt: 'chatgpt',
    'gemini.google.com': 'gemini',
    gemini: 'gemini',
    'perplexity.ai': 'perplexity',
    'perplexity.com': 'perplexity',
    perplexity: 'perplexity',
    'copilot.microsoft.com': 'copilot',
    copilot: 'copilot',
    'grok.com': 'grok',
    grok: 'grok',
    'claude.ai': 'claude',
    claude: 'claude',
    google: 'google',
    bing: 'bing',
    whatsapp: 'whatsapp'
  };
  return sources[normalized] || value;
}

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().replace(/[<>]/g, '').slice(0, maxLength) : '';
}
