export const siteSlugs = ['ai-workflow-rescue', 'payments-reliability', 'ai-launch-gate', 'capabilities'] as const;
export type SiteSlug = (typeof siteSlugs)[number];

export const siteRouteSegments = [[], ['cv'], ...siteSlugs.map(slug => [slug])] as const;

export function isSiteSlug(value: string): value is SiteSlug {
  return (siteSlugs as readonly string[]).includes(value);
}

/** True only for publicly supported non-localized path segments. */
export function isCanonicalRouteSegments(segments: readonly string[]): boolean {
  return segments.length === 0 || (segments.length === 1 && (segments[0] === 'cv' || isSiteSlug(segments[0])));
}
