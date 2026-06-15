'use client';
import Link from 'next/link';
import { X, GitCompare } from 'lucide-react';
import { useCompare } from '@/hooks/useCompare';

export default function CompareBar() {
  const { ids, remove, clear } = useCompare();
  if (ids.length === 0) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-amazon-navy text-white shadow-2xl border-t border-amazon-orange animate-slideDown">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-3">
        <GitCompare className="w-5 h-5 text-amazon-orange" />
        <div className="flex-1">
          <div className="text-sm font-medium">{ids.length} item{ids.length !== 1 ? 's' : ''} selected to compare</div>
          <div className="flex gap-2 mt-1 flex-wrap">
            {ids.map((id, i) => (
              <span key={id} className="chip !bg-white/10 !text-white !border-white/30 flex items-center gap-1">
                Item {i + 1}
                <button onClick={() => remove(id)} className="ml-1 hover:text-amazon-orange">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
        <Link
          href={`/compare?ids=${ids.join(',')}`}
          className="amazon-btn-yellow !text-sm"
        >
          Compare {ids.length} item{ids.length !== 1 ? 's' : ''}
        </Link>
        <button onClick={clear} className="text-xs text-white/70 hover:text-white">
          Clear
        </button>
      </div>
    </div>
  );
}
