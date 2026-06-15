'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Heart, ChevronRight, Plus, Minus, Truck, Shield, RotateCcw, MapPin } from 'lucide-react';
import { formatPrice, calcDiscount, starArray } from '@/lib/utils';
import StarRating from '@/components/StarRating';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import toast from 'react-hot-toast';

type P = {
  _id: string;
  title: string;
  brand?: string;
  categorySlug?: string;
  description?: string;
  features?: string[];
  price: number;
  listPrice?: number;
  images?: string[];
  rating?: number;
  ratingCount?: number;
  reviews?: any[];
  isPrime?: boolean;
  isDeal?: boolean;
  dealEndsAt?: string;
  colors?: string[];
  sizes?: string[];
  seller?: string;
  stock?: number;
  freeShipping?: boolean;
  fastShipping?: boolean;
};

export default function ProductDetail({ product, related }: { product: P; related: any[] }) {
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState<string | null>(product.colors?.[0] || null);
  const [size, setSize] = useState<string | null>(product.sizes?.[0] || null);
  const [tab, setTab] = useState<'description' | 'reviews'>('description');
  const { add } = useCart();
  const { has, toggle } = useWishlist();

  const discount = calcDiscount(product.price, product.listPrice);
  const stars = starArray(product.rating || 0);
  const wished = has(product._id);

  async function handleAdd() {
    const ok = await add(product._id, qty);
    if (ok) toast.success(`Added ${qty} to cart`);
    else toast.error('Please sign in');
  }

  async function handleBuyNow() {
    const ok = await add(product._id, qty);
    if (ok) window.location.href = '/checkout';
    else toast.error('Please sign in');
  }

  async function handleWish() {
    const ok = await toggle(product._id);
    if (!ok) toast('Please sign in to use wish list');
    else toast.success(wished ? 'Removed from wish list' : 'Added to wish list');
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4">
      <div className="text-xs text-amazon-textMuted mb-3">
        <Link href="/" className="amazon-link">Home</Link>
        <ChevronRight className="w-3 h-3 inline mx-1" />
        {product.categorySlug ? (
          <Link href={`/category/${product.categorySlug}`} className="amazon-link capitalize">
            {product.categorySlug.replace(/-/g, ' ')}
          </Link>
        ) : null}
        <ChevronRight className="w-3 h-3 inline mx-1" />
        <span className="line-clamp-1 inline max-w-[300px] align-middle">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_280px] gap-6">
        {/* Image gallery */}
        <div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2">
              {(product.images || []).slice(0, 7).map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-12 h-12 border-2 rounded-md overflow-hidden flex items-center justify-center bg-white ${
                    active === i ? 'border-amazon-orange' : 'border-amazon-border hover:border-amazon-orange'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`thumb-${i}`} className="max-w-full max-h-full object-contain" />
                </button>
              ))}
            </div>
            <div className="flex-1 aspect-square bg-white border border-amazon-border rounded-md flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images?.[active]}
                alt={product.title}
                className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-110"
              />
            </div>
          </div>
        </div>

        {/* Center info */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-medium leading-tight">{product.title}</h1>
          <Link href="#reviews" className="text-sm amazon-link">
            Visit the {product.brand || 'halozon'} Store
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <span className="text-base font-medium">{Number(product.rating || 0).toFixed(1)}</span>
            <StarRating rating={product.rating || 0} count={product.ratingCount} />
          </div>
          <div className="border-t border-b border-amazon-border py-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              {discount > 0 && (
                <span className="bg-amazon-deal text-white text-xs font-bold px-2 py-0.5 rounded">
                  -{discount}%
                </span>
              )}
              <sup className="text-sm">$</sup>
              <span className="text-3xl font-medium text-amazon-red">
                {Math.floor(product.price)}
              </span>
              <sup className="text-sm">{((product.price % 1) * 100).toFixed(0).padStart(2, '0')}</sup>
              {product.listPrice && product.listPrice > product.price && (
                <span className="price-strike">List: {formatPrice(product.listPrice)}</span>
              )}
            </div>
            {discount > 0 && (
              <div className="text-sm text-amazon-textMuted mt-1">
                FREE Returns · Apply 5% coupon · Save{' '}
                <span className="text-amazon-deal font-medium">
                  {formatPrice((product.listPrice || 0) - product.price)}
                </span>{' '}
                ({discount}%)
              </div>
            )}
          </div>

          {product.isPrime && (
            <div className="border-b border-amazon-border pb-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-amazon-prime">prime</span>
                <span className="text-amazon-text">FREE delivery <b>Tomorrow</b></span>
              </div>
              <div className="text-xs text-amazon-textMuted mt-1">
                Order within <span className="text-amazon-greenDark font-medium">3 hrs 27 mins</span>.
              </div>
            </div>
          )}

          {/* Color */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="text-sm">
                <span className="text-amazon-textMuted">Color:</span> <b>{color}</b>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`text-xs border rounded-md px-3 py-1.5 ${
                      color === c ? 'border-amazon-orange bg-amazon-orange/10' : 'border-amazon-border hover:border-amazon-orange'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="text-sm">
                <span className="text-amazon-textMuted">Size:</span> <b>{size}</b>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`text-xs border rounded-md px-3 py-1.5 ${
                      size === s ? 'border-amazon-orange bg-amazon-orange/10' : 'border-amazon-border hover:border-amazon-orange'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          {product.features && product.features.length > 0 && (
            <div className="pt-2">
              <h3 className="font-bold mb-2">About this item</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-amazon-text">
                {product.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Buy box */}
        <div className="lg:sticky lg:top-32 self-start">
          <div className="panel p-4 space-y-3">
            <div className="text-2xl font-medium">
              {formatPrice(product.price)}
              <div className="text-sm text-amazon-link">FREE Returns</div>
            </div>
            <div className="text-sm">
              <div>
                <b>FREE delivery</b> <span className="text-amazon-textMuted">Tomorrow</span>
              </div>
              <div className="text-xs text-amazon-textMuted">
                Order within 3 hrs 27 mins.
              </div>
            </div>
            <div className="text-sm">
              <MapPin className="w-4 h-4 inline mr-1 text-amazon-link" />
              <span className="amazon-link">Deliver to United States</span>
            </div>
            <div className="text-lg font-bold">
              {product.stock && product.stock > 0 ? 'In Stock' : 'Currently unavailable'}
            </div>

            <div>
              <div className="text-sm mb-1">Quantity:</div>
              <div className="inline-flex items-center border border-amazon-borderDark rounded-md">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-2 py-1 hover:bg-amazon-bg">
                  <Minus className="w-3 h-3" />
                </button>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="px-2 py-1 border-0 bg-transparent text-sm"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <button onClick={() => setQty((q) => q + 1)} className="px-2 py-1 hover:bg-amazon-bg">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button onClick={handleAdd} className="amazon-btn-yellow w-full !text-sm !py-2">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="amazon-btn-orange w-full !text-sm !py-2">
              Buy Now
            </button>
            <button
              onClick={handleWish}
              className="w-full text-xs text-amazon-link hover:text-amazon-linkHover flex items-center justify-center gap-1"
            >
              <Heart className={`w-4 h-4 ${wished ? 'fill-amazon-deal text-amazon-deal' : ''}`} />
              {wished ? 'Already in your Wish List' : 'Add to Wish List'}
            </button>
          </div>

          <div className="panel p-3 mt-3 text-xs text-amazon-textMuted space-y-1.5">
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-amazon-link shrink-0" />
              <span>FREE delivery on eligible orders</span>
            </div>
            <div className="flex items-start gap-2">
              <RotateCcw className="w-4 h-4 text-amazon-link shrink-0" />
              <span>30-day easy returns</span>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-amazon-link shrink-0" />
              <span>Secure transaction</span>
            </div>
            <div className="pt-2 border-t border-amazon-border">
              <span>Ships from and sold by </span>
              <span className="amazon-link">{product.seller || 'halozon.com'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div id="reviews" className="panel mt-6">
        <div className="flex border-b border-amazon-border">
          {(['description', 'reviews'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                tab === t ? 'border-amazon-orange text-amazon-linkHover' : 'border-transparent text-amazon-text'
              }`}
            >
              {t === 'description' ? 'Description' : `Reviews (${product.reviews?.length || product.ratingCount || 0})`}
            </button>
          ))}
        </div>
        <div className="p-5">
          {tab === 'description' && (
            <div className="prose max-w-none text-sm">
              {product.description || 'No description available.'}
            </div>
          )}
          {tab === 'reviews' && (
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
              <div>
                <h3 className="text-xl font-bold">Customer reviews</h3>
                <div className="flex items-center gap-2 my-2">
                  <StarRating rating={product.rating || 0} count={product.ratingCount} />
                </div>
                <hr className="my-3" />
                <h4 className="font-bold mb-2">Review this product</h4>
                <p className="text-xs text-amazon-textMuted mb-3">
                  Share your thoughts with other customers
                </p>
                <Link href="/signin" className="amazon-btn-dark w-fit inline-block">Write a customer review</Link>
                <hr className="my-4" />
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <button key={n} className="flex items-center gap-2 text-xs w-full">
                      <span className="text-amazon-link font-bold">{n} star</span>
                      <div className="flex-1 h-2 bg-amazon-bg rounded">
                        <div
                          className="h-full bg-amazon-star rounded"
                          style={{ width: `${n === Math.round(product.rating || 0) ? '60%' : `${Math.max(5, 70 - n * 12)}%`}` }}
                        />
                      </div>
                      <span className="text-amazon-textMuted">{n === Math.round(product.rating || 0) ? Math.floor((product.ratingCount || 0) * 0.7) : Math.floor((product.ratingCount || 0) * 0.05)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {(product.reviews || []).slice(0, 10).map((r, i) => (
                  <div key={i} className="border-b border-amazon-border pb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold">{r.userName || 'Customer'}</span>
                      <StarRating rating={r.rating} showCount={false} size="sm" />
                    </div>
                    <div className="text-sm font-bold mt-1">{r.title}</div>
                    <div className="text-xs text-amazon-textMuted">
                      Reviewed in the United States on {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                    <p className="text-sm mt-2">{r.body}</p>
                    <div className="text-xs text-amazon-link mt-2">{r.helpful || 0} people found this helpful</div>
                  </div>
                ))}
                {(!product.reviews || product.reviews.length === 0) && (
                  <div className="text-sm text-amazon-textMuted">No reviews yet.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-3">Customers who viewed this also viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {related.slice(0, 8).map((p) => (
              <ProductCard key={p._id} product={p} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
