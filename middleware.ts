import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cek status login dari cookies
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/dashboard/login') || 
                    request.nextUrl.pathname.startsWith('/dashboard/register');

  if (!isLoggedIn && !isAuthPage) {
    // Redirect ke login jika belum login dan mencoba akses halaman dashboard
    return NextResponse.redirect(new URL('/dashboard/login', request.url));
  }

  if (isLoggedIn && isAuthPage) {
    // Redirect ke dashboard jika sudah login tapi mencoba akses halaman login/register
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};