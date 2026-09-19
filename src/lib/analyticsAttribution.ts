export function resolveAttribution(search: string, stored: string | null) {
  const params = new URLSearchParams(search);
  if (params.has('utm_source') || params.has('utm_campaign')) {
    return result(params.get('utm_source'), params.get('utm_campaign'));
  }

  try {
    const saved = JSON.parse(stored || '') as { source?: unknown; campaign?: unknown };
    return result(saved.source, saved.campaign);
  } catch {
    return result('', '');
  }
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
