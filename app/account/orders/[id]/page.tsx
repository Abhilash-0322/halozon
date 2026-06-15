import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderDetail from './OrderDetail';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account/orders');
  await connectDB();
  const order = await Order.findOne({ _id: params.id, userId: user.id }).lean();
  if (!order) redirect('/account/orders');
  return <OrderDetail order={JSON.parse(JSON.stringify(order))} />;
}
