import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const addr = await req.json();
  await connectDB();
  if (addr.isDefault) {
    await User.updateOne({ _id: user.id }, { $set: { 'addresses.$[].isDefault': false } });
  }
  await User.updateOne({ _id: user.id }, { $push: { addresses: addr } });
  const u = (await User.findById(user.id).lean()) as any;
  return NextResponse.json({ addresses: u?.addresses || [] });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { index } = await req.json();
  await connectDB();
  const u = await User.findById(user.id);
  if (!u) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  u.addresses.splice(index, 1);
  await u.save();
  return NextResponse.json({ addresses: u.addresses });
}
