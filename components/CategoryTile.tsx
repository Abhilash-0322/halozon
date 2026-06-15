import Link from 'next/link';
import { slugify } from '@/lib/utils';

export default function CategoryTile({ name, image, slug }: { name: string; image?: string; slug?: string }) {
  const href = `/category/${slug || slugify(name)}`;
  return (
    <Link
      href={href}
      className="amazon-card amazon-card-hover p-4 flex flex-col items-center text-center group"
    >
      <div className="w-full aspect-square bg-amazon-bg rounded-md mb-2 overflow-hidden flex items-center justify-center">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <div className="text-4xl">🛍️</div>
        )}
      </div>
      <span className="text-sm font-medium group-hover:text-amazon-linkHover transition-colors">{name}</span>
    </Link>
  );
}
