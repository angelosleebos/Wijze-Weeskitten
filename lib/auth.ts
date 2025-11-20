import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  id: number;
  username: string;
}

export function verifyToken(token: string): AuthUser {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

export function requireAuth(request: NextRequest): AuthUser {
  const user = getAuthUser(request);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}
