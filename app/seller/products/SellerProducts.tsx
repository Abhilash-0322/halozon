'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import SellerLayout from '../SellerLayout';
import toast from 'react-hot-toast';

export default function SellerProducts({ user, products }: { user: any; products: any[] }) {
  const [q, setQ] = useState('');
  const filtered = products.filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()));

  async function del(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const r = await fetch(`/api/seller/products/${id}`, { method: 'DELETE' });
    if (r.ok) {
      toast.success('Product deleted');
      window.location.reload();
    } else {
      toast.error('Failed to delete');
    }
  }

  return (
    <SellerLayout user={user}>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-bold">Your products</h1>
          <p className="text-sm text-amazon-textMuted">{products.length} active</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-amazon-textMuted" />
            <input
              className="amazon-input pl-8"
              placeholder="Search products"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Link href="/seller/products/new" className="amazon-btn-yellow !text-sm whitespace-nowrap">
            <Plus className="w-4 h-4 inline mr-1" /> Add product
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="panel p-10 text-center">
          <Package className="w-12 h-12 mx-auto text-amazon-textMuted mb-3" />
          <h3 className="text-lg font-bold mb-2">No products yet</h3>
          <p className="text-sm text-amazon-textMuted mb-4">Add your first product to start selling.</p>
          <Link href="/seller/products/new" className="amazon-btn-yellow inline-block">Add product</Link>
        </div>
      ) : (
        <div className="bg-white border border-amazon-border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-amazon-bg text-xs text-amazon-textMuted">
              <tr>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Sold</th>
                <th className="text-left p-3">Rating</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-t border-amazon-border">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.images?.[0]} alt={p.title} className="w-12 h-12 object-contain rounded border border-amazon-border" />
                      <div className="min-w-0">
                        <div className="line-clamp-1 font-medium">{p.title}</div>
                        <Link href={`/product/${p._id}`} className="text-xs text-amazon-link hover:underline">View live →</Link>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{formatPrice(p.price)}</td>
                  <td className="p-3">
                    {p.stock <= 5 ? (
                      <span className="text-amazon-deal font-bold">{p.stock}</span>
                    ) : (
                      p.stock
                    )}
                  </td>
                  <td className="p-3">{p.sold || 0}</td>
                  <td className="p-3">{p.rating?.toFixed(1) || '—'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link href={`/seller/products/${p._id}`} className="text-xs text-amazon-link hover:underline flex items-center gap-1">
                        <Edit className="w-3 h-3" /> Edit
                      </Link>
                      <button onClick={() => del(p._id, p.title)} className="text-xs text-amazon-deal hover:underline flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SellerLayout>
  );
}
