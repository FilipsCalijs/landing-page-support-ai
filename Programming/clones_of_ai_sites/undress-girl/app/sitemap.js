import { site } from '@/lib/site'
import { getLocales, locales } from '@/lib/content'

// Add entries here as pages land. '' is the home page; a route is written without
// the language prefix, which is added below for every language.
const routes = ['']

/**
 * One entry per language per route, each listing all the others as alternates.
 * That is what tells a crawler these are translations of one page rather than a
 * couple of dozen separate pages that happen to look alike.
 */
export default function sitemap() {
  const all = getLocales()

  return routes.flatMap((route) =>
    locales.map((locale) => {
      const path = route ? `${locale}/${route}` : locale

      return {
        url: `${site.url}/${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            all.map((item) => [
              item.htmlLang,
              `${site.url}/${route ? `${item.code}/${route}` : item.code}`,
            ])
          ),
        },
      }
    })
  )
}
