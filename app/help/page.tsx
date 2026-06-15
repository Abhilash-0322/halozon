import Link from 'next/link';

const TOPICS = [
  { t: 'Shipping & Delivery', d: 'Track packages, shipping rates, and delivery options.' },
  { t: 'Returns & Refunds', d: 'Return eligible items and view refund status.' },
  { t: 'Manage Your Account', d: 'Update info, change password, or close account.' },
  { t: 'Payment, Pricing & Promotions', d: 'Manage payment methods, gift cards, and promo codes.' },
  { t: 'halozon Prime', d: 'Manage your membership and benefits.' },
  { t: 'halozon Devices', d: 'Get help with Echo, Fire TV, Ring, and more.' },
  { t: 'Security & Privacy', d: 'Report fraud, manage your data, and account security.' },
  { t: 'Accessibility', d: 'Resources for customers with disabilities.' },
];

export default function HelpPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="text-xs text-amazon-textMuted mb-3">
        <Link href="/" className="amazon-link">Home</Link>
        <span className="mx-1">›</span>
        <span>Customer Service</span>
      </div>
      <div className="bg-white border border-amazon-border rounded-md p-6 mb-4">
        <h1 className="text-3xl font-bold mb-2">Hello. How can we help you?</h1>
        <input
          placeholder="Search help topics"
          className="amazon-input max-w-md"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {TOPICS.map((t) => (
          <div key={t.t} className="panel p-4 hover:shadow-cardHover transition-all">
            <h3 className="font-bold mb-1 amazon-link">{t.t}</h3>
            <p className="text-sm text-amazon-textMuted">{t.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
