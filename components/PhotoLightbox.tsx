'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

export default function PhotoLightbox({
  images,
  initialIndex = 0,
  onClose,
}: {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}) {
  const [i, setI] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setI((v) => (v - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setI((v) => (v + 1) % images.length);
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [images.length, onClose]);

  function resetZoom() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }
  function next() {
    setI((v) => (v + 1) % images.length);
    resetZoom();
  }
  function prev() {
    setI((v) => (v - 1 + images.length) % images.length);
    resetZoom();
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-fadeIn" onClick={onClose}>
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
        <div className="text-sm">
          {i + 1} / {images.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
            className="p-2 rounded-full hover:bg-white/10"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
            className="p-2 rounded-full hover:bg-white/10"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main image */}
      <div className="flex-1 flex items-center justify-center px-12 relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div
          className="relative max-w-full max-h-full overflow-hidden"
          onMouseMove={(e) => {
            if (zoom <= 1) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            setPan({ x: -x * 60 * (zoom - 1), y: -y * 60 * (zoom - 1) });
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[i]}
            alt={`Image ${i + 1}`}
            className="max-w-full max-h-[80vh] object-contain transition-transform duration-200 select-none"
            style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`, cursor: zoom > 1 ? 'grab' : 'zoom-in' }}
            onClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
          />
        </div>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="p-4 flex justify-center gap-2 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
        {images.map((src, k) => (
          <button
            key={k}
            onClick={() => {
              setI(k);
              resetZoom();
            }}
            className={`w-16 h-16 rounded overflow-hidden border-2 transition-all ${
              k === i ? 'border-amazon-orange scale-110' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`thumb-${k}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
