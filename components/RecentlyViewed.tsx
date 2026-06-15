'use client';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function RecentlyViewed() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch('/api/me/recently-viewed')
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => {});
  }, []);
  if (!items.length) return null;
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-3">Your recently viewed items</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.slice(0, 8).map((p: any) => (
          <ProductCard key={p._id} product={p} compact />
        ))}
      </div>
    </section>
  );
}
