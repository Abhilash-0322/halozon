import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Question from '@/models/Question';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { qid: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  const { body } = await req.json();
  if (!body || body.trim().length < 2)
    return NextResponse.json({ error: 'Answer too short' }, { status: 400 });

  await connectDB();
  const q = await Question.findById(params.qid);
  if (!q) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

  q.answers.push({
    userId: user.id,
    userName: user.name,
    body: body.trim(),
  });
  q.answerCount = q.answers.length;
  await q.save();
  return NextResponse.json({ question: q });
}
