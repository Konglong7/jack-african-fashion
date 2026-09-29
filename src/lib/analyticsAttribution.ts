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
    const aiSource = detectAiReferrer(referrer);
    if (aiSource) {
      return result(aiSource, 'ai_recommendation');
    }
  }

  return result('', '');
}

function detectAiReferrer(referrer: string): string {
  try {
    const ref = referrer.toLowerCase();
    if (
      ref.includes('chatgpt.com') ||
      ref.includes('chat.openai.com') ||
      ref.includes('com.openai.chatgpt')
    ) {
      return 'chatgpt';
    }
    if (ref.includes('perplexity.ai')) {
      return 'perplexity';
    }
    if (ref.includes('claude.ai')) {
      return 'claude';
    }
    if (
      ref.includes('copilot.microsoft.com') ||
      (ref.includes('bing.com') && ref.includes('chat'))
    ) {
      return 'copilot';
    }
    if (ref.includes('gemini.google.com')) {
      return 'gemini';
    }
  } catch {}
  return '';
}

function result(sourceValue: unknown, campaignValue: unknown) {
  const source = clean(sourceValue, 60);
  const campaign = clean(campaignValue, 80);
  return {
    source,
    campaign,
    serialized: source || campaign ? JSON.stringify({ source, campaign }) : ''
  };
}

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().replace(/[<>]/g, '').slice(0, maxLength) : '';
}
