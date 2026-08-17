import { NextResponse } from 'next/server'
import { getLocales } from '@/lib/content'
import { site } from '@/lib/site'

/**
 * Every page lives under /<lang>. This sends the bare "/" somewhere real,
 * preferring the language the browser asked for and falling back to the default.
 *
 * The guard below is deliberate rather than left to `matcher`. A path that
 * already has a segment is returned untouched - including an unknown one, so
 * /xx reaches the layout and 404s there instead of being quietly rewritten to
 * English, and including a real language, so /ar is not redirected onto itself.
 */
export function middleware(request) {
  const { pathname } = request.nextUrl

  if (pathname !== '/') return NextResponse.next()

  const preferred = pickLocale(request.headers.get('accept-language'))

  // Built from the request's own origin rather than by mutating a clone: the
  // clone carries internal routing state, and assigning to its pathname was
  // appending to the old path instead of replacing it.
  const url = new URL(`/${preferred}`, request.url)

  // 307, not 308: which language "/" resolves to depends on who is asking, and a
  // permanent redirect would be cached by the browser for everyone after them.
  return NextResponse.redirect(url, 307)
}

/**
 * First language in the Accept-Language header that we have a file for.
 *
 * Each language is matched on both its URL code and its standards tag, because
 * for two of them those differ: br-pt is pt-BR and zh-tw is zh-TW. Matching the
 * code alone would read br-pt's base language as "br" and send a Portuguese
 * browser to English. The exact tag wins over the base language, so pt-BR gets
 * Brazilian Portuguese outright while pt-PT still lands on Portuguese rather
 * than nothing.
 */
function pickLocale(header) {
  if (!header) return site.defaultLocale

  const known = getLocales().map(({ code, htmlLang }) => ({
    code,
    tags: [code.toLowerCase(), htmlLang.toLowerCase()],
  }))

  const wanted = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { tag } of wanted) {
    const exact = known.find((item) => item.tags.includes(tag))
    if (exact) return exact.code

    const base = tag.split('-')[0]
    const loose = known.find((item) => item.tags.some((t) => t.split('-')[0] === base))
    if (loose) return loose.code
  }

  return site.defaultLocale
}

// Static files and the image optimizer never need this; skipping them keeps the
// middleware off every asset request.
export const config = {
  matcher: ['/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)'],
}
