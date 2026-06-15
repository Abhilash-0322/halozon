'use client';
import { useState } from 'react';
import { Calendar, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const FREQUENCIES = [
  { months: 1, label: 'Every month', discount: 5 },
  { months: 2, label: 'Every 2 months', discount: 8 },
  { months: 3, label: 'Every 3 months', discount: 10 },
  { months: 6, label: 'Every 6 months', discount: 15 },
];

export default function SubscribeSave({ productId, price }: { productId: string; price: number }) {
  const [selected, setSelected] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const f = FREQUENCIES.find((x) => x.months === selected)!;
  const discounted = +(price * (1 - f.discount / 100)).toFixed(2);

  async function subscribe() {
    setLoading(true);
    try {
      const r = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, frequencyMonths: selected }),
      });
      const d = await r.json();
      if (!r.ok) {
        toast.error(d.error || 'Sign in to subscribe');
        return;
      }
      setDone(true);
      toast.success('Subscribed!');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="panel p-4 mt-4 border-l-4 border-amazon-green">
        <div className="flex items-center gap-2 font-bold text-amazon-greenDark">
          <Check className="w-5 h-5" /> Subscribed!
        </div>
        <p className="text-sm mt-1">You'll receive {f.label.toLowerCase()} at {formatPrice(discounted)} (saved {f.discount}%).</p>
      </div>
    );
  }

  return (
    <div className="panel p-4 mt-4">
      <h3 className="font-bold text-base mb-1 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-amazon-orange" /> Subscribe & Save
      </h3>
      <p className="text-xs text-amazon-textMuted mb-3">
        Never run out. Cancel anytime.
      </p>
      <div className="space-y-2">
        {FREQUENCIES.map((f) => {
          const dPrice = +(price * (1 - f.discount / 100)).toFixed(2);
          return (
            <label
              key={f.months}
              className={`flex items-center gap-3 border rounded-md p-2 cursor-pointer transition-all ${
                selected === f.months
                  ? 'border-amazon-orange bg-amazon-orange/5'
                  : 'border-amazon-border hover:border-amazon-orange'
              }`}
            >
              <input
                type="radio"
                name="frequency"
                checked={selected === f.months}
                onChange={() => setSelected(f.months)}
              />
              <div className="flex-1">
                <div className="text-sm font-medium">{f.label}</div>
                <div className="text-xs text-amazon-textMuted">Save {f.discount}%</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{formatPrice(dPrice)}</div>
                <div className="text-xs text-amazon-textMuted line-through">{formatPrice(price)}</div>
              </div>
            </label>
          );
        })}
      </div>
      <button onClick={subscribe} disabled={loading} className="amazon-btn-yellow w-full mt-3 !text-sm disabled:opacity-60">
        {loading ? 'Subscribing…' : `Subscribe · ${formatPrice(discounted)} ${f.label.toLowerCase()}`}
      </button>
    </div>
  );
}
