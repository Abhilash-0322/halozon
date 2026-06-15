'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      toast.success('Welcome to halozon!');
      router.push(sp.get('redirect') || '/');
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || 'Sign-up failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-8 px-4">
      <Link href="/" className="text-3xl font-extrabold mb-4 text-amazon-navy">
        halo<span className="text-amazon-orange">zon</span>
      </Link>
      <form onSubmit={submit} className="w-full max-w-sm bg-white border border-amazon-border rounded-md p-5 shadow-card space-y-3">
        <h1 className="text-2xl font-medium">Create account</h1>
        <label className="block">
          <span className="text-sm font-bold block mb-1">Your name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="amazon-input"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold block mb-1">Mobile number or email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="amazon-input"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold block mb-1">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="amazon-input"
            placeholder="At least 6 characters"
          />
          <span className="text-xs text-amazon-textMuted mt-1 inline-block">Passwords must be at least 6 characters.</span>
        </label>
        <button type="submit" disabled={submitting} className="amazon-btn-yellow w-full !text-sm !py-2 disabled:opacity-60">
          {submitting ? 'Creating...' : 'Create your halozon account'}
        </button>
        <p className="text-xs text-amazon-textMuted">
          By creating an account, you agree to halozon&apos;s{' '}
          <span className="amazon-link">Conditions of Use</span> and{' '}
          <span className="amazon-link">Privacy Notice</span>.
        </p>
        <hr className="my-3 border-amazon-border" />
        <div className="text-sm">
          Already have an account? <Link href="/signin" className="amazon-link">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
