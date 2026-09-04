import styles from './ui.module.css';
export type BrandMarkProps = {inverted?: boolean};

/** Основной логотип сайта; текстовое имя предоставляет родительская ссылка. */
export function BrandMark({inverted = false}: BrandMarkProps) {
  return <span className={`${styles.mark} ${inverted ? styles.inverted : ''}`} aria-hidden="true">
    <svg className={styles.logo} viewBox="36.82 -361.58 242.092 369.58" focusable="false" aria-label="glyph: E">
      <path fill="#00c48c" d="M44.82-353.58V0h226.092v-41.832H87.648V-156.87h173.304v-40.836H87.648v-114.042h179.28v-41.832Z" />
      <rect x="229.08" y="-41.832" width="41.832" height="41.832" fill="#c40038" />
    </svg>
  </span>;
}
