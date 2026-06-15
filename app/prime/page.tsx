import Link from 'next/link';

export default function PrimePage() {
  return (
    <div className="min-h-[80vh]">
      <div className="bg-gradient-to-br from-amazon-prime via-amazon-navylight to-amazon-navy text-white py-20">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <div className="text-5xl md:text-6xl font-extrabold mb-4">halozon Prime</div>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            Fast, free delivery on millions of items. Plus, exclusive deals, movies, and music.
          </p>
          <Link href="/register" className="amazon-btn-yellow inline-block mt-6 !text-base !px-8 !py-3">
            Start your free trial
          </Link>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { t: 'FREE Fast Delivery', d: 'Get FREE One-Day, Same-Day, and Two-Day delivery on eligible items.' },
          { t: 'Prime Video', d: 'Watch thousands of movies and TV shows, including award-winning halozon Originals.' },
          { t: 'Prime Music', d: 'Stream over 100 million songs, ad-free, with unlimited skips.' },
        ].map((f) => (
          <div key={f.t} className="panel p-6">
            <h3 className="text-xl font-bold mb-2">{f.t}</h3>
            <p className="text-sm text-amazon-textMuted">{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
