import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import ReturnRequest from '@/models/ReturnRequest';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';

function newRma() {
  return 'RMA-' + Math.floor(100000 + Math.random() * 900000) + '-' + crypto.randomBytes(2).toString('hex').toUpperCase();
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ items: [] });
  await connectDB();
  const items = await ReturnRequest.find({ userId: user.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items: JSON.parse(JSON.stringify(items)) });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  const { orderId, items, reason, notes } = await req.json();
  if (!orderId || !Array.isArray(items) || items.length === 0)
    return NextResponse.json({ error: 'Order and items required' }, { status: 400 });
  if (!reason)
    return NextResponse.json({ error: 'Reason required' }, { status: 400 });

  await connectDB();
  const order = (await Order.findOne({ _id: orderId, userId: user.id }).lean()) as any;
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (order.status !== 'delivered')
    return NextResponse.json({ error: 'Only delivered orders can be returned' }, { status: 400 });

  // Refund calculation: sum of selected items
  const refundAmount = items.reduce(
    (s: number, it: { price: number; qty: number }) => s + it.price * it.qty,
    0
  );

  const ret = await ReturnRequest.create({
    rma: newRma(),
    userId: user.id,
    orderId,
    orderNumber: order.orderNumber,
    items,
    reason,
    notes: notes || '',
    refundAmount: +refundAmount.toFixed(2),
    status: 'requested',
  });
  return NextResponse.json({ return: JSON.parse(JSON.stringify(ret)) });
}
