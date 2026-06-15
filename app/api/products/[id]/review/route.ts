import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  const { rating, title, body, images = [] } = await req.json();
  if (!rating || rating < 1 || rating > 5)
    return NextResponse.json({ error: 'Rating 1-5 required' }, { status: 400 });
  if (!body || body.trim().length < 4)
    return NextResponse.json({ error: 'Review body required' }, { status: 400 });

  await connectDB();

  // Verified-buyer check: any delivered order containing this product
  const verifiedOrder = await Order.findOne({
    userId: user.id,
    status: 'delivered',
    'items.productId': params.id,
  });
  const verifiedBuyer = !!verifiedOrder;

  const product = await Product.findById(params.id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  product.reviews.push({
    userId: user.id,
    userName: user.name,
    rating,
    title: title || '',
    body: body.trim(),
    verified: true,
    verifiedBuyer,
    images: Array.isArray(images) ? images.slice(0, 4) : [],
  });
  product.ratingCount = product.reviews.length;
  product.rating =
    product.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) /
    product.ratingCount;
  await product.save();

  return NextResponse.json({ ok: true, verifiedBuyer });
}
