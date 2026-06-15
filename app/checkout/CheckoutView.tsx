'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type User = { id: string; name: string; email: string };
type Address = {
  fullName?: string; street?: string; apt?: string; city?: string;
  state?: string; zip?: string; country?: string; phone?: string;
  label?: string; isDefault?: boolean;
};
type Payment = { brand?: string; cardNumberLast4?: string; expiry?: string; label?: string; isDefault?: boolean };

export default function CheckoutView({
  user,
  savedAddresses,
  savedPayments,
}: {
  user: User;
  savedAddresses: Address[];
  savedPayments: Payment[];
}) {
  const router = useRouter();
  const { items, subtotal, refresh } = useCart();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); refresh(); }, [refresh]);

  const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
  const defaultPay = savedPayments.find((p) => p.isDefault) || savedPayments[0];

  const [addr, setAddr] = useState<Address>({
    fullName: user.name,
    street: defaultAddr?.street || '',
    apt: defaultAddr?.apt || '',
    city: defaultAddr?.city || '',
    state: defaultAddr?.state || '',
    zip: defaultAddr?.zip || '',
    country: 'United States',
    phone: defaultAddr?.phone || '',
  });
  const [cardNumber, setCardNumber] = useState(defaultPay?.cardNumberLast4 ? `**** **** **** ${defaultPay.cardNumberLast4}` : '');
  const [expiry, setExpiry] = useState(defaultPay?.expiry || '');
  const [brand, setBrand] = useState(defaultPay?.brand || 'Visa');
  const [name, setName] = useState(defaultPay?.label || user.name);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [placed, setPlaced] = useState<any>(null);

  if (!hydrated) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="shimmer-bg h-40 rounded-md" />
      </div>
    );
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="bg-white border border-amazon-border rounded-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <Link href="/" className="amazon-link">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= 35 ? 0 : 5.99;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  async function placeOrder() {
    if (!addr.street || !addr.city || !addr.zip) {
      toast.error('Please complete your shipping address');
      setStep(1);
      return;
    }
    if (!cardNumber || cardNumber.length < 12) {
      toast.error('Please enter a valid card number');
      setStep(2);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: addr,
          paymentMethod: brand,
          cardNumber,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Checkout failed');
      setPlaced(d.order);
      setStep(3);
      window.dispatchEvent(new Event('cart:update'));
    } catch (e: any) {
      toast.error(e.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (placed) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="bg-white border border-amazon-border rounded-md p-8 text-center animate-fadeIn">
          <div className="w-16 h-16 mx-auto bg-amazon-green/10 rounded-full flex items-center justify-center mb-4 animate-pulseRing">
            <Check className="w-8 h-8 text-amazon-greenDark" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order placed!</h1>
          <p className="text-amazon-textMuted mb-4">
            Thank you, your order has been received.
          </p>
          <div className="bg-amazon-bg border border-amazon-border rounded-md p-4 inline-block mb-4">
            <div className="text-xs text-amazon-textMuted">Order number</div>
            <div className="text-xl font-bold">{placed.orderNumber}</div>
            <div className="text-sm mt-2">
              Total: <b>{formatPrice(placed.total)}</b>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push('/account/orders')} className="amazon-btn-primary">
              View orders
            </button>
            <button onClick={() => router.push('/')} className="amazon-btn-yellow">
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <Link href="/" className="text-2xl font-extrabold text-amazon-navy">
          halo<span className="text-amazon-orange">zon</span>
        </Link>
        <div className="text-sm text-amazon-textMuted flex items-center gap-1">
          <Lock className="w-4 h-4" /> Secure checkout
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          {/* Stepper */}
          <div className="panel p-4">
            <div className="flex items-center gap-4 text-sm">
              {[
                { i: 1, l: 'Address' },
                { i: 2, l: 'Payment' },
                { i: 3, l: 'Review' },
              ].map((s, idx) => (
                <div key={s.i} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= s.i ? 'bg-amazon-orange text-white' : 'bg-amazon-bg text-amazon-textMuted'
                    }`}
                  >
                    {s.i}
                  </div>
                  <span className={step === s.i ? 'font-bold' : ''}>{s.l}</span>
                  {idx < 2 && <span className="text-amazon-textMuted">›</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          {step === 1 && (
            <div className="panel p-5">
              <h2 className="text-xl font-bold mb-3">Shipping address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Full name">
                  <input className="amazon-input" value={addr.fullName || ''} onChange={(e) => setAddr({ ...addr, fullName: e.target.value })} />
                </Field>
                <Field label="Phone number">
                  <input className="amazon-input" value={addr.phone || ''} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} />
                </Field>
                <Field label="Street address">
                  <input className="amazon-input" value={addr.street || ''} onChange={(e) => setAddr({ ...addr, street: e.target.value })} />
                </Field>
                <Field label="Apt / Suite (optional)">
                  <input className="amazon-input" value={addr.apt || ''} onChange={(e) => setAddr({ ...addr, apt: e.target.value })} />
                </Field>
                <Field label="City">
                  <input className="amazon-input" value={addr.city || ''} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
                </Field>
                <Field label="State">
                  <input className="amazon-input" value={addr.state || ''} onChange={(e) => setAddr({ ...addr, state: e.target.value })} />
                </Field>
                <Field label="ZIP code">
                  <input className="amazon-input" value={addr.zip || ''} onChange={(e) => setAddr({ ...addr, zip: e.target.value })} />
                </Field>
                <Field label="Country">
                  <select className="amazon-input" value={addr.country || 'United States'} onChange={(e) => setAddr({ ...addr, country: e.target.value })}>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>India</option>
                    <option>Japan</option>
                    <option>Germany</option>
                  </select>
                </Field>
              </div>
              <div className="mt-5 flex justify-end">
                <button onClick={() => setStep(2)} className="amazon-btn-primary">
                  Continue to payment
                </button>
              </div>
            </div>
          )}

          {/* Payment */}
          {step === 2 && (
            <div className="panel p-5">
              <h2 className="text-xl font-bold mb-3">Payment method</h2>
              {savedPayments.length > 0 && (
                <div className="mb-4 space-y-2">
                  {savedPayments.map((p, i) => (
                    <label key={i} className="panel p-3 flex items-center gap-3 cursor-pointer hover:bg-amazon-bg">
                      <input
                        type="radio"
                        name="pay"
                        onChange={() => {
                          setCardNumber(`**** **** **** ${p.cardNumberLast4}`);
                          setBrand(p.brand || 'Visa');
                          setName(p.label || user.name);
                          setExpiry(p.expiry || '');
                        }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{p.label || p.brand}</div>
                        <div className="text-xs text-amazon-textMuted">**** {p.cardNumberLast4} · exp {p.expiry}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Cardholder name">
                  <input className="amazon-input" value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field label="Card type">
                  <select className="amazon-input" value={brand} onChange={(e) => setBrand(e.target.value)}>
                    <option>Visa</option>
                    <option>Mastercard</option>
                    <option>American Express</option>
                    <option>Discover</option>
                  </select>
                </Field>
                <Field label="Card number">
                  <input
                    className="amazon-input"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                  />
                </Field>
                <Field label="Expiration (MM/YY)">
                  <input className="amazon-input" placeholder="12/29" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                </Field>
              </div>
              <div className="mt-5 flex justify-between">
                <button onClick={() => setStep(1)} className="text-sm text-amazon-link hover:underline">
                  ← Back
                </button>
                <button onClick={() => setStep(3)} className="amazon-btn-primary">
                  Review your order
                </button>
              </div>
            </div>
          )}

          {/* Review */}
          {step === 3 && (
            <div className="panel p-5 space-y-4">
              <h2 className="text-xl font-bold">Review your order</h2>
              <div className="border-t border-b border-amazon-border divide-y divide-amazon-border">
                {items.map((it) => (
                  <div key={it.productId} className="py-3 flex gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.image} alt={it.title} className="w-16 h-16 object-contain bg-white rounded" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm line-clamp-2">{it.title}</div>
                      <div className="text-xs text-amazon-textMuted">Qty: {it.qty}</div>
                    </div>
                    <div className="text-sm font-bold">{formatPrice(it.price * it.qty)}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-amazon-textMuted mb-1">Shipping to:</div>
                  <div>{addr.fullName}</div>
                  <div>{addr.street}{addr.apt ? `, ${addr.apt}` : ''}</div>
                  <div>{addr.city}, {addr.state} {addr.zip}</div>
                  <div>{addr.country}</div>
                </div>
                <div>
                  <div className="text-amazon-textMuted mb-1">Paying with:</div>
                  <div>{brand} ending in {String(cardNumber).slice(-4)}</div>
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="text-sm text-amazon-link hover:underline">
                  ← Back
                </button>
                <button onClick={placeOrder} disabled={submitting} className="amazon-btn-orange !text-base !py-2.5 disabled:opacity-60">
                  {submitting ? 'Placing your order...' : `Place your order · ${formatPrice(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-32 self-start">
          <div className="panel p-4">
            <button onClick={placeOrder} disabled={submitting || step < 3} className="amazon-btn-yellow w-full !text-base !py-2.5 mb-3 disabled:opacity-60">
              {submitting ? 'Placing...' : 'Place your order'}
            </button>
            <h3 className="font-bold text-lg mb-2">Order Summary</h3>
            <div className="text-sm space-y-1.5">
              <Row label={`Items (${items.length}):`} value={formatPrice(subtotal)} />
              <Row label="Shipping & handling:" value={shipping === 0 ? 'FREE' : formatPrice(shipping)} />
              <Row label="Total before tax:" value={formatPrice(subtotal + shipping)} />
              <Row label="Estimated tax:" value={formatPrice(tax)} />
              <hr className="my-2 border-amazon-border" />
              <div className="flex justify-between text-amazon-deal text-lg font-bold">
                <span>Order total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-bold block mb-1">{label}</span>
      {children}
    </label>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
