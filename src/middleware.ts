import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('autosuz_session')?.value;
  const role = request.cookies.get('autosuz_role')?.value?.toUpperCase(); // Ej: GERENTE, DIRECTOR, VENDEDOR
  const { pathname } = request.nextUrl;

  // Protect all routes except /login and static public files
  if (
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/favicon.ico')
  ) {
    // Si el crawler de verificación de Meta / Facebook visita la raíz o cualquier ruta
    const userAgent = request.headers.get('user-agent') || '';
    if (
      userAgent.includes('facebookexternalhit') ||
      userAgent.includes('Facebot') ||
      userAgent.includes('facebookplatform')
    ) {
      return new NextResponse(
        `<!DOCTYPE html><html><head><meta name="facebook-domain-verification" content="2ifmhukhlouwtrdi442vnmo9xp8acc" /></head><body>Autosuz</body></html>`,
        {
          status: 200,
          headers: { 'content-type': 'text/html; charset=utf-8' },
        }
      );
    }

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
