'use client';
import { useEffect, useState } from 'react';
import { Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

type Answer = { userName?: string; body: string; helpful?: number; isSeller?: boolean; isAsker?: boolean; createdAt?: string };
type Question = { _id: string; body: string; helpful: number; answers: Answer[]; answerCount: number; userName?: string; createdAt?: string };

export default function QASection({ productId }: { productId: string }) {
  const [items, setItems] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [asking, setAsking] = useState(false);
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  async function refresh() {
    setLoading(true);
    try {
      const r = await fetch(`/api/products/${productId}/questions`);
      const d = await r.json();
      setItems(d.items || []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, [productId]);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim().length < 5) return toast.error('Question too short');
    const r = await fetch(`/api/products/${productId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: q }),
    });
    const d = await r.json();
    if (!r.ok) return toast.error(d.error || 'Failed');
    toast.success('Question posted');
    setQ('');
    setAsking(false);
    setItems((prev) => [d.question, ...prev]);
  }

  async function answer(qid: string) {
    const body = (replyMap[qid] || '').trim();
    if (body.length < 2) return toast.error('Answer too short');
    const r = await fetch(`/api/questions/${qid}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    const d = await r.json();
    if (!r.ok) return toast.error(d.error || 'Failed');
    toast.success('Answer posted');
    setReplyMap((prev) => ({ ...prev, [qid]: '' }));
    setItems((prev) => prev.map((it) => (it._id === qid ? d.question : it)));
  }

  async function helpful(qid: string) {
    const r = await fetch(`/api/questions/${qid}/helpful`, { method: 'POST' });
    const d = await r.json();
    if (r.ok) {
      setItems((prev) => prev.map((it) => (it._id === qid ? { ...it, helpful: d.helpful } : it)));
    } else {
      toast.error('Sign in to vote');
    }
  }

  return (
    <section className="panel p-5 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">Customer questions & answers</h3>
          <p className="text-xs text-amazon-textMuted">{items.length} question{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setAsking((v) => !v)} className="amazon-btn-yellow !text-xs">
          <Plus className="w-3 h-3 inline mr-1" /> Ask a question
        </button>
      </div>

      {asking && (
        <form onSubmit={ask} className="mb-4 border border-amazon-border rounded-md p-3 bg-amazon-bg/30">
          <textarea
            className="amazon-input min-h-[80px]"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What do you want to know about this product?"
            maxLength={500}
          />
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setAsking(false)} className="amazon-btn-dark !text-xs">Cancel</button>
            <button type="submit" className="amazon-btn-primary !text-xs">Post question</button>
          </div>
        </form>
      )}

      {loading && <div className="shimmer-bg h-20 rounded-md" />}

      {!loading && items.length === 0 && (
        <p className="text-sm text-amazon-textMuted py-4 text-center">No questions yet — be the first to ask.</p>
      )}

      <div className="divide-y divide-amazon-border">
        {items.map((it) => {
          const isOpen = openId === it._id;
          return (
            <div key={it._id} className="py-4">
              <button
                onClick={() => setOpenId(isOpen ? null : it._id)}
                className="w-full text-left flex items-start gap-2"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">Q:</span>
                    <span className="text-sm">{it.body}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-amazon-textMuted">
                    <span>{it.userName || 'Customer'}</span>
                    <span>· {new Date(it.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span>· {it.answerCount} answer{it.answerCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="mt-3 pl-4 space-y-3 animate-fadeIn">
                  {it.answers.map((a, k) => (
                    <div key={k} className="bg-amazon-bg/30 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm">A:</span>
                        <span className="text-sm font-medium">{a.userName || 'Customer'}</span>
                        {a.isSeller && <span className="chip !bg-amazon-orange/20 !text-amazon-orange">halozon</span>}
                        {a.isAsker && <span className="chip">Asker</span>}
                      </div>
                      <p className="text-sm">{a.body}</p>
                      <div className="text-xs text-amazon-textMuted mt-1">{a.helpful || 0} found helpful</div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <textarea
                      className="amazon-input min-h-[60px] !text-sm"
                      placeholder="Add an answer"
                      value={replyMap[it._id] || ''}
                      onChange={(e) => setReplyMap((prev) => ({ ...prev, [it._id]: e.target.value }))}
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button onClick={() => helpful(it._id)} className="text-xs text-amazon-link hover:underline flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> Helpful ({it.helpful})
                      </button>
                      <button onClick={() => answer(it._id)} className="amazon-btn-yellow !text-xs">Post answer</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
