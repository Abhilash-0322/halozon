import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password)
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });

    await connectDB();
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed });
    const token = await signToken({ userId: String(user._id), email: user.email });
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    console.error('register error', e);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
