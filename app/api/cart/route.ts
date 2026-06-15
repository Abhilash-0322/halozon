import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';

async function loadCart(userId: string) {
  await connectDB();
  let cart = await Cart.findOne({ userId }).lean();
  if (!cart) cart = (await Cart.create({ userId, items: [] })).toObject();
  return cart;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ items: [] });
  const cart = (await loadCart(user.id)) as any;
  return NextResponse.json({ items: cart?.items || [] });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  const { productId, qty = 1 } = await req.json();

  await connectDB();
  const product = (await Product.findById(productId).lean()) as any;
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const cart = await Cart.findOneAndUpdate(
    { userId: user.id },
    {
      $setOnInsert: { userId: user.id },
    },
    { upsert: true, new: true }
  );

  const idx = cart.items.findIndex((i: { productId: { toString(): string } }) =>
    i.productId.toString() === productId
  );
  if (idx >= 0) {
    cart.items[idx].qty += qty;
  } else {
    cart.items.push({
      productId,
      title: product.title,
      image: product.images[0],
      price: product.price,
      qty,
      isPrime: product.isPrime,
    });
  }
  await cart.save();
  return NextResponse.json({ items: cart.items });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  const { productId, qty } = await req.json();
  await connectDB();
  const cart = await Cart.findOne({ userId: user.id });
  if (!cart) return NextResponse.json({ error: 'No cart' }, { status: 404 });
  const item = cart.items.find((i: { productId: { toString(): string } }) =>
    i.productId.toString() === productId
  );
  if (!item) return NextResponse.json({ error: 'Item not in cart' }, { status: 404 });
  if (qty <= 0) cart.items = cart.items.filter((i: { productId: { toString(): string } }) => i.productId.toString() !== productId);
  else item.qty = qty;
  await cart.save();
  return NextResponse.json({ items: cart.items });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  const { productId } = await req.json();
  await connectDB();
  const cart = await Cart.findOne({ userId: user.id });
  if (!cart) return NextResponse.json({ items: [] });
  cart.items = cart.items.filter((i: { productId: { toString(): string } }) => i.productId.toString() !== productId);
  await cart.save();
  return NextResponse.json({ items: cart.items });
}
