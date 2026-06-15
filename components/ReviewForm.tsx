'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

type Props = {
  productId: string;
  onSubmitted?: () => void;
};

export default function ReviewForm({ productId, onSubmitted }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files || []).slice(0, 4);
    setFiles(list);
    setPreviews(list.map((f) => URL.createObjectURL(f)));
  }

  function removeImage(i: number) {
    setFiles((prev) => prev.filter((_, j) => j !== i));
    setPreviews((prev) => prev.filter((_, j) => j !== i));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) return toast.error('Please choose a rating');
    if (body.trim().length < 4) return toast.error('Review is too short');
    setSubmitting(true);
    try {
      let imageUrls: string[] = [];
      if (files.length) {
        const fd = new FormData();
        files.forEach((f) => fd.append('files', f));
        const up = await fetch('/api/upload', { method: 'POST', body: fd });
        const upData = await up.json();
        if (!up.ok) throw new Error(upData.error || 'Upload failed');
        imageUrls = upData.urls || [];
      }
      const r = await fetch(`/api/products/${productId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, title, body, images: imageUrls }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Submit failed');
      toast.success(d.verifiedBuyer ? 'Review posted — verified buyer!' : 'Review posted!');
      setRating(0);
      setTitle('');
      setBody('');
      setFiles([]);
      setPreviews([]);
      onSubmitted?.();
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 border border-amazon-border rounded-md p-4 bg-amazon-bg/30">
      <h4 className="font-bold">Write a customer review</h4>
      <div>
        <span className="text-sm block mb-1">Your rating *</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="text-2xl leading-none transition-transform hover:scale-110"
            >
              <span className={n <= (hover || rating) ? 'text-amazon-star' : 'text-amazon-border'}>★</span>
            </button>
          ))}
          {rating > 0 && <span className="text-xs text-amazon-textMuted ml-2">{rating} of 5</span>}
        </div>
      </div>
      <label className="block">
        <span className="text-sm font-bold block mb-1">Headline</span>
        <input
          className="amazon-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's most important to know?"
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold block mb-1">Your review *</span>
        <textarea
          className="amazon-input min-h-[100px]"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your thoughts about this product"
          required
        />
      </label>
      <div>
        <span className="text-sm font-bold block mb-1">Add photos (max 4)</span>
        <label className="inline-flex items-center gap-2 cursor-pointer amazon-btn-dark !text-xs">
          <Upload className="w-3 h-3" />
          Upload images
          <input type="file" accept="image/*" multiple onChange={onPick} className="hidden" />
        </label>
        {previews.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden border border-amazon-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-0 right-0 bg-amazon-red text-white rounded-bl p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <button type="submit" disabled={submitting} className="amazon-btn-yellow !text-sm !py-2 disabled:opacity-60">
        {submitting ? (
          <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Posting…</span>
        ) : (
          'Submit review'
        )}
      </button>
    </form>
  );
}
