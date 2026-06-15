import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import CompareView from './CompareView';

export const dynamic = 'force-dynamic';

export default async function ComparePage({ searchParams }: { searchParams: { ids?: string } }) {
  const ids = (searchParams.ids || '').split(',').filter(Boolean).slice(0, 4);
  let products: any[] = [];
  if (ids.length >= 2) {
    await connectDB();
    products = JSON.parse(
      JSON.stringify(
        await Product.find({ _id: { $in: ids } })
          .select('-reviews -description -createdAt -updatedAt -__v')
          .lean()
      )
    );
  }
  return <CompareView products={products} requestedIds={ids} />;
}
