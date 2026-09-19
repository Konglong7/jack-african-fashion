import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/db';
import { normalizeProductInput } from '@/lib/productValidation';
import { readJsonBody } from '@/lib/apiRequest';

interface Params {
  id: string;
}

// GET /api/admin/products/[id] — fetch single product
export async function GET(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ product });
}

// PUT /api/admin/products/[id] — update product
export async function PUT(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const body = await readJsonBody(req);
  if (!body.ok) {
    return NextResponse.json({ ok: false, error: body.error }, { status: 400 });
  }

  const validation = normalizeProductInput(body.data as Record<string, unknown>);

  if (!validation.ok) {
    return NextResponse.json({ ok: false, error: validation.error }, { status: 400 });
  }

  try {
    const product = await updateProduct(id, validation.product);
    if (!product) {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, product });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to update product' },
      { status: 400 }
    );
  }
}

// DELETE /api/admin/products/[id] — delete product
export async function DELETE(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const deleted = await deleteProduct(id);
  if (!deleted) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
