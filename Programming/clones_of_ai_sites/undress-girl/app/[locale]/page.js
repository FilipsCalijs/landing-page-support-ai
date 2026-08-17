import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Showcase from '@/components/Showcase'
import Tools from '@/components/Tools'
import Benefits from '@/components/Benefits'
import HowTo from '@/components/HowTo'
import Comparison from '@/components/Comparison'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import AgeGate from '@/components/AgeGate'

import { getContent, getLocales, locales } from '@/lib/content'
import { site } from '@/lib/site'

const ogImage = 'https://placehold.co/1200x630/18181b/ffffff/png'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/**
 * Per-language metadata. `alternates` is the part that matters beyond the title:
 * every translation points at every other one, so search engines treat them as
 * one page in many languages instead of a pile of near-duplicates.
 */
export async function generateMetadata({ params }) {
  const { meta } = getContent(params.locale)

  const languages = Object.fromEntries(
    getLocales().map((locale) => [locale.htmlLang, `/${locale.code}`])
  )

  return {
    title: meta.pageTitle,
    description: meta.pageDescription,
    alternates: {
      canonical: `/${params.locale}`,
      languages: { ...languages, 'x-default': `/${site.defaultLocale}` },
    },
    openGraph: {
      type: 'website',
      url: `${site.url}/${params.locale}`,
      siteName: site.name,
      title: meta.pageTitle,
      description: meta.pageDescription,
      locale: meta.ogLocale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.ogImageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.pageTitle,
      description: meta.pageDescription,
      images: [ogImage],
    },
  }
}

export default function HomePage({ params }) {
  const t = getContent(params.locale)
  const url = `${site.url}/${params.locale}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        description: t.meta.pageDescription,
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { '@id': `${site.url}/#organization` },
        inLanguage: t.meta.htmlLang,
      },
      {
        '@type': 'WebPage',
        '@id': `${url}/#webpage`,
        url,
        name: t.meta.pageTitle,
        description: t.meta.pageDescription,
        isPartOf: { '@id': `${site.url}/#website` },
        inLanguage: t.meta.htmlLang,
      },
      {
        // Built from the same list the accordion renders, so the questions
        // Google is told about are the questions on the page - however many this
        // language happens to have.
        '@type': 'FAQPage',
        '@id': `${url}/#faq`,
        inLanguage: t.meta.htmlLang,
        mainEntity: t.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="page-bg" aria-hidden="true" />

      <Navbar content={t.nav} locales={getLocales()} locale={params.locale} />

      <main>
        <Hero content={t.hero} />
        <Stats content={t.stats} />
        <Tools content={t.tools} />
        <Showcase content={t.showcase} />
        <HowTo content={t.howTo} />
        <Comparison content={t.comparison} />
        <Benefits content={t.benefits} />
        <FAQ content={t.faq} />
      </main>

      <Footer content={t.footer} locale={params.locale} />

      {/* Last in the tree: it covers the page when it is open, and being last
          means it needs no z-index race with the sticky header. */}
      <AgeGate content={t.gate} />
    </>
  )
}
