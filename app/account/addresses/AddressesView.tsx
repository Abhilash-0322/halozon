'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

type Address = {
  label?: string;
  fullName?: string;
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
};

export default function AddressesView({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addrs, setAddrs] = useState<Address[]>(initialAddresses);
  const [adding, setAdding] = useState(false);
  const empty = { fullName: '', street: '', apt: '', city: '', state: '', zip: '', country: 'United States', phone: '', label: 'Home', isDefault: false };
  const [form, setForm] = useState<Address>(empty);

  async function save() {
    const r = await fetch('/api/account/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    if (r.ok) {
      setAddrs(d.addresses);
      setForm(empty);
      setAdding(false);
      toast.success('Address added');
    } else toast.error(d.error);
  }

  async function del(i: number) {
    const r = await fetch('/api/account/addresses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index: i }),
    });
    const d = await r.json();
    if (r.ok) {
      setAddrs(d.addresses);
      toast.success('Removed');
    }
  }

  return (
    <div className="bg-white border border-amazon-border rounded-md p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold">Your Addresses</h1>
          <p className="text-sm text-amazon-textMuted">Manage your shipping addresses.</p>
        </div>
        <button onClick={() => setAdding(true)} className="amazon-btn-yellow !text-xs">+ Add address</button>
      </div>

      {addrs.length === 0 && !adding && (
        <p className="text-sm text-amazon-textMuted">No saved addresses yet.</p>
      )}

      <div className="space-y-3">
        {addrs.map((a, i) => (
          <div key={i} className="border border-amazon-border rounded-md p-4">
            <div className="flex justify-between mb-2">
              <div className="font-bold">
                {a.label || 'Address'} {a.isDefault && <span className="chip ml-2">Default</span>}
              </div>
              <div className="space-x-3 text-xs">
                <button onClick={() => { setForm(a); setAdding(true); }} className="amazon-link">Edit</button>
                <button onClick={() => del(i)} className="amazon-link">Remove</button>
              </div>
            </div>
            <div className="text-sm text-amazon-text">
              <div>{a.fullName}</div>
              <div>{a.street}{a.apt ? `, ${a.apt}` : ''}</div>
              <div>{a.city}, {a.state} {a.zip}</div>
              <div>{a.country}</div>
              {a.phone && <div className="text-amazon-textMuted mt-1">Phone: {a.phone}</div>}
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <div className="border border-amazon-border rounded-md p-4 mt-4 bg-amazon-bg">
          <h3 className="font-bold mb-3">{form.fullName ? 'Edit address' : 'Add a new address'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Label" v={form.label} on={(v) => setForm({ ...form, label: v })} />
            <Input label="Full name" v={form.fullName} on={(v) => setForm({ ...form, fullName: v })} />
            <Input label="Street" v={form.street} on={(v) => setForm({ ...form, street: v })} />
            <Input label="Apt" v={form.apt} on={(v) => setForm({ ...form, apt: v })} />
            <Input label="City" v={form.city} on={(v) => setForm({ ...form, city: v })} />
            <Input label="State" v={form.state} on={(v) => setForm({ ...form, state: v })} />
            <Input label="ZIP" v={form.zip} on={(v) => setForm({ ...form, zip: v })} />
            <Input label="Phone" v={form.phone} on={(v) => setForm({ ...form, phone: v })} />
          </div>
          <label className="text-sm mt-2 flex items-center gap-2">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
            Make default
          </label>
          <div className="mt-3 flex gap-2 justify-end">
            <button onClick={() => { setForm(empty); setAdding(false); }} className="amazon-btn-dark !text-xs">Cancel</button>
            <button onClick={save} className="amazon-btn-yellow !text-xs">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, v, on }: { label: string; v?: string; on: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-bold block mb-1">{label}</span>
      <input className="amazon-input" value={v || ''} onChange={(e) => on(e.target.value)} />
    </label>
  );
}
