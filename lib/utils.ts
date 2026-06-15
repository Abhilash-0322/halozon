import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}

export function calcDiscount(price: number, list?: number) {
  if (!list || list <= price) return 0;
  return Math.round(((list - price) / list) * 100);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function starArray(rating: number) {
  const r = Math.round(rating * 2) / 2;
  const out: ('full' | 'half' | 'empty')[] = [];
  for (let i = 0; i < 5; i++) {
    const v = r - i;
    if (v >= 1) out.push('full');
    else if (v >= 0.5) out.push('half');
    else out.push('empty');
  }
  return out;
}

export function ratingFromCount(reviews: { rating: number }[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

export function pick<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}
