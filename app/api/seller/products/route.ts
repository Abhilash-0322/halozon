import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireSeller } from '@/lib/auth';

export async function GET() {
  const auth = await requireSeller();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  await connectDB();
  const items = await Product.find({ sellerId: auth.user.id })
    .sort({ createdAt: -1 })
    .select('-reviews -description')
    .lean();
  return NextResponse.json({ items: JSON.parse(JSON.stringify(items)) });
}

export async function POST(req: NextRequest) {
  const auth = await requireSeller();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const {
    title, description, features, price, listPrice, brand, categorySlug,
    subCategory, images, stock, isPrime, freeShipping, colors, sizes, tags,
  } = body;

  if (!title || price == null)
    return NextResponse.json({ error: 'Title and price required' }, { status: 400 });
  if (!Array.isArray(images) || images.length === 0)
    return NextResponse.json({ error: 'At least one image required' }, { status: 400 });

  await connectDB();
  const slug =
    String(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') +
    '-' +
    Math.random().toString(36).slice(2, 6);

  const product = await Product.create({
    title,
    slug,
    description: description || '',
    features: features || [],
    price: Number(price),
    listPrice: listPrice ? Number(listPrice) : 0,
    brand: brand || (auth.user.sellerProfile as any)?.storeName || 'Unknown',
    categorySlug: categorySlug || 'misc',
    subCategory: subCategory || '',
    images,
    stock: stock != null ? Number(stock) : 10,
    isPrime: !!isPrime,
    freeShipping: freeShipping !== false,
    seller: (auth.user.sellerProfile as any)?.storeName || auth.user.name,
    sellerId: auth.user.id,
    sellerName: (auth.user.sellerProfile as any)?.storeName || auth.user.name,
    sellerSlug: (auth.user.sellerProfile as any)?.slug,
    colors: colors || [],
    sizes: sizes || [],
    tags: tags || [],
    currency: 'USD',
  });
  return NextResponse.json({ product: JSON.parse(JSON.stringify(product)) });
}
