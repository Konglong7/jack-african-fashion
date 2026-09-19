import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import {
  buildUploadFilename,
  isAllowedImageBuffer,
  uploadErrorFor
} from '@/lib/uploadValidation';
import { readFormDataBody } from '@/lib/apiRequest';

// POST /api/admin/upload — receive one or more images and save to public/images/products/
// Form fields:
//   - files: File[] (the images)
//   - slug (optional): target filename prefix; falls back to the original name

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'products');

export async function POST(req: NextRequest) {
  const parsedFormData = await readFormDataBody(req);
  if (!parsedFormData.ok) {
    return NextResponse.json({ ok: false, error: parsedFormData.error }, { status: 400 });
  }

  const formData = parsedFormData.data;
  const files = formData.getAll('files').filter((f): f is File => f instanceof File);
  const slug = (formData.get('slug') as string) || '';

  if (files.length === 0) {
    return NextResponse.json({ ok: false, error: 'No files uploaded' }, { status: 400 });
  }

  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('[Upload] Failed to create upload directory:', error);
    return NextResponse.json({ ok: false, error: 'Upload storage is unavailable' }, { status: 500 });
  }

  const uploaded: { name: string; url: string; size: number }[] = [];
  const errors: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const validationError = uploadErrorFor(file);

    if (validationError) {
      errors.push(validationError);
      continue;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!isAllowedImageBuffer(buffer, file.type)) {
      errors.push(`${file.name}: invalid image content`);
      continue;
    }

    const filename = buildUploadFilename({
      originalName: file.name,
      slug,
      index: i,
      nonce: randomBytes(4).toString('hex')
    });

    try {
      await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
    } catch (error) {
      console.error(`[Upload] Failed to write ${filename}:`, error);
      errors.push(`${file.name}: failed to save file`);
      continue;
    }

    uploaded.push({
      name: filename,
      url: `/images/products/${filename}`,
      size: file.size
    });
  }

  return NextResponse.json({ ok: true, uploaded, errors });
}
