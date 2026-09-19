import { describe, expect, test } from 'vitest';
import { resolveAttribution } from './analyticsAttribution';

describe('analytics session attribution', () => {
  test('uses and serializes attribution from the current URL', () => {
    const result = resolveAttribution('?utm_source=whatsapp&utm_campaign=Ghana-Amina', null);

    expect(result).toEqual({
      source: 'whatsapp',
      campaign: 'Ghana-Amina',
      serialized: '{"source":"whatsapp","campaign":"Ghana-Amina"}'
    });
  });

  test('inherits attribution stored earlier in the browser tab', () => {
    const result = resolveAttribution('', '{"source":"whatsapp","campaign":"Ghana-Amina"}');

    expect(result.source).toBe('whatsapp');
    expect(result.campaign).toBe('Ghana-Amina');
  });

  test('ignores malformed storage and bounds user-controlled fields', () => {
    expect(resolveAttribution('', 'not-json')).toEqual({ source: '', campaign: '', serialized: '' });

    const result = resolveAttribution(
      `?utm_source=${'s'.repeat(100)}&utm_campaign=${'c'.repeat(120)}`,
      null
    );
    expect(result.source).toHaveLength(60);
    expect(result.campaign).toHaveLength(80);
  });
});
