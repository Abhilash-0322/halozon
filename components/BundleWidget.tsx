'use client';
import { useEffect, useState } from 'react';
import { ShoppingBag, Plus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function BundleWidget({ productId }: { productId: string }) {
  const [bundles, setBundles] = useState<any[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch(`/api/bundles/${productId}`)
      .then((r) => r.json())
      .then((d) => {
        setBundles(d.items || []);
        // Auto-check all items in first bundle
        const first = (d.items || [])[0];
        if (first) {
          const map: Record<string, boolean> = {};
          first.products.forEach((p: any) => (map[p._id] = true));
          setChecked(map);
        }
      })
      .catch(() => {});
  }, [productId]);

  if (!bundles.length) return null;
  const bundle = bundles[0];

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function addBundle() {
    const ids = Object.entries(checked).filter(([, v]) => v).map(([k]) => k);
    if (!ids.length) return toast.error('Pick at least one item');
    setAdding(true);
    try {
      let okCount = 0;
      for (const id of ids) {
        const r = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: id, qty: 1 }),
        });
        if (r.ok) okCount += 1;
      }
      if (okCount === 0) {
        toast.error('Please sign in to add to cart');
      } else {
        toast.success(`Added ${okCount} items to cart`);
      }
    } finally {
      setAdding(false);
    }
  }

  const selected = bundle.products.filter((p: any) => checked[p._id]);
  const subtotal = selected.reduce((s: number, p: any) => s + p.price, 0);
  const discount = +(subtotal * (bundle.bundleDiscountPercent / 100)).toFixed(2);

  return (
    <div className="panel p-4 mt-4">
      <h3 className="font-bold text-base mb-1 flex items-center gap-2">
        <ShoppingBag className="w-4 h-4 text-amazon-orange" /> Frequently bought together
      </h3>
      <p className="text-xs text-amazon-textMuted mb-3">
        Save {bundle.bundleDiscountPercent}% when you bundle
      </p>
      <div className="grid grid-cols-3 gap-3">
        {bundle.products.map((p: any, i: number) => (
          <div key={p._id} className="text-center">
            <label className="cursor-pointer block">
              <input
                type="checkbox"
                checked={!!checked[p._id]}
                onChange={() => toggle(p._id)}
                className="mb-1"
              />
              <div className="aspect-square bg-white border border-amazon-border rounded flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images?.[0]} alt={p.title} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="text-xs mt-1 line-clamp-2">{p.title}</div>
              <div className="text-sm font-bold mt-1">{formatPrice(p.price)}</div>
            </label>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-amazon-border pt-3">
        <div className="text-sm">
          {selected.length} item{selected.length !== 1 ? 's' : ''}:
          <span className="font-bold ml-1">{formatPrice(subtotal - discount)}</span>
          {discount > 0 && (
            <span className="ml-2 text-amazon-deal text-xs">save {formatPrice(discount)}</span>
          )}
        </div>
        <button onClick={addBundle} disabled={adding} className="amazon-btn-orange !text-xs disabled:opacity-60">
          <Plus className="w-3 h-3 inline mr-1" />
          {adding ? 'Adding…' : 'Add all to cart'}
        </button>
      </div>
    </div>
  );
}
