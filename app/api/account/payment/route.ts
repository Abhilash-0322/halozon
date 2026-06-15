import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { label, cardNumber, expiry, brand, isDefault } = await req.json();
  const last4 = String(cardNumber).slice(-4);
  await connectDB();
  if (isDefault) {
    await User.updateOne({ _id: user.id }, { $set: { 'paymentMethods.$[].isDefault': false } });
  }
  await User.updateOne(
    { _id: user.id },
    { $push: { paymentMethods: { label, brand, cardNumberLast4: last4, expiry, isDefault: !!isDefault } } }
  );
  const u = (await User.findById(user.id).lean()) as any;
  return NextResponse.json({ paymentMethods: u?.paymentMethods || [] });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { index } = await req.json();
  await connectDB();
  const u = await User.findById(user.id);
  if (!u) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  u.paymentMethods.splice(index, 1);
  await u.save();
  return NextResponse.json({ paymentMethods: u.paymentMethods });
}
