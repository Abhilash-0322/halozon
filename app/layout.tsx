import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import CompareBar from '@/components/CompareBar';
import Seo from '@/components/Seo';
import { getCurrentUser } from '@/lib/auth';
import { organizationJsonLd, SITE_URL, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'halozon — Online Shopping for Electronics, Books, Apparel & More',
  description:
    'Free shipping on millions of items. Get the best of Shopping and Entertainment with halozon.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'halozon — Online Shopping',
    description:
      'Free shipping on millions of items. Get the best of Shopping and Entertainment with halozon.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'halozon',
    description: 'Free shipping on millions of items.',
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header user={user} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CompareBar />
        </Providers>
        <Seo jsonLd={organizationJsonLd()} />
      </body>
    </html>
  );
}
