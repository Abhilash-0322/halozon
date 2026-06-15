import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string; rid: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  await connectDB();
  const product = await Product.findById(params.id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const review = product.reviews.id(params.rid);
  if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

  // Prevent double-voting
  const userId = user.id as unknown as { toString(): string };
  const already = (review.helpfulVoters || []).some(
    (v: { toString(): string }) => v.toString() === userId.toString()
  );
  if (already) {
    return NextResponse.json({ helpful: review.helpful, alreadyVoted: true });
  }
  review.helpfulVoters = [...(review.helpfulVoters || []), user.id];
  review.helpful = (review.helpful || 0) + 1;
  await product.save();
  return NextResponse.json({ helpful: review.helpful });
}
