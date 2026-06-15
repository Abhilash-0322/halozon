import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { SITE_URL } from '@/lib/seo';
import { INFO_SLUGS } from '@/lib/infoPages';

export default async function sitemap() {
  await connectDB();
  const [products, categories] = await Promise.all([
    Product.find().select('_id updatedAt').lean(),
    Category.find().select('slug updatedAt').lean(),
  ]);
  const now = new Date();

  const staticUrls = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/deals`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/prime`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/help`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/currency-converter`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/conditions`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/interest-based-ads`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/seller/apply`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...INFO_SLUGS.map((slug) => ({
      url: `${SITE_URL}/info/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
  const productUrls = products.map((p: any) => ({
    url: `${SITE_URL}/product/${p._id}`,
    lastModified: new Date(p.updatedAt || now),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  const categoryUrls = categories.map((c: any) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: new Date(c.updatedAt || now),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
