import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const cat = sp.get('category');
  await connectDB();
  const match: Record<string, unknown> = {};
  if (cat) match.categorySlug = cat;
  const items = await Product.aggregate([
    { $match: match },
    { $group: { _id: '$brand', count: { $sum: 1 } } },
    { $match: { _id: { $ne: null } } },
    { $sort: { count: -1 } },
    { $limit: 30 },
  ]);
  return NextResponse.json({ items });
}
