import crypto from 'crypto';

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24h

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function tokenExpiry(): Date {
  return new Date(Date.now() + TOKEN_TTL_MS);
}

export { TOKEN_TTL_MS };
