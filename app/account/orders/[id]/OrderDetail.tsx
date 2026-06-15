'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check, Clock, Package, Truck, Home, X, ArrowLeft, RotateCcw, FastForward, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import AccountLayout from '../../AccountLayout';
import ReturnModal from '@/components/ReturnModal';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type TrackingEvent = { status: string; label: string; location?: string; at: string };

const STEPS = [
  { id: 'ordered', label: 'Ordered', icon: Clock },
  { id: 'processing', label: 'Preparing', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'out_for_delivery', label: 'Out for delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Home },
];

export default function OrderDetail({ order }: { order: any }) {
  const router = useRouter();
  const [advancing, setAdvancing] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const user = { name: 'Customer', email: '' };

  const events: TrackingEvent[] = order.trackingEvents || [];
  const statusOrder = ['ordered', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
  const currentStepIdx = statusOrder.indexOf(order.status);

  async function advance() {
    setAdvancing(true);
    try {
      const r = await fetch(`/api/orders/${order._id}/advance`, { method: 'POST' });
      if (r.ok) {
        toast.success('Order status advanced');
        router.refresh();
      } else {
        const d = await r.json();
        toast.error(d.error || 'Failed');
      }
    } finally {
      setAdvancing(false);
    }
  }

  function stepState(idx: number) {
    if (idx < currentStepIdx) return 'done';
    if (idx === currentStepIdx) return 'current';
    return 'pending';
  }

  return (
    <AccountLayout user={user}>
      <div className="bg-white border border-amazon-border rounded-md p-5">
        <Link href="/account/orders" className="text-sm text-amazon-link hover:underline flex items-center gap-1 mb-3">
          <ArrowLeft className="w-3 h-3" /> Back to orders
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-sm text-amazon-textMuted">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-amazon-textMuted">Total</div>
            <div className="text-2xl font-bold">{formatPrice(order.total)}</div>
          </div>
        </div>

        {/* Tracking timeline */}
        <div className="mt-6 panel p-5 bg-amazon-bg/30">
          <h3 className="font-bold mb-4">Shipment status</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
            {STEPS.map((s, idx) => {
              const state = stepState(idx);
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      state === 'done' ? 'bg-amazon-greenDark text-white' :
                      state === 'current' ? 'bg-amazon-orange text-white animate-pulseRing' :
                      'bg-amazon-bg text-amazon-textMuted'
                    }`}
                  >
                    {state === 'done' ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className={`text-xs mt-2 font-medium ${state === 'pending' ? 'text-amazon-textMuted' : ''}`}>
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="hidden md:flex items-center justify-between text-xs text-amazon-textMuted -mt-8 mb-2 px-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex-1" />
            ))}
          </div>
          <div className="hidden md:block relative h-1 bg-amazon-border rounded-full mx-8 -mt-7 mb-4">
            <div
              className="h-full bg-amazon-greenDark rounded-full transition-all duration-500"
              style={{ width: `${Math.max(0, (currentStepIdx / 4) * 100)}%` }}
            />
          </div>

          {/* Events list */}
          <div className="space-y-2 text-sm border-t border-amazon-border pt-3 mt-4">
            {events.map((e, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <b>{e.label}</b>
                  {e.location && <span className="text-amazon-textMuted"> · {e.location}</span>}
                </div>
                <div className="text-amazon-textMuted">{new Date(e.at).toLocaleString()}</div>
              </div>
            ))}
          </div>

          {order.deliveryEta && order.status !== 'delivered' && (
            <div className="mt-3 text-sm bg-amazon-prime/10 text-amazon-prime px-3 py-2 rounded">
              <Truck className="w-4 h-4 inline mr-1" />
              Estimated delivery: <b>{new Date(order.deliveryEta).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</b>
            </div>
          )}

          {/* Demo: advance button */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <button
              onClick={advance}
              disabled={advancing}
              className="mt-3 text-xs text-amazon-link hover:underline flex items-center gap-1"
            >
              <FastForward className="w-3 h-3" />
              {advancing ? 'Advancing…' : 'Demo: advance to next step'}
            </button>
          )}
        </div>

        {/* Address(es) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="panel p-4">
            <h4 className="font-bold mb-2 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Shipping {order.addresses?.length > 1 ? 'addresses' : 'address'}
            </h4>
            {(order.addresses || [order.shippingAddress]).map((a: any, i: number) => (
              <div key={i} className="mb-2 text-sm">
                {order.addresses?.length > 1 && <div className="font-medium">Address {i + 1}</div>}
                <div>{a?.fullName}</div>
                <div>{a?.street}{a?.apt ? `, ${a?.apt}` : ''}</div>
                <div>{a?.city}, {a?.state} {a?.zip}</div>
              </div>
            ))}
          </div>
          <div className="panel p-4">
            <h4 className="font-bold mb-2">Payment</h4>
            <div className="text-sm">
              {order.paymentMethod?.brand} ending in {order.paymentMethod?.last4}
            </div>
            {order.couponCode && (
              <div className="text-xs text-amazon-greenDark mt-2">
                Coupon <b>{order.couponCode}</b> saved {formatPrice(order.couponDiscount || 0)}
              </div>
            )}
            {order.giftWrap && (
              <div className="text-xs text-amazon-orange mt-2">
                Gift wrap +{formatPrice(order.giftWrapFee || 0)}
                {order.giftMessage && <div className="italic">"{order.giftMessage}"</div>}
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="mt-6">
          <h3 className="font-bold mb-3">Items in this order</h3>
          <div className="border-t border-amazon-border divide-y divide-amazon-border">
            {order.items.map((it: any, i: number) => (
              <div key={i} className="py-3 flex gap-3">
                <Link href={`/product/${it.productId}`} className="w-20 h-20 bg-white rounded shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image} alt={it.title} className="w-full h-full object-contain" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${it.productId}`} className="text-sm amazon-link line-clamp-2">
                    {it.title}
                  </Link>
                  <div className="text-xs text-amazon-textMuted mt-1">Qty: {it.qty}</div>
                  <div className="text-sm font-bold mt-1">{formatPrice(it.price * it.qty)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Return button */}
        {order.status === 'delivered' && (
          <div className="mt-6 panel p-4 border-l-4 border-amazon-orange">
            <h3 className="font-bold mb-1">Need to return items?</h3>
            <p className="text-sm text-amazon-textMuted mb-3">
              You can return items within 30 days of delivery.
            </p>
            <button onClick={() => setReturnOpen(true)} className="amazon-btn-dark !text-xs">
              <RotateCcw className="w-3 h-3 inline mr-1" /> Return items
            </button>
          </div>
        )}

        {/* Order summary */}
        <div className="mt-6 panel p-4 bg-amazon-bg/30">
          <h3 className="font-bold mb-2">Order summary</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span>Items:</span><span>{formatPrice(order.itemsTotal)}</span></div>
            <div className="flex justify-between"><span>Shipping:</span><span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span></div>
            {order.couponDiscount > 0 && (
              <div className="flex justify-between text-amazon-greenDark"><span>Coupon:</span><span>-{formatPrice(order.couponDiscount)}</span></div>
            )}
            {order.giftWrap && <div className="flex justify-between"><span>Gift wrap:</span><span>{formatPrice(order.giftWrapFee)}</span></div>}
            <div className="flex justify-between"><span>Tax:</span><span>{formatPrice(order.tax)}</span></div>
            <hr className="my-2 border-amazon-border" />
            <div className="flex justify-between text-lg font-bold"><span>Total:</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </div>
      </div>

      {returnOpen && (
        <ReturnModal
          orderId={order._id}
          items={order.items}
          onClose={() => setReturnOpen(false)}
          onSubmitted={() => {
            setReturnOpen(false);
            router.push('/account/returns');
          }}
        />
      )}
    </AccountLayout>
  );
}
