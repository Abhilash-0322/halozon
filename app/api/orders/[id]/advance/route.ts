import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';

const NEXT: Record<string, { status: string; label: string; location?: string }> = {
  processing: { status: 'shipped', label: 'Shipped', location: 'Carrier facility' },
  shipped: { status: 'out_for_delivery', label: 'Out for delivery', location: 'Local facility' },
  out_for_delivery: { status: 'delivered', label: 'Delivered', location: 'Front door' },
};

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const order = (await Order.findOne({ _id: params.id, userId: user.id })) as any;
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const cur = order.status;
  const next = NEXT[cur];
  if (!next) return NextResponse.json({ error: 'Cannot advance' }, { status: 400 });

  order.status = next.status;
  order.trackingEvents.push({
    status: next.status,
    label: next.label,
    location: next.location,
    at: new Date(),
  });
  await order.save();
  return NextResponse.json({ order: JSON.parse(JSON.stringify(order)) });
}
