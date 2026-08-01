import { NextResponse } from 'next/server';

export function middleware(req) {
  // Ignorar peticiones a archivos estáticos de Next.js o favicon
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    try {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      const expectedUser = process.env.ADMIN_USER || 'admin';
      const expectedPassword = process.env.ADMIN_PASSWORD || 'admin';

      if (user === expectedUser && pwd === expectedPassword) {
        return NextResponse.next();
      }
    } catch (e) {
      console.error('Error al decodificar la autenticación básica:', e);
    }
  }

  return new NextResponse('Autenticación Requerida', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Dashboard Tanda Admin"',
    },
  });
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
