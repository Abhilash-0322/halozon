import { NextRequest, NextResponse } from 'next/server';

// Simulated live viewers — random number in a believable range, slowly rotating
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  // Pseudo-random based on id hash so the same product returns stable-ish values for a session
  const seed = params.id
    .split('')
    .reduce((s, c) => (s * 31 + c.charCodeAt(0)) >>> 0, 7);
  const base = 5 + (seed % 30); // 5..35
  const wiggle = Math.floor(Math.sin(Date.now() / 8000) * 4) + (seed % 3);
  return NextResponse.json({ count: Math.max(1, base + wiggle) });
}
