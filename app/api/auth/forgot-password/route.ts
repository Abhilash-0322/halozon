import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, hashToken, tokenExpiry } from '@/lib/tokens';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    // Always respond ok to avoid email enumeration
    if (!user) return NextResponse.json({ ok: true });
    const token = generateToken();
    user.passwordResetToken = hashToken(token);
    user.passwordResetExpires = tokenExpiry();
    await user.save();
    return NextResponse.json({ ok: true, resetToken: token }); // mocked email link
  } catch (e) {
    console.error('forgot-password error', e);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
