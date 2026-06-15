'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Package, ShoppingBag, DollarSign, AlertTriangle, Store } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import AdminLayout from './AdminLayout';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return <AdminLayout><div className="shimmer-bg h-40 rounded-md" /></AdminLayout>;
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <Tile icon={Users} label="Users" value={stats.users} color="bg-amazon-navylight/10 text-amazon-navylight" />
        <Tile icon={Store} label="Pending sellers" value={stats.pendingSellers} color="bg-amazon-orange/10 text-amazon-orange" link="/admin/sellers" />
        <Tile icon={Package} label="Products" value={stats.products} color="bg-amazon-green/10 text-amazon-greenDark" link="/admin/products" />
        <Tile icon={ShoppingBag} label="Orders" value={stats.orders} color="bg-amazon-prime/10 text-amazon-prime" />
        <Tile icon={DollarSign} label="Revenue" value={formatPrice(stats.revenue)} color="bg-amazon-yellow/20 text-amazon-text" />
        <Tile icon={AlertTriangle} label="Low stock" value={stats.lowStock} color="bg-amazon-deal/10 text-amazon-deal" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Link href="/admin/sellers" className="panel p-5 hover:shadow-cardHover transition-all">
          <h3 className="font-bold mb-1">Review seller applications →</h3>
          <p className="text-sm text-amazon-textMuted">
            {stats.pendingSellers} pending application{stats.pendingSellers !== 1 ? 's' : ''}
          </p>
        </Link>
        <Link href="/admin/products?q=" className="panel p-5 hover:shadow-cardHover transition-all">
          <h3 className="font-bold mb-1">Manage products →</h3>
          <p className="text-sm text-amazon-textMuted">{stats.products} listings</p>
        </Link>
        <Link href="/admin/users" className="panel p-5 hover:shadow-cardHover transition-all">
          <h3 className="font-bold mb-1">Manage users →</h3>
          <p className="text-sm text-amazon-textMuted">Ban, change roles</p>
        </Link>
        <Link href="/admin/reviews" className="panel p-5 hover:shadow-cardHover transition-all">
          <h3 className="font-bold mb-1">Moderate reviews →</h3>
          <p className="text-sm text-amazon-textMuted">Remove inappropriate content</p>
        </Link>
      </div>
    </AdminLayout>
  );
}

function Tile({ icon: Icon, label, value, color, link }: any) {
  const content = (
    <div className="panel p-4 h-full">
      <div className={`w-9 h-9 rounded-md flex items-center justify-center ${color} mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-amazon-textMuted">{label}</div>
    </div>
  );
  return link ? <Link href={link}>{content}</Link> : content;
}
