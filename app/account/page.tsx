import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AccountLayout from './AccountLayout';

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account');
  return (
    <AccountLayout user={user}>
      <div className="bg-white border border-amazon-border rounded-md p-6">
        <h1 className="text-3xl font-bold mb-1">Your Account</h1>
        <p className="text-sm text-amazon-textMuted mb-4">Hello, {user.name}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Your Orders" desc="Track, return, or buy things again" href="/account/orders" />
          <Card title="Your Addresses" desc="Edit addresses for orders and gifts" href="/account/addresses" />
          <Card title="Payment options" desc="Manage your cards and saved methods" href="/account/payment" />
          <Card title="Your Wish List" desc="Save items you love for later" href="/account/wishlist" />
          <Card title="Login & security" desc="Edit login, name, and mobile number" href="/account/security" />
          <Card title="Prime" desc="View your benefits and membership" href="/prime" />
          {(user as any).role === 'seller' && (
            <Card title="Seller Central" desc="Manage your store, products, and orders" href="/seller/dashboard" highlight />
          )}
          {(user as any).role === 'seller' && (
            <Card title="Your public store" desc="View your store as customers see it" href={`/store/${(user as any).sellerProfile?.slug || ''}`} />
          )}
          {(user as any).role !== 'seller' && (
            <Card title="Sell on halozon" desc="Open a store and reach millions" href="/seller/apply" highlight />
          )}
          {(user as any).role === 'admin' && (
            <Card title="Admin console" desc="Manage users, products, reviews, sellers" href="/admin" highlight />
          )}
        </div>
      </div>
    </AccountLayout>
  );
}

function Card({ title, desc, href, highlight }: { title: string; desc: string; href: string; highlight?: boolean }) {
  return (
    <a href={href} className={`border rounded-md p-4 hover:shadow-cardHover transition-all hover:-translate-y-0.5 block ${highlight ? 'border-amazon-orange bg-amazon-orange/5' : 'border-amazon-border'}`}>
      <div className="font-bold mb-1">{title}</div>
      <div className="text-sm text-amazon-textMuted">{desc}</div>
    </a>
  );
}
