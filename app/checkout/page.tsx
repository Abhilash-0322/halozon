import CheckoutView from './CheckoutView';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/checkout');
  await connectDB();
  const u = (await User.findById(user.id).lean()) as any;
  return (
    <CheckoutView
      user={user}
      savedAddresses={u?.addresses || []}
      savedPayments={u?.paymentMethods || []}
    />
  );
}
