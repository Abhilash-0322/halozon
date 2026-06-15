'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

type Brand = { _id: string; count: number };

export default function CategoryView({
  slug,
  title,
  products,
  searchParams,
}: {
  slug: string;
  title: string;
  products: any[];
  searchParams: { [k: string]: string | undefined };
}) {
  const [brands, setBrands] = useState<Brand[]>([]);
  useEffect(() => {
    fetch(`/api/products/brands?category=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => setBrands(d.items || []))
      .catch(() => {});
  }, [slug]);

  const activeBrands = (searchParams.brand ? searchParams.brand.split(',') : []).filter(Boolean);

  function spWith(updates: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v != null && v !== '' && !(k in updates)) sp.set(k, v);
    });
    Object.entries(updates).forEach(([k, v]) => {
      if (v != null && v !== '') sp.set(k, v);
    });
    return sp.toString();
  }

  function toggleBrand(b: string) {
    const set = new Set(activeBrands);
    if (set.has(b)) set.delete(b);
    else set.add(b);
    return spWith({ brand: set.size ? [...set].join(',') : '' });
  }

  const chips: { label: string; href: string }[] = [];
  if (searchParams.min) chips.push({ label: `Min $${searchParams.min}`, href: `?${spWith({ min: '' })}` });
  if (searchParams.max) chips.push({ label: `Max $${searchParams.max}`, href: `?${spWith({ max: '' })}` });
  if (searchParams.minRating) chips.push({ label: `${searchParams.minRating}★ & up`, href: `?${spWith({ minRating: '' })}` });
  if (searchParams.minDiscount) chips.push({ label: `${searchParams.minDiscount}%+ off`, href: `?${spWith({ minDiscount: '' })}` });
  if (searchParams.prime) chips.push({ label: 'Prime', href: `?${spWith({ prime: '' })}` });
  if (searchParams.deal) chips.push({ label: "Today's Deals", href: `?${spWith({ deal: '' })}` });
  activeBrands.forEach((b) =>
    chips.push({
      label: `Brand: ${b}`,
      href: `?${spWith({ brand: activeBrands.filter((x) => x !== b).join(',') || '' })}`,
    })
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
      <aside className="space-y-4">
        <div className="panel p-4">
          <h3 className="font-bold mb-2">Department</h3>
          <div className="text-sm font-medium">{title}</div>
        </div>

        <div className="panel p-4 space-y-2">
          <h3 className="font-bold">Customer Reviews</h3>
          {[4, 3, 2, 1].map((n) => {
            const count = Math.floor((products.length * (5 - n)) / 8);
            return (
              <Link
                key={n}
                href={`?${spWith({ minRating: String(n) })}`}
                className="flex items-center gap-1 text-sm hover:underline"
              >
                <span className="text-amazon-star">★★★★★</span>
                <span className="text-amazon-link">& Up ({count})</span>
              </Link>
            );
          })}
        </div>

        {brands.length > 0 && (
          <div className="panel p-4 space-y-2">
            <h3 className="font-bold">Brand</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {brands.slice(0, 12).map((b) => (
                <Link
                  key={b._id}
                  href={`?${toggleBrand(b._id)}`}
                  className="flex items-center justify-between text-sm hover:underline"
                >
                  <span className={activeBrands.includes(b._id) ? 'font-bold text-amazon-linkHover' : ''}>
                    {activeBrands.includes(b._id) ? '✓ ' : ''}{b._id}
                  </span>
                  <span className="text-amazon-textMuted text-xs">({b.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="panel p-4 space-y-2">
          <h3 className="font-bold">Price</h3>
          <div className="space-y-1">
            {[
              { l: 'Under $25', max: 25 },
              { l: '$25 to $50', min: 25, max: 50 },
              { l: '$50 to $100', min: 50, max: 100 },
              { l: '$100 to $200', min: 100, max: 200 },
              { l: '$200 & Above', min: 200 },
            ].map((r) => {
              const sp = new URLSearchParams();
              Object.entries(searchParams).forEach(([k, v]) => {
                if (k !== 'min' && k !== 'max' && v) sp.set(k, v);
              });
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
          <h3 className="font-bold">Discount</h3>
          {[
            { v: '10', l: '10% off or more' },
            { v: '25', l: '25% off or more' },
            { v: '50', l: '50% off or more' },
            { v: '70', l: '70% off or more' },
          ].map((d) => (
            <Link
              key={d.v}
              href={`?${spWith({ minDiscount: searchParams.minDiscount === d.v ? '' : d.v })}`}
              className="flex items-center gap-2 text-sm amazon-link"
            >
              {searchParams.minDiscount === d.v ? '✓ ' : ''}{d.l}
            </Link>
          ))}
        </div>

        <div className="panel p-4 space-y-2">
          <h3 className="font-bold">Prime</h3>
          <Link
            href={`?${spWith({ prime: searchParams.prime ? '' : '1' })}`}
            className="flex items-center gap-2 text-sm amazon-link"
          >
            {searchParams.prime ? '✓ ' : ''}Prime eligible
          </Link>
        </div>

        <div className="panel p-4 space-y-2">
          <h3 className="font-bold">Deals</h3>
          <Link
            href={`?${spWith({ deal: searchParams.deal ? '' : '1' })}`}
            className="flex items-center gap-2 text-sm amazon-link"
          >
            {searchParams.deal ? '✓ ' : ''}Today's Deals
          </Link>
        </div>
      </aside>

      <div>
        <div className="panel p-4 mb-3">
          <h1 className="text-2xl mb-1">{title}</h1>
          <div className="text-sm text-amazon-textMuted">
            {products.length.toLocaleString()} result{products.length !== 1 ? 's' : ''}
          </div>
        </div>

        {chips.length > 0 && (
          <div className="panel p-3 mb-3 flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Active filters:</span>
            {chips.map((c, i) => (
              <Link
                key={i}
                href={c.href}
                className="chip border-amazon-orange text-amazon-orange hover:bg-amazon-orange/10 flex items-center gap-1"
              >
                {c.label}
                <X className="w-3 h-3" />
              </Link>
            ))}
          </div>
        )}

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
            const active = (searchParams.sort || 'relevance') === s.id;
            return (
              <Link
                key={s.id}
                href={`?${spWith({ sort: s.id })}`}
                className={`text-sm border rounded-md px-3 py-1 ${
                  active
                    ? 'border-amazon-orange bg-amazon-orange/10 text-amazon-linkHover font-medium'
                    : 'border-amazon-border text-amazon-link hover:border-amazon-orange'
                }`}
              >
                {s.l}
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {products.map((p: any) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="panel p-10 text-center text-amazon-textMuted">
            No products match these filters. Try removing some.
          </div>
        )}
      </div>
    </div>
  );
}
