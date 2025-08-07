// File: middleware.js

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Panggil getSession() di awal agar Supabase dapat membaca
  // dan menyinkronkan token sesi dari cookies.
  await supabase.auth.getSession();

  const { data: { session } } = await supabase.auth.getSession();
  const isLoggedIn = !!session;
  const url = req.nextUrl.pathname;

  // Definisikan path yang dilindungi
  const protectedPaths = [
    '/dashboard',
    '/manage-stock',
    '/marketplace',
    '/habit-tracker',
    '/trash-classifier',
    '/donations',
    '/food-rescue',
    '/leaderboard',
  ];
  const isProtected = protectedPaths.some((path) => url.startsWith(path));

  // 1. Redirect pengguna yang sudah login dari halaman login/register
  if (isLoggedIn && (url === '/login' || url === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 2. Redirect pengguna yang belum login dari halaman yang dilindungi
  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Lanjutkan permintaan
  return res;
}

export const config = {
  matcher: [
    // Jalankan middleware pada semua rute kecuali API, file statis, dan aset.
    '/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};