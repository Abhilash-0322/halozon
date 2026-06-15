import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import StoreView from './StoreView';
import { serialize } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

export default async function StorePage({ params }: { params: { slug: string } }) {
  await connectDB();
  const seller: any = await User.findOne({
    'sellerProfile.slug': params.slug,
    'sellerProfile.approved': true,
  })
    .select('name sellerProfile')
    .lean();
  if (!seller) return <StoreView notFound />;

  const products = serialize(
    await Product.find({ sellerId: seller._id })
      .sort({ sold: -1 })
      .select('-reviews -description')
      .lean()
  );

  return (
    <StoreView
      store={{
        name: seller.sellerProfile?.storeName,
        slug: seller.sellerProfile?.slug,
        description: seller.sellerProfile?.description,
        country: seller.sellerProfile?.country,
        rating: seller.sellerProfile?.rating || 0,
        ratingCount: seller.sellerProfile?.ratingCount || 0,
      }}
      products={products as any[]}
    />
  );
}
