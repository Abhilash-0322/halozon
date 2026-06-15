import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  await connectDB();
  const seller: any = await User.findOne({
    'sellerProfile.slug': params.slug,
    'sellerProfile.approved': true,
  })
    .select('name sellerProfile')
    .lean();
  if (!seller) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

  const products = await Product.find({ sellerId: seller._id })
    .sort({ sold: -1 })
    .limit(60)
    .select('-reviews -description')
    .lean();
  return NextResponse.json({
    store: {
      name: seller.sellerProfile?.storeName,
      slug: seller.sellerProfile?.slug,
      description: seller.sellerProfile?.description,
      logo: seller.sellerProfile?.logo,
      country: seller.sellerProfile?.country,
      rating: seller.sellerProfile?.rating || 0,
      ratingCount: seller.sellerProfile?.ratingCount || 0,
    },
    products: JSON.parse(JSON.stringify(products)),
  });
}
