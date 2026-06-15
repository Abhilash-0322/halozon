import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const sp = req.nextUrl.searchParams;
  await connectDB();
  const filter: Record<string, unknown> = {};
  const q = sp.get('q');
  if (q) filter.title = { $regex: q, $options: 'i' };
  const items = await Product.find(filter)
    .select('-reviews -description')
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  return NextResponse.json({ items: JSON.parse(JSON.stringify(items)) });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { productId } = await req.json();
  await connectDB();
  await Product.deleteOne({ _id: productId });
  return NextResponse.json({ ok: true });
}
