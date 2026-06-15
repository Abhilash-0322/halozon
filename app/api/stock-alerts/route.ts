import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StockAlert from '@/models/StockAlert';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, productId } = await req.json();
    if (!email || !productId)
      return NextResponse.json({ error: 'Email and product required' }, { status: 400 });

    await connectDB();
    const user = await getCurrentUser();
    const existing = await StockAlert.findOne({ email: email.toLowerCase(), productId });
    if (existing) return NextResponse.json({ ok: true, alert: existing });

    const alert = await StockAlert.create({
      email: email.toLowerCase(),
      productId,
      userId: user?.id,
    });
    return NextResponse.json({ ok: true, alert });
  } catch (e: any) {
    if (e?.code === 11000) return NextResponse.json({ ok: true, duplicate: true });
    console.error('stock-alert error', e);
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
