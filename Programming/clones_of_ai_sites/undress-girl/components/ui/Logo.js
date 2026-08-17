import Link from 'next/link'
import BikiniMark from './BikiniMark'
import { site } from '@/lib/site'

/**
 * The wordmark: the bikini mark, then the name.
 *
 * The name itself is configuration - it comes from the environment so a
 * deployment can be renamed without a rebuild - but the spoken label around it is
 * copy, so it arrives as a prop from the JSON, already with the name substituted
 * in.
 *
 * The mark is decorative here: the link already says where it goes through
 * `aria-label`, and a screen reader announcing "image, bikini" before the brand
 * name would only get in the way.
 *
 * `idSuffix` keeps the gradient ids apart - the header and the footer both render
 * one of these, and duplicate ids make the second mark inherit the first one's
 * fill.
 */
export default function Logo({ label, locale, idSuffix = '', className = '' }) {
  return (
    <Link
      href={locale ? `/${locale}` : '/'}
      className={`inline-flex items-center gap-2 text-xl font-extrabold lowercase tracking-tight sm:text-[22px] ${className}`}
      aria-label={label}
    >
      <BikiniMark className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" idSuffix={idSuffix} />
      <span className="inline-flex items-baseline">
        {/* The name is long enough that it wraps on a 320px screen next to the
            mark, so it is allowed to shrink rather than pushing the burger off. */}
        <span className="truncate">{site.name}</span>
        <span className="text-accent">{site.nameSuffix}</span>
      </span>
    </Link>
  )
}
