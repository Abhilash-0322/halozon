import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { hashToken } from '@/lib/tokens';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password)
      return NextResponse.json({ error: 'Token and password required' }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });

    await connectDB();
    const user = await User.findOne({
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });

    user.password = await hashPassword(password);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('reset-password error', e);
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
