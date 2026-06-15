import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { connectDB } from './mongodb';
import User from '@/models/User';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'halozon_super_secret_change_me_in_production_2026_xyz'
);
const COOKIE = 'halozon_token';
const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function signToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyToken<T = Record<string, unknown>>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as T;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: SEVEN_DAYS,
  });
}

export async function clearAuthCookie() {
  cookies().delete(COOKIE);
}

export async function getCurrentUser() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken<{ userId: string }>(token);
  if (!payload?.userId) return null;
  await connectDB();
  const user = (await User.findById(payload.userId).lean()) as any;
  if (!user) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    banned: user.banned,
    sellerProfile: user.sellerProfile,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) return { error: 'Sign in required', status: 401 } as const;
  if (user.banned) return { error: 'Account suspended', status: 403 } as const;
  return { user } as const;
}

export async function requireSeller() {
  const user = await getCurrentUser();
  if (!user) return { error: 'Sign in required', status: 401 } as const;
  if (user.role !== 'seller' && user.role !== 'admin')
    return { error: 'Seller account required', status: 403 } as const;
  if (!user.sellerProfile?.approved && user.role !== 'admin')
    return { error: 'Seller application not approved', status: 403 } as const;
  return { user } as const;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return { error: 'Sign in required', status: 401 } as const;
  if (user.role !== 'admin') return { error: 'Admin access required', status: 403 } as const;
  return { user } as const;
}

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export async function comparePassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export function randomOrderId() {
  return (
    Math.floor(100000 + Math.random() * 900000) +
    '-' +
    crypto.randomBytes(3).toString('hex').toUpperCase()
  );
}
