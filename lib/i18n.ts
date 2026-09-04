/** Canonical locale policy shared by routing, links, metadata, and static generation. */
export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Chooses the best supported locale from the browser's Accept-Language header.
 * Region-specific tags (for example, en-US) are matched to their base locale.
 */
export function getPreferredLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale;

  const preferences = acceptLanguage
    .split(',')
    .map((entry, index) => {
      const [languageTag, ...parameters] = entry.trim().toLowerCase().split(';');
      const qualityParameter = parameters.find(parameter => parameter.trim().startsWith('q='));
      const quality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1;
      return {languageTag, quality: Number.isFinite(quality) ? quality : 0, index};
    })
    .filter(preference => preference.quality > 0 && preference.languageTag)
    .sort((left, right) => right.quality - left.quality || left.index - right.index);

  for (const preference of preferences) {
    const baseLanguage = preference.languageTag.split('-')[0];
    const locale = locales.find(candidate => candidate === baseLanguage);
    if (locale) return locale;
  }

  return defaultLocale;
}

/** Returns the public URL for a locale; English is intentionally unprefixed. */
export function getLocalizedPath(pathname: string, locale: Locale): string {
  const normalizedPath = pathname === '/' ? '/' : `/${pathname.replace(/^\/+/, '')}`;
  if (locale === defaultLocale) return normalizedPath;
  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;
}

/** Builds static params for every locale and known optional catch-all path. */
export function getLocalizedStaticParams(paths: readonly (readonly string[])[]): Array<{locale: Locale; slug: string[]}> {
  return locales.flatMap(locale => paths.map(slug => ({locale, slug: [...slug]})));
}
