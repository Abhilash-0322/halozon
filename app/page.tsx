import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CategoryTile from '@/components/CategoryTile';
import PersonalizedRow from '@/components/PersonalizedRow';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectDB();
  const [featured, deals, topRated, bestSellers, categories] = await Promise.all([
    Product.find({ isFeatured: true }).limit(10).select('-reviews -description').lean() as any,
    Product.find({ isDeal: true }).sort({ sold: -1 }).limit(10).select('-reviews -description').lean() as any,
    Product.find().sort({ rating: -1, ratingCount: -1 }).limit(10).select('-reviews -description').lean() as any,
    Product.find().sort({ sold: -1 }).limit(10).select('-reviews -description').lean() as any,
    Category.find({ featured: true }).sort({ order: 1 }).limit(8).lean() as any,
  ]);
  const safe = (v: unknown) => JSON.parse(JSON.stringify(v));
  const safeFeatured = safe(featured);
  const safeDeals = safe(deals);
  const safeTopRated = safe(topRated);
  const safeBestSellers = safe(bestSellers);
  const safeCategories = safe(categories);

  return (
    <div className="min-h-screen pb-8">
      <Hero />

      <div className="max-w-screen-xl mx-auto px-4 -mt-32 relative z-10 space-y-6">
        {/* Quick categories grid */}
        {safeCategories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {safeCategories.slice(0, 4).map((c: any) => (
              <div key={String(c._id)} className="amazon-card p-4">
                <h3 className="text-lg font-bold mb-2">{c.name}</h3>
                <div className="grid grid-cols-2 gap-1">
                  {[0, 1, 2, 3].map((k) => (
                    <div key={k} className="aspect-square bg-amazon-bg rounded overflow-hidden">
                      {c.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full shimmer-bg" />
                      )}
                    </div>
                  ))}
                </div>
                <Link href={`/category/${c.slug}`} className="amazon-link text-sm mt-2 inline-block">
                  Shop now
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Deals strip */}
        <ProductGrid products={safeDeals} title="🔥 Today's Deals" subtitle="Limited time offers" />

        {/* Featured */}
        <ProductGrid products={safeFeatured} title="Featured Categories" />

        {/* Two-up promo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="amazon-card p-6 bg-gradient-to-br from-amazon-navy to-amazon-navylight text-white">
            <h3 className="text-xl font-bold mb-1">Sign in for the best experience</h3>
            <p className="text-sm text-white/80 mb-3">Personalized recommendations, faster checkout, and more.</p>
            <Link href="/signin" className="amazon-btn-yellow inline-block">Sign in securely</Link>
            <div className="text-xs text-white/70 mt-3">
              New customer?{' '}
              <Link href="/register" className="amazon-link !text-white underline">
                Start here.
              </Link>
            </div>
          </div>
          <div className="amazon-card p-6">
            <h3 className="text-xl font-bold mb-2">Top Sellers</h3>
            <p className="text-sm text-amazon-textMuted mb-3">Most-loved items by customers</p>
            <div className="grid grid-cols-2 gap-2">
              {safeBestSellers.slice(0, 4).map((p: any) => (
                <Link key={p._id} href={`/product/${p._id}`} className="amazon-card-hover amazon-card p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images?.[0]} alt={p.title} className="w-full aspect-square object-contain" loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
          <div className="amazon-card p-6 bg-gradient-to-br from-amazon-orange/20 to-amazon-orangedark/30">
            <h3 className="text-xl font-bold mb-1">Try halozon Prime</h3>
            <p className="text-sm text-amazon-textMuted mb-3">Fast, free delivery on millions of items.</p>
            <Link href="/prime" className="amazon-btn-primary inline-block">Try Prime free</Link>
            <div className="text-xs text-amazon-textMuted mt-2">Cancel anytime.</div>
          </div>
        </div>

        <ProductGrid products={safeTopRated} title="Highly Rated" subtitle="Top customer reviews" />

        {/* Categories */}
        {safeCategories.length > 0 && (
          <section className="panel p-4">
            <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {safeCategories.map((c: any) => (
                <CategoryTile key={String(c._id)} name={c.name} image={c.image} slug={c.slug} />
              ))}
            </div>
          </section>
        )}

        {/* Best Sellers */}
        <ProductGrid products={safeBestSellers} title="Best Sellers" />

        {/* Personalized */}
        <PersonalizedRow />

        {/* Bottom info block */}
        <div className="bg-white border border-amazon-border rounded-md p-6 mt-8 text-center">
          <div className="text-xs text-amazon-textMuted mb-2">Personalized recommendations</div>
          <h3 className="text-2xl font-bold mb-2">See more products for your interests</h3>
          <Link href="/signin" className="amazon-btn-primary inline-block mt-2">Sign in to view</Link>
          <div className="text-xs text-amazon-textMuted mt-3">
            New customer?{' '}
            <Link href="/register" className="amazon-link">Start here.</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
