import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('autosuz_session')?.value;
  const { pathname } = request.nextUrl;

  // Protect all routes except /login and static public files
  if (
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/favicon.ico')
  ) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If trying to access login while already authenticated
  if (pathname.startsWith('/login') && session) {
      return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
