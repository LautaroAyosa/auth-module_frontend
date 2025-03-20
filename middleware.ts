// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get('refreshToken');
  const isLoggedIn = !!accessToken;

  // Prevent logged-in users from accessing /auth/ routes
  if (pathname.startsWith('/auth') && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Prevent logged-out users from accessing /dashboard/ routes
  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Otherwise proceed
  return NextResponse.next();
}

// Apply to /auth/* and /dashboard/*
export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*'],
};
