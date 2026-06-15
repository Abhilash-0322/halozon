import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import SellerApply from './SellerApply';

export default async function SellerApplyPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/seller/apply');
  return <SellerApply user={user} />;
}
