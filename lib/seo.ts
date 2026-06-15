// SEO helpers for JSON-LD structured data

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4000';
export const SITE_NAME = 'halozon';

export type BreadcrumbItem = { name: string; href: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.href.startsWith('http') ? it.href : `${SITE_URL}${it.href}`,
    })),
  };
}

export function productJsonLd(p: {
  title: string;
  description?: string;
  images?: string[];
  brand?: string;
  price: number;
  listPrice?: number;
  currency?: string;
  rating?: number;
  ratingCount?: number;
  stock?: number;
  sku?: string;
  url: string;
}) {
  const offers: any = {
    '@type': 'Offer',
    url: p.url,
    priceCurrency: p.currency || 'USD',
    price: p.price,
    availability: p.stock && p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
  };
  if (p.listPrice && p.listPrice > p.price) offers.priceValidUntil = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    description: p.description || p.title,
    image: p.images?.[0],
    sku: p.sku,
    brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
    aggregateRating:
      p.ratingCount && p.rating
        ? {
            '@type': 'AggregateRating',
            ratingValue: Number(p.rating).toFixed(1),
            reviewCount: p.ratingCount,
          }
        : undefined,
    offers,
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [],
  };
}
