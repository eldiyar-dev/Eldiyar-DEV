import type {ReactNode} from 'react';
import Link from 'next/link';
import {ActionLink} from '@/components/ui';
import type {MarkdownNode, SiteLocale} from '@/lib/site-content';
import {defaultLocale, getLocalizedPath} from '@/lib/i18n';
import {diagnosticHref} from './site.constants';
import type {CtaProps} from './site.types';
import styles from './site.module.css';

export type MarkdownContentProps = CtaProps & {nodes: MarkdownNode[]; locale?: SiteLocale; compact?: boolean};

/** Рендерит ограниченное подмножество Markdown в семантический HTML. */
export function MarkdownContent({nodes, cta, onCta, locale = defaultLocale, compact = false}: MarkdownContentProps) {
  return <>{nodes.map((node, index) => {
    if (node.type === 'paragraph') return <p key={index} className={compact ? styles.compactText : undefined}><MarkdownInline text={node.text} cta={cta} onCta={onCta} locale={locale} /></p>;
    if (node.type === 'demo') return <Demo key={index} text={node.text} locale={locale} />;
    if (node.type === 'unordered-list') return <ul key={index}>{node.items.map(item => <li key={item}><MarkdownInline text={item} cta={cta} onCta={onCta} locale={locale} /></li>)}</ul>;
    if (node.type === 'ordered-list') return <ol key={index}>{node.items.map(item => <li key={item}><MarkdownInline text={item} cta={cta} onCta={onCta} locale={locale} /></li>)}</ol>;
    if (node.type === 'heading') return <h3 key={index}>{node.text}</h3>;
    return null;
  })}</>;
}

/** Рендерит inline-разметку Markdown без создания блочного контейнера. */
export function MarkdownInline({text, cta, onCta, locale = defaultLocale}: {text: string; locale?: SiteLocale} & CtaProps): ReactNode {
  // Keep standalone bracketed CTAs as tokens so they can become real links.
  // Markdown links are matched first to preserve their href and formatting.
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^\)]+\)|\[[^\]]+\])/g).filter(Boolean);
  return tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) return <strong key={index}><MarkdownInline text={token.slice(2, -2)} cta={cta} onCta={onCta} locale={locale} /></strong>;
    if (token.startsWith('`') && token.endsWith('`')) return <code key={index}>{token.slice(1, -1)}</code>;
    const bracketCta = token.match(/^\[\s*(.+?)\s*\]$/);
    if (bracketCta?.[1] === cta && onCta()) return <ActionLink key={index} className={styles.primaryButton} href={diagnosticHref(locale)}>{bracketCta[1]}</ActionLink>;
    const link = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (link) {
      if (link[1].trim() === cta && onCta()) return <ActionLink key={index} className={styles.primaryButton} href={diagnosticHref(locale)}>{link[1].trim()}</ActionLink>;
      return link[2].startsWith('/') ? <Link key={index} className={styles.contentLink} href={getLocalizedPath(link[2], locale)}>{link[1]}</Link> : <a key={index} className={styles.contentLink} href={link[2]}>{link[1]}</a>;
    }
    return token;
  });
}

function Demo({text, locale}: {text: string; locale: SiteLocale}) {
  return <aside className={styles.demo} aria-label={locale === 'en' ? 'Demonstration placeholder' : 'Демонстрационный placeholder'}><span>DEMO</span><p>{text}</p></aside>;
}
