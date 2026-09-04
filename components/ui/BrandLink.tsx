import Link from 'next/link';
import {BrandMark} from './BrandMark';
import styles from './ui.module.css';

export type BrandLinkProps = {href?: string; inverted?: boolean; label?: string; showName?: boolean; className?: string};

/** Ссылка на главную страницу с брендовой меткой и доступным названием. */
export function BrandLink({href = '/', inverted = false, label = 'Eldiyar — на главную', showName = false, className}: BrandLinkProps) {
  return <Link href={href} aria-label={label} className={className} style={{textDecoration: 'none'}}><BrandMark inverted={inverted} />{showName && <span className={styles.brandName}>ldiyar</span>}</Link>;
}
