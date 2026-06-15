import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    // Anonymous fallback: top sellers
    await connectDB();
    const items = await Product.find()
      .sort({ sold: -1, rating: -1 })
      .limit(10)
      .select('-reviews -description')
      .lean();
    return NextResponse.json({ items: JSON.parse(JSON.stringify(items)) });
  }

  await connectDB();
  const u = (await User.findById(user.id).select('recentlyViewed').lean()) as any;
  const recentIds: string[] = (u?.recentlyViewed || []).slice(0, 10).map(String);

  if (recentIds.length === 0) {
    const items = await Product.find({ isFeatured: true })
      .limit(10)
      .select('-reviews -description')
      .lean();
    return NextResponse.json({ items: JSON.parse(JSON.stringify(items)) });
  }

  // Get categories of recently viewed
  const recentProducts = await Product.find({ _id: { $in: recentIds } })
    .select('categorySlug')
    .lean();
  const cats = [...new Set(recentProducts.map((p: any) => p.categorySlug).filter(Boolean))];

  // Recommend: same categories, excluding already-viewed
  const items = await Product.find({
    categorySlug: { $in: cats },
    _id: { $nin: recentIds },
  })
    .sort({ rating: -1, sold: -1 })
    .limit(10)
    .select('-reviews -description')
    .lean();

  // Fallback: pad with top sellers if too few
  if (items.length < 6) {
    const more = await Product.find({ _id: { $nin: [...recentIds, ...items.map((i: any) => i._id)] } })
      .sort({ sold: -1 })
      .limit(10 - items.length)
      .select('-reviews -description')
      .lean();
    items.push(...more);
  }
  return NextResponse.json({ items: JSON.parse(JSON.stringify(items)) });
}
