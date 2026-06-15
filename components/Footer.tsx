'use client';
import Link from 'next/link';

const COLS = [
  {
    title: 'Get to Know Us',
    items: ['Careers', 'Blog', 'About halozon', 'Sustainability', 'Press Center', 'Investor Relations', 'halozon Devices', 'halozon Science'],
  },
  {
    title: 'Make Money with Us',
    items: ['Sell on halozon', 'Sell apps on halozon', 'Become an Affiliate', 'Advertise Your Products', 'Self-Publish with Us', 'Host a halozon Hub', '› See More Ways to Make Money'],
  },
  {
    title: 'Payment Products',
    items: ['halozon Business Card', 'Shop with Points', 'Reload Your Balance', 'Currency Converter'],
  },
  {
    title: 'Let Us Help You',
    items: ['Your Account', 'Your Orders', 'Shipping Rates & Policies', 'Returns', 'Manage Subscriptions', 'Help', 'Accessibility'],
  },
];

export default function Footer() {
  return (
    <footer className="mt-12">
      {/* Back to top */}
      <button
        onClick={() => typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-amazon-navylight hover:bg-amazon-navy text-white text-sm py-3 transition-colors"
      >
        Back to top
      </button>

      {/* Main 4-col */}
      <div className="bg-amazon-navy text-white text-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="font-bold mb-3 text-white">{col.title}</h3>
              <ul className="space-y-1.5 text-white/80">
                {col.items.map((it) => (
                  <li key={it}>
                    <a className="hover:underline cursor-pointer text-white/80 hover:text-white transition-colors">{it}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Logo divider */}
        <div className="border-t border-white/10 py-6 flex flex-col items-center gap-4">
          <div className="flex items-end">
            <span className="text-2xl font-extrabold leading-none">halo</span>
            <span className="text-2xl font-extrabold leading-none text-amazon-orange">zon</span>
            <span className="text-amazon-orange text-xs ml-0.5 leading-none translate-y-[-2px]">.com</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <button className="border border-white/40 rounded px-3 py-1.5 hover:border-white">🌐 English</button>
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
