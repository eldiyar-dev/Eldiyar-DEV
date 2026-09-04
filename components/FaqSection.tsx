import {Reveal, SectionHeading} from '@/components/ui';
import type {FaqContent, SiteLocale} from '@/lib/site-content';
import styles from './site.module.css';

export type FaqSectionProps = {content: FaqContent; locale: SiteLocale};

/** Compact, progressively disclosed FAQ shown on every marketing page. */
export function FaqSection({content}: FaqSectionProps) {
  return <section className={`${styles.section} ${styles.faqSection}`} aria-labelledby="faq-title"><Reveal><SectionHeading eyebrow="FAQ"><span id="faq-title">{content.title}</span></SectionHeading><div className={styles.faqGroups}>{content.groups.map(group => <section className={styles.faqGroup} key={group.title}><h3>{group.title}</h3><div className={styles.faqList}>{group.items.map(item => <details className={styles.faqItem} key={item.question}><summary>{item.question}<span aria-hidden="true" /></summary><div className={styles.faqAnswer}><p>{item.answer.join(' ')}</p></div></details>)}</div></section>)}</div></Reveal></section>;
}
