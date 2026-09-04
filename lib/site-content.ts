import enMessages from '@/messages/en.json';
import ruMessages from '@/messages/ru.json';
import {defaultLocale, type Locale} from '@/lib/i18n';
import {siteSlugs, type SiteSlug} from '@/lib/site-routes';

export type SitePageId = 'home' | 'ai-workflow-rescue' | 'payments-reliability' | 'ai-launch-gate' | 'capabilities';
export type SiteLocale = Locale;
export {siteSlugs, type SiteSlug};

export type PageMetadata = {title: string; description: string; url: string; offer: string; cta: string};
export type MarkdownNode =
  | {type: 'heading'; level: 1 | 2 | 3; text: string}
  | {type: 'paragraph'; text: string}
  | {type: 'unordered-list'; items: string[]}
  | {type: 'ordered-list'; items: string[]}
  | {type: 'demo'; text: string};
export type SitePage = {metadata: PageMetadata; nodes: MarkdownNode[]};
export type FaqItem = {question: string; answer: string[]};
export type FaqGroup = {title: string; items: FaqItem[]};
export type FaqContent = {title: string; groups: FaqGroup[]};

type SiteMessage = {metadata: PageMetadata; body: string};
type SiteMessages = {faq: FaqContent; site: {pages: Record<string, SiteMessage>}};

const messages: Record<SiteLocale, SiteMessages> = {
  en: enMessages as SiteMessages,
  ru: ruMessages as SiteMessages
};

function flushParagraph(lines: string[], nodes: MarkdownNode[]) {
  if (lines.length) nodes.push({type: 'paragraph', text: lines.join(' ').trim()});
  lines.length = 0;
}

function parseMarkdown(body: string): MarkdownNode[] {
  const nodes: MarkdownNode[] = [];
  const paragraph: string[] = [];
  const lines = body.split(/\r?\n/);

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    if (!line) { flushParagraph(paragraph, nodes); index++; continue; }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    const demo = line.match(/^<!--\s*DEMO:\s*(.+?)\s*-->$/);
    const unordered = line.match(/^-\s+(.+)$/);
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (heading) {
      flushParagraph(paragraph, nodes);
      nodes.push({type: 'heading', level: heading[1].length as 1 | 2 | 3, text: heading[2]});
      index++;
    } else if (demo) {
      flushParagraph(paragraph, nodes);
      nodes.push({type: 'demo', text: demo[1]});
      index++;
    } else if (unordered || ordered) {
      flushParagraph(paragraph, nodes);
      const type = unordered ? 'unordered-list' : 'ordered-list';
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].trim().match(type === 'unordered-list' ? /^-\s+(.+)$/ : /^\d+\.\s+(.+)$/);
        if (!item) break;
        items.push(item[1]);
        index++;
      }
      nodes.push({type, items});
    } else {
      paragraph.push(line);
      index++;
    }
  }
  flushParagraph(paragraph, nodes);
  return nodes;
}

export function getFaqContent(locale: SiteLocale = defaultLocale): FaqContent {
  return messages[locale].faq;
}

/** Removes the introductory experience block, which duplicated the case studies below it. */
function removeExperienceSection(nodes: MarkdownNode[]): MarkdownNode[] {
  const experienceHeadings = new Set(['Опыт в похожих задачах', 'Relevant experience']);
  const result: MarkdownNode[] = [];
  let skipSection = false;

  for (const node of nodes) {
    if (node.type === 'heading' && node.level === 2) {
      skipSection = experienceHeadings.has(node.text);
    }
    if (!skipSection) result.push(node);
  }

  return result;
}

export function getSitePage(id: SitePageId, locale: SiteLocale = defaultLocale): SitePage {
  const page = messages[locale].site.pages[id === 'home' ? 'index' : id];
  if (!page) throw new Error(`Unknown site page: ${id}`);
  const normalizeCopy = (text: string) => text
    .replaceAll('Забронировать платную диагностику', 'Связаться со мной')
    .replaceAll('Забронировать диагностику', 'Связаться со мной')
    .replaceAll('Book a diagnostic', 'Contact me')
    .replaceAll('Диагностика всегда платная', 'Диагностика оплачивается отдельно')
    .replaceAll('Диагностика остаётся платной', 'Диагностика оплачивается отдельно')
    .replaceAll('Платная диагностика', 'Диагностика')
    .replaceAll('платная диагностика', 'диагностика')
    .replaceAll('платную диагностику', 'диагностику')
    .replaceAll('платной диагностики', 'диагностики')
    .replaceAll('платной', 'отдельной');
  const metadata = {...page.metadata, title: normalizeCopy(page.metadata.title), description: normalizeCopy(page.metadata.description), offer: normalizeCopy(page.metadata.offer), cta: normalizeCopy(page.metadata.cta)};
  return {metadata, nodes: removeExperienceSection(parseMarkdown(normalizeCopy(page.body)))};
}

export function getAllPageMetadata(locale: SiteLocale = defaultLocale): Array<PageMetadata & {id: SitePageId}> {
  return (['home', ...siteSlugs] as SitePageId[]).map(id => ({id, ...getSitePage(id, locale).metadata}));
}
