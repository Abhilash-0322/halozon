'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Store, CheckCircle2 } from 'lucide-react';
import SellerLayout from '../SellerLayout';
import toast from 'react-hot-toast';

export default function SellerStore({ user }: { user: any }) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch('/api/seller/apply')
      .then((r) => r.json())
      .then((d) => setProfile(d.profile));
  }, []);

  if (!profile) {
    return (
      <SellerLayout user={user}>
        <div className="shimmer-bg h-40 rounded-md" />
      </SellerLayout>
    );
  }

  return (
    <SellerLayout user={user}>
      <h1 className="text-3xl font-bold mb-4">Store profile</h1>

      {profile.approved ? (
        <div className="mb-4 bg-amazon-green/10 border border-amazon-greenDark rounded-md p-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-amazon-greenDark" />
          <span className="text-sm">
            Your store is <b>live</b> and visible to customers at{' '}
            <Link href={`/store/${profile.slug}`} className="text-amazon-link hover:underline">
              /store/{profile.slug}
              <ExternalLink className="w-3 h-3 inline ml-1" />
            </Link>
          </span>
        </div>
      ) : (
        <div className="mb-4 bg-amazon-yellow/20 border border-amazon-yellow rounded-md p-3 text-sm">
          ⏳ Your application is <b>pending review</b>. Once an admin approves, your store will be visible to customers.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div className="panel p-4">
            <h2 className="font-bold mb-2">{profile.storeName}</h2>
            <div className="text-sm text-amazon-textMuted space-y-1">
              <div><b>Slug:</b> {profile.slug}</div>
              <div><b>Country:</b> {profile.country}</div>
              <div><b>Payout:</b> {profile.payoutMethod} → {profile.payoutEmail}</div>
              <div><b>Applied:</b> {new Date(profile.appliedAt).toLocaleDateString()}</div>
              {profile.approvedAt && <div><b>Approved:</b> {new Date(profile.approvedAt).toLocaleDateString()}</div>}
            </div>
          </div>
          <div className="panel p-4">
            <h3 className="font-bold mb-2">Description</h3>
            <p className="text-sm text-amazon-text">{profile.description || '(no description)'}</p>
          </div>
        </div>
        <div className="panel p-4 bg-amazon-bg/30">
          <Store className="w-12 h-12 text-amazon-orange mx-auto mb-2" />
          <h3 className="text-center font-bold mb-2">{profile.storeName}</h3>
          <div className="text-center text-sm">
            <div className="text-2xl font-bold">{(profile.rating || 0).toFixed(1)}</div>
            <div className="text-xs text-amazon-textMuted">{profile.ratingCount || 0} ratings</div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
