'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';

export default function CartView() {
  const { items, count, subtotal, update, remove, refresh } = useCart();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); refresh(); }, [refresh]);

  if (!hydrated) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="shimmer-bg h-40 rounded-md" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="bg-white border border-amazon-border rounded-md p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Your halozon Cart is empty</h1>
          <Link href="/" className="amazon-link text-sm">
            Shop today&apos;s deals
          </Link>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= 35 ? 0 : 5.99;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <div className="bg-white border border-amazon-border rounded-md p-4 mb-3">
            <div className="flex items-end justify-between">
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <div className="text-sm text-amazon-textMuted">Price</div>
            </div>
          </div>
          <div className="bg-white border border-amazon-border rounded-md divide-y divide-amazon-border">
            {items.map((it) => (
              <div key={it.productId} className="p-4 flex gap-4">
                <Link href={`/product/${it.productId}`} className="w-32 h-32 shrink-0 bg-white flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image} alt={it.title} className="max-w-full max-h-full object-contain" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${it.productId}`} className="text-base text-amazon-link hover:text-amazon-linkHover hover:underline line-clamp-2">
                    {it.title}
                  </Link>
                  {it.isPrime && (
                    <div className="text-xs text-amazon-link font-semibold mt-1">prime</div>
                  )}
                  <div className="text-xs text-amazon-greenDark font-medium mt-1">In Stock</div>
                  <div className="text-xs text-amazon-textMuted">Eligible for FREE Shipping</div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="inline-flex items-center border border-amazon-borderDark rounded-md">
                      <button onClick={() => update(it.productId, Math.max(0, it.qty - 1))} className="px-2 py-1 hover:bg-amazon-bg">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-sm">{it.qty}</span>
                      <button onClick={() => update(it.productId, it.qty + 1)} className="px-2 py-1 hover:bg-amazon-bg">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button onClick={() => remove(it.productId)} className="text-xs text-amazon-link hover:text-amazon-linkHover flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                    <button className="text-xs text-amazon-link hover:text-amazon-linkHover">Save for later</button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold">{formatPrice(it.price * it.qty)}</div>
                  {it.qty > 1 && <div className="text-xs text-amazon-textMuted">{formatPrice(it.price)} each</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-amazon-border rounded-md p-3 mt-3 text-right">
            <span className="text-lg">
              Subtotal ({count} item{count > 1 ? 's' : ''}):{' '}
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </span>
          </div>
        </div>

        <aside className="lg:sticky lg:top-32 self-start space-y-3">
          <div className="panel p-4">
            {shipping === 0 ? (
              <div className="text-sm text-amazon-greenDark mb-2">
                ✓ Your order qualifies for FREE shipping
              </div>
            ) : (
              <div className="text-sm mb-2">
                Spend <b>{formatPrice(35 - subtotal)}</b> more for FREE shipping
              </div>
            )}
            <div className="text-sm text-amazon-textMuted mb-2">
              Choose a payment method below to complete checkout.
            </div>
            <Link
              href="/checkout"
              className="amazon-btn-yellow w-full !text-base !py-2.5 block text-center"
            >
              Proceed to checkout ({count} item{count > 1 ? 's' : ''})
            </Link>
            <div className="text-center mt-3">
              <div className="text-xs text-amazon-textMuted mb-1">Subtotal: {formatPrice(subtotal)}</div>
              <Link href="/" className="amazon-link text-sm">Continue shopping</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
