import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Bundle from '@/models/Bundle';
import Product from '@/models/Product';

export async function GET(_req: NextRequest, { params }: { params: { productId: string } }) {
  await connectDB();
  // Find bundles containing this product
  const bundles = await Bundle.find({
    active: true,
    productIds: params.productId,
  }).lean();

  // For each bundle, fetch full product details
  const result = await Promise.all(
    bundles.map(async (b: any) => {
      const products = await Product.find({ _id: { $in: b.productIds } })
        .select('-reviews -description')
        .lean();
      return { ...b, products: JSON.parse(JSON.stringify(products)) };
    })
  );
  return NextResponse.json({ items: result });
}
