import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { serialize } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q || '').trim();
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (q) filter.$text = { $search: q };
  const products = q
    ? serialize(await Product.find(filter).select('-reviews -description').limit(120).lean()) as any[]
    : [];
  // Suggest categories if nothing
  const categories = q
    ? serialize(await (await import('@/models/Category')).default.find({
        name: { $regex: q, $options: 'i' },
      }).lean()) as any[]
    : [];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4">
      <div className="text-xs text-amazon-textMuted mb-3">
        <Link href="/" className="amazon-link">Home</Link>
        <span className="mx-1">›</span>
        <span>Search results for &ldquo;{q}&rdquo;</span>
      </div>

      {q ? (
        <div className="panel p-4 mb-3">
          <div className="text-sm">{products.length.toLocaleString()} results for <span className="font-bold">&ldquo;{q}&rdquo;</span></div>
        </div>
      ) : (
        <div className="panel p-6 text-center text-amazon-textMuted">Type in the search bar to find products.</div>
      )}

      {categories.length > 0 && (
        <div className="panel p-4 mb-3">
          <h3 className="font-bold mb-2">Suggestions</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link key={String(c._id)} href={`/category/${c.slug}`} className="amazon-link text-sm border border-amazon-border rounded-full px-3 py-1 hover:border-amazon-orange">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {products.map((p: any) => (
            <ProductCard key={String(p._id)} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
