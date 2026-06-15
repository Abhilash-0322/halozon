import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { saveFile } from '@/lib/upload';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  try {
    const form = await req.formData();
    const files = form.getAll('files') as File[];
    if (!files.length) return NextResponse.json({ error: 'No files' }, { status: 400 });

    const urls: string[] = [];
    for (const f of files) {
      const r = await saveFile(f);
      if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400 });
      urls.push(r.url);
    }
    return NextResponse.json({ urls });
  } catch (e) {
    console.error('upload error', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
