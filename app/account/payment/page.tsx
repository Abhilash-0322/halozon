import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import AccountLayout from '../AccountLayout';
import PaymentView from './PaymentView';

export const dynamic = 'force-dynamic';

export default async function PaymentPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account/payment');
  await connectDB();
  const u = (await User.findById(user.id).lean()) as any;
  return (
    <AccountLayout user={user}>
      <PaymentView initial={u?.paymentMethods || []} />
    </AccountLayout>
  );
}
