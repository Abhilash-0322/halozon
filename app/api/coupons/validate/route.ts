import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code)
      return NextResponse.json({ valid: false, error: 'Code required' }, { status: 400 });
    if (typeof subtotal !== 'number')
      return NextResponse.json({ valid: false, error: 'Subtotal required' }, { status: 400 });

    await connectDB();
    const c = await Coupon.findOne({ code: String(code).toUpperCase().trim() });
    if (!c || !c.active)
      return NextResponse.json({ valid: false, error: 'Invalid or expired code' });
    const now = new Date();
    if (c.startsAt && now < new Date(c.startsAt))
      return NextResponse.json({ valid: false, error: 'Not yet active' });
    if (c.expiresAt && now > new Date(c.expiresAt))
      return NextResponse.json({ valid: false, error: 'Expired' });
    if (subtotal < c.minOrder)
      return NextResponse.json({
        valid: false,
        error: `Spend at least $${c.minOrder.toFixed(2)}`,
      });
    if (c.usageLimit && c.usageCount >= c.usageLimit)
      return NextResponse.json({ valid: false, error: 'Usage limit reached' });

    let discount = 0;
    if (c.type === 'percent') {
      discount = +(subtotal * (c.amount / 100)).toFixed(2);
      if (c.maxDiscount) discount = Math.min(discount, c.maxDiscount);
    } else if (c.type === 'fixed') {
      discount = Math.min(c.amount, subtotal);
    } else if (c.type === 'freeship') {
      discount = 0; // freeship handled by shipping
    }

    return NextResponse.json({
      valid: true,
      code: c.code,
      type: c.type,
      amount: c.amount,
      discount,
      description: c.description,
    });
  } catch (e) {
    console.error('coupon error', e);
    return NextResponse.json({ valid: false, error: 'Validation failed' }, { status: 500 });
  }
}
