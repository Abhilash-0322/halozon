import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ items: [] });
  await connectDB();
  const u = (await User.findById(user.id).select('recentlyViewed').lean()) as any;
  const ids: string[] = (u?.recentlyViewed || []).slice(0, 12).map(String);
  if (!ids.length) return NextResponse.json({ items: [] });
  const items = await Product.find({ _id: { $in: ids } })
    .select('-reviews -description')
    .lean();
  // Preserve order of recentlyViewed
  const map = new Map(items.map((p: any) => [String(p._id), p]));
  const ordered = ids.map((id) => map.get(id)).filter(Boolean);
  return NextResponse.json({ items: JSON.parse(JSON.stringify(ordered)) });
}
