import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { INFO_PAGES, isValidSlug, type InfoPage, type InfoBlock } from '@/lib/infoPages';
import { serialize } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

export default async function InfoPage({ params }: { params: { slug: string } }) {
  if (!isValidSlug(params.slug)) notFound();
  const page = INFO_PAGES[params.slug] as InfoPage;

  await connectDB();
  const products = serialize(
    await Product.find({}).sort({ rating: -1 }).limit(4).select('-reviews -description').lean()
  ) as any[];

  return <InfoView page={page} products={products} />;
}

function InfoView({ page, products }: { page: InfoPage; products: any[] }) {
  const heroBg =
    page.hero.bg === 'orange'
      ? 'from-amazon-orange via-amazon-orangedark to-amazon-buy'
      : page.hero.bg === 'green'
      ? 'from-amazon-greenDark via-emerald-900 to-amazon-navy'
      : page.hero.bg === 'prime'
      ? 'from-amazon-prime via-amazon-navylight to-amazon-navy'
      : 'from-amazon-navy via-amazon-navylight to-amazon-orange/70';

  return (
    <div>
      {/* Hero */}
      <div className={`bg-gradient-to-br ${heroBg} text-white`}>
        <div className="max-w-screen-xl mx-auto px-6 py-16 md:py-24 text-center">
          {page.hero.eyebrow && (
            <div className="text-xs uppercase tracking-widest text-white/70 mb-3 font-semibold">
              {page.hero.eyebrow}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3" dangerouslySetInnerHTML={{ __html: page.hero.headline }} />
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: page.hero.sub }} />
          {page.cta && (
            <div className="mt-6">
              <Link href={page.cta.href} className="amazon-btn-yellow !text-base !px-8 !py-2.5 inline-block">
                {page.cta.label}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* Body */}
        <div className="space-y-6 text-amazon-text">
          {page.body.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}

          {page.cta && (
            <div className="text-center pt-4">
              <Link href={page.cta.href} className="amazon-btn-primary !text-base !px-6 !py-2.5 inline-block">
                {page.cta.label}
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 self-start">
          {page.related && page.related.length > 0 && (
            <div className="panel p-4">
              <h3 className="font-bold mb-2">Related</h3>
              <ul className="space-y-1.5 text-sm">
                {page.related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="text-amazon-link hover:underline">{r.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="panel p-4 bg-amazon-bg/50">
            <h3 className="font-bold mb-2">Featured products</h3>
            <div className="grid grid-cols-2 gap-2">
              {products.map((p) => (
                <Link key={p._id} href={`/product/${p._id}`} className="block">
                  <div className="aspect-square bg-white rounded border border-amazon-border p-1 mb-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images?.[0]} alt={p.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="text-xs line-clamp-2 hover:text-amazon-linkHover">{p.title}</div>
                  <div className="text-sm font-bold">${p.price.toFixed(2)}</div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function BlockRenderer({ block }: { block: InfoBlock }) {
  switch (block.kind) {
    case 'h2':
      return <h2 className="text-2xl font-bold mt-6" dangerouslySetInnerHTML={{ __html: block.text }} />;
    case 'h3':
      return <h3 className="text-lg font-bold mt-4" dangerouslySetInnerHTML={{ __html: block.text }} />;
    case 'p':
      return <p className="text-base text-amazon-text leading-relaxed" dangerouslySetInnerHTML={{ __html: block.text }} />;
    case 'ul':
      return (
        <ul className="list-disc pl-6 space-y-1.5 text-amazon-text">
          {block.items.map((it, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
          ))}
        </ul>
      );
    case 'stats': {
      const colors = ['text-amazon-orange', 'text-amazon-greenDark', 'text-amazon-prime', 'text-amazon-navylight'];
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
          {block.items.map((it, i) => (
            <div key={i} className="panel p-4 text-center">
              <div className={`text-3xl font-extrabold ${colors[i % colors.length]}`}>{it.value}</div>
              <div className="text-xs text-amazon-textMuted mt-1">{it.label}</div>
            </div>
          ))}
        </div>
      );
    }
    case 'cards':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {block.items.map((it, i) => (
            <div key={i} className="panel p-4">
              <h4 className="font-bold mb-1" dangerouslySetInnerHTML={{ __html: it.title }} />
              <p className="text-sm text-amazon-text" dangerouslySetInnerHTML={{ __html: it.body }} />
            </div>
          ))}
        </div>
      );
    case 'faq':
      return (
        <div className="space-y-2 my-4">
          {block.items.map((it, i) => (
            <details key={i} className="panel p-4">
              <summary className="font-bold cursor-pointer" dangerouslySetInnerHTML={{ __html: it.q }} />
              <p className="text-sm text-amazon-text mt-2" dangerouslySetInnerHTML={{ __html: it.a }} />
            </details>
          ))}
        </div>
      );
    default:
      return null;
  }
}
