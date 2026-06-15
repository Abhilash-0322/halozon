import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { requireSeller } from '@/lib/auth';

export async function GET() {
  const auth = await requireSeller();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  await connectDB();
  const myProducts = (await Product.find({ sellerId: auth.user.id }).select('_id title stock sold price images').lean()) as any[];
  const myProductIds = myProducts.map((p: any) => String(p._id));

  const orders = await Order.find({ 'items.productId': { $in: myProductIds } }).lean();

  // Compute metrics
  let revenue = 0;
  let unitsSold = 0;
  const productStats: Record<string, { sold: number; revenue: number }> = {};
  // Last 14 days sales
  const days: { date: string; revenue: number; units: number }[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push({ date: d.toISOString().slice(0, 10), revenue: 0, units: 0 });
  }
  const byDate = new Map(days.map((d) => [d.date, d]));

  for (const o of orders as any[]) {
    for (const it of o.items || []) {
      if (!myProductIds.includes(String(it.productId))) continue;
      const line = it.price * it.qty;
      revenue += line;
      unitsSold += it.qty;
      const key = String(it.productId);
      productStats[key] = productStats[key] || { sold: 0, revenue: 0 };
      productStats[key].sold += it.qty;
      productStats[key].revenue += line;
      const day = new Date(o.createdAt).toISOString().slice(0, 10);
      const slot = byDate.get(day);
      if (slot) {
        slot.revenue += line;
        slot.units += it.qty;
      }
    }
  }

  // Top products
  const topProducts = myProducts
    .map((p: any) => {
      const stats = productStats[String(p._id)] || { sold: 0, revenue: 0 };
      return {
        _id: p._id,
        title: p.title,
        image: p.images?.[0],
        price: p.price,
        stock: p.stock,
        totalSold: stats.sold,
        revenue: stats.revenue,
      };
    })
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 5);

  // Low stock
  const lowStock = myProducts
    .filter((p: any) => (p.stock || 0) <= 5)
    .map((p: any) => ({ _id: p._id, title: p.title, image: p.images?.[0], stock: p.stock, sold: p.sold }))
    .sort((a: any, b: any) => a.stock - b.stock)
    .slice(0, 5);

  return NextResponse.json({
    metrics: {
      revenue: +revenue.toFixed(2),
      unitsSold,
      orderCount: orders.length,
      productCount: myProducts.length,
      avgOrderValue: orders.length ? +(revenue / orders.length).toFixed(2) : 0,
    },
    series: days,
    topProducts,
    lowStock,
  });
}
