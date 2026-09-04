import {ActionLink, Card, Reveal, SectionHeading} from '@/components/ui';
import type {MarkdownNode} from '@/lib/site-content';
import type {SiteLocale} from '@/lib/site-content';
import {getLocalizedPath} from '@/lib/i18n';
import {MarkdownContent, MarkdownInline} from './MarkdownContent';
import type {CtaProps} from './site.types';
import styles from './site.module.css';

export type CaseSectionProps = CtaProps & {title: string; nodes: MarkdownNode[]; locale: SiteLocale};

/** Группирует Markdown-кейсы в самостоятельные доступные карточки. */
export function CaseSection({title, nodes, cta, onCta, locale}: CaseSectionProps) {
  const groups: Array<{title?: string; nodes: MarkdownNode[]}> = [];
  const intro: MarkdownNode[] = [];
  let current: {title?: string; nodes: MarkdownNode[]} | undefined;
  for (const node of nodes) {
    if (node.type === 'heading' && node.level === 3) { if (current?.nodes.length || current?.title) groups.push(current); current = {title: node.text, nodes: []}; }
    else if (current) current.nodes.push(node);
    else intro.push(node);
  }
  if (current?.nodes.length || current?.title) groups.push(current);
  const showCvLink = /^Кейсы/.test(title);
  return <section className={styles.section}><SectionHeading eyebrow="CASE STUDIES">{title}</SectionHeading>{intro.length > 0 && <div className={styles.caseIntro}><MarkdownContent nodes={intro} cta={cta} onCta={onCta} locale={locale} /></div>}<div className={styles.caseGrid}>{groups.map((group, index) => <Reveal key={group.title ?? index} delay={index * 50}><article className={styles.caseWrap}>{group.title && <h3>{group.title}</h3>}<CaseBody nodes={group.nodes} cta={cta} onCta={onCta} locale={locale} /></article></Reveal>)}</div>{showCvLink && <div className={styles.workCta}><ActionLink className={styles.primaryButton} href={getLocalizedPath('/cv', locale)}>Подробнее в CV</ActionLink></div>}</section>;
}

function CaseBody({nodes, cta, onCta, locale}: CtaProps & {nodes: MarkdownNode[]; locale: SiteLocale}) {
  const details = nodes.filter((node): node is Extract<MarkdownNode, {type: 'paragraph'}> => node.type === 'paragraph' && /^\*\*(Контекст|Роль|Решение)\.\*\*/.test(node.text));
  const rest = nodes.filter(node => !details.includes(node as Extract<MarkdownNode, {type: 'paragraph'}>));
  return <Card as="article" className={styles.caseCard}>{details.length > 0 && <dl>{details.map(node => { const [, label, value] = node.text.match(/^\*\*(Контекст|Роль|Решение)\.\*\*\s*(.+)$/) ?? []; return <div key={node.text}><dt>{label}</dt><dd><MarkdownInline text={value} cta={cta} onCta={onCta} locale={locale} /></dd></div>; })}</dl>}<MarkdownContent nodes={rest} cta={cta} onCta={onCta} locale={locale} compact /></Card>;
}
