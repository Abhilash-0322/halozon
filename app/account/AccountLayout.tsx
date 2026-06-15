'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/account', label: 'Your Account' },
  { href: '/account/orders', label: 'Your Orders' },
  { href: '/account/security', label: 'Login & Security' },
  { href: '/account/addresses', label: 'Your Addresses' },
  { href: '/account/payment', label: 'Payment Options' },
  { href: '/account/wishlist', label: 'Wish List' },
  { href: '/prime', label: 'Prime' },
];

export default function AccountLayout({ user, children }: { user: { name: string; email: string }; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      <aside className="space-y-2">
        <div className="bg-white border border-amazon-border rounded-md p-4">
          <div className="font-bold text-lg mb-1">Hello, {user.name}</div>
          <nav className="mt-2 space-y-1">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`block px-2 py-1.5 rounded text-sm ${
                  pathname === t.href ? 'bg-amazon-orange/10 text-amazon-linkHover font-medium' : 'text-amazon-link hover:bg-amazon-bg'
                }`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <div>{children}</div>
    </div>
  );
}
