import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import AccountLayout from '../AccountLayout';
import SubscriptionsView from './SubscriptionsView';
import { serialize } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

export default async function SubscriptionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account/subscriptions');
  await connectDB();
  const items = serialize(
    await Subscription.find({ userId: user.id }).sort({ createdAt: -1 }).lean()
  ) as any;
  return (
    <AccountLayout user={user}>
      <SubscriptionsView initial={items} />
    </AccountLayout>
  );
}
