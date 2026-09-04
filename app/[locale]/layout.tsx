import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {Geist, Geist_Mono} from 'next/font/google';
import '../globals.css';
import {isLocale} from '@/lib/i18n';
import {siteUrl} from '@/lib/seo';

const geist = Geist({subsets: ['latin', 'cyrillic'], variable: '--font-geist'});
const geistMono = Geist_Mono({subsets: ['latin', 'cyrillic'], variable: '--font-geist-mono'});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {default: 'Eldiyar', template: '%s | Eldiyar'},
  description: 'Product & Systems Engineer',
  icons: {icon: '/icon.svg', shortcut: '/favicon.svg', apple: '/favicon.svg'},
  robots: {index: true, follow: true}
};

export default async function LocaleLayout({children, params}: Readonly<{children: React.ReactNode; params: Promise<{locale: string}>}>) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={locale} className={`${geist.variable} ${geistMono.variable}`}><body>{children}</body></html>;
}
