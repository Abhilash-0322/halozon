'use client';
import Link from 'next/link';
import { Heart, GitCompare } from 'lucide-react';
import { formatPrice, calcDiscount, starArray } from '@/lib/utils';
import { useWishlist } from '@/hooks/useWishlist';
import { useCompare } from '@/hooks/useCompare';
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
  stock?: number;
  lowStockThreshold?: number;
};

export default function ProductCard({ product, compact }: { product: P; compact?: boolean }) {
  const discount = calcDiscount(product.price, product.listPrice);
  const { has: wished, toggle } = useWishlist();
  const { has: compared, toggle: toggleCompare } = useCompare();
  const isWished = wished(product._id);
  const isCompared = compared(product._id);
  const isLowStock = (product.stock ?? 100) <= (product.lowStockThreshold ?? 5);

  function handleWish(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product._id).then((ok) => {
      if (!ok) toast('Please sign in to use your wishlist');
      else toast.success(isWished ? 'Removed from wish list' : 'Added to wish list');
    });
  }
  function handleCompare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product._id);
  }

  const stars = starArray(product.rating || 0);
  return (
    <Link
      href={`/product/${product._id}`}
      className="amazon-card amazon-card-hover p-3 group flex flex-col h-full relative"
    >
      {!compact && (
        <label
          className={`absolute top-1.5 left-1.5 z-10 flex items-center gap-1 text-[10px] bg-white/95 border rounded px-1.5 py-0.5 cursor-pointer transition-all ${
            isCompared ? 'border-amazon-orange text-amazon-orange font-medium' : 'border-amazon-border text-amazon-textMuted hover:border-amazon-orange'
          }`}
          onClick={handleCompare}
        >
          <input
            type="checkbox"
            checked={isCompared}
            onChange={() => {}}
            className="w-3 h-3 cursor-pointer"
          />
          Compare
        </label>
      )}
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
            isWished ? 'text-amazon-deal scale-110' : 'text-amazon-textMuted hover:text-amazon-deal'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-amazon-deal' : ''}`} />
        </button>
        {isLowStock && (
          <span className="absolute bottom-1 left-1 bg-amazon-deal/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            Only {product.stock} left
          </span>
        )}
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
