'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

type P = { brand?: string; cardNumberLast4?: string; expiry?: string; label?: string; isDefault?: boolean };

export default function PaymentView({ initial }: { initial: P[] }) {
  const [items, setItems] = useState<P[]>(initial);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ brand: 'Visa', cardNumber: '', expiry: '', label: 'Personal', isDefault: false });

  async function save() {
    if (form.cardNumber.length < 12) return toast.error('Invalid card number');
    const r = await fetch('/api/account/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    if (r.ok) {
      setItems(d.paymentMethods);
      setForm({ brand: 'Visa', cardNumber: '', expiry: '', label: 'Personal', isDefault: false });
      setAdding(false);
      toast.success('Card added');
    } else toast.error(d.error);
  }

  async function del(i: number) {
    const r = await fetch('/api/account/payment', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index: i }),
    });
    const d = await r.json();
    if (r.ok) {
      setItems(d.paymentMethods);
      toast.success('Removed');
    }
  }

  return (
    <div className="bg-white border border-amazon-border rounded-md p-5">
      <h1 className="text-3xl font-bold mb-1">Payment options</h1>
      <p className="text-sm text-amazon-textMuted mb-4">Manage your saved cards. Card details are never stored in full.</p>

      <div className="space-y-3 mb-4">
        {items.map((p, i) => (
          <div key={i} className="border border-amazon-border rounded-md p-4 flex items-center justify-between">
            <div>
              <div className="font-bold">
                {p.label} {p.isDefault && <span className="chip ml-2">Default</span>}
              </div>
              <div className="text-sm text-amazon-textMuted">
                {p.brand} ending in {p.cardNumberLast4}
                {p.expiry && <span className="ml-2">· exp {p.expiry}</span>}
              </div>
            </div>
            <button onClick={() => del(i)} className="amazon-link text-sm">Remove</button>
          </div>
        ))}
      </div>

      {!adding && (
        <button onClick={() => setAdding(true)} className="amazon-btn-yellow !text-xs">
          + Add a card
        </button>
      )}

      {adding && (
        <div className="border border-amazon-border rounded-md p-4 mt-4 bg-amazon-bg">
          <h3 className="font-bold mb-3">Add a card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-bold block mb-1">Label</span>
              <input className="amazon-input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-xs font-bold block mb-1">Card brand</span>
              <select className="amazon-input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}>
                <option>Visa</option>
                <option>Mastercard</option>
                <option>American Express</option>
                <option>Discover</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-bold block mb-1">Card number</span>
              <input
                className="amazon-input"
                placeholder="1234 5678 9012 3456"
                value={form.cardNumber}
                onChange={(e) => setForm({ ...form, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) })}
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold block mb-1">Expiration</span>
              <input className="amazon-input" placeholder="MM/YY" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
            </label>
          </div>
          <label className="text-sm mt-2 flex items-center gap-2">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
            Make default
          </label>
          <div className="mt-3 flex gap-2 justify-end">
            <button onClick={() => setAdding(false)} className="amazon-btn-dark !text-xs">Cancel</button>
            <button onClick={save} className="amazon-btn-yellow !text-xs">Add card</button>
          </div>
        </div>
      )}
    </div>
  );
}
