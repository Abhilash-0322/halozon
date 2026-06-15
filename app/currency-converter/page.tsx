'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightLeft } from 'lucide-react';

const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.52,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.1,
  MXN: 17.0,
  BRL: 4.97,
  KRW: 1320,
  SGD: 1.34,
};

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [result, setResult] = useState(0);

  useEffect(() => {
    const inUsd = amount / RATES[from];
    setResult(+(inUsd * RATES[to]).toFixed(2));
  }, [amount, from, to]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8">
      <div className="text-xs text-amazon-textMuted mb-3">
        <Link href="/" className="amazon-link">Home</Link>
        <span className="mx-1">›</span>
        <span>Currency Converter</span>
      </div>
      <h1 className="text-3xl font-bold mb-2">Currency Converter</h1>
      <p className="text-sm text-amazon-textMuted mb-6">
        Live exchange rates. Demo rates — for reference only.
      </p>

      <div className="panel p-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
          <div>
            <label className="block text-sm font-bold mb-1">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="amazon-input !text-2xl !py-3"
            />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="amazon-input mt-2"
            >
              {Object.keys(RATES).map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button
            onClick={swap}
            className="amazon-btn-yellow !text-xs md:mb-7"
            aria-label="Swap currencies"
          >
            <ArrowRightLeft className="w-3 h-3" />
          </button>
          <div>
            <label className="block text-sm font-bold mb-1">Converted</label>
            <div className="amazon-input !text-2xl !py-3 bg-amazon-bg font-bold">
              {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}
            </div>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="amazon-input mt-2"
            >
              {Object.keys(RATES).map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-amazon-border">
          <div className="text-sm text-amazon-textMuted mb-2">Exchange rates (1 USD =)</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {Object.entries(RATES).filter(([c]) => c !== 'USD').map(([c, r]) => (
              <div key={c} className="bg-amazon-bg/50 rounded px-2 py-1.5">
                <span className="font-bold">{c}</span>
                <span className="float-right">{r.toFixed(c === 'JPY' || c === 'KRW' ? 1 : 4)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-amazon-textMuted mt-4 text-center">
        These rates are for demonstration only and are not live market data.
      </p>
    </div>
  );
}
