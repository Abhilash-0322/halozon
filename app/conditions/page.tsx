import Link from 'next/link';

export default function ConditionsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 prose prose-sm">
      <Link href="/" className="amazon-link text-sm">← Back to Home</Link>
      <h1 className="text-3xl font-bold mt-4">Conditions of Use</h1>
      <p className="text-sm text-amazon-textMuted">Last updated: January 1, 2026</p>
      <p>
        Welcome to halozon.com. By using our site, you agree to these conditions, including our Privacy Notice and any other policies posted on this site.
      </p>
      <h2 className="text-xl font-bold mt-6">1. Eligibility</h2>
      <p>You must be at least 18 years old to use this site.</p>
      <h2 className="text-xl font-bold mt-6">2. Account</h2>
      <p>You are responsible for maintaining the confidentiality of your account and password.</p>
      <h2 className="text-xl font-bold mt-6">3. Purchases</h2>
      <p>All purchases are subject to availability and our refund policy.</p>
    </div>
  );
}
