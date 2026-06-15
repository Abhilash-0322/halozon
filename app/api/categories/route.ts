import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  await connectDB();
  const cats = await Category.find().sort({ order: 1 }).lean();
  return NextResponse.json({ items: cats });
}
