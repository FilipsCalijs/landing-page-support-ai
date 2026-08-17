/**
 * Single source of truth for site-wide constants.
 * Everything env-driven so Coolify can override without a rebuild of the source.
 */
export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'removedorderoupa',
  // rendered right after `name` in the wordmark, in the accent colour
  nameSuffix: process.env.NEXT_PUBLIC_SITE_NAME_SUFFIX || '.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://removedorderoupa.com',
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en',
  // The list of languages is not here: it comes from the files in /content, via
  // getLocales() in lib/content.js. A language exists when its file exists.
}

/**
 * placehold.co helper - `/png` keeps next/image from choking on remote SVG.
 *
 * `bg` exists for placeholders that have to differ from each other: a before/after
 * pair rendered in one colour looks like a still frame, so the reveal reads as
 * broken rather than as a wipe that has nothing to show yet.
 */
export function ph(w, h, text, bg = '18181b') {
  const base = `https://placehold.co/${w}x${h}/${bg}/ffffff/png`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
