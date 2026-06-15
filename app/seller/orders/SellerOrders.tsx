'use client';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';
import SellerLayout from '../SellerLayout';
import { Search } from 'lucide-react';

export default function SellerOrders({ user }: { user: any }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/api/seller/orders')
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = items.filter((o) => !q || o.orderNumber.toLowerCase().includes(q.toLowerCase()));

  return (
    <SellerLayout user={user}>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-sm text-amazon-textMuted">{items.length} order{items.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-amazon-textMuted" />
          <input className="amazon-input pl-8" placeholder="Search order #" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="shimmer-bg h-40 rounded-md" />
      ) : filtered.length === 0 ? (
        <div className="panel p-10 text-center text-sm text-amazon-textMuted">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o._id} className="panel p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs mb-3">
                <div>
                  <div className="text-amazon-textMuted">ORDER</div>
                  <div className="font-bold">{o.orderNumber}</div>
                </div>
                <div>
                  <div className="text-amazon-textMuted">DATE</div>
                  <div>{new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-amazon-textMuted">YOUR ITEMS</div>
                  <div>{o.myItems?.length || 0}</div>
                </div>
                <div>
                  <div className="text-amazon-textMuted">YOUR TOTAL</div>
                  <div className="font-bold text-amazon-orange">{formatPrice(o.myTotal || 0)}</div>
                </div>
                <div>
                  <div className="text-amazon-textMuted">STATUS</div>
                  <span className="chip">{o.status}</span>
                </div>
              </div>
              <div className="space-y-1">
                {(o.myItems || []).map((it: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm border-t border-amazon-border pt-1 first:border-0 first:pt-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.image} alt={it.title} className="w-10 h-10 object-contain bg-white rounded" />
                    <div className="flex-1 min-w-0 line-clamp-1">{it.title}</div>
                    <div className="text-xs text-amazon-textMuted">×{it.qty}</div>
                    <div className="font-bold">{formatPrice(it.price * it.qty)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </SellerLayout>
  );
}
