import type { NextRequest } from 'next/server';
import { createLead, getLeads, normalizeLeadInput } from '@/lib/leadsStore';
import { getProducts } from '@/lib/db';
import { guardLeadRequest, privateLeadResponse, readLeadBody } from '@/lib/adminLeadsApi';

export async function GET(req: NextRequest) {
  const blocked = await guardLeadRequest(req);
  if (blocked) return blocked;
  try {
    return privateLeadResponse({ ok: true, leads: await getLeads() });
  } catch {
    return privateLeadResponse({ ok: false, error: 'Unable to read enquiry records' }, 500);
  }
}
export async function POST(req: NextRequest) {
  const blocked = await guardLeadRequest(req, true);
  if (blocked) return blocked;
  let fields;
  try {
    fields = normalizeLeadInput(await readLeadBody(req));
    const ids = new Set((await getProducts()).map((product) => product.id));
    if (fields.productIds.some((id) => !ids.has(id))) {
      throw new Error('Select an existing catalog style');
    }
  } catch (error) {
    return privateLeadResponse(
      { ok: false, error: error instanceof Error ? error.message : 'Invalid record' },
      400
    );
  }
  try {
    return privateLeadResponse({ ok: true, lead: await createLead(fields) }, 201);
  } catch {
    return privateLeadResponse({ ok: false, error: 'Unable to save enquiry. Please retry.' }, 500);
  }
}
