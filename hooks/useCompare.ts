'use client';
import { useEffect, useState, useCallback } from 'react';

export function useCompare() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const v = localStorage.getItem('halozon_compare');
      if (v) setIds(JSON.parse(v));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('halozon_compare', JSON.stringify(ids));
    } catch {}
  }, [ids]);

  const add = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev : prev.length >= 4 ? prev : [...prev, id]));
  }, []);
  const remove = useCallback((id: string) => {
    setIds((prev) => prev.filter((x) => x !== id));
  }, []);
  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }, []);
  const clear = useCallback(() => setIds([]), []);

  return { ids, add, remove, toggle, clear, has: (id: string) => ids.includes(id) };
}
