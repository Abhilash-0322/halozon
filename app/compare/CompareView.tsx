'use client';
import Link from 'next/link';
import { X, ArrowLeft, Star, Check, Minus } from 'lucide-react';
import { formatPrice, calcDiscount, starArray } from '@/lib/utils';
import { useCompare } from '@/hooks/useCompare';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

type P = {
  _id: string;
  title: string;
  brand?: string;
  price: number;
  listPrice?: number;
  images?: string[];
  features?: string[];
  rating?: number;
  ratingCount?: number;
  stock?: number;
  isPrime?: boolean;
  freeShipping?: boolean;
  colors?: string[];
  sizes?: string[];
  seller?: string;
  categorySlug?: string;
};

const ROWS: { label: string; render: (p: P) => React.ReactNode }[] = [
  { label: 'Image', render: (p) => p.images?.[0] ? <img src={p.images[0]} alt={p.title} className="max-h-32 mx-auto object-contain" /> : <Minus className="w-5 h-5 mx-auto text-amazon-textMuted" /> },
  { label: 'Title', render: (p) => <Link href={`/product/${p._id}`} className="text-amazon-link hover:underline text-sm line-clamp-3">{p.title}</Link> },
  { label: 'Brand', render: (p) => p.brand || <Minus className="w-4 h-4 text-amazon-textMuted" /> },
  { label: 'Price', render: (p) => <span className="text-xl font-bold text-amazon-red">{formatPrice(p.price)}</span> },
  { label: 'List Price', render: (p) => p.listPrice && p.listPrice > p.price ? <span className="line-through text-amazon-textMuted text-sm">{formatPrice(p.listPrice)}</span> : <Minus className="w-4 h-4 text-amazon-textMuted" /> },
  { label: 'You Save', render: (p) => {
      const d = calcDiscount(p.price, p.listPrice);
      return d > 0 ? <span className="text-amazon-deal font-bold">{d}% ({formatPrice((p.listPrice || 0) - p.price)})</span> : <Minus className="w-4 h-4 text-amazon-textMuted" />;
    }
  },
  { label: 'Rating', render: (p) => p.rating ? (
    <div className="flex items-center gap-1 justify-center">
      <Star className="w-4 h-4 text-amazon-star fill-amazon-star" />
      <span className="text-sm">{Number(p.rating).toFixed(1)}</span>
      <span className="text-xs text-amazon-textMuted">({p.ratingCount || 0})</span>
    </div>
  ) : <Minus className="w-4 h-4 text-amazon-textMuted" /> },
  { label: 'Prime', render: (p) => p.isPrime ? <Check className="w-5 h-5 text-amazon-prime mx-auto" /> : <Minus className="w-4 h-4 text-amazon-textMuted" /> },
  { label: 'Free Shipping', render: (p) => p.freeShipping !== false ? <Check className="w-5 h-5 text-amazon-greenDark mx-auto" /> : <Minus className="w-4 h-4 text-amazon-textMuted" /> },
  { label: 'Stock', render: (p) => p.stock && p.stock > 0 ? <span className="text-amazon-greenDark text-sm font-medium">In Stock ({p.stock})</span> : <span className="text-amazon-deal text-sm">Out of stock</span> },
  { label: 'Colors', render: (p) => p.colors && p.colors.length ? <span className="text-sm">{p.colors.length} option{p.colors.length !== 1 ? 's' : ''}</span> : <Minus className="w-4 h-4 text-amazon-textMuted" /> },
  { label: 'Sizes', render: (p) => p.sizes && p.sizes.length ? <span className="text-sm">{p.sizes.length} option{p.sizes.length !== 1 ? 's' : ''}</span> : <Minus className="w-4 h-4 text-amazon-textMuted" /> },
  { label: 'Seller', render: (p) => <span className="text-sm">{p.seller || 'halozon.com'}</span> },
  { label: 'Category', render: (p) => p.categorySlug ? <span className="capitalize text-sm">{p.categorySlug.replace(/-/g, ' ')}</span> : <Minus className="w-4 h-4 text-amazon-textMuted" /> },
];

export default function CompareView({ products, requestedIds }: { products: P[]; requestedIds: string[] }) {
  const { remove, clear } = useCompare();
  const { add } = useCart();

  if (products.length < 2) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Compare products</h1>
        <p className="text-amazon-textMuted mb-4">
          Select 2-4 products to compare side by side.
        </p>
        <Link href="/" className="amazon-btn-primary inline-block">Browse products</Link>
      </div>
    );
  }

  async function addToCart(id: string) {
    const ok = await add(id, 1);
    if (ok) toast.success('Added to cart');
    else toast.error('Sign in to add');
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      <div className="mb-4">
        <Link href="/" className="text-sm text-amazon-link hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Continue shopping
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Compare products ({products.length})</h1>

      <div className="border border-amazon-border rounded-md overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr className="bg-amazon-bg">
              <th className="p-3 text-left text-xs font-medium text-amazon-textMuted w-32 sticky left-0 bg-amazon-bg z-10">Feature</th>
              {products.map((p) => (
                <th key={p._id} className="p-3 min-w-[220px] relative">
                  <button
                    onClick={() => remove(p._id)}
                    className="absolute top-1 right-1 text-amazon-textMuted hover:text-amazon-deal"
                    aria-label="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-t border-amazon-border">
                <td className="p-3 text-left text-sm font-medium text-amazon-textMuted bg-amazon-bg/50 sticky left-0 z-10">
                  {row.label}
                </td>
                {products.map((p) => (
                  <td key={p._id} className="p-3 align-middle">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-amazon-border bg-amazon-bg/30">
              <td className="p-3 sticky left-0 bg-amazon-bg/30" />
              {products.map((p) => (
                <td key={p._id} className="p-3">
                  <button onClick={() => addToCart(p._id)} className="amazon-btn-yellow !text-xs">
                    Add to cart
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center">
        <button onClick={clear} className="text-sm text-amazon-link hover:underline">
          Clear comparison
        </button>
      </div>
    </div>
  );
}
