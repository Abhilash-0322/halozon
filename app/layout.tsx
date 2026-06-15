import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import { getCurrentUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'halozon — Online Shopping for Electronics, Books, Apparel & More',
  description:
    'Free shipping on millions of items. Get the best of Shopping and Entertainment with halozon.',
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
        </Providers>
      </body>
    </html>
  );
}
