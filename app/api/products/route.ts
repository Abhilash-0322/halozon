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

  // Brand multi-select
  const brands = sp.getAll('brand');
  if (brands.length) filter.brand = { $in: brands };

  // Min rating
  if (sp.get('minRating')) filter.rating = { $gte: Number(sp.get('minRating')) };

  // Price range
  const priceCond: Record<string, number> = {};
  if (sp.get('min')) priceCond.$gte = Number(sp.get('min'));
  if (sp.get('max')) priceCond.$lte = Number(sp.get('max'));
  if (Object.keys(priceCond).length) filter.price = priceCond;

  // Discount % (computed) - approximated by ratio of listPrice to price
  const minDiscount = Number(sp.get('minDiscount') || 0);
  if (minDiscount > 0) {
    filter.listPrice = { $gt: 0 };
    // We'll re-filter in JS for accuracy because Mongo can't compute ratio
  }

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
  let items = await Product.find(filter)
    .sort(sortMap[sort] || sortMap.relevance)
    .limit(limit)
    .select('-reviews -description')
    .lean();

  if (minDiscount > 0) {
    items = items.filter((p: any) => {
      if (!p.listPrice || p.listPrice <= p.price) return false;
      return ((p.listPrice - p.price) / p.listPrice) * 100 >= minDiscount;
    });
  }

  return NextResponse.json({ items: JSON.parse(JSON.stringify(items)) });
}
