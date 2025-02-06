import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  // Add paths that don't require authentication
  const publicPaths = ['/', '/auth/signin'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (session && request.nextUrl.pathname === '/auth/signin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/create',
    '/profile/:path*',
    '/post/:path*',
    '/notifications',
    '/search',
    '/auth/:path*',
  ],
}; 