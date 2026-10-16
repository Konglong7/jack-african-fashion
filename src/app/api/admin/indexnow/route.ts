import type { NextRequest } from 'next/server';
import { guardLeadRequest, privateLeadResponse, readLeadBody } from '@/lib/adminLeadsApi';
import { enqueueIndexNow, flushIndexNow, getIndexNowState } from '@/lib/indexNow';
import sitemap from '@/app/sitemap';
export async function GET(req: NextRequest) {
  const denied = await guardLeadRequest(req);
  if (denied) return denied;
  return privateLeadResponse({
    ...(await getIndexNowState()),
    enabled: process.env.JACK_FASHION_INDEXNOW_ENABLED === '1'
  });
}
export async function POST(req: NextRequest) {
  const denied = await guardLeadRequest(req, true);
  if (denied) return denied;
  if (req.body) {
    try {
      const body = await readLeadBody(req);
      if (
        !Array.isArray(body.paths) ||
        !body.paths.length ||
        body.paths.length > 1_000 ||
        body.paths.some((path) => typeof path !== 'string') ||
        typeof body.change !== 'string' ||
        !body.change ||
        body.change.length > 160
      ) {
        return privateLeadResponse({ ok: false, error: 'Invalid release update' }, 400);
      }
      const publicUrls = new Set((await sitemap()).map((entry) => new URL(entry.url).toString()));
      const origin = new URL([...publicUrls][0]).origin;
      const paths = body.paths as string[];
      if (paths.some((path) => !publicUrls.has(new URL(path, origin).toString()))) {
        return privateLeadResponse(
          { ok: false, error: 'Release updates must match the current public sitemap' },
          400
        );
      }
      await enqueueIndexNow(paths, body.change);
    } catch {
      return privateLeadResponse(
        { ok: false, error: 'The release notification could not be queued' },
        400
      );
    }
  }
  try {
    return privateLeadResponse({ ok: true, ...(await flushIndexNow({ force: true })) });
  } catch {
    return privateLeadResponse(
      {
        ok: false,
        error: 'The update queue could not be read. Check the data file before retrying.'
      },
      500
    );
  }
}
