import Link from 'next/link';
import {BrandLink} from '@/components/ui';
import {getAllPageMetadata, type SiteLocale} from '@/lib/site-content';
import {getLocalizedPath} from '@/lib/i18n';
import styles from './site.module.css';

export type SiteNavigationProps = {locale: SiteLocale; currentUrl: string};

/** Основная навигация между страницами одного типа контента. */
export function SiteNavigation({locale, currentUrl}: SiteNavigationProps) {
  const pages = getAllPageMetadata(locale);
  return <header className={styles.topbar}><BrandLink href={getLocalizedPath('/', locale)} label={locale === 'en' ? 'Home' : 'На главную'} /><nav aria-label={locale === 'en' ? 'Main navigation' : 'Основная навигация'}>{pages.filter(page => page.url !== currentUrl).map(page => <Link key={page.id} href={getLocalizedPath(page.url, locale)}>{page.offer}</Link>)}</nav></header>;
}
