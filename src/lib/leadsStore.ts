import { randomUUID } from 'node:crypto';
import { readRuntimeJson, updateRuntimeJson } from './runtimeData';

export const LEAD_STATUSES = ['new', 'qualified', 'quoted', 'won', 'closed'] as const;
export const LEAD_SOURCES = [
  'unknown',
  'google',
  'bing',
  'chatgpt',
  'perplexity',
  'copilot',
  'claude',
  'gemini',
  'grok',
  'whatsapp',
  'referral',
  'direct',
  'other'
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];
export interface Lead {
  id: string;
  customer: string;
  country: string;
  productIds: string[];
  quantity?: number;
  source: LeadSource;
  sourceEvidence: 'unknown' | 'customer_reported' | 'campaign_link';
  landingPath: string;
  notes: string;
  status: LeadStatus;
  timeline: Partial<Record<LeadStatus, string>>;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
interface LeadFile {
  schemaVersion: 1;
  leads: Lead[];
}
const empty = (): LeadFile => ({ schemaVersion: 1, leads: [] });

function assertFile(data: LeadFile) {
  if (data.schemaVersion !== 1 || !Array.isArray(data.leads)) {
    throw new Error('Invalid leads data; restore a verified backup before writing.');
  }
}
export async function getLeads(): Promise<Lead[]> {
  const data = await readRuntimeJson('leads.json', empty);
  assertFile(data);
  return [...data.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function createLead(input: unknown): Promise<Lead> {
  const fields = normalizeLeadInput(input);
  const now = new Date().toISOString();
  const lead: Lead = {
    ...fields,
    id: randomUUID(),
    timeline: { new: now, [fields.status]: now },
    archivedAt: fields.archived ? now : null,
    createdAt: now,
    updatedAt: now
  };
  delete (lead as Lead & { archived?: boolean }).archived;
  return updateRuntimeJson('leads.json', empty, (data) => {
    assertFile(data);
    data.leads.unshift(lead);
    return lead;
  });
}
export async function updateLead(id: string, input: unknown): Promise<Lead | null> {
  return updateRuntimeJson('leads.json', empty, (data) => {
    assertFile(data);
    const index = data.leads.findIndex((lead) => lead.id === id);
    if (index < 0) return null;
    const prior = data.leads[index];
    const fields = normalizeLeadInput(input, prior);
    const now = new Date().toISOString();
    const lead: Lead = {
      ...prior,
      ...fields,
      id: prior.id,
      createdAt: prior.createdAt,
      updatedAt: now,
      timeline: { ...prior.timeline, [fields.status]: prior.timeline[fields.status] || now },
      archivedAt: fields.archived ? prior.archivedAt || now : null
    };
    delete (lead as Lead & { archived?: boolean }).archived;
    data.leads[index] = lead;
    return lead;
  });
}

export function normalizeLeadInput(input: unknown, prior?: Lead) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Invalid enquiry record');
  }
  const supplied = input as Record<string, unknown>;
  const data = { ...prior, ...supplied } as Record<string, unknown>;
  const customer = text(data.customer, 100, 'Customer name');
  if (!customer) throw new Error('Enter a customer name');
  const status = data.status ?? 'new';
  const source = data.source ?? 'unknown';
  const sourceEvidence = data.sourceEvidence ?? 'unknown';
  if (!LEAD_STATUSES.includes(status as LeadStatus)) throw new Error('Invalid enquiry status');
  if (!LEAD_SOURCES.includes(source as LeadSource)) throw new Error('Invalid source');
  if (!['unknown', 'customer_reported', 'campaign_link'].includes(String(sourceEvidence))) {
    throw new Error('Invalid source evidence');
  }
  const quantity = data.quantity === '' || data.quantity === null ? undefined : data.quantity;
  if (
    quantity !== undefined &&
    (typeof quantity !== 'number' ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1 ||
      quantity > 10_000_000)
  ) {
    throw new Error('Quantity must be a positive whole number');
  }
  const productIds = data.productIds ?? [];
  if (
    !Array.isArray(productIds) ||
    productIds.length > 20 ||
    productIds.some((id) => typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,60}$/.test(id))
  ) {
    throw new Error('Invalid style selection');
  }
  const landingPath = text(data.landingPath, 200, 'Landing page');
  if (
    landingPath &&
    (!landingPath.startsWith('/') ||
      landingPath.startsWith('//') ||
      landingPath.startsWith('/admin') ||
      landingPath.startsWith('/api'))
  ) {
    throw new Error('Use a public website path');
  }
  if (supplied.archived !== undefined && typeof supplied.archived !== 'boolean') {
    throw new Error('Invalid archive value');
  }
  return {
    customer,
    country: text(data.country, 80, 'Country'),
    productIds: [...new Set(productIds as string[])],
    quantity: quantity as number | undefined,
    source: source as LeadSource,
    sourceEvidence: sourceEvidence as Lead['sourceEvidence'],
    landingPath: landingPath.split('?')[0],
    notes: text(data.notes, 1500, 'Notes'),
    status: status as LeadStatus,
    archived: supplied.archived === undefined ? Boolean(prior?.archivedAt) : supplied.archived
  };
}
export function summarizeLeads(leads: Lead[]) {
  return {
    registered: leads.length,
    qualified: leads.filter(
      (lead) => lead.timeline.qualified || lead.timeline.quoted || lead.timeline.won
    ).length,
    quoted: leads.filter((lead) => lead.timeline.quoted || lead.timeline.won).length,
    won: leads.filter((lead) => lead.timeline.won).length
  };
}
function text(value: unknown, limit: number, field: string) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string' || value.length > limit) {
    throw new Error(`${field} is too long or invalid`);
  }
  return value.trim();
}
