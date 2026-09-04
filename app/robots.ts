import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/seo';

/** Разрешает индексацию публичных страниц и указывает карту сайта. */
export default function robots(): MetadataRoute.Robots {
  return {rules: {userAgent: '*', allow: '/'}, sitemap: new URL('/sitemap.xml', siteUrl).toString()};
}
