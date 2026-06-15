import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import AccountLayout from '../AccountLayout';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { serialize } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account/wishlist');
  await connectDB();
  const w = serialize(await Wishlist.findOne({ userId: user.id }).populate('items.productId').lean()) as any;
  const items = (w?.items || []).map((i: any) => i.productId).filter((p: any) => p && p._id);

  return (
    <AccountLayout user={user}>
      <div className="bg-white border border-amazon-border rounded-md p-5">
        <h1 className="text-3xl font-bold mb-1">Your Wish List</h1>
        <p className="text-sm text-amazon-textMuted mb-4">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        {items.length === 0 ? (
          <div className="text-center py-10">
            <p className="mb-3">Your wish list is empty.</p>
            <Link href="/" className="amazon-btn-primary inline-block">Discover products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
