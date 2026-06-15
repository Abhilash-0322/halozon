import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  await connectDB();
  const u = (await User.findById(user.id).select('sellerProfile role').lean()) as any;
  return NextResponse.json({ profile: u?.sellerProfile || null, role: u?.role });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  const { storeName, description, logo, country, payoutEmail, payoutMethod, autoApprove } = await req.json();

  if (!storeName || storeName.trim().length < 3)
    return NextResponse.json({ error: 'Store name required (min 3 chars)' }, { status: 400 });

  await connectDB();
  const u = await User.findById(user.id);
  if (!u) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (u.role === 'seller' && u.sellerProfile?.approved) {
    return NextResponse.json({ error: 'Already a seller' }, { status: 400 });
  }

  let slug = slugify(storeName);
  const existing = await User.findOne({ 'sellerProfile.slug': slug });
  if (existing) slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

  u.sellerProfile = {
    storeName: storeName.trim(),
    slug,
    description: description || '',
    logo: logo || '',
    country: country || 'United States',
    payoutEmail: payoutEmail || user.email,
    payoutMethod: payoutMethod || 'bank',
    appliedAt: new Date(),
    approved: !!autoApprove,
    approvedAt: autoApprove ? new Date() : undefined,
    rating: 0,
    ratingCount: 0,
  } as any;
  if (autoApprove) u.role = 'seller';

  await u.save();

  return NextResponse.json({ ok: true, profile: u.sellerProfile, role: u.role });
}
