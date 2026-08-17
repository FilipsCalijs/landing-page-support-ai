import '../globals.css'
import { Geologica } from 'next/font/google'
import { notFound } from 'next/navigation'
import { site } from '@/lib/site'
import { directionOf, getContent, isLocale, locales } from '@/lib/content'

const geologica = Geologica({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '900'],
  display: 'swap',
  variable: '--font-geologica',
})

/**
 * The root layout. It lives under [locale] rather than at app/ because the one
 * thing a layout owns that a page cannot is <html lang>, and that value differs
 * per language - a single root layout would have had to pick one language and
 * label every translation with it.
 */

// Prerendered at build time, one document per language.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
  const { meta } = getContent(params.locale)

  return {
    metadataBase: new URL(site.url),
    title: {
      default: meta.siteTitle,
      template: meta.titleTemplate,
    },
    description: meta.pageDescription,
    applicationName: site.name,
    referrer: 'origin-when-cross-origin',
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  }
}

export const viewport = {
  themeColor: '#0e0e0e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children, params }) {
  // /xx for an unknown xx is a 404, not a silent fallback to English: a URL that
  // answers 200 with the wrong language is a page search engines will index.
  if (!isLocale(params.locale)) notFound()

  const { meta } = getContent(params.locale)

  return (
    // dir mirrors the whole page for Arabic and any other right-to-left
    // language: reading order, the nav, the grids, the paddings. It has to be on
    // <html> - set anywhere lower and the page chrome stays the wrong way round.
    // The components use logical properties (ms/me, start/end) so they follow it
    // rather than being pinned to physical left and right.
    <html lang={meta.htmlLang} dir={directionOf(params.locale)} className={geologica.variable}>
      <body className="bg-body font-sans text-fg antialiased">{children}</body>
    </html>
  )
}
