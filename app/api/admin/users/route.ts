import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const sp = req.nextUrl.searchParams;
  await connectDB();
  const q = sp.get('q') || '';
  const filter: Record<string, unknown> = {};
  if (q) filter.$or = [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }];
  const items = await User.find(filter).select('-password').sort({ createdAt: -1 }).limit(100).lean();
  return NextResponse.json({ items: JSON.parse(JSON.stringify(items)) });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { userId, banned, role } = await req.json();
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
  await connectDB();
  const update: Record<string, unknown> = {};
  if (typeof banned === 'boolean') update.banned = banned;
  if (role && ['user', 'seller', 'admin'].includes(role)) update.role = role;
  await User.updateOne({ _id: userId }, update);
  return NextResponse.json({ ok: true });
}
