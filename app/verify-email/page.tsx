'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

function VerifyForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = sp.get('token');
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setError('No token provided');
      return;
    }
    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (ok) setState('success');
        else {
          setState('error');
          setError(d.error || 'Verification failed');
        }
      })
      .catch(() => {
        setState('error');
        setError('Network error');
      });
  }, [token]);

  return (
    <div className="w-full max-w-sm bg-white border border-amazon-border rounded-md p-5 shadow-card text-center">
      {state === 'loading' && (
        <>
          <Loader2 className="w-12 h-12 mx-auto mb-3 text-amazon-orange animate-spin" />
          <h1 className="text-xl font-bold mb-2">Verifying…</h1>
        </>
      )}
      {state === 'success' && (
        <>
          <div className="w-16 h-16 mx-auto bg-amazon-green/10 rounded-full flex items-center justify-center mb-3">
            <Check className="w-8 h-8 text-amazon-greenDark" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Email verified!</h1>
          <p className="text-sm text-amazon-textMuted mb-4">
            Your account is now active. Welcome to halozon.
          </p>
          <Link href="/" className="amazon-btn-yellow w-full !text-sm !py-2 block">Continue shopping</Link>
        </>
      )}
      {state === 'error' && (
        <>
          <div className="w-16 h-16 mx-auto bg-amazon-deal/10 rounded-full flex items-center justify-center mb-3">
            <X className="w-8 h-8 text-amazon-deal" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Verification failed</h1>
          <p className="text-sm text-amazon-deal mb-4">{error}</p>
          <Link href="/signin" className="amazon-btn-yellow w-full !text-sm !py-2 block">Back to sign in</Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-8 px-4">
      <Link href="/" className="text-3xl font-extrabold mb-4 text-amazon-navy">
        halo<span className="text-amazon-orange">zon</span>
      </Link>
      <Suspense fallback={<div>Loading…</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
