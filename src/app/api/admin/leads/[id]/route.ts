import type { NextRequest } from 'next/server';
import { getLeads, normalizeLeadInput, updateLead } from '@/lib/leadsStore';
import { getProducts } from '@/lib/db';
import { guardLeadRequest, privateLeadResponse, readLeadBody } from '@/lib/adminLeadsApi';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const blocked = await guardLeadRequest(req, true);
  if (blocked) return blocked;
  const { id } = await params;
  let data;
  try {
    const prior = (await getLeads()).find((lead) => lead.id === id);
    if (!prior) return privateLeadResponse({ ok: false, error: 'Record not found' }, 404);
    data = await readLeadBody(req);
    const fields = normalizeLeadInput(data, prior);
    const ids = new Set([
      ...(await getProducts()).map((product) => product.id),
      ...prior.productIds
    ]);
    if (fields.productIds.some((value) => !ids.has(value))) {
      throw new Error('Select an existing catalog style');
    }
  } catch (error) {
    return privateLeadResponse(
      { ok: false, error: error instanceof Error ? error.message : 'Invalid record' },
      400
    );
  }
  try {
    const lead = await updateLead(id, data);
    return lead
      ? privateLeadResponse({ ok: true, lead })
      : privateLeadResponse({ ok: false, error: 'Record not found' }, 404);
  } catch {
    return privateLeadResponse({ ok: false, error: 'Unable to save enquiry. Please retry.' }, 500);
  }
}
