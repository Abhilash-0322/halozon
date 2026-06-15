import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireSeller } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSeller();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = await req.json();
  await connectDB();
  const product = await Product.findOne({ _id: params.id, sellerId: auth.user.id });
  if (!product) return NextResponse.json({ error: 'Not found or not yours' }, { status: 404 });
  const allowed = ['title', 'description', 'features', 'price', 'listPrice', 'brand', 'categorySlug', 'images', 'stock', 'isPrime', 'freeShipping', 'colors', 'sizes', 'tags', 'isDeal', 'dealEndsAt'];
  for (const k of allowed) {
    if (body[k] !== undefined) (product as any)[k] = body[k];
  }
  await product.save();
  return NextResponse.json({ product: JSON.parse(JSON.stringify(product)) });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSeller();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  await connectDB();
  const r = await Product.deleteOne({ _id: params.id, sellerId: auth.user.id });
  if (r.deletedCount === 0)
    return NextResponse.json({ error: 'Not found or not yours' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
