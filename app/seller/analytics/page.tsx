import SellerAnalytics from './SellerAnalytics';
import { ensureSellerOrAdmin } from '@/lib/requireSellerPage';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const user = await ensureSellerOrAdmin();
  return <SellerAnalytics user={user} />;
}
