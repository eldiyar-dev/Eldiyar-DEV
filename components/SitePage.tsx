import {ActionLink, Reveal} from '@/components/ui';
import type {MarkdownNode, SiteLocale, SitePage as SitePageData} from '@/lib/site-content';
import {defaultLocale} from '@/lib/i18n';
import {ContentSections} from './ContentSections';
import {MarkdownContent} from './MarkdownContent';
import {diagnosticHref} from './site.constants';
import {SiteFooter} from './SiteFooter';
import {SiteNavigation} from './SiteNavigation';
import {FluidHero} from './FluidHero';
import fluidStyles from './fluid.module.css';
import styles from './site.module.css';

export type SitePageProps = {page: SitePageData; locale?: SiteLocale};

/** Композиционный слой: связывает данные маршрута с feature-компонентами страницы. */
export function SitePage({page, locale = defaultLocale}: SitePageProps) {
  const proofIndex = page.nodes.findIndex(node => node.type === 'heading' && node.level === 2 && (node.text === 'Proof strip' || node.text === 'Доказательства'));
  const heroEnd = proofIndex >= 0 ? proofIndex : page.nodes.length;
  const heroNodes = page.nodes.slice(0, heroEnd).filter(node => {
    if (node.type === 'heading' && node.level === 1) return false;
    return !(node.type === 'paragraph' && node.text.includes('100M+ requests/day') && node.text.includes('10K+ WebSockets'));
  });
  const contentNodes = proofIndex >= 0 ? page.nodes.slice(proofIndex + 2) : page.nodes;
  const proofNode = proofIndex >= 0 ? page.nodes[proofIndex + 1] : undefined;
  const proof = proofNode?.type === 'paragraph' ? proofNode.text : '';
  const h1 = page.nodes.find((node): node is Extract<MarkdownNode, {type: 'heading'}> => node.type === 'heading' && node.level === 1);
  // Every explicit CTA in the content should remain actionable. Previously only
  // the first one was rendered as a link, leaving later `[CTA]` markers visible.
  const consumeCta = () => true;
  const heroHasCta = heroNodes.some(node => node.type === 'paragraph' && node.text.includes(page.metadata.cta));
  const heroCta = !heroHasCta && consumeCta();

  return <main className={styles.site} lang={locale}><section className={styles.hero}><FluidHero><div className={`${styles.container} ${fluidStyles.contentLayer}`}><SiteNavigation locale={locale} currentUrl={page.metadata.url} /><Reveal className={styles.heroContent}><p className={styles.eyebrow}>{page.metadata.offer}</p><h1>{h1?.text ?? page.metadata.title}</h1><p className={styles.lead}>{page.metadata.description}</p><div className={styles.heroCopy}><MarkdownContent nodes={heroNodes} cta={page.metadata.cta} onCta={consumeCta} locale={locale} />{heroCta && <ActionLink className={styles.primaryButton} href={diagnosticHref(locale)}>{page.metadata.cta}</ActionLink>}</div>{proof && <ProofStrip text={proof} />}</Reveal></div></FluidHero></section><div className={styles.container}><ContentSections nodes={contentNodes} cta={page.metadata.cta} onCta={consumeCta} locale={locale} /></div><SiteFooter locale={locale} currentPath={page.metadata.url} /></main>;
}

function ProofStrip({text}: {text: string}) { return <p className={styles.proofStrip}><code>{text.replace(/^`|`$/g, '')}</code></p>; }
