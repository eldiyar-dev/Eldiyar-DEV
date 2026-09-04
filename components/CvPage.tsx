'use client';

import {useState} from 'react';
import {ActionLink, BrandLink, Card, Reveal, SectionHeading} from '@/components/ui';
import {getLocalizedPath, type Locale} from '@/lib/i18n';
import {siteUrl} from '@/lib/seo';
import {SiteFooter} from './SiteFooter';
import {diagnosticHref} from './site.constants';
import {FluidHero} from './FluidHero';
import fluidStyles from './fluid.module.css';
import styles from './cv.module.css';

type Pair = [string, string];
type Case = {id: string; title: string; task: string; role: string; built: string; changed: string; metrics: string[]; stack: string[]; achievements: string[]};
export type CvContent = {
  hero: {role: string; name: string; lead: string; body: string; cta: string; facts: string[]}; nav: Record<string, string>;
  results: {eyebrow: string; title: string; items: Pair[]}; what: {eyebrow: string; title: string; items: Pair[]};
  cases: {eyebrow: string; title: string; detail: string; hide: string; stack: string; achievements: string; task: string; role: string; built: string; changed: string; items: Case[]};
  ai: {eyebrow: string; title: string; lead: string; items: Pair[]}; fit: {eyebrow: string; title: string; items: Pair[]; noFitTitle: string; noFit: string};
  work: {eyebrow: string; title: string; items: Pair[]; lead: string; cta: string}; contact: {eyebrow: string; title: string; items: [string, string, string][]}; footer: {role: string; cta: string};
};

function Tags({items, accent = false}: {items: string[]; accent?: boolean}) { return <div className={styles.tags}>{items.map(item => <span key={item} className={accent ? styles.accentTag : styles.tag}>{item}</span>)}</div>; }

function CaseCard({item, index, labels}: {item: Case; index: number; labels: CvContent['cases']}) {
  const [open, setOpen] = useState(false); const detailId = `case-${item.id}-details`;
  return <Card as="article" className={`${styles.card} ${styles.caseCard}`}>
    <span className={styles.caseNumber}>CASE {String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3>
    <dl className={styles.caseSummary}><div><dt>{labels.task}</dt><dd>{item.task}</dd></div><div><dt>{labels.role}</dt><dd>{item.role}</dd></div><div><dt>{labels.built}</dt><dd>{item.built}</dd></div><div><dt>{labels.changed}</dt><dd>{item.changed}</dd></div></dl>
    <Tags items={item.metrics} accent />
    <button className={styles.detailButton} type="button" aria-expanded={open} aria-controls={detailId} onClick={() => setOpen(!open)}>{open ? '−' : '+'} {open ? labels.hide : labels.detail}</button>
    <div id={detailId} className={`${styles.caseDetails} ${open ? styles.open : ''}`} aria-hidden={!open}><div><p className={styles.detailLabel}>{labels.stack}</p><Tags items={item.stack} /><p className={styles.detailLabel}>{labels.achievements}</p><ul>{item.achievements.map(line => <li key={line}>{line}</li>)}</ul></div></div>
  </Card>;
}

export type CvPageProps = {locale: Locale; content: CvContent};

/** Структурированное резюме с доступной навигацией по разделам. */
export default function CvPage({locale, content}: CvPageProps) {
  const {hero, nav, results, what, cases, ai, fit, work, contact} = content;
  const personSchema = {'@context': 'https://schema.org', '@type': 'Person', name: hero.name, jobTitle: hero.role, url: new URL(getLocalizedPath('/cv', locale), siteUrl).toString(), email: contact.items.find(([type]) => type === 'Email')?.[1], sameAs: contact.items.map(([, , href]) => href).filter(href => href.startsWith('https://'))};
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(personSchema)}} /><main className={styles.cv} lang={locale}>
     <section className={styles.hero}><FluidHero><div className={`${styles.container} ${fluidStyles.contentLayer}`}><header className={styles.topbar}><BrandLink href={getLocalizedPath('/', locale)} label={locale === 'en' ? 'Eldiyar — home' : 'Eldiyar — на главную'} /><nav aria-label="CV sections">{[['results', 'results'], ['cases', 'cases'], ['ai', 'ai'], ['fit', 'fit'], ['work', 'work']].map(([id, key]) => <a key={id} href={`#${id}`}>{nav[key]}</a>)}</nav></header><Reveal className={styles.heroContent}><p className={styles.eyebrow}>{hero.role}</p><h1 className={styles.name}>{hero.name}</h1><p className={styles.heroLead}>{hero.lead}</p><p className={styles.heroBody}>{hero.body}</p><ActionLink className={styles.primaryButton} href={diagnosticHref(locale)}>{hero.cta}</ActionLink><div className={styles.facts}>{hero.facts.map(fact => <span key={fact}>{fact}</span>)}</div></Reveal></div></FluidHero></section>

    <section id="results" className={styles.section}><div className={styles.container}><SectionHeading eyebrow={results.eyebrow}>{results.title}</SectionHeading><div className={styles.resultsGrid}>{results.items.map(([value, description], index) => <Reveal key={value} delay={index * 50}><Card className={`${styles.card} ${styles.metricCard}`}><strong>{value}</strong><p>{description}</p></Card></Reveal>)}</div></div></section>
    <section className={styles.section}><div className={styles.container}><SectionHeading eyebrow={what.eyebrow}>{what.title}</SectionHeading><div className={styles.cardsGrid}>{what.items.map(([title, body], index) => <Reveal key={title} delay={index * 50}><Card className={styles.card}><h3>{title}</h3><p>{body}</p></Card></Reveal>)}</div></div></section>
    <section id="cases" className={styles.section}><div className={styles.container}><SectionHeading eyebrow={cases.eyebrow}>{cases.title}</SectionHeading><div className={styles.casesGrid}>{cases.items.map((item, index) => <Reveal key={item.id} delay={index * 60}><CaseCard item={item} index={index} labels={cases} /></Reveal>)}</div></div></section>
    <section id="ai" className={`${styles.section} ${styles.darkSection}`}><div className={styles.container}><SectionHeading eyebrow={ai.eyebrow} dark>{ai.title}</SectionHeading><p className={styles.darkLead}>{ai.lead}</p><div className={styles.principlesGrid}>{ai.items.map(([title, body], index) => <Reveal key={title} delay={index * 40} className={styles.principle}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{body}</p></Reveal>)}</div></div></section>
    <section id="fit" className={styles.section}><div className={styles.container}><SectionHeading eyebrow={fit.eyebrow}>{fit.title}</SectionHeading><div className={styles.cardsGrid}>{fit.items.map(([title, body], index) => <Reveal key={title} delay={index * 50}><Card className={styles.card}><h3>{title}</h3><p>{body}</p></Card></Reveal>)}</div><div className={styles.noFit}><span>{fit.noFitTitle}</span><p>{fit.noFit}</p></div></div></section>
    <section id="work" className={`${styles.section} ${styles.softSection}`}><div className={styles.container}><SectionHeading eyebrow={work.eyebrow}>{work.title}</SectionHeading><div className={styles.cardsGrid}>{work.items.map(([title, body], index) => <Reveal key={title} delay={index * 50}><Card className={styles.card}><h3>{title}</h3><p>{body}</p></Card></Reveal>)}</div><div className={styles.workCta}><p>{work.lead}</p><ActionLink className={styles.primaryButton} href={diagnosticHref(locale)}>{work.cta}</ActionLink></div></div></section>
    <SiteFooter locale={locale} currentPath="/cv" />
  </main></>;
}
