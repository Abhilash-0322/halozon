import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
import { serialize } from '@/lib/serialize';

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
  let cat = allCats.find((c) => c.slug === params.slug);
  if (!cat) cat = allCats.find((c) => c.name.toLowerCase() === decoded.toLowerCase());
  if (!cat) cat = allCats.find((c) => slugify(c.name) === slugify(decoded));

  const filter: Record<string, unknown> = {};
  if (cat) filter.categorySlug = cat.slug;
  else filter.categorySlug = { $exists: false };

  const sort = searchParams.sort || 'relevance';
  const sortMap: Record<string, any> = {
    relevance: { rating: -1, sold: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    newest: { createdAt: -1 },
    rating: { rating: -1, ratingCount: -1 },
    'best-sellers': { sold: -1 },
  };

  if (searchParams.min) filter.price = { ...((filter.price as object) || {}), $gte: Number(searchParams.min) };
  if (searchParams.max) filter.price = { ...((filter.price as object) || {}), $lte: Number(searchParams.max) };
  if (searchParams.prime) filter.isPrime = true;
  if (searchParams.deal) filter.isDeal = true;
  if (searchParams.minRating) filter.rating = { $gte: Number(searchParams.minRating) };

  const products = serialize(
    await Product.find(filter)
      .sort(sortMap[sort] || sortMap.relevance)
      .select('-reviews -description')
      .lean()
  ) as any;

  const title = cat?.name || decoded.replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <div className="text-xs text-amazon-textMuted mb-3">
        <Link href="/" className="amazon-link">Home</Link>
        <span className="mx-1">›</span>
        <span className="text-amazon-text">{title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        {/* Filters */}
        <aside className="space-y-4">
          <div className="panel p-4">
            <h3 className="font-bold mb-3">Department</h3>
            <div className="text-sm">{title}</div>
            {cat?.description && <div className="text-xs text-amazon-textMuted mt-1">{cat.description}</div>}
          </div>

          <div className="panel p-4 space-y-3">
            <h3 className="font-bold">Customer Reviews</h3>
            {[4, 3, 2, 1].map((n) => (
              <Link
                key={n}
                href={`?${new URLSearchParams({ ...searchParams as Record<string,string>, minRating: String(n) }).toString()}`}
                className="flex items-center gap-1 text-sm hover:underline"
              >
                <span className="text-amazon-star">★★★★★</span>
                <span className="text-amazon-link">& Up</span>
              </Link>
            ))}
          </div>

          <div className="panel p-4 space-y-3">
            <h3 className="font-bold">Price</h3>
            <div className="space-y-2">
              {[
                { l: 'Under $25', max: 25 },
                { l: '$25 to $50', min: 25, max: 50 },
                { l: '$50 to $100', min: 50, max: 100 },
                { l: '$100 to $200', min: 100, max: 200 },
                { l: '$200 & Above', min: 200 },
              ].map((r) => {
                const sp = new URLSearchParams(searchParams as Record<string,string>);
                if (r.min !== undefined) sp.set('min', String(r.min));
                if (r.max !== undefined) sp.set('max', String(r.max));
                return (
                  <Link key={r.l} href={`?${sp.toString()}`} className="block text-sm amazon-link">
                    {r.l}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="panel p-4 space-y-2">
            <h3 className="font-bold">Other Sellers</h3>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" /> halozon
            </label>
          </div>

          <div className="panel p-4 space-y-2">
            <h3 className="font-bold">Availability</h3>
            <Link href={`?${new URLSearchParams({ ...searchParams as Record<string,string>, deal: '1' }).toString()}`} className="block text-sm amazon-link">
              <input type="checkbox" className="mr-1" readOnly /> Include Out of Stock
            </Link>
          </div>

          <div className="panel p-4 space-y-2">
            <h3 className="font-bold">Prime</h3>
            <Link href={`?${new URLSearchParams({ ...searchParams as Record<string,string>, prime: '1' }).toString()}`} className="flex items-center gap-2 text-sm">
              <input type="checkbox" /> Prime eligible
            </Link>
          </div>

          <div className="panel p-4 space-y-2">
            <h3 className="font-bold">Deals & Discounts</h3>
            <Link href={`?${new URLSearchParams({ ...searchParams as Record<string,string>, deal: '1' }).toString()}`} className="flex items-center gap-2 text-sm">
              <input type="checkbox" /> Today's Deals
            </Link>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="panel p-4 mb-3">
            <h1 className="text-2xl mb-1">{title}</h1>
            <div className="text-sm text-amazon-textMuted">
              {products.length.toLocaleString()} results
            </div>
          </div>

          <div className="panel p-3 mb-3 flex items-center gap-3 flex-wrap">
            <span className="text-sm">Sort by:</span>
            {[
              { id: 'relevance', l: 'Featured' },
              { id: 'best-sellers', l: 'Best Sellers' },
              { id: 'price-asc', l: 'Price: Low to High' },
              { id: 'price-desc', l: 'Price: High to Low' },
              { id: 'rating', l: 'Avg. Customer Review' },
              { id: 'newest', l: 'Newest Arrivals' },
            ].map((s) => {
              const sp = new URLSearchParams(searchParams as Record<string,string>);
              sp.set('sort', s.id);
              const active = (searchParams.sort || 'relevance') === s.id;
              return (
                <Link
                  key={s.id}
                  href={`?${sp.toString()}`}
                  className={`text-sm border rounded-md px-3 py-1 ${active ? 'border-amazon-orange bg-amazon-orange/10 text-amazon-linkHover font-medium' : 'border-amazon-border text-amazon-link hover:border-amazon-orange'}`}
                >
                  {s.l}
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {products.map((p: any) => (
              <ProductCard key={String(p._id)} product={p} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="panel p-10 text-center text-amazon-textMuted">
              No products found in this category yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
