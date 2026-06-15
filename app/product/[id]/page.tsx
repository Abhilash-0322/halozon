import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import ProductDetail from './ProductDetail';
import { serialize } from '@/lib/serialize';
import Seo from '@/components/Seo';
import { productJsonLd, breadcrumbJsonLd, SITE_URL } from '@/lib/seo';

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

  return (
    <>
      <Seo
        jsonLd={productJsonLd({
          title: product.title,
          description: product.description,
          images: product.images,
          brand: product.brand,
          price: product.price,
          listPrice: product.listPrice,
          stock: product.stock,
          rating: product.rating,
          ratingCount: product.ratingCount,
          url: `${SITE_URL}/product/${product._id}`,
        })}
      />
      <Seo
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', href: '/' },
          { name: product.categorySlug?.replace(/-/g, ' ') || 'Products', href: `/category/${product.categorySlug || ''}` },
          { name: product.title, href: `/product/${product._id}` },
        ])}
      />
      <ProductDetail product={JSON.parse(JSON.stringify(product))} related={JSON.parse(JSON.stringify(related))} />
    </>
  );
}
