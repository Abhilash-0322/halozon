import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  await connectDB();
  const filter: Record<string, unknown> = {};
  const category = sp.get('category');
  const search = sp.get('q');
  const featured = sp.get('featured');
  const deal = sp.get('deal');
  const prime = sp.get('prime');
  if (category) filter.categorySlug = category;
  if (featured) filter.isFeatured = true;
  if (deal) filter.isDeal = true;
  if (prime) filter.isPrime = true;
  if (search) filter.$text = { $search: search };

  const sort = sp.get('sort') || 'relevance';
  const sortMap: Record<string, any> = {
    relevance: { rating: -1, sold: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    newest: { createdAt: -1 },
    rating: { rating: -1, ratingCount: -1 },
    'best-sellers': { sold: -1 },
  };

  const limit = Math.min(parseInt(sp.get('limit') || '60'), 200);
  const items = await Product.find(filter)
    .sort(sortMap[sort] || sortMap.relevance)
    .limit(limit)
    .select('-reviews -description')
    .lean();
  return NextResponse.json({ items });
}
