import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
import { serialize } from '@/lib/serialize';
import CategoryView from './CategoryView';
import Seo from '@/components/Seo';
import { breadcrumbJsonLd } from '@/lib/seo';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [k: string]: string | undefined };
}) {
  await connectDB();

  // Resolve category by slug OR by humanized name
  const allCats = await Category.find().lean();
  const decoded = decodeURIComponent(params.slug).replace(/-/g, ' ');
  let cat: any = allCats.find((c: any) => c.slug === params.slug);
  if (!cat) cat = allCats.find((c: any) => c.name.toLowerCase() === decoded.toLowerCase());
  if (!cat) cat = allCats.find((c: any) => slugify(c.name) === slugify(decoded));

  // If slug contains 'store' prefix or isn't a real category, 404
  if (!cat) notFound();

  const filter: Record<string, unknown> = {};
  filter.categorySlug = cat.slug;

  const sort = searchParams.sort || 'relevance';
  const sortMap: Record<string, any> = {
    relevance: { rating: -1, sold: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    newest: { createdAt: -1 },
    rating: { rating: -1, ratingCount: -1 },
    'best-sellers': { sold: -1 },
  };

  const priceCond: Record<string, number> = {};
  if (searchParams.min) priceCond.$gte = Number(searchParams.min);
  if (searchParams.max) priceCond.$lte = Number(searchParams.max);
  if (Object.keys(priceCond).length) filter.price = priceCond;
  if (searchParams.minRating) filter.rating = { $gte: Number(searchParams.minRating) };
  if (searchParams.prime) filter.isPrime = true;
  if (searchParams.deal) filter.isDeal = true;
  if (searchParams.brand) {
    const brands = searchParams.brand.split(',');
    filter.brand = { $in: brands };
  }
  if (searchParams.minDiscount) {
    filter.listPrice = { $gt: 0 };
  }

  let products: any[] = serialize(
    await Product.find(filter)
      .sort(sortMap[sort] || sortMap.relevance)
      .select('-reviews -description')
      .lean()
  ) as any[];

  if (searchParams.minDiscount) {
    const minD = Number(searchParams.minDiscount);
    products = products.filter((p) => {
      if (!p.listPrice || p.listPrice <= p.price) return false;
      return ((p.listPrice - p.price) / p.listPrice) * 100 >= minD;
    });
  }

  const title = cat?.name || decoded.replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <Seo
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', href: '/' },
          { name: title, href: `/category/${cat?.slug || params.slug}` },
        ])}
      />
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="text-xs text-amazon-textMuted mb-3">
          <Link href="/" className="amazon-link">Home</Link>
          <span className="mx-1">›</span>
          <span className="text-amazon-text">{title}</span>
        </div>
        <CategoryView
          slug={cat?.slug || params.slug}
          title={title}
          products={products}
          searchParams={searchParams}
        />
      </div>
    </>
  );
}
