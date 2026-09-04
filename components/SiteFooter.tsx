import Link from 'next/link';
import {BrandLink} from '@/components/ui';
import type {SiteLocale} from '@/lib/site-content';
import {getLocalizedPath} from '@/lib/i18n';
import {contactHref} from './site.constants';
import {FluidHero} from './FluidHero';
import fluidStyles from './fluid.module.css';
import styles from './site.module.css';

export type SiteFooterProps = {locale: SiteLocale; currentPath?: string};

/** Footer с подтверждёнными публичными контактами и ссылкой на резюме. */
export function SiteFooter({locale, currentPath = '/'}: SiteFooterProps) {
  const otherLocale = locale === 'ru' ? 'en' : 'ru';
  return <FluidHero><footer className={`${styles.container} ${styles.footer} ${fluidStyles.contentLayer}`}><BrandLink className={styles.footerBrand} href={getLocalizedPath('/', locale)} inverted label={locale === 'en' ? 'Eldiyar — home' : 'Eldiyar — на главную'} /><nav className={styles.footerLinks} aria-label={locale === 'en' ? 'Contacts and language' : 'Контакты и язык'}><a className={styles.footerLink} href={contactHref}><span>eldiyar.dev@gmail.com</span></a><a className={styles.footerLink} href="https://www.linkedin.com/in/eldiyar-dev/"><FooterIcon type="linkedin" /><span>LinkedIn</span></a><a className={styles.footerLink} href="https://t.me/EldiyarDev"><FooterIcon type="telegram" /><span>Telegram</span></a><Link className={styles.footerLink} href={getLocalizedPath('/cv', locale)}><FooterIcon type="cv" /><span>CV</span></Link><Link className={styles.footerLink} href={getLocalizedPath(currentPath, otherLocale)} aria-label={locale === 'en' ? 'Switch to Russian' : 'Переключить на английский'}>{otherLocale.toUpperCase()}</Link></nav></footer></FluidHero>;
}

function FooterIcon({type}: {type: 'linkedin' | 'telegram' | 'cv'}) {
  if (type === 'linkedin') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5H3.25V21H6.5V8.5ZM4.88 3A1.88 1.88 0 1 0 4.88 6.75 1.88 1.88 0 0 0 4.88 3ZM21 13.84C21 10.08 18.99 8.32 16.31 8.32c-2.18 0-3.15 1.2-3.69 2.04V8.5H9.38V21h3.24v-6.19c0-1.63.31-3.21 2.33-3.21 1.99 0 2.02 1.87 2.02 3.32V21H21v-7.16Z" /></svg>;
  if (type === 'telegram') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21.4 4.6-3.05 14.4c-.23 1.02-.84 1.27-1.7.79l-4.67-3.44-2.25 2.16c-.25.25-.46.46-.94.46l.34-4.75 8.65-7.81c.38-.34-.08-.53-.59-.19L6.5 12.9l-4.58-1.43c-1-.31-1.02-1 .21-1.48L20.05 3.8c.82-.3 1.54.19 1.35.8Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6M9 16h6" /></svg>;
}
