import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getCurrentUser, randomOrderId } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  const { shippingAddress, paymentMethod, cardNumber } = await req.json();

  if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.zip)
    return NextResponse.json({ error: 'Complete address required' }, { status: 400 });
  if (!paymentMethod || !cardNumber)
    return NextResponse.json({ error: 'Payment required' }, { status: 400 });

  await connectDB();
  const cart = (await Cart.findOne({ userId: user.id })) as any;
  if (!cart || cart.items.length === 0)
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

  // Validate stock
  for (const item of cart.items) {
    const p = await Product.findById(item.productId);
    if (!p) return NextResponse.json({ error: `Product unavailable` }, { status: 400 });
    if (p.stock < item.qty)
      return NextResponse.json({ error: `Insufficient stock for ${p.title}` }, { status: 400 });
  }

  const itemsTotal = cart.items.reduce((s: number, i: { price: number; qty: number }) => s + i.price * i.qty, 0);
  const shippingFee = itemsTotal >= 35 ? 0 : 5.99;
  const tax = +(itemsTotal * 0.08).toFixed(2);
  const total = +(itemsTotal + shippingFee + tax).toFixed(2);

  const order = await Order.create({
    userId: user.id,
    orderNumber: randomOrderId(),
    items: cart.items.map((i: any) => ({
      productId: i.productId,
      title: i.title,
      image: i.image,
      price: i.price,
      qty: i.qty,
      isPrime: i.isPrime,
    })),
    shippingAddress,
    paymentMethod: {
      brand: paymentMethod,
      last4: String(cardNumber).slice(-4),
    },
    itemsTotal: +itemsTotal.toFixed(2),
    shippingFee,
    tax,
    total,
    status: 'processing',
    deliveryEta: new Date(Date.now() + 1000 * 60 * 60 * 24 * (1 + Math.random() * 4)),
  });

  // Decrement stock
  for (const item of cart.items) {
    await Product.updateOne({ _id: item.productId }, { $inc: { stock: -item.qty, sold: item.qty } });
  }

  cart.items = [];
  await cart.save();

  return NextResponse.json({ order });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ items: [] });
  await connectDB();
  const orders = await Order.find({ userId: user.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items: orders });
}
