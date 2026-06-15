'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const d = await r.json();
      setSent(true);
      // Mock email: show the reset link
      if (d.resetToken) {
        setResetLink(`${window.location.origin}/reset-password?token=${d.resetToken}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-8 px-4">
      <Link href="/" className="text-3xl font-extrabold mb-4 text-amazon-navy">
        halo<span className="text-amazon-orange">zon</span>
      </Link>
      <div className="w-full max-w-sm bg-white border border-amazon-border rounded-md p-5 shadow-card">
        {!sent ? (
          <form onSubmit={submit} className="space-y-3">
            <h1 className="text-2xl font-medium">Forgot password?</h1>
            <p className="text-sm text-amazon-textMuted">
              Enter the email associated with your account. We&apos;ll send you a link to reset your password.
            </p>
            <label className="block">
              <span className="text-sm font-bold block mb-1">Email</span>
              <input
                type="email"
                required
                className="amazon-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button type="submit" disabled={submitting} className="amazon-btn-yellow w-full !text-sm !py-2 disabled:opacity-60">
              {submitting ? (
                <span className="flex items-center gap-1 justify-center"><Loader2 className="w-3 h-3 animate-spin" /> Sending…</span>
              ) : 'Send reset link'}
            </button>
            <Link href="/signin" className="block text-center text-sm text-amazon-link hover:underline">
              Back to sign in
            </Link>
          </form>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-amazon-green/10 rounded-full flex items-center justify-center mb-3">
              <Check className="w-8 h-8 text-amazon-greenDark" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-sm text-amazon-textMuted mb-4">
              If an account exists for <b>{email}</b>, we&apos;ve sent a password reset link.
            </p>
            {resetLink && (
              <div className="text-left bg-amazon-yellow/20 border border-amazon-yellow rounded-md p-3 mb-4 text-xs">
                <div className="font-bold mb-1">📬 Demo: Mock email — reset link below</div>
                <a href={resetLink} className="text-amazon-link break-all hover:underline">
                  {resetLink}
                </a>
              </div>
            )}
            <Link href="/signin" className="amazon-btn-dark w-full !text-sm !py-2 block">Back to sign in</Link>
          </div>
        )}
      </div>
    </div>
  );
}
