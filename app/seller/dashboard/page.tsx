import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import SellerDashboard from './SellerDashboard';
import { serialize } from '@/lib/serialize';
import { ensureSellerOrAdmin } from '@/lib/requireSellerPage';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await ensureSellerOrAdmin();
  await connectDB();
  const myProducts = await Product.find({ sellerId: user.id }).select('_id title stock sold price images createdAt').lean();
  const myProductIds = myProducts.map((p: any) => p._id);
  const orders = await Order.find({ 'items.productId': { $in: myProductIds } }).sort({ createdAt: -1 }).limit(10).lean();

  let revenue = 0;
  let unitsSold = 0;
  const last7Days: { date: string; revenue: number; units: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push({ date: d.toISOString().slice(0, 10), revenue: 0, units: 0 });
  }
  const byDate = new Map(last7Days.map((d) => [d.date, d]));
  for (const o of orders as any[]) {
    for (const it of o.items || []) {
      if (!myProductIds.some((p) => String(p) === String(it.productId))) continue;
      revenue += it.price * it.qty;
      unitsSold += it.qty;
      const slot = byDate.get(new Date(o.createdAt).toISOString().slice(0, 10));
      if (slot) {
        slot.revenue += it.price * it.qty;
        slot.units += it.qty;
      }
    }
  }

  return (
    <SellerDashboard
      user={user}
      metrics={{
        revenue: +revenue.toFixed(2),
        unitsSold,
        orderCount: orders.length,
        productCount: myProducts.length,
      }}
      series={last7Days}
      recentOrders={JSON.parse(JSON.stringify(orders)).slice(0, 5)}
      topProducts={serialize(myProducts).sort((a: any, b: any) => b.sold - a.sold).slice(0, 5)}
    />
  );
}
