import SellerOrders from './SellerOrders';
import { ensureSellerOrAdmin } from '@/lib/requireSellerPage';

export const dynamic = 'force-dynamic';

export default async function SellerOrdersPage() {
  const user = await ensureSellerOrAdmin();
  return <SellerOrders user={user} />;
}
