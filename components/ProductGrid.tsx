'use client';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { ComponentProps } from 'react';

type Product = ComponentProps<typeof ProductCard>['product'];

export default function ProductGrid({
  products,
  title,
  subtitle,
  showMore,
  moreHref,
}: {
  products: Product[];
  title?: string;
  subtitle?: string;
  showMore?: boolean;
  moreHref?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  function scroll(dir: 'l' | 'r') {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === 'l' ? -800 : 800, behavior: 'smooth' });
  }
  if (!products?.length) return null;
  return (
    <section className="mb-6">
      {title && (
        <div className="bg-white border border-amazon-border rounded-md p-4 mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-amazon-text">{title}</h2>
            {subtitle && <p className="text-sm text-amazon-textMuted">{subtitle}</p>}
          </div>
          {showMore && moreHref && (
            <a href={moreHref} className="amazon-link text-sm">See all offers</a>
          )}
        </div>
      )}
      <div className="relative panel p-4">
        <button
          onClick={() => scroll('l')}
          aria-label="Scroll left"
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-amazon-bg hidden md:block"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll('r')}
          aria-label="Scroll right"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-amazon-bg hidden md:block"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
        >
          {products.slice(0, 10).map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
