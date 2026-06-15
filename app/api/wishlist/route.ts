import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ items: [] });
  await connectDB();
  const w = (await Wishlist.findOne({ userId: user.id }).populate('items.productId').lean()) as any;
  return NextResponse.json({ items: w?.items || [] });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  const { productId } = await req.json();
  await connectDB();
  const w = (await Wishlist.findOneAndUpdate(
    { userId: user.id },
    { $setOnInsert: { userId: user.id } },
    { upsert: true, new: true }
  )) as any;
  const exists = w.items.find((id: { toString(): string }) => id.toString() === productId);
  if (!exists) w.items.push(productId);
  await w.save();
  return NextResponse.json({ items: w.items });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  const { productId } = await req.json();
  await connectDB();
  const w = (await Wishlist.findOne({ userId: user.id })) as any;
  if (!w) return NextResponse.json({ items: [] });
  w.items = w.items.filter((id: { toString(): string }) => id.toString() !== productId);
  await w.save();
  return NextResponse.json({ items: w.items });
}
