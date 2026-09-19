import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';
import { normalizeProductInput } from '@/lib/productValidation';
import { readJsonBody } from '@/lib/apiRequest';

// GET /api/admin/products — list all products
export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

// POST /api/admin/products — create a new product
export async function POST(req: NextRequest) {
  const body = await readJsonBody(req);
  if (!body.ok) {
    return NextResponse.json({ ok: false, error: body.error }, { status: 400 });
  }

  const validation = normalizeProductInput(body.data as Record<string, unknown>);

  if (!validation.ok) {
    return NextResponse.json({ ok: false, error: validation.error }, { status: 400 });
  }

  try {
    const product = await createProduct(validation.product);
    return NextResponse.json({ ok: true, product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 400 }
    );
  }
}
