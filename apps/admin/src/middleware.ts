import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/cadastro', '/esqueci-minha-senha'];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If user is not authenticated and trying to access a protected route
  if (!isPublicRoute && !token && pathname !== '/login') {
    // Check localStorage on client-side (this is a server-side check limitation)
    // The actual auth check happens client-side in the api-client interceptor
    return NextResponse.next();
  }

  // If user is authenticated and trying to access login page, redirect to home
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
