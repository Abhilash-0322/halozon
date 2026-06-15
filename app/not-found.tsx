import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-20 text-center">
      <div className="text-6xl font-extrabold text-amazon-orange mb-2">404</div>
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-sm text-amazon-textMuted mb-4">
        Sorry, we couldn&apos;t find the page you were looking for.
      </p>
      <Link href="/" className="amazon-btn-primary inline-block">Go to home</Link>
    </div>
  );
}
