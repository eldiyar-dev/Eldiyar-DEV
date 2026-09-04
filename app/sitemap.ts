import type {MetadataRoute} from 'next';
import {defaultLocale, getLocalizedPath, locales} from '@/lib/i18n';
import {getAllPageMetadata} from '@/lib/site-content';
import {siteUrl} from '@/lib/seo';

function absolutePath(pathname: string) {
  return new URL(pathname, siteUrl).toString();
}

/** Перечисляет только статически существующие публичные страницы сайта. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...getAllPageMetadata(defaultLocale).map(page => page.url), '/cv'];

  return paths.flatMap(pathname => {
    const alternates = {languages: Object.fromEntries(locales.map(locale => [locale, absolutePath(getLocalizedPath(pathname, locale))]))};
    return locales.map(locale => ({url: absolutePath(getLocalizedPath(pathname, locale)), alternates}));
  });
}
