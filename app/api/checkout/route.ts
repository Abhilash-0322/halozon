import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import { getCurrentUser, randomOrderId } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  const {
    addresses,
    shippingAddress,
    paymentMethod,
    cardNumber,
    couponCode,
    giftWrap,
    giftMessage,
  } = await req.json();

  // Accept either single shippingAddress or multi-address list
  const addressList: any[] =
    Array.isArray(addresses) && addresses.length > 0
      ? addresses
      : shippingAddress
      ? [shippingAddress]
      : [];
  if (addressList.length === 0)
    return NextResponse.json({ error: 'At least one shipping address required' }, { status: 400 });
  for (const a of addressList) {
    if (!a?.street || !a?.city || !a?.zip)
      return NextResponse.json({ error: 'Complete every shipping address' }, { status: 400 });
  }
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

  const itemsTotal = cart.items.reduce(
    (s: number, i: { price: number; qty: number }) => s + i.price * i.qty,
    0
  );

  // Coupon
  let couponDiscount = 0;
  let couponCodeApplied: string | undefined;
  if (couponCode) {
    const c = await Coupon.findOne({ code: String(couponCode).toUpperCase().trim() });
    if (c && c.active && itemsTotal >= (c.minOrder || 0)) {
      if (c.type === 'percent') {
        couponDiscount = +(itemsTotal * (c.amount / 100)).toFixed(2);
        if (c.maxDiscount) couponDiscount = Math.min(couponDiscount, c.maxDiscount);
      } else if (c.type === 'fixed') {
        couponDiscount = Math.min(c.amount, itemsTotal);
      }
      couponCodeApplied = c.code;
      c.usageCount += 1;
      await c.save();
    }
  }

  // Shipping: free if itemsTotal >= $35 OR coupon is freeship
  let shippingFee = itemsTotal >= 35 ? 0 : 5.99;
  if (couponCodeApplied) {
    const c = await Coupon.findOne({ code: couponCodeApplied });
    if (c?.type === 'freeship') shippingFee = 0;
  }

  const giftWrapFee = giftWrap ? 3.99 : 0;
  const tax = +((itemsTotal - couponDiscount) * 0.08).toFixed(2);
  const total = +(itemsTotal - couponDiscount + shippingFee + giftWrapFee + tax).toFixed(2);

  // Build initial tracking events
  const trackingEvents = [
    { status: 'ordered', label: 'Order placed', at: new Date() },
    { status: 'processing', label: 'Preparing for shipment', at: new Date(Date.now() + 1000 * 60 * 60) },
  ];

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
    addresses: addressList,
    shippingAddress: addressList[0],
    paymentMethod: {
      brand: paymentMethod,
      last4: String(cardNumber).slice(-4),
    },
    itemsTotal: +itemsTotal.toFixed(2),
    shippingFee,
    tax,
    couponCode: couponCodeApplied,
    couponDiscount,
    giftWrap: !!giftWrap,
    giftWrapFee,
    giftMessage: giftMessage || '',
    total,
    status: 'processing',
    trackingEvents,
    deliveryEta: new Date(Date.now() + 1000 * 60 * 60 * 24 * (1 + Math.random() * 4)),
  });

  // Decrement stock
  for (const item of cart.items) {
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { stock: -item.qty, sold: item.qty } }
    );
  }

  cart.items = [];
  await cart.save();

  return NextResponse.json({ order: JSON.parse(JSON.stringify(order)) });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ items: [] });
  await connectDB();
  const orders = await Order.find({ userId: user.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items: JSON.parse(JSON.stringify(orders)) });
}
