import SellerStore from './SellerStore';
import { ensureSellerOrAdmin } from '@/lib/requireSellerPage';

export const dynamic = 'force-dynamic';

export default async function SellerStorePage() {
  const user = await ensureSellerOrAdmin();
  return <SellerStore user={user} />;
}
