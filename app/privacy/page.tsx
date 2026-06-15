import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 prose prose-sm">
      <Link href="/" className="amazon-link text-sm">← Back to Home</Link>
      <h1 className="text-3xl font-bold mt-4">Privacy Notice</h1>
      <p className="text-sm text-amazon-textMuted">Last updated: January 1, 2026</p>
      <p>
        We know that you care how information about you is used and shared. This Privacy Notice explains what information we collect, how we use it, and what choices you have.
      </p>
      <h2 className="text-xl font-bold mt-6">Information We Collect</h2>
      <p>We collect information you provide when you sign in, place an order, or contact customer service.</p>
      <h2 className="text-xl font-bold mt-6">How We Use Information</h2>
      <p>We use your information to process orders, prevent fraud, and improve our services.</p>
    </div>
  );
}
