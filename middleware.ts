import {NextResponse, type NextRequest} from 'next/server';
import {defaultLocale, isLocale} from '@/lib/i18n';
import {isCanonicalRouteSegments} from '@/lib/site-routes';

function getSegments(pathname: string): string[] {
  return pathname.split('/').filter(Boolean);
}

/** Exposes Russian as unprefixed while keeping locale routes static internally. */
export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const segments = getSegments(pathname);

  // Legacy suffix form: /cv/ru and /{slug}/ru.
  if (segments.length === 2 && segments[1] === defaultLocale && isCanonicalRouteSegments([segments[0]])) {
    const destination = request.nextUrl.clone();
    destination.pathname = `/${segments[0]}`;
    return NextResponse.redirect(destination, 308);
  }

  // Never expose direct internal Russian paths as duplicate public URLs.
  if (segments[0] === defaultLocale && isCanonicalRouteSegments(segments.slice(1))) {
    const destination = request.nextUrl.clone();
    destination.pathname = segments.length === 1 ? '/' : `/${segments.slice(1).join('/')}`;
    return NextResponse.redirect(destination, 308);
  }

  // English routes are already canonical and are handled by app/[locale].
  if (segments[0] && isLocale(segments[0])) return NextResponse.next();

  // Public Russian URLs map to the pre-rendered /ru implementation route.
  if (isCanonicalRouteSegments(segments)) {
    const destination = request.nextUrl.clone();
    destination.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    return NextResponse.rewrite(destination);
  }

  return NextResponse.next();
}

export const config = {matcher: ['/((?!_next|api|.*\\..*).*)']};
