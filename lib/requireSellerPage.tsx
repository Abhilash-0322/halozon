import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export async function ensureSellerOrAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/seller/dashboard');
  if (user.role !== 'seller' && user.role !== 'admin') redirect('/seller/apply');
  return user as any;
}
