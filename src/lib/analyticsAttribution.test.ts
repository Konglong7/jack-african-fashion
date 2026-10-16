import { describe, expect, test } from 'vitest';
import { resolveAttribution } from './analyticsAttribution';

describe('analytics session attribution', () => {
  test('recognizes search hosts without inventing AI referrals or trusting lookalike domains', () => {
    expect(resolveAttribution('', null, 'https://www.google.co.uk/search?q=dresses').source).toBe(
      'google'
    );
    expect(resolveAttribution('', null, 'https://www.bing.com/search?q=chat+dress').source).toBe(
      'bing'
    );
    expect(resolveAttribution('', null, 'https://www.perplexity.com/search/123').source).toBe(
      'perplexity'
    );
    expect(resolveAttribution('', null, 'https://chatgpt.com.example.org/').source).toBe('');
    expect(resolveAttribution('', null, 'https://example.org/?next=chatgpt.com').source).toBe('');
  });
  test('uses and serializes attribution from the current URL', () => {
    const result = resolveAttribution('?utm_source=whatsapp&utm_campaign=Ghana-Amina', null);

    expect(result).toEqual({
      source: 'whatsapp',
      campaign: 'Ghana-Amina',
      serialized: '{"source":"whatsapp","campaign":"Ghana-Amina"}'
    });
  });

  test('normalizes official AI campaign sources to stable reporting names', () => {
    expect(resolveAttribution('?utm_source=chatgpt.com', null).source).toBe('chatgpt');
    expect(resolveAttribution('?utm_source=ChatGPT', null).source).toBe('chatgpt');
    expect(resolveAttribution('?utm_source=gemini.google.com', null).source).toBe('gemini');
    expect(resolveAttribution('?utm_source=grok.com', null).source).toBe('grok');
    expect(resolveAttribution('', '{"source":"chatgpt.com","campaign":"answer"}').source).toBe(
      'chatgpt'
    );
  });

  test('inherits attribution stored earlier in the browser tab', () => {
    const result = resolveAttribution('', '{"source":"whatsapp","campaign":"Ghana-Amina"}');

    expect(result.source).toBe('whatsapp');
    expect(result.campaign).toBe('Ghana-Amina');
  });

  test('ignores malformed storage and bounds user-controlled fields', () => {
    expect(resolveAttribution('', 'not-json')).toEqual({
      source: '',
      campaign: '',
      serialized: ''
    });

    const result = resolveAttribution(
      `?utm_source=${'s'.repeat(100)}&utm_campaign=${'c'.repeat(120)}`,
      null
    );
    expect(result.source).toHaveLength(60);
    expect(result.campaign).toHaveLength(80);
  });

  test('identifies and attributes traffic from ChatGPT and other AI answer engines', () => {
    const chatgptWeb = resolveAttribution('', null, 'https://chatgpt.com/');
    expect(chatgptWeb.source).toBe('chatgpt');
    expect(chatgptWeb.campaign).toBe('ai_referral');

    const chatgptApp = resolveAttribution('', null, 'android-app://com.openai.chatgpt');
    expect(chatgptApp.source).toBe('chatgpt');

    const perplexity = resolveAttribution('', null, 'https://www.perplexity.ai/search/123');
    expect(perplexity.source).toBe('perplexity');

    const claude = resolveAttribution('', null, 'https://claude.ai/chat/abc');
    expect(claude.source).toBe('claude');

    const grok = resolveAttribution('', null, 'https://grok.com/?ref=answer');
    expect(grok.source).toBe('grok');
    expect(resolveAttribution('', null, 'https://x.com/jackfashion').source).toBe('');
    expect(resolveAttribution('', null, 'https://grok.com.example.org/').source).toBe('');
  });
});
