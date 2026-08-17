'use client'

import { useEffect, useRef, useState } from 'react'
import BikiniMark from './ui/BikiniMark'
import { site } from '@/lib/site'

// Bumping this shows the notice again to everyone - which is the point if the
// terms themselves change. The old value is simply never matched again.
const STORAGE_KEY = 'age-gate-accepted-v1'

/**
 * Age and consent notice, shown once to a first-time visitor over a blurred page.
 *
 * Rendered as nothing on the server and on the first client paint, then decided
 * after mount. That order matters both ways: the markup is identical on both
 * sides so hydration never mismatches, and the page underneath is fully
 * rendered - and indexable - rather than sitting behind a wall a crawler has to
 * click through.
 *
 * The record lives in localStorage rather than in a cookie: nothing on the server
 * needs to read it, and a cookie would be sent on every single request for no
 * reason. It also keeps this out of consent-banner territory - there is no
 * tracking here, just a note of which build's terms were accepted.
 */
export default function AgeGate({ content }) {
  // null = not decided yet, so nothing renders. Set once, after mount.
  const [open, setOpen] = useState(null)
  const acceptRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    let accepted = false

    // Private-mode Safari throws on localStorage. A visitor who cannot store the
    // answer still gets the notice - annoying on repeat visits, but the
    // alternative is a crash on the first one.
    try {
      accepted = window.localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      accepted = false
    }

    setOpen(!accepted)
  }, [])

  // The page must not scroll behind an open dialog, and focus must not walk out
  // of it. Focus goes to Accept because that is the one thing to do here.
  useEffect(() => {
    if (!open) return undefined

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    acceptRef.current?.focus()

    // No Escape handler and no click-outside: this is the one dialog that must
    // not be dismissible by accident, because dismissing it is a legal
    // confirmation. Tab is caught and wrapped instead.
    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return

      const focusable = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // Storage refused: let them through anyway rather than trapping them on a
      // notice they have already agreed to.
    }

    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      // The blur is on the backdrop, so the page shows through out of focus
      // rather than being hidden behind a flat sheet. The tint under it is what
      // keeps the text readable over whatever part of the page is behind.
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-body/70 p-4 backdrop-blur-md sm:p-6"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={content.a11yLabel}
        className="my-auto w-full max-w-2xl rounded-[28px] border border-card-b bg-card p-6 shadow-2xl shadow-black/70 motion-safe:animate-fade-up sm:p-10"
      >
        <div className="flex items-center justify-center gap-3">
          <BikiniMark className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" idSuffix="-gate" />
          {/* Not an h1 or h2: the page below has its own heading outline, and the
              brand name is not a section of this document. */}
          <p className="inline-flex items-baseline text-xl font-extrabold lowercase tracking-tight sm:text-2xl">
            <span>{site.name}</span>
            <span className="text-accent">{site.nameSuffix}</span>
          </p>
        </div>

        {/* An ordered list, because the numbers are part of the content here -
            these are numbered terms, and "point 2" has to mean something. The
            numerals are drawn from the list position, so a locale with a fifth
            rule numbers it without anyone touching this file. */}
        <ol className="mt-7 flex flex-col gap-5 sm:mt-9 sm:gap-6">
          {content.rules.map((rule, i) => (
            <li key={i} className="flex gap-4">
              <span
                aria-hidden="true"
                className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-regular text-sm font-bold text-white/70"
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-white/75 sm:text-base sm:leading-7">
                {rule}
              </p>
            </li>
          ))}
        </ol>

        <button
          ref={acceptRef}
          type="button"
          onClick={accept}
          className="mt-8 w-full rounded-[20px] bg-grad-accent px-6 py-5 text-base font-black uppercase tracking-wide text-black transition-[background] duration-300 hover:bg-grad-accent-h sm:mt-10"
        >
          {content.accept}
        </button>
      </div>
    </div>
  )
}
