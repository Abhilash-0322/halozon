import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  let product: any;
  try {
    product = await Product.findById(params.id).lean();
  } catch {
    product = await Product.findOne({ slug: params.id }).lean();
  }
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const user = await getCurrentUser();
  if (user) {
    await import('@/models/User').then(async (m) => {
      const User = m.default;
      await User.updateOne(
        { _id: user.id },
        { $pull: { recentlyViewed: product!._id } }
      );
      await User.updateOne(
        { _id: user.id },
        { $push: { recentlyViewed: { $each: [product!._id], $position: 0, $slice: 20 } } }
      );
    });
  }

  return NextResponse.json({ product });
}
