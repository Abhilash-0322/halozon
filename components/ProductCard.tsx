'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { formatPrice, calcDiscount, starArray } from '@/lib/utils';
import { useWishlist } from '@/hooks/useWishlist';
import toast from 'react-hot-toast';

type P = {
  _id: string;
  title: string;
  slug?: string;
  brand?: string;
  images?: string[];
  price: number;
  listPrice?: number;
  rating?: number;
  ratingCount?: number;
  isPrime?: boolean;
  isDeal?: boolean;
};

export default function ProductCard({ product, compact }: { product: P; compact?: boolean }) {
  const discount = calcDiscount(product.price, product.listPrice);
  const { has, toggle } = useWishlist();
  const wished = has(product._id);

  function handleWish(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product._id).then((ok) => {
      if (!ok) toast('Please sign in to use your wishlist');
      else toast.success(wished ? 'Removed from wish list' : 'Added to wish list');
    });
  }

  const stars = starArray(product.rating || 0);
  return (
    <Link
      href={`/product/${product._id}`}
      className="amazon-card amazon-card-hover p-3 group flex flex-col h-full"
    >
      <div className="relative aspect-square mb-2 bg-white overflow-hidden flex items-center justify-center">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.title}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="shimmer-bg w-full h-full" />
        )}
        {discount > 0 && (
          <span className="absolute top-0 left-0 bg-amazon-deal text-white text-xs font-bold px-2 py-1">
            -{discount}%
          </span>
        )}
        {product.isDeal && discount === 0 && (
          <span className="absolute top-0 left-0 bg-amazon-deal text-white text-xs font-bold px-2 py-1">
            DEAL
          </span>
        )}
        <button
          onClick={handleWish}
          aria-label="Add to wish list"
          className={`absolute top-1.5 right-1.5 p-1.5 rounded-full bg-white/95 shadow transition-all ${
            wished ? 'text-amazon-deal scale-110' : 'text-amazon-textMuted hover:text-amazon-deal'
          }`}
        >
          <Heart className={`w-4 h-4 ${wished ? 'fill-amazon-deal' : ''}`} />
        </button>
      </div>
      <div className="flex-1 flex flex-col">
        {!compact && product.rating ? (
          <div className="flex items-center gap-1 mb-0.5">
            <div className="flex">
              {stars.map((s, i) => (
                <span key={i} className="text-amazon-star text-sm leading-none">
                  {s === 'full' ? '★' : s === 'half' ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-amazon-link text-xs">{(product.ratingCount || 0).toLocaleString()}</span>
          </div>
        ) : null}
        <div className="text-sm text-amazon-text line-clamp-3 mb-1 group-hover:text-amazon-linkHover transition-colors">
          {product.title}
        </div>
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xl font-medium text-amazon-text">
              {formatPrice(product.price)}
            </span>
            {product.listPrice && product.listPrice > product.price && (
              <span className="price-strike">{formatPrice(product.listPrice)}</span>
            )}
          </div>
          {product.isPrime && (
            <div className="text-xs text-amazon-link font-semibold mt-0.5">prime</div>
          )}
          {discount > 0 && (
            <div className="text-xs text-amazon-deal font-medium mt-0.5">
              Save {formatPrice((product.listPrice || 0) - product.price)} ({discount}%)
            </div>
          )}
          {!compact && <div className="chip mt-2 w-fit">FREE delivery</div>}
        </div>
      </div>
    </Link>
  );
}
