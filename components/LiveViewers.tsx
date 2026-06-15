'use client';
import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function LiveViewers({ productId }: { productId: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let cancelled = false;
    async function tick() {
      try {
        const r = await fetch(`/api/products/${productId}/viewers`);
        const d = await r.json();
        if (!cancelled) setCount(d.count || 0);
      } catch {}
    }
    tick();
    const id = setInterval(tick, 8000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [productId]);
  if (!count) return null;
  return (
    <div className="text-xs text-amazon-textMuted flex items-center gap-1 mt-1">
      <Eye className="w-3 h-3 animate-pulse" />
      <span className="font-medium text-amazon-orange">{count} people</span> are viewing this right now
    </div>
  );
}
