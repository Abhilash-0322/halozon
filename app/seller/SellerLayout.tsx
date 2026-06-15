'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Store, ArrowLeft } from 'lucide-react';

const TABS = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/seller/products', label: 'Products', icon: Package },
  { href: '/seller/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/seller/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/seller/store', label: 'Store Profile', icon: Store },
];

export default function SellerLayout({ user, children }: { user: any; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-amazon-bg">
      {/* Sub-header */}
      <div className="bg-amazon-navy text-white">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1 text-white/80 hover:text-white text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to store
            </Link>
            <div className="text-sm">
              <span className="font-bold">halozon Seller Central</span>
              <span className="ml-3 text-white/60">{user.sellerProfile?.storeName || user.name}</span>
            </div>
          </div>
          <Link href="/seller/store" className="text-sm text-white/80 hover:text-white">
            View public store
          </Link>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <aside className="space-y-1 bg-white border border-amazon-border rounded-md p-3 self-start">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
                  active ? 'bg-amazon-orange/10 text-amazon-linkHover font-bold' : 'text-amazon-text hover:bg-amazon-bg'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </Link>
            );
          })}
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
