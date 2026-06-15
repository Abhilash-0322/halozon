'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const CATS = [
  'electronics', 'computers', 'smart-home', 'books', 'home-and-kitchen',
  'fashion', 'toys-and-games', 'beauty', 'sports-and-outdoors', 'grocery',
  'pet-supplies', 'tools', 'automotive', 'office',
];

type Props = {
  user: any;
  initial?: any;
  mode: 'create' | 'edit';
};

export default function ProductForm({ user, initial, mode }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [features, setFeatures] = useState((initial?.features || []).join('\n'));
  const [price, setPrice] = useState<number | string>(initial?.price ?? '');
  const [listPrice, setListPrice] = useState<number | string>(initial?.listPrice ?? '');
  const [brand, setBrand] = useState(initial?.brand || user.sellerProfile?.storeName || user.name);
  const [categorySlug, setCategorySlug] = useState(initial?.categorySlug || 'electronics');
  const [stock, setStock] = useState<number | string>(initial?.stock ?? 10);
  const [images, setImages] = useState<string[]>(initial?.images || []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function uploadFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('files', f));
      const r = await fetch('/api/upload', { method: 'POST', body: fd });
      const d = await r.json();
      if (r.ok) setImages((prev) => [...prev, ...d.urls].slice(0, 5));
      else toast.error(d.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function addImageByUrl() {
    const url = prompt('Paste image URL:');
    if (url) setImages((p) => [...p, url].slice(0, 5));
  }

  function removeImage(i: number) {
    setImages((p) => p.filter((_, j) => j !== i));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || price === '' || !images.length) {
      toast.error('Title, price, and at least one image are required');
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        title,
        description,
        features: features.split('\n').map((s: string) => s.trim()).filter(Boolean),
        price: Number(price),
        listPrice: listPrice === '' ? 0 : Number(listPrice),
        brand,
        categorySlug,
        stock: Number(stock),
        images,
        isPrime: true,
        freeShipping: true,
      };
      const r = await fetch(
        mode === 'create' ? '/api/seller/products' : `/api/seller/products/${initial._id}`,
        {
          method: mode === 'create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Save failed');
      toast.success(mode === 'create' ? 'Product created!' : 'Product updated!');
      router.push('/seller/products');
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: basics */}
        <div className="md:col-span-2 space-y-4">
          <div className="panel p-4 space-y-3">
            <h2 className="font-bold">Basic info</h2>
            <label className="block">
              <span className="text-sm font-bold block mb-1">Title *</span>
              <input className="amazon-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label className="block">
              <span className="text-sm font-bold block mb-1">Brand</span>
              <input className="amazon-input" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-sm font-bold block mb-1">Category</span>
              <select className="amazon-input" value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-bold block mb-1">Description</span>
              <textarea
                className="amazon-input min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold block mb-1">Features (one per line)</span>
              <textarea
                className="amazon-input min-h-[80px]"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="Quantum Dot Color&#10;120Hz refresh rate&#10;Built-in Alexa"
              />
            </label>
          </div>

          <div className="panel p-4 space-y-3">
            <h2 className="font-bold">Images *</h2>
            <div className="flex gap-2 flex-wrap">
              <label className="amazon-btn-dark !text-xs cursor-pointer">
                <Upload className="w-3 h-3 inline mr-1" /> Upload
                <input type="file" accept="image/*" multiple onChange={uploadFiles} className="hidden" />
              </label>
              <button type="button" onClick={addImageByUrl} className="amazon-btn-dark !text-xs">
                + Add by URL
              </button>
            </div>
            {uploading && <p className="text-xs text-amazon-textMuted">Uploading…</p>}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {images.map((src, i) => (
                <div key={i} className="relative aspect-square bg-white rounded border border-amazon-border overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`img-${i}`} className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-amazon-red text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-amazon-navy text-white text-[10px] text-center py-0.5">Main</span>}
                </div>
              ))}
              {images.length === 0 && (
                <div className="col-span-full text-sm text-amazon-textMuted text-center py-4 border border-dashed border-amazon-border rounded">
                  Add at least one image
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: pricing + inventory */}
        <div className="space-y-4">
          <div className="panel p-4 space-y-3">
            <h2 className="font-bold">Pricing</h2>
            <label className="block">
              <span className="text-sm font-bold block mb-1">Price *</span>
              <input
                type="number"
                step="0.01"
                className="amazon-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold block mb-1">List price (MSRP)</span>
              <input
                type="number"
                step="0.01"
                className="amazon-input"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
              />
              <span className="text-xs text-amazon-textMuted mt-1 inline-block">For showing "Save X%"</span>
            </label>
          </div>
          <div className="panel p-4 space-y-3">
            <h2 className="font-bold">Inventory</h2>
            <label className="block">
              <span className="text-sm font-bold block mb-1">Stock quantity *</span>
              <input
                type="number"
                className="amazon-input"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </label>
            <p className="text-xs text-amazon-textMuted">
              Low-stock alert when ≤ 5 units
            </p>
          </div>
          <button type="submit" disabled={submitting || uploading} className="amazon-btn-yellow w-full !text-base !py-2.5 disabled:opacity-60">
            <Save className="w-4 h-4 inline mr-1" />
            {submitting ? 'Saving…' : mode === 'create' ? 'Publish product' : 'Save changes'}
          </button>
        </div>
      </div>
    </form>
  );
}
