import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import ProductDetail from './ProductDetail';
import { serialize } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { id: string } }) {
  await connectDB();
  let product: any;
  try {
    product = await Product.findById(params.id).lean();
  } catch {}
  if (!product) {
    try {
      product = await Product.findOne({ slug: params.id }).lean();
    } catch {}
  }
  if (!product) notFound();

  const related = serialize(
    await Product.find({
      categorySlug: product.categorySlug,
      _id: { $ne: product._id },
    })
      .limit(12)
      .select('-reviews -description')
      .lean()
  ) as any;

  return <ProductDetail product={JSON.parse(JSON.stringify(product))} related={JSON.parse(JSON.stringify(related))} />;
}
