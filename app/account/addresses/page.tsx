import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import AccountLayout from '../AccountLayout';
import AddressesView from './AddressesView';

export const dynamic = 'force-dynamic';

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account/addresses');
  await connectDB();
  const u = (await User.findById(user.id).lean()) as any;
  return (
    <AccountLayout user={user}>
      <AddressesView initialAddresses={u?.addresses || []} />
    </AccountLayout>
  );
}
