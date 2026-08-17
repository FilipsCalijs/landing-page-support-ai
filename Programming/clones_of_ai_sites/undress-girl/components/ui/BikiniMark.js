/**
 * The brand mark: a bikini top.
 *
 * Two triangular cups tied by a strap, drawn as flat shapes rather than outlines
 * because a 1px stroke disappears at favicon size. The cups are triangles with
 * one rounded corner each - the tip that would point straight down is softened,
 * which is what keeps the silhouette from reading as two arrows.
 *
 * Deliberately geometric and closed: it has to survive being 16px in a browser
 * tab, where anything anatomical turns into a smudge. The same file is the
 * favicon (app/icon.svg), so any change here belongs there too.
 *
 * `gradient` picks between the accent gradient and flat currentColor. The
 * gradient needs a document-unique id, hence `idSuffix` - two of these on one
 * page with the same id and the second one silently reuses the first one's fill.
 */
export default function BikiniMark({ className = 'h-7 w-7', gradient = true, idSuffix = '' }) {
  const id = `bikini-grad${idSuffix}`

  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      {gradient ? (
        <defs>
          {/* Same angle as bg-grad-accent: yellow at one end, orange at the other. */}
          <linearGradient id={id} x1="30" y1="16" x2="2" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fc9918" />
            <stop offset="1" stopColor="#fbf46d" />
          </linearGradient>
        </defs>
      ) : null}

      {/* The strap, dipping between the cups. Drawn first so the cups sit over
          its ends and it reads as passing behind them. */}
      <path
        d="M2.6 10.4C6 13.2 10.5 14.7 16 14.7s10-1.5 13.4-4.3"
        stroke={gradient ? `url(#${id})` : 'currentColor'}
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Left cup, then right: a triangle from the strap down to a rounded tip. */}
      <path
        d="M14.1 15.4H4.3c-.9 0-1.5.9-1.1 1.7 1.4 3.1 3.6 5.6 6.4 6.9 1.6.8 3.4-.5 3.4-2.3v-5.2c0-.6-.3-1.1-.9-1.1Z"
        fill={gradient ? `url(#${id})` : 'currentColor'}
      />
      <path
        d="M17.9 15.4h9.8c.9 0 1.5.9 1.1 1.7-1.4 3.1-3.6 5.6-6.4 6.9-1.6.8-3.4-.5-3.4-2.3v-5.2c0-.6.3-1.1.9-1.1Z"
        fill={gradient ? `url(#${id})` : 'currentColor'}
      />
    </svg>
  )
}
