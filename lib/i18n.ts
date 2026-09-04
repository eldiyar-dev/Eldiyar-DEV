/** Canonical locale policy shared by routing, links, metadata, and static generation. */
export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Returns the public URL for a locale; Russian is intentionally unprefixed. */
export function getLocalizedPath(pathname: string, locale: Locale): string {
  const normalizedPath = pathname === '/' ? '/' : `/${pathname.replace(/^\/+/, '')}`;
  if (locale === defaultLocale) return normalizedPath;
  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;
}

/** Builds static params for every locale and known optional catch-all path. */
export function getLocalizedStaticParams(paths: readonly (readonly string[])[]): Array<{locale: Locale; slug: string[]}> {
  return locales.flatMap(locale => paths.map(slug => ({locale, slug: [...slug]})));
}
