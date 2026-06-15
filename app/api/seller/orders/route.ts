import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { requireSeller } from '@/lib/auth';

export async function GET() {
  const auth = await requireSeller();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  await connectDB();
  const myProducts = await Product.find({ sellerId: auth.user.id }).select('_id').lean();
  const myProductIds = myProducts.map((p: any) => p._id);

  const orders = await Order.find({ 'items.productId': { $in: myProductIds } })
    .sort({ createdAt: -1 })
    .lean();

  // Annotate items so the UI can show only the seller's items + a per-seller total
  const annotated = orders.map((o: any) => {
    const myItems = o.items.filter((it: any) =>
      myProductIds.some((pid) => String(pid) === String(it.productId))
    );
    const myTotal = myItems.reduce((s: number, it: any) => s + it.price * it.qty, 0);
    return { ...o, myItems, myTotal };
  });

  return NextResponse.json({ items: JSON.parse(JSON.stringify(annotated)) });
}
