'use client';
import { starArray } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function StarRating({
  rating,
  count,
  size = 'md',
  showCount = true,
}: {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}) {
  const stars = starArray(rating);
  const cls = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-xs' : 'text-sm';
  return (
    <div className="inline-flex items-center gap-1">
      <div className={cn('flex text-amazon-star', cls)}>
        {stars.map((s, i) => (
          <span key={i} className="leading-none">{s === 'full' ? '★' : s === 'half' ? '★' : '☆'}</span>
        ))}
      </div>
      {showCount && count !== undefined && (
        <span className="text-amazon-link text-sm hover:underline cursor-pointer">
          {count.toLocaleString()}
        </span>
      )}
    </div>
  );
}
