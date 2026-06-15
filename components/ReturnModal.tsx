'use client';
import { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const REASONS = [
  'Damaged on arrival',
  'Wrong item received',
  'Item defective',
  'Better price found',
  'No longer needed',
  'Other',
];

export default function ReturnModal({
  orderId,
  items,
  onClose,
  onSubmitted,
}: {
  orderId: string;
  items: any[];
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [selected, setSelected] = useState<Record<string, { qty: number; reason: string; condition: string }>>({});
  const [overallReason, setOverallReason] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function toggle(idx: number, item: any) {
    setSelected((prev) => {
      const key = String(idx);
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: { qty: 1, reason: overallReason || 'No longer needed', condition: 'new' } };
    });
  }

  function update(idx: number, key: string, val: any) {
    setSelected((prev) => ({ ...prev, [idx]: { ...prev[idx], [key]: val } }));
  }

  async function submit() {
    if (Object.keys(selected).length === 0) return toast.error('Select at least one item to return');
    if (!overallReason) return toast.error('Please choose a reason');
    setSubmitting(true);
    try {
      const returnItems = Object.entries(selected).map(([k, v]) => {
        const item = items[Number(k)];
        return {
          productId: item.productId,
          title: item.title,
          image: item.image,
          qty: v.qty,
          price: item.price,
          reason: v.reason,
          condition: v.condition,
        };
      });
      const r = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, items: returnItems, reason: overallReason, notes }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      toast.success(`Return created: ${d.return.rma}`);
      onSubmitted();
    } catch (e: any) {
      toast.error(e.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-amazon-border">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amazon-orange" /> Return items
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-amazon-bg rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <label className="block">
            <span className="text-sm font-bold block mb-1">Reason for return *</span>
            <select
              className="amazon-input"
              value={overallReason}
              onChange={(e) => setOverallReason(e.target.value)}
            >
              <option value="">Choose a reason…</option>
              {REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-bold block mb-1">Additional notes (optional)</span>
            <textarea
              className="amazon-input min-h-[60px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
            />
          </label>
          <div>
            <div className="text-sm font-bold mb-2">Select items to return</div>
            <div className="space-y-2 max-h-60 overflow-y-auto border border-amazon-border rounded-md p-3">
              {items.map((it, i) => {
                const sel = selected[String(i)];
                return (
                  <div key={i} className="flex items-start gap-3 border-b border-amazon-border pb-2 last:border-0">
                    <input
                      type="checkbox"
                      checked={!!sel}
                      onChange={() => toggle(i, it)}
                      className="mt-1"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.image} alt={it.title} className="w-12 h-12 object-contain bg-white rounded" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm line-clamp-2">{it.title}</div>
                      <div className="text-xs text-amazon-textMuted">Qty: {it.qty} · ${it.price}</div>
                      {sel && (
                        <div className="flex gap-2 mt-2">
                          <select
                            className="amazon-input !text-xs !py-1"
                            value={sel.qty}
                            onChange={(e) => update(i, 'qty', Number(e.target.value))}
                          >
                            {Array.from({ length: it.qty }, (_, k) => (
                              <option key={k} value={k + 1}>{k + 1}</option>
                            ))}
                          </select>
                          <select
                            className="amazon-input !text-xs !py-1"
                            value={sel.condition}
                            onChange={(e) => update(i, 'condition', e.target.value)}
                          >
                            <option value="new">New</option>
                            <option value="like_new">Like New</option>
                            <option value="used">Used</option>
                            <option value="damaged">Damaged</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="amazon-btn-dark !text-xs">Cancel</button>
            <button onClick={submit} disabled={submitting} className="amazon-btn-orange !text-xs disabled:opacity-60">
              {submitting ? 'Submitting…' : 'Submit return'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
