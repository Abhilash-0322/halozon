import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AccountLayout from '../AccountLayout';

export default async function SecurityPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account/security');
  return (
    <AccountLayout user={user}>
      <div className="bg-white border border-amazon-border rounded-md p-5 space-y-4">
        <h1 className="text-3xl font-bold">Login & security</h1>
        <div className="space-y-3">
          <Row label="Name" value={user.name} />
          <Row label="Email" value={user.email} />
          <Row label="Password" value="••••••••" />
          <Row label="Two-step verification" value="Off" />
        </div>
        <button className="amazon-btn-dark !text-xs">Edit</button>
      </div>
    </AccountLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-amazon-border pb-3">
      <div>
        <div className="font-bold">{label}</div>
        <div className="text-sm text-amazon-textMuted">Update your {label.toLowerCase()}.</div>
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
