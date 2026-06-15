import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import Product from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ items: [] });
  await connectDB();
  const items = await Subscription.find({ userId: user.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  const { productId, frequencyMonths = 1 } = await req.json();
  if (!productId)
    return NextResponse.json({ error: 'Product required' }, { status: 400 });
  if (![1, 2, 3, 6].includes(frequencyMonths))
    return NextResponse.json({ error: 'Invalid frequency' }, { status: 400 });

  await connectDB();
  const product = (await Product.findById(productId).lean()) as any;
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const existing = await Subscription.findOne({ userId: user.id, productId });
  if (existing) return NextResponse.json({ subscription: existing });

  // Discount: more months = bigger discount
  const discountPercent = frequencyMonths === 1 ? 5 : frequencyMonths === 2 ? 8 : frequencyMonths === 3 ? 10 : 15;

  const sub = await Subscription.create({
    userId: user.id,
    productId,
    title: product.title,
    image: product.images?.[0],
    price: product.price,
    frequencyMonths,
    discountPercent,
    nextDeliveryAt: new Date(Date.now() + frequencyMonths * 30 * 24 * 60 * 60 * 1000),
  });
  return NextResponse.json({ subscription: sub });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  const { subscriptionId } = await req.json();
  await connectDB();
  await Subscription.deleteOne({ _id: subscriptionId, userId: user.id });
  return NextResponse.json({ ok: true });
}
