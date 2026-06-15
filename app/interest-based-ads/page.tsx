import Link from 'next/link';

export default function InterestBasedAds() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 prose prose-sm">
      <Link href="/" className="amazon-link text-sm">← Back to Home</Link>
      <h1 className="text-3xl font-bold mt-4">Interest-Based Ads</h1>
      <p>
        halozon displays interest-based advertising using information you make available to us when you interact with our sites and services.
      </p>
    </div>
  );
}
