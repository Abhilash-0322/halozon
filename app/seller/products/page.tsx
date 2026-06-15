import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import SellerProducts from './SellerProducts';
import { serialize } from '@/lib/serialize';
import { ensureSellerOrAdmin } from '@/lib/requireSellerPage';

export const dynamic = 'force-dynamic';

export default async function SellerProductsPage() {
  const user = await ensureSellerOrAdmin();
  await connectDB();
  const items = serialize(
    await Product.find({ sellerId: user.id }).sort({ createdAt: -1 }).select('-reviews -description').lean()
  ) as any;
  return <SellerProducts user={user} products={items} />;
}
