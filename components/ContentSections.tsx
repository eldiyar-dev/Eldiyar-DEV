import {ActionLink, Reveal, SectionHeading} from '@/components/ui';
import type {MarkdownNode} from '@/lib/site-content';
import type {SiteLocale} from '@/lib/site-content';
import {CaseSection} from './CaseSection';
import {MarkdownContent} from './MarkdownContent';
import type {CtaProps} from './site.types';
import {diagnosticHref} from './site.constants';
import styles from './site.module.css';

export type ContentSectionsProps = CtaProps & {nodes: MarkdownNode[]; locale: SiteLocale};

/** Делит Markdown второго уровня на независимые секции страницы. */
export function ContentSections({nodes, cta, onCta, locale}: ContentSectionsProps) {
  const sections: Array<{title: string; nodes: MarkdownNode[]}> = [];
  let current: {title: string; nodes: MarkdownNode[]} | undefined;
  for (const node of nodes) {
    if (node.type === 'heading' && node.level === 2) { if (current) sections.push(current); current = {title: node.text, nodes: []}; }
    else if (current) current.nodes.push(node);
  }
  if (current) sections.push(current);
  let sectionNumber = 0;
  const hasNextStep = sections.some(section => section.title === 'Следующий шаг' || section.title === 'Next step');
  const nextStepCta = locale === 'en' ? 'Contact me' : 'Связаться со мной';
  return <>{sections.map((section, index) => {
    if (section.title === 'Что НЕ входит' || section.title === 'Цена') return null;
    if (/^Кейсы|^Кейс:/.test(section.title)) return <CaseSection key={section.title} {...section} cta={cta} onCta={onCta} locale={locale} />;
    sectionNumber += 1;
    return <section key={section.title} className={styles.section}><Reveal delay={index * 35}><SectionHeading eyebrow={String(sectionNumber).padStart(2, '0')}>{section.title}</SectionHeading><div className={styles.prose}><MarkdownContent nodes={section.nodes} cta={cta} onCta={onCta} locale={locale} /></div></Reveal></section>;
  })}{!hasNextStep && <section className={styles.section}><Reveal delay={sections.length * 35}><SectionHeading eyebrow={String(sectionNumber + 1).padStart(2, '0')}>{locale === 'en' ? 'Next step' : 'Следующий шаг'}</SectionHeading><div className={styles.prose}><ActionLink className={styles.primaryButton} href={diagnosticHref(locale)}>{nextStepCta}</ActionLink></div></Reveal></section>}</>;
}
