const paths = {
  upload: (
    <>
      <path d="M12 15.5V4m0 0L8 8m4-4 4 4" />
      <path d="M4.5 15.5v2.75a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V15.5" />
    </>
  ),
  star: (
    <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.7l5.9-.8L12 3.5Z" />
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  arrow: <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  dash: <path d="M5 12h14" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M3.25 12h17.5M12 3.25c2.2 2.4 3.4 5.5 3.4 8.75S14.2 18.35 12 20.75c-2.2-2.4-3.4-5.5-3.4-8.75S9.8 5.65 12 3.25Z" />
    </>
  ),
  send: <path d="M21 3 3 10.5l7 2.8m11-10.3-7.5 18-2.6-7.7m10.1-10.3-10.1 10.3" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
}

// Icons that mean "forward". Mirrored on a right-to-left page; everything else,
// including the telegram mark, is left alone - a flipped logo is a broken logo.
const DIRECTIONAL = new Set(['arrow'])

/**
 * Inline SVG icon set - no icon library dependency, no extra network request.
 * Decorative by default; pass a `title` when the icon carries meaning alone.
 */
export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.75, title }) {
  const shape = paths[name]
  if (!shape) return null

  const cls = DIRECTIONAL.has(name) ? `${className} rtl:-scale-x-100` : className

  const filled = name === 'star'

  return (
    <svg
      viewBox="0 0 24 24"
      className={cls}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {shape}
    </svg>
  )
}
