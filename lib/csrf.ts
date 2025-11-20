import { NextRequest } from 'next/server';
import crypto from 'crypto';

// Store CSRF tokens in memory (for production, use Redis or database)
const csrfTokens = new Map<string, { token: string; expires: number }>();

// Cleanup expired tokens every 10 minutes
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  csrfTokens.forEach((value, key) => {
    if (now > value.expires) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach((key) => csrfTokens.delete(key));
}, 10 * 60 * 1000);

export function generateCsrfToken(userId: number): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 60 * 60 * 1000; // 1 hour
  
  csrfTokens.set(`${userId}:${token}`, { token, expires });
  
  return token;
}

export function verifyCsrfToken(userId: number, token: string): boolean {
  const key = `${userId}:${token}`;
  const stored = csrfTokens.get(key);
  
  if (!stored || Date.now() > stored.expires) {
    csrfTokens.delete(key);
    return false;
  }
  
  return stored.token === token;
}

export function getCsrfTokenFromRequest(request: NextRequest): string | null {
  return request.headers.get('x-csrf-token');
}

export function requireCsrfToken(request: NextRequest, userId: number): void {
  const token = getCsrfTokenFromRequest(request);
  
  if (!token || !verifyCsrfToken(userId, token)) {
    throw new Error('Invalid CSRF token');
  }
}
