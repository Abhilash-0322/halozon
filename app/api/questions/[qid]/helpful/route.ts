import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Question from '@/models/Question';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { qid: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  await connectDB();
  const q = await Question.findById(params.qid);
  if (!q) return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  q.helpful += 1;
  await q.save();
  return NextResponse.json({ ok: true, helpful: q.helpful });
}
