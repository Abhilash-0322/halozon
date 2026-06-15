import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length < 2 || ids.length > 4)
      return NextResponse.json({ error: 'Provide 2-4 product IDs' }, { status: 400 });
    await connectDB();
    const products = await Product.find({ _id: { $in: ids } })
      .select('-reviews -description -createdAt -updatedAt -__v')
      .lean();
    return NextResponse.json({ items: JSON.parse(JSON.stringify(products)) });
  } catch (e) {
    console.error('compare error', e);
    return NextResponse.json({ error: 'Compare failed' }, { status: 500 });
  }
}
