import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  const { rating, title, body } = await req.json();
  if (!rating || rating < 1 || rating > 5)
    return NextResponse.json({ error: 'Rating 1-5 required' }, { status: 400 });

  await connectDB();
  const product = await Product.findById(params.id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  product.reviews.push({
    userId: user.id,
    userName: user.name,
    rating,
    title: title || '',
    body: body || '',
    verified: true,
  });
  product.ratingCount = product.reviews.length;
  product.rating =
    product.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / product.ratingCount;
  await product.save();

  return NextResponse.json({ ok: true });
}
