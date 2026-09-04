import {NextResponse, type NextRequest} from 'next/server';
import {defaultLocale, getLocalizedPath, getPreferredLocale, isLocale} from '@/lib/i18n';
import {isCanonicalRouteSegments} from '@/lib/site-routes';

function getSegments(pathname: string): string[] {
  return pathname.split('/').filter(Boolean);
}

/** Exposes Russian as unprefixed while keeping locale routes static internally. */
export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const segments = getSegments(pathname);

  // Legacy suffix form for the default locale: /cv/en and /{slug}/en.
  if (segments.length === 2 && segments[1] === defaultLocale && isCanonicalRouteSegments([segments[0]])) {
    const destination = request.nextUrl.clone();
    destination.pathname = `/${segments[0]}`;
    return NextResponse.redirect(destination, 308);
  }

  // Never expose direct internal default-locale paths as duplicate public URLs.
  if (segments[0] === defaultLocale && isCanonicalRouteSegments(segments.slice(1))) {
    const destination = request.nextUrl.clone();
    destination.pathname = segments.length === 1 ? '/' : `/${segments.slice(1).join('/')}`;
    return NextResponse.redirect(destination, 308);
  }

  // Explicit locale routes are handled by app/[locale].
  if (segments[0] && isLocale(segments[0])) return NextResponse.next();

  // Pick a non-default locale automatically for visitors without a locale URL.
  // Keep this redirect private because its result depends on the browser header.
  const preferredLocale = getPreferredLocale(request.headers.get('accept-language'));
  if (preferredLocale !== defaultLocale && isCanonicalRouteSegments(segments)) {
    const destination = request.nextUrl.clone();
    destination.pathname = getLocalizedPath(pathname, preferredLocale);
    const response = NextResponse.redirect(destination, 307);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }

  // Public default-locale URLs map to the pre-rendered /en implementation route.
  if (isCanonicalRouteSegments(segments)) {
    const destination = request.nextUrl.clone();
    destination.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    return NextResponse.rewrite(destination);
  }

  return NextResponse.next();
}

export const config = {matcher: ['/((?!_next|api|.*\\..*).*)']};
