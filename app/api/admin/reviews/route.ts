import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const sp = req.nextUrl.searchParams;
  await connectDB();
  const limit = Math.min(parseInt(sp.get('limit') || '30'), 100);
  const products = await Product.find({ 'reviews.0': { $exists: true } })
    .select('title reviews')
    .limit(50)
    .lean();
  const items: any[] = [];
  for (const p of products as any[]) {
    for (const r of p.reviews || []) {
      items.push({
        productId: String(p._id),
        productTitle: p.title,
        reviewId: String(r._id),
        userName: r.userName,
        rating: r.rating,
        title: r.title,
        body: r.body,
        createdAt: r.createdAt,
      });
    }
  }
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ items: items.slice(0, limit) });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { productId, reviewId } = await req.json();
  if (!productId || !reviewId)
    return NextResponse.json({ error: 'productId and reviewId required' }, { status: 400 });
  await connectDB();
  const product = await Product.findById(productId);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  product.reviews = product.reviews.filter((r: any) => String(r._id) !== String(reviewId));
  product.ratingCount = product.reviews.length;
  product.rating =
    product.reviews.length > 0
      ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
      : 4.5;
  await product.save();
  return NextResponse.json({ ok: true });
}
