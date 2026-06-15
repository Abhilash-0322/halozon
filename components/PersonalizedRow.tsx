'use client';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function PersonalizedRow() {
  const [items, setItems] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetch('/api/me/recommendations')
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);
  if (!loaded || !items.length) return null;
  return (
    <section className="mb-6">
      <div className="bg-white border border-amazon-border rounded-md p-4 mb-3">
        <h2 className="text-2xl font-bold text-amazon-text">Inspired by your browsing</h2>
        <p className="text-sm text-amazon-textMuted">Personalized picks based on what you've viewed</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {items.slice(0, 10).map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
