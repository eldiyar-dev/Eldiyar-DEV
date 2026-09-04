import styles from './ui.module.css';
export type SectionHeadingProps = {eyebrow: string; children: React.ReactNode; dark?: boolean};

/** Заголовок раздела второго уровня с поясняющей меткой. */
export function SectionHeading({eyebrow, children, dark = false}: SectionHeadingProps) { return <header className={`${styles.sectionHeading} ${dark ? styles.dark : ''}`}><span>{eyebrow}</span><h2>{children}</h2></header>; }
