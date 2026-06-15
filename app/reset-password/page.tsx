'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, X, Loader2 } from 'lucide-react';

function ResetForm() {
  const sp = useSearchParams();
  const token = sp.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');
    if (!token) return setError('No token');

    setSubmitting(true);
    try {
      const r = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Reset failed');
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Reset failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-sm bg-white border border-amazon-border rounded-md p-5 shadow-card text-center">
        <X className="w-12 h-12 mx-auto mb-3 text-amazon-deal" />
        <h1 className="text-xl font-bold mb-2">Invalid reset link</h1>
        <Link href="/forgot-password" className="amazon-btn-yellow w-full !text-sm !py-2 block">Request a new one</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full max-w-sm bg-white border border-amazon-border rounded-md p-5 shadow-card text-center">
        <Check className="w-12 h-12 mx-auto mb-3 text-amazon-greenDark" />
        <h1 className="text-xl font-bold mb-2">Password reset!</h1>
        <p className="text-sm text-amazon-textMuted mb-4">Your password has been updated.</p>
        <Link href="/signin" className="amazon-btn-yellow w-full !text-sm !py-2 block">Sign in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm bg-white border border-amazon-border rounded-md p-5 shadow-card space-y-3">
      <h1 className="text-2xl font-medium">Reset your password</h1>
      <label className="block">
        <span className="text-sm font-bold block mb-1">New password</span>
        <input type="password" className="amazon-input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <span className="text-xs text-amazon-textMuted mt-1 inline-block">At least 6 characters</span>
      </label>
      <label className="block">
        <span className="text-sm font-bold block mb-1">Confirm password</span>
        <input type="password" className="amazon-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
      </label>
      {error && <div className="text-sm text-amazon-deal">{error}</div>}
      <button type="submit" disabled={submitting} className="amazon-btn-yellow w-full !text-sm !py-2 disabled:opacity-60">
        {submitting ? (
          <span className="flex items-center gap-1 justify-center"><Loader2 className="w-3 h-3 animate-spin" /> Resetting…</span>
        ) : 'Reset password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-8 px-4">
      <Link href="/" className="text-3xl font-extrabold mb-4 text-amazon-navy">
        halo<span className="text-amazon-orange">zon</span>
      </Link>
      <Suspense fallback={<div>Loading…</div>}>
        <ResetForm />
      </Suspense>
    </div>
  );
}
