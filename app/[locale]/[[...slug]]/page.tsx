import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import CvPage from '@/components/CvPage';
import {SitePage} from '@/components/SitePage';
import {getLocalizedStaticParams, isLocale, type Locale} from '@/lib/i18n';
import {createCvMetadata, createSiteMetadata} from '@/lib/seo';
import {getSitePage, type SitePageId} from '@/lib/site-content';
import {isSiteSlug, siteRouteSegments} from '@/lib/site-routes';

type RouteParams = {locale: string; slug?: string[]};
type PageRoute = {kind: 'cv'} | {kind: 'site'; id: SitePageId};

export const dynamicParams = false;

/** Pre-render every internal locale route; middleware exposes Russian paths without /ru. */
export function generateStaticParams() {
  return getLocalizedStaticParams(siteRouteSegments);
}

function getPageRoute(slug?: string[]): PageRoute {
  if (!slug?.length) return {kind: 'site', id: 'home'};
  if (slug.length === 1 && slug[0] === 'cv') return {kind: 'cv'};
  if (slug.length === 1 && isSiteSlug(slug[0])) return {kind: 'site', id: slug[0]};
  notFound();
}

function getRouteParams(params: RouteParams): {locale: Locale; route: PageRoute} {
  if (!isLocale(params.locale)) notFound();
  return {locale: params.locale, route: getPageRoute(params.slug)};
}

async function getCvContent(locale: Locale) {
  return (await import(`@/messages/${locale}.json`)).default.cv;
}

export async function generateMetadata({params}: {params: Promise<RouteParams>}): Promise<Metadata> {
  const {locale, route} = getRouteParams(await params);
  if (route.kind === 'site') return createSiteMetadata(getSitePage(route.id, locale).metadata, locale);
  const content = await getCvContent(locale);
  return createCvMetadata(content.hero.name, content.hero.role, content.hero.lead, locale);
}

export default async function Page({params}: {params: Promise<RouteParams>}) {
  const {locale, route} = getRouteParams(await params);
  if (route.kind === 'site') return <SitePage page={getSitePage(route.id, locale)} locale={locale} />;
  const content = await getCvContent(locale);
  return <NextIntlClientProvider locale={locale} messages={{cv: content}}><CvPage locale={locale} content={content} /></NextIntlClientProvider>;
}
