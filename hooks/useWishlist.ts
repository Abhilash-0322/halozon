'use client';
import { useEffect, useState, useCallback } from 'react';

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch('/api/wishlist', { cache: 'no-store' });
      const d = await r.json();
      setIds((d.items || []).map((i: { productId?: { _id?: string; toString(): string }; _id?: string }) =>
        typeof i.productId === 'object' ? i.productId!._id?.toString() : (i as string).toString()
      ));
    } catch {}
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener('wishlist:update', onUpdate);
    return () => window.removeEventListener('wishlist:update', onUpdate);
  }, [refresh]);

  const toggle = useCallback(async (productId: string) => {
    const has = ids.includes(productId);
    const r = await fetch('/api/wishlist', {
      method: has ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    if (r.ok) {
      await refresh();
      window.dispatchEvent(new Event('wishlist:update'));
    }
    return r.ok;
  }, [ids, refresh]);

  return { ids, toggle, refresh, has: (id: string) => ids.includes(id) };
}
