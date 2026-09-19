import { promises as fs } from 'fs';
import path from 'path';
import { DEFAULT_SITE_CONTENT, normalizeSiteContent, type SiteContent } from './siteContentTypes';

const SITE_CONTENT_FILE = path.join(process.cwd(), 'data', 'site-content.json');

let cache: SiteContent | null = null;
let writeLock = false;

export async function getSiteContent(): Promise<SiteContent> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(SITE_CONTENT_FILE, 'utf-8');
    cache = normalizeSiteContent(JSON.parse(raw));
  } catch {
    cache = DEFAULT_SITE_CONTENT;
  }
  return cache;
}

export async function updateSiteContent(input: unknown): Promise<SiteContent> {
  const content = normalizeSiteContent(input);
  while (writeLock) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  writeLock = true;
  try {
    await fs.mkdir(path.dirname(SITE_CONTENT_FILE), { recursive: true });
    const tempFile = `${SITE_CONTENT_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(content, null, 2), 'utf-8');
    await fs.rename(tempFile, SITE_CONTENT_FILE);
    cache = content;
    return content;
  } finally {
    writeLock = false;
  }
}
