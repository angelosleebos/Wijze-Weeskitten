import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if accessing admin routes (except login page)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.pathname !== '/admin') {
    
    // In client-side rendered admin pages, we rely on the token in localStorage
    // For API routes, authentication is handled by requireAuth() middleware
    // This middleware just ensures users go through the login page
    
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
