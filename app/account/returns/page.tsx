import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import ReturnRequest from '@/models/ReturnRequest';
import AccountLayout from '../AccountLayout';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ReturnsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account/returns');
  await connectDB();
  const items = JSON.parse(JSON.stringify(
    await ReturnRequest.find({ userId: user.id }).sort({ createdAt: -1 }).lean()
  ));

  const statusColor: Record<string, string> = {
    requested: 'bg-amazon-orange/15 text-amazon-orange',
    approved: 'bg-amazon-prime/15 text-amazon-prime',
    rejected: 'bg-amazon-deal/15 text-amazon-deal',
    received: 'bg-amazon-yellow text-amazon-text',
    refunded: 'bg-amazon-greenDark/15 text-amazon-greenDark',
  };

  return (
    <AccountLayout user={user}>
      <div className="bg-white border border-amazon-border rounded-md p-5">
        <h1 className="text-3xl font-bold mb-1">Your Returns</h1>
        <p className="text-sm text-amazon-textMuted mb-4">{items.length} return{items.length !== 1 ? 's' : ''}</p>

        {items.length === 0 ? (
          <div className="text-center py-10">
            <p className="mb-3">No returns yet.</p>
            <Link href="/account/orders" className="amazon-btn-primary inline-block">View orders</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((r: any) => (
              <div key={r._id} className="border border-amazon-border rounded-md p-4">
                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                  <div>
                    <div className="font-bold">RMA: {r.rma}</div>
                    <div className="text-xs text-amazon-textMuted">
                      Order {r.orderNumber} · Filed {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`chip ${statusColor[r.status] || ''}`}>
                    {r.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-sm text-amazon-textMuted">
                  Reason: {r.reason}
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {r.items.map((it: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 border border-amazon-border rounded-md p-2 text-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.image} alt={it.title} className="w-10 h-10 object-contain" />
                      <div>
                        <div className="line-clamp-1 max-w-[150px]">{it.title}</div>
                        <div className="text-amazon-textMuted">×{it.qty}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {r.refundAmount && (
                  <div className="mt-3 text-sm">
                    Refund: <b className="text-amazon-greenDark">{formatPrice(r.refundAmount)}</b>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
