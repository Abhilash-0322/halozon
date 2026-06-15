'use client';
import Link from 'next/link';
import { ChevronUp, Globe } from 'lucide-react';

type Item = { label: string; href: string };

const COLS: { title: string; items: Item[] }[] = [
  {
    title: 'Get to Know Us',
    items: [
      { label: 'Careers', href: '/info/careers' },
      { label: 'Blog', href: '/info/blog' },
      { label: 'About halozon', href: '/info/about' },
      { label: 'Sustainability', href: '/info/sustainability' },
      { label: 'Press Center', href: '/info/press' },
      { label: 'Investor Relations', href: '/info/investor-relations' },
      { label: 'halozon Devices', href: '/info/devices' },
      { label: 'halozon Science', href: '/info/science' },
    ],
  },
  {
    title: 'Make Money with Us',
    items: [
      { label: 'Sell on halozon', href: '/seller/apply' },
      { label: 'Sell apps on halozon', href: '/info/sell-apps' },
      { label: 'Become an Affiliate', href: '/info/affiliate' },
      { label: 'Advertise Your Products', href: '/info/advertise' },
      { label: 'Self-Publish with Us', href: '/info/publish' },
      { label: 'Host a halozon Hub', href: '/info/hub' },
      { label: '› See More Ways to Make Money', href: '/info/make-money' },
    ],
  },
  {
    title: 'Payment Products',
    items: [
      { label: 'halozon Business Card', href: '/info/business-card' },
      { label: 'Shop with Points', href: '/info/shop-points' },
      { label: 'Reload Your Balance', href: '/info/reload-balance' },
      { label: 'Currency Converter', href: '/currency-converter' },
    ],
  },
  {
    title: 'Let Us Help You',
    items: [
      { label: 'Your Account', href: '/account' },
      { label: 'Your Orders', href: '/account/orders' },
      { label: 'Shipping Rates & Policies', href: '/info/shipping-policies' },
      { label: 'Returns', href: '/account/returns' },
      { label: 'Manage Subscriptions', href: '/account/subscriptions' },
      { label: 'Help', href: '/help' },
      { label: 'Accessibility', href: '/info/accessibility' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-12">
      {/* Back to top */}
      <button
        onClick={() => typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-amazon-navylight hover:bg-amazon-navy text-white text-sm py-3 transition-colors flex items-center justify-center gap-1"
        aria-label="Back to top"
      >
        <ChevronUp className="w-4 h-4" /> Back to top
      </button>

      {/* Main 4-col */}
      <div className="bg-amazon-navy text-white text-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="font-bold mb-3 text-white">{col.title}</h3>
              <ul className="space-y-1.5 text-white/80">
                {col.items.map((it) => (
                  <li key={it.href + it.label}>
                    <Link
                      href={it.href}
                      className="hover:underline text-white/80 hover:text-white transition-colors"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Logo divider */}
        <div className="border-t border-white/10 py-6 flex flex-col items-center gap-4">
          <Link href="/" className="flex items-end" aria-label="halozon home">
            <span className="text-2xl font-extrabold leading-none">halo</span>
            <span className="text-2xl font-extrabold leading-none text-amazon-orange">zon</span>
            <span className="text-amazon-orange text-xs ml-0.5 leading-none translate-y-[-2px]">.com</span>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <button className="border border-white/40 rounded px-3 py-1.5 hover:border-white flex items-center gap-1">
              <Globe className="w-3 h-3" /> English
            </button>
            <button className="border border-white/40 rounded px-3 py-1.5 hover:border-white">$ USD - U.S. Dollar</button>
            <button className="border border-white/40 rounded px-3 py-1.5 hover:border-white">🇺🇸 United States</button>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-amazon-navy/95 text-white/70 text-xs">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-3">
            <li><Link href="/conditions" className="hover:underline">Conditions of Use</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy Notice</Link></li>
            <li><Link href="/interest-based-ads" className="hover:underline">Interest-Based Ads</Link></li>
            <li><Link href="/help" className="hover:underline">Help</Link></li>
          </ul>
          <div>© 1996-2026, halozon.com, Inc. or its affiliates. Built with care for a beautiful shopping experience.</div>
        </div>
      </div>
    </footer>
  );
}
