'use client';
import { useState } from 'react';
import { Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StockAlert({ productId }: { productId: string }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return toast.error('Valid email required');
    setLoading(true);
    try {
      const r = await fetch('/api/stock-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, productId }),
      });
      const d = await r.json();
      if (!r.ok) return toast.error(d.error || 'Failed');
      toast.success("You'll be notified when it's back in stock");
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-sm text-amazon-greenDark mt-2 flex items-center gap-1">
        <Bell className="w-4 h-4" /> You'll be notified at <b>{email}</b>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 pt-3 border-t border-amazon-border">
      <div className="text-sm font-bold mb-1 flex items-center gap-1">
        <Bell className="w-4 h-4" /> Email me when this is back in stock
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="amazon-input flex-1 !text-sm"
        />
        <button type="submit" disabled={loading} className="amazon-btn-dark !text-xs disabled:opacity-60">
          Notify me
        </button>
      </div>
    </form>
  );
}
