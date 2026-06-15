'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';

type User = { id: string; name: string; email: string; role: string } | null;

const CATS = [
  'Electronics', 'Computers', 'Smart Home', 'Arts & Crafts',
  'See all', 'Books', 'Movies', 'Music', 'Games', 'Home & Kitchen', 'Fashion',
];

export default function Header({ user }: { user: User }) {
  const router = useRouter();
  const sp = useSearchParams();
  const initialQ = sp.get('q') || '';
  const [q, setQ] = useState(initialQ);
  const [showCat, setShowCat] = useState(false);
  const [showAcc, setShowAcc] = useState(false);
  const [cats, setCats] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((d) => {
      setCats((d.items || []).map((c: { name: string }) => c.name));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    router.push(`/search?${params.toString()}`);
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Top nav */}
      <nav className="bg-amazon-navy text-white text-sm">
        <div className="px-2 py-1.5 flex items-center gap-1">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-end border border-transparent hover:border-white px-2 py-1.5 transition-all"
          >
            <span className="text-2xl font-extrabold tracking-tight leading-none text-white">
              halo
            </span>
            <span className="text-2xl font-extrabold tracking-tight leading-none text-amazon-orange">
              zon
            </span>
            <span className="text-amazon-orange text-xs ml-0.5 leading-none translate-y-[-2px]">.com</span>
          </Link>

          {/* Deliver to */}
          <Link
            href="/account/addresses"
            className="hidden md:flex items-center gap-1 border border-transparent hover:border-white px-2 py-1.5"
          >
            <MapPin className="w-5 h-5 text-white/90" />
            <div className="leading-tight">
              <div className="text-[11px] text-white/80">Deliver to</div>
              <div className="font-bold text-sm">United States</div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={submitSearch} className="flex-1 mx-2">
            <div className="flex rounded-md overflow-hidden h-10 bg-white">
              <select
                aria-label="Search category"
                className="hidden md:block bg-amazon-bg hover:bg-amazon-border text-amazon-text text-xs px-2 border-r border-amazon-borderDark"
                defaultValue=""
              >
                <option value="">All</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
                <option value="Deals">Deals</option>
              </select>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search halozon"
                className="flex-1 px-3 text-amazon-text text-sm outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="bg-amazon-orange hover:bg-amazon-orangelight px-4 transition-colors"
              >
                <Search className="w-5 h-5 text-amazon-navy" />
              </button>
            </div>
          </form>

          {/* Account */}
          <div
            className="relative"
            onMouseEnter={() => setShowAcc(true)}
            onMouseLeave={() => setShowAcc(false)}
          >
            <button className="flex flex-col items-start border border-transparent hover:border-white px-2 py-1.5">
              <span className="text-[11px] text-white/80">
                {user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}
              </span>
              <span className="font-bold text-sm leading-tight flex items-center gap-0.5">
                Account & Lists <ChevronDown className="w-3 h-3" />
              </span>
            </button>
            {showAcc && (
              <div className="absolute right-0 top-full pt-1 w-[480px] z-50 animate-slideDown">
                <div className="bg-white text-amazon-text rounded-md shadow-2xl border border-amazon-border p-5 grid grid-cols-2 gap-5">
                  {user ? (
                    <>
                      <div className="col-span-2 flex items-center justify-between border-b border-amazon-border pb-3">
                        <div>
                          <div className="font-bold">Hello, {user.name}</div>
                          <div className="text-xs text-amazon-textMuted">{user.email}</div>
                        </div>
                        <button onClick={logout} className="amazon-btn-yellow !text-xs">
                          Sign out
                        </button>
                      </div>
                      <div>
                        <div className="font-bold mb-2">Your Account</div>
                        <ul className="space-y-1.5 text-sm">
                          <li><Link className="amazon-link" href="/account">Your Account</Link></li>
                          <li><Link className="amazon-link" href="/account/orders">Your Orders</Link></li>
                          <li><Link className="amazon-link" href="/account/wishlist">Your Wish List</Link></li>
                          <li><Link className="amazon-link" href="/account/payment">Payment options</Link></li>
                          <li><Link className="amazon-link" href="/account/addresses">Addresses</Link></li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-bold mb-2">Shop & Browse</div>
                        <ul className="space-y-1.5 text-sm">
                          <li><Link className="amazon-link" href="/deals">Today's Deals</Link></li>
                          <li><Link className="amazon-link" href="/category/electronics">Electronics</Link></li>
                          <li><Link className="amazon-link" href="/category/books">Books</Link></li>
                          <li><Link className="amazon-link" href="/help">Customer Service</Link></li>
                          <li><Link className="amazon-link" href="/prime">Prime</Link></li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-2 flex justify-center border-b border-amazon-border pb-3">
                        <Link href="/signin" className="amazon-btn-primary !text-sm">
                          Sign in to your account
                        </Link>
                      </div>
                      <div>
                        <div className="font-bold mb-2">Your Lists</div>
                        <ul className="space-y-1.5 text-sm">
                          <li><Link className="amazon-link" href="/signin">Create a List</Link></li>
                          <li><Link className="amazon-link" href="/signin">Find a List or Registry</Link></li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-bold mb-2">Your Account</div>
                        <ul className="space-y-1.5 text-sm">
                          <li><Link className="amazon-link" href="/signin">Account</Link></li>
                          <li><Link className="amazon-link" href="/signin">Orders</Link></li>
                          <li><Link className="amazon-link" href="/signin">Wish List</Link></li>
                          <li><Link className="amazon-link" href="/signin">Recommendations</Link></li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Returns */}
          <Link
            href="/account/orders"
            className="hidden md:flex flex-col items-start border border-transparent hover:border-white px-2 py-1.5"
          >
            <span className="text-[11px] text-white/80">Returns</span>
            <span className="font-bold text-sm">& Orders</span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-end border border-transparent hover:border-white px-2 py-1.5"
          >
            <div className="relative">
              <ShoppingCart className="w-8 h-8" />
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-amazon-orange font-bold text-sm">
                {count}
              </span>
            </div>
            <span className="hidden md:inline font-bold text-sm ml-1 mb-0.5">Cart</span>
          </Link>
        </div>

        {/* Sub-nav */}
        <div className={cn(
          "bg-amazon-navylight text-white text-sm transition-shadow",
          scrolled && "shadow-header"
        )}>
          <div className="px-2 py-1 flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setShowCat(true)}
              className="flex items-center gap-1 border border-transparent hover:border-white px-2 py-1.5 font-bold whitespace-nowrap"
            >
              <Menu className="w-4 h-4" /> All
            </button>
            {(cats.length ? cats : CATS).slice(0, 14).map((c) => (
              <Link
                key={c}
                href={`/category/${encodeURIComponent(c.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'))}`}
                className="border border-transparent hover:border-white px-2 py-1.5 whitespace-nowrap"
              >
                {c}
              </Link>
            ))}
            <Link
              href="/deals"
              className="border border-transparent hover:border-white px-2 py-1.5 whitespace-nowrap font-bold text-amazon-orange"
            >
              Today's Deals
            </Link>
            <Link
              href="/prime"
              className="border border-transparent hover:border-white px-2 py-1.5 whitespace-nowrap"
            >
              Prime
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar Categories */}
      {showCat && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCat(false)} />
          <aside className="relative bg-white w-[360px] max-w-[90vw] h-full overflow-y-auto animate-slideDown shadow-2xl">
            <div className="bg-amazon-navylight text-white px-5 py-4 flex items-center justify-between">
              <div className="font-bold text-xl flex items-center gap-2">
                <Menu className="w-5 h-5" /> Shop by Category
              </div>
              <button onClick={() => setShowCat(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-2">
              {(cats.length ? cats : CATS).map((c) => (
                <Link
                  key={c}
                  href={`/category/${encodeURIComponent(c.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'))}`}
                  className="block px-3 py-2.5 hover:bg-amazon-bg rounded text-sm"
                  onClick={() => setShowCat(false)}
                >
                  {c}
                </Link>
              ))}
              <div className="border-t my-2" />
              <Link href="/deals" className="block px-3 py-2.5 hover:bg-amazon-bg rounded font-bold text-amazon-deal">Today's Deals</Link>
              <Link href="/prime" className="block px-3 py-2.5 hover:bg-amazon-bg rounded">Prime</Link>
              <Link href="/help" className="block px-3 py-2.5 hover:bg-amazon-bg rounded">Customer Service</Link>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
