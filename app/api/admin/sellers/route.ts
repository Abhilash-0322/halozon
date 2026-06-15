import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  await connectDB();
  const items = await User.find({ 'sellerProfile.appliedAt': { $exists: true } })
    .select('name email role sellerProfile')
    .sort({ 'sellerProfile.appliedAt': -1 })
    .lean();
  return NextResponse.json({ items: JSON.parse(JSON.stringify(items)) });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { userId, approved } = await req.json();
  if (!userId || typeof approved !== 'boolean')
    return NextResponse.json({ error: 'userId and approved required' }, { status: 400 });
  await connectDB();
  const u = await User.findById(userId);
  if (!u || !u.sellerProfile) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  u.sellerProfile.approved = approved;
  if (approved) {
    u.sellerProfile.approvedAt = new Date();
    u.role = 'seller';
  }
  await u.save();
  return NextResponse.json({ ok: true });
}
