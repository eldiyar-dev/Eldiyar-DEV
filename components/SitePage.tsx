import {ActionLink, Reveal} from '@/components/ui';
import {getFaqContent, type MarkdownNode, type SiteLocale, type SitePage as SitePageData} from '@/lib/site-content';
import {defaultLocale, getLocalizedPath} from '@/lib/i18n';
import {ContentSections} from './ContentSections';
import {MarkdownContent} from './MarkdownContent';
import {diagnosticHref} from './site.constants';
import {SiteFooter} from './SiteFooter';
import {SiteNavigation} from './SiteNavigation';
import {FluidHero} from './FluidHero';
import {FaqSection} from './FaqSection';
import fluidStyles from './fluid.module.css';
import styles from './site.module.css';

export type SitePageProps = {page: SitePageData; locale?: SiteLocale};

/** Композиционный слой: связывает данные маршрута с feature-компонентами страницы. */
export function SitePage({page, locale = defaultLocale}: SitePageProps) {
  // The hero is the introductory copy before the first content section.  The
  // former `Proof strip` marker was removed from the page copy; relying on it
  // made the complete page render both in the hero and below it.
  const firstSectionIndex = page.nodes.findIndex(node => node.type === 'heading' && node.level === 2);
  const heroEnd = firstSectionIndex >= 0 ? firstSectionIndex : page.nodes.length;
  const heroNodes = page.nodes.slice(0, heroEnd).filter(node => {
    if (node.type === 'heading' && node.level === 1) return false;
    return !(node.type === 'paragraph' && node.text.includes('100M+ requests/day') && node.text.includes('10K+ WebSockets'));
  });
  const contentNodes = firstSectionIndex >= 0 ? page.nodes.slice(firstSectionIndex) : [];
  const h1 = page.nodes.find((node): node is Extract<MarkdownNode, {type: 'heading'}> => node.type === 'heading' && node.level === 1);
  // Every explicit CTA in the content should remain actionable. Previously only
  // the first one was rendered as a link, leaving later `[CTA]` markers visible.
  const consumeCta = () => true;
  const heroHasCta = heroNodes.some(node => node.type === 'paragraph' && node.text.includes(page.metadata.cta));
  const heroCta = !heroHasCta && consumeCta();

  const cvLinkLabel = locale === 'ru' ? 'Подробнее в CV' : 'More in CV';

  return <main className={styles.site} lang={locale}><section className={styles.hero}><FluidHero><div className={`${styles.container} ${fluidStyles.contentLayer}`}><SiteNavigation locale={locale} currentUrl={page.metadata.url} /><Reveal className={styles.heroContent}><p className={styles.eyebrow}>{page.metadata.offer}</p><h1>{h1?.text ?? page.metadata.title}</h1><p className={styles.lead}>{page.metadata.description}</p><div className={styles.heroCopy}><MarkdownContent nodes={heroNodes} cta={page.metadata.cta} onCta={consumeCta} locale={locale} />{heroCta && <ActionLink className={styles.primaryButton} href={diagnosticHref(locale)}>{page.metadata.cta}</ActionLink>}</div></Reveal></div></FluidHero></section><div className={styles.container}><ContentSections nodes={contentNodes} cta={page.metadata.cta} onCta={consumeCta} locale={locale} /><FaqSection content={getFaqContent(locale)} locale={locale} /><div className={styles.cvCta}><ActionLink className={styles.primaryButton} href={getLocalizedPath('/cv', locale)}>{cvLinkLabel}</ActionLink></div></div><SiteFooter locale={locale} currentPath={page.metadata.url} /></main>;
}
