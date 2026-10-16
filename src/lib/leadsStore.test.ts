import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createLead, getLeads, updateLead, summarizeLeads } from './leadsStore';

let folder: string;
const priorDirectory = process.env.JACK_FASHION_RUNTIME_DATA_DIR;
beforeEach(async () => {
  folder = await mkdtemp(path.join(tmpdir(), 'jack-leads-test-'));
  process.env.JACK_FASHION_RUNTIME_DATA_DIR = folder;
});
afterEach(async () => {
  if (priorDirectory === undefined) delete process.env.JACK_FASHION_RUNTIME_DATA_DIR;
  else process.env.JACK_FASHION_RUNTIME_DATA_DIR = priorDirectory;
  await rm(folder, { recursive: true, force: true });
});

describe('private lead records', () => {
  test('creates a manual record and retains confirmed stages when it is archived', async () => {
    const lead = await createLead({
      customer: 'Boutique A',
      country: 'Ghana',
      productIds: ['13'],
      quantity: 100,
      source: 'chatgpt',
      sourceEvidence: 'customer_reported'
    });
    expect(lead.status).toBe('new');
    expect(lead.timeline.new).toBeTruthy();
    await updateLead(lead.id, { status: 'qualified' });
    await updateLead(lead.id, { status: 'quoted' });
    await updateLead(lead.id, { status: 'won', archived: true });
    const records = await getLeads();
    expect(records[0].timeline.qualified).toBeTruthy();
    expect(records[0].timeline.quoted).toBeTruthy();
    expect(records[0].archivedAt).toBeTruthy();
    expect(summarizeLeads(records)).toMatchObject({
      registered: 1,
      qualified: 1,
      quoted: 1,
      won: 1
    });
  });
  test('accepts Grok as a first-class manually evidenced lead source', async () => {
    const lead = await createLead({
      customer: 'Boutique G',
      country: 'United Kingdom',
      source: 'grok',
      sourceEvidence: 'customer_reported'
    });

    expect(lead.source).toBe('grok');
    expect((await getLeads())[0].source).toBe('grok');
  });
  test('rejects invalid input and cannot overwrite identifiers or timestamps', async () => {
    await expect(createLead({ customer: '' })).rejects.toThrow();
    await expect(createLead({ customer: 'A', quantity: -1 })).rejects.toThrow();
    await expect(createLead({ customer: 'A', status: 'magic' })).rejects.toThrow();
    const lead = await createLead({ customer: 'A' });
    const changed = await updateLead(lead.id, {
      customer: 'B',
      id: 'changed',
      createdAt: '1990-01-01'
    });
    expect(changed?.id).toBe(lead.id);
    expect(changed?.createdAt).toBe(lead.createdAt);
    expect(changed?.source).toBe('unknown');
    expect(await updateLead('not-present', { status: 'qualified' })).toBeNull();
  });
  test('serializes concurrent writes without losing customers', async () => {
    await Promise.all(
      Array.from({ length: 12 }, (_, index) => createLead({ customer: `Buyer ${index}` }))
    );
    const records = await getLeads();
    expect(records).toHaveLength(12);
    expect(new Set(records.map((lead) => lead.id)).size).toBe(12);
  });
  test('keeps damaged data intact instead of replacing it with an empty store', async () => {
    const file = path.join(folder, 'leads.json');
    await writeFile(file, 'damaged-data');
    await expect(createLead({ customer: 'A' })).rejects.toThrow();
    expect(await readFile(file, 'utf-8')).toBe('damaged-data');
  });
});
