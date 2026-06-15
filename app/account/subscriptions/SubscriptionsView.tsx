'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Trash2, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const FREQ_LABELS: Record<number, string> = {
  1: 'Monthly',
  2: 'Every 2 months',
  3: 'Every 3 months',
  6: 'Every 6 months',
};

export default function SubscriptionsView({ initial }: { initial: any[] }) {
  const [items, setItems] = useState(initial);

  async function cancel(id: string) {
    if (!confirm('Cancel this subscription?')) return;
    const r = await fetch('/api/subscriptions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId: id }),
    });
    if (r.ok) {
      toast.success('Subscription cancelled');
      setItems((prev) => prev.filter((i) => i._id !== id));
    } else {
      toast.error('Failed to cancel');
    }
  }

  return (
    <div className="bg-white border border-amazon-border rounded-md p-5">
      <h1 className="text-3xl font-bold mb-1">Your subscriptions</h1>
      <p className="text-sm text-amazon-textMuted mb-4">
        Manage Subscribe & Save deliveries. Cancel anytime.
      </p>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <Calendar className="w-12 h-12 mx-auto text-amazon-textMuted mb-3" />
          <h3 className="text-lg font-bold mb-2">No subscriptions yet</h3>
          <p className="text-sm text-amazon-textMuted mb-4">
            Subscribe to your favorite products and save up to 15%.
          </p>
          <Link href="/" className="amazon-btn-yellow inline-block">Browse products</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((s) => {
            const nextDate = s.nextDeliveryAt ? new Date(s.nextDeliveryAt) : null;
            const discounted = s.price * (1 - (s.discountPercent || 0) / 100);
            return (
              <div key={s._id} className="panel p-4 flex gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.title} className="w-24 h-24 object-contain bg-white rounded border border-amazon-border" />
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${s.productId}`} className="text-base font-bold text-amazon-link hover:underline line-clamp-2">
                    {s.title}
                  </Link>
                  <div className="text-sm text-amazon-textMuted mt-1 flex flex-wrap gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {FREQ_LABELS[s.frequencyMonths] || `Every ${s.frequencyMonths} mo`}
                    </span>
                    {nextDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Next: {nextDate.toLocaleDateString()}
                      </span>
                    )}
                    <span className="text-amazon-greenDark font-medium">Save {s.discountPercent}%</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-bold text-amazon-orange">{formatPrice(discounted)}</span>
                    <span className="text-amazon-textMuted line-through ml-2">{formatPrice(s.price)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <Link href={`/product/${s.productId}`} className="amazon-btn-dark !text-xs">
                    View product
                  </Link>
                  <button
                    onClick={() => cancel(s._id)}
                    className="text-xs text-amazon-deal hover:underline flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Cancel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
