import type {Metadata} from 'next';
import type {PageMetadata, SiteLocale} from '@/lib/site-content';
import {getLocalizedPath} from '@/lib/i18n';

/** Публичный канонический адрес сайта, подтверждённый в материалах проекта. */
export const siteUrl = new URL('https://cv.eldiyar.dev');

function absoluteUrl(pathname: string): string {
  return new URL(pathname, siteUrl).toString();
}

/** Собирает согласованные метаданные для контентных страниц на двух языках. */
export function createSiteMetadata(page: PageMetadata, locale: SiteLocale): Metadata {
  const canonical = getLocalizedPath(page.url, locale);

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
      languages: {ru: getLocalizedPath(page.url, 'ru'), en: getLocalizedPath(page.url, 'en')}
    },
    openGraph: {
      type: 'website', url: absoluteUrl(canonical), title: page.title, description: page.description,
      locale: locale === 'ru' ? 'ru_RU' : 'en_US', siteName: 'Eldiyar'
    },
    twitter: {card: 'summary', title: page.title, description: page.description}
  };
}

/** Метаданные для локализованной страницы резюме. */
export function createCvMetadata(name: string, role: string, description: string, locale: SiteLocale): Metadata {
  const canonical = getLocalizedPath('/cv', locale);
  const title = `${name} — ${role}`;

  return {
    title, description,
    alternates: {canonical, languages: {ru: getLocalizedPath('/cv', 'ru'), en: getLocalizedPath('/cv', 'en')}},
    openGraph: {type: 'profile', url: absoluteUrl(canonical), title, description, locale: locale === 'ru' ? 'ru_RU' : 'en_US', siteName: 'Eldiyar'},
    twitter: {card: 'summary', title, description}
  };
}
