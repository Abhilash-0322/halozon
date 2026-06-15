import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Question from '@/models/Question';
import { getCurrentUser } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const items = await Question.find({ productId: params.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  const { body } = await req.json();
  if (!body || body.trim().length < 5)
    return NextResponse.json({ error: 'Question too short' }, { status: 400 });

  await connectDB();
  const q = await Question.create({
    productId: params.id,
    userId: user.id,
    userName: user.name,
    body: body.trim(),
  });
  return NextResponse.json({ question: q });
}
