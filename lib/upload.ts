import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export function extFromType(type: string): string {
  if (type === 'image/jpeg') return 'jpg';
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  if (type === 'image/gif') return 'gif';
  return 'bin';
}

export async function saveFile(file: File): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!ALLOWED_TYPES.includes(file.type))
    return { ok: false, error: 'Unsupported file type' };
  if (file.size > MAX_SIZE)
    return { ok: false, error: 'File too large (max 5MB)' };
  await ensureUploadDir();
  const buf = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${extFromType(file.type)}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), buf);
  return { ok: true, url: `/uploads/${name}` };
}
