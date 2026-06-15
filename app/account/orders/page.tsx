import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import AccountLayout from '../AccountLayout';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { serialize } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account/orders');
  await connectDB();
  const orders = serialize(await Order.find({ userId: user.id }).sort({ createdAt: -1 }).lean()) as any;

  return (
    <AccountLayout user={user}>
      <div className="bg-white border border-amazon-border rounded-md p-5">
        <h1 className="text-3xl font-bold mb-1">Your Orders</h1>
        <p className="text-sm text-amazon-textMuted mb-4">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="mb-3">You have no orders yet.</p>
            <Link href="/" className="amazon-btn-primary inline-block">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o: any) => (
              <div key={String(o._id)} className="border border-amazon-border rounded-md overflow-hidden">
                <div className="bg-amazon-bg px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-amazon-textMuted">ORDER PLACED</div>
                    <div>{new Date(o.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-amazon-textMuted">TOTAL</div>
                    <div>{formatPrice(o.total)}</div>
                  </div>
                  <div>
                    <div className="text-amazon-textMuted">SHIP TO</div>
                    <div className="amazon-link">{o.shippingAddress?.fullName}</div>
                  </div>
                  <div>
                    <div className="text-amazon-textMuted">ORDER # {o.orderNumber}</div>
                    <Link className="amazon-link" href={`/account/orders/${o._id}`}>View order details</Link>
                  </div>
                </div>
                <div className="divide-y divide-amazon-border">
                  {(o.items as any[]).map((it, i) => (
                    <div key={i} className="p-4 flex gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.image} alt={it.title} className="w-24 h-24 object-contain bg-white rounded" />
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${it.productId}`} className="text-base text-amazon-link hover:text-amazon-linkHover hover:underline line-clamp-2">
                          {it.title}
                        </Link>
                        <div className="text-xs text-amazon-textMuted mt-1">Qty: {it.qty}</div>
                        <div className="text-sm font-bold mt-1">{formatPrice(it.price * it.qty)}</div>
                        <div className="mt-2 text-sm">
                          <span className="text-amazon-greenDark font-medium">
                            {o.status === 'delivered' ? 'Delivered' : o.status === 'shipped' ? 'Shipped' : o.status === 'cancelled' ? 'Cancelled' : 'Processing'}
                          </span>
                          {o.deliveryEta && (
                            <span className="text-amazon-textMuted ml-2">
                              Arriving by {new Date(o.deliveryEta).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex gap-2 flex-wrap">
                          <button className="amazon-btn-yellow !text-xs !py-1.5">Buy it again</button>
                          <button className="amazon-btn-dark !text-xs !py-1.5">View your item</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
