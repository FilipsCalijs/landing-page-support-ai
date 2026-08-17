/**
 * Every URL on the page, in one place.
 *
 * A URL is not copy. It is the same on the .com, the .ru and every other domain,
 * so keeping it inside the language files meant the same string repeated across
 * all of them - and a link that had to be changed in 22 places, with 21 chances
 * to miss one. The language files carry labels only; the destinations live here.
 *
 * Once there are real pages, their paths have to carry the language - "/pricing"
 * would leave /de for the English site, "/de/pricing" is the link. Anchors never
 * do: they point inside the page that is already open.
 *
 * Positional: entry i of a list here is the destination of label i in the
 * matching list in /content. A language with more labels than there are links
 * falls back to "#" rather than crashing, but the intent is that these lists and
 * the label lists stay the same length.
 */

// The offer every button leads to.
const OFFER = 'https://clothoff.app/r/Eybe8q9s3PHy891dxIENEb5OamEhALUV?if=0'

// Free credits and promo codes - the bot the copy keeps pointing at.
const TELEGRAM = 'https://t.me/nsfwfreebot?start=_tgr_FAiy7RY1ZmNk'

export const links = {
  // hero upload button
  heroCta: OFFER,

  // header menu - the four in-page anchors
  nav: ['#tools', '#how-to', '#benefits', '#faq'],

  // header social buttons. `icon` is a key from components/ui/Icon.js; it is not
  // copy either, so it sits here next to the destination instead of being
  // repeated in every language file.
  social: [{ icon: 'send', href: TELEGRAM }],

  // the "Try now" button on each tool card
  tools: [OFFER, OFFER, OFFER, OFFER, OFFER, OFFER],

  // the button under the before/after band
  showcaseCta: OFFER,

  // Closing row of the comparison table, one link per column: ours, then the two
  // competitors the table names. Each one goes to the product in its own column -
  // pointing all three at our offer would make the comparison a lie, and the
  // reader clicks the column heading they were reading about.
  comparisonCta: ['https://sweetiecompanion.com/', OFFER, 'https://undress.cc/?ref=927a7b30'],

  // footer link columns, in the order the columns are declared in /content
  footerColumns: [
    [OFFER, OFFER, OFFER, OFFER],
    ['#how-to', '#faq', TELEGRAM, OFFER],
    // Legal column - terms, privacy, 18+ policy, refunds. On the offer for now
    // because there are no policy pages yet; they need real documents of their
    // own before launch, not a redirect to a product.
    [OFFER, OFFER, OFFER, OFFER],
  ],

  // the legal row at the very bottom - same caveat as the column above
  footerLegal: [OFFER, OFFER, OFFER],
}

/** Destination of the i-th entry of a list, or "#" when the list is shorter. */
export function at(list, i) {
  return list?.[i] || '#'
}

/**
 * Props for a link, given where it goes.
 *
 * Anything off-site opens in a new tab and is marked `sponsored`: these are
 * affiliate and referral URLs, and Google asks that paid links say so - an
 * unmarked one puts the domain at risk rather than passing it any credit.
 * `noopener` is there because the new tab would otherwise get a handle on this
 * window through `window.opener`.
 *
 * In-page anchors and internal paths get nothing extra: same site, same tab.
 */
export function linkProps(href) {
  const external = typeof href === 'string' && href.startsWith('http')

  return external ? { href, target: '_blank', rel: 'sponsored noopener' } : { href }
}
