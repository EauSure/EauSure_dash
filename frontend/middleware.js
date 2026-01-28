import { auth } from './auth';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const session = await auth();
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isRegisterPage = request.nextUrl.pathname === '/register';
  const isForgotPassword = request.nextUrl.pathname === '/forgot-password';
  const isResetPassword = request.nextUrl.pathname === '/reset-password';
  const isProfileSetup = request.nextUrl.pathname === '/profile/setup';
  const isProfileEdit = request.nextUrl.pathname === '/profile/edit';
  const isSettingsPage = request.nextUrl.pathname.startsWith('/settings');

  // Public pages that don't require authentication
  const isPublicPage = isLoginPage || isRegisterPage || isForgotPassword || isResetPassword;

  // If not logged in and not on public pages, redirect to login
  if (!session && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in and on login or register page, redirect to dashboard or profile setup
  if (session && (isLoginPage || isRegisterPage)) {
    if (!session.user.isProfileComplete) {
      return NextResponse.redirect(new URL('/profile/setup', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If logged in, profile incomplete, and not on profile setup/edit/settings page, redirect to profile setup
  if (session && !session.user.isProfileComplete && !isProfileSetup && !isProfileEdit && !isSettingsPage) {
    return NextResponse.redirect(new URL('/profile/setup', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
