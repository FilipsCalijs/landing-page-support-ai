'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from './ui/Icon'

/**
 * Language menu. Every entry is a real link to /<code>, so choosing a language
 * navigates and the page comes back translated.
 *
 * It used to hold the choice in local state, which highlighted the new language
 * and changed nothing else - the copy is rendered on the server from the URL, and
 * nothing had told the server anything. `active` is now read from the path, so
 * what is ticked is always what is actually being shown.
 *
 * The list arrives as a prop rather than being imported: the languages come from
 * the files in /content, and importing that module here would pull every
 * language's copy into the browser bundle to draw a dropdown.
 */
export default function LanguageSwitcher({ label = 'Change language', locales = [], locale }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!open) return

    function onPointerDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // Close on navigation: the menu is not unmounted by a route change, so without
  // this it stays open over the new page.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const current = locales.find((l) => l.code === locale) || locales[0]

  // One language is not a choice - drawing a dropdown that can only pick what is
  // already picked is noise.
  if (!current || locales.length < 2) return null

  /**
   * Same page, different language: swap the first path segment. Built from the
   * current path rather than hardcoded to "/" so this keeps working once there
   * are pages below the home page.
   */
  const hrefFor = (code) => {
    const rest = pathname.split('/').slice(2).join('/')
    return rest ? `/${code}/${rest}` : `/${code}`
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        className="inline-flex h-11 items-center gap-1.5 rounded-btn px-3 text-sm font-medium text-white/70 transition-colors hover:bg-card hover:text-fg"
      >
        <Icon name="globe" className="h-[18px] w-[18px]" />
        <span>{current.short}</span>
        <Icon
          name="chevron"
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <ul
          aria-label={label}
          // Capped and scrollable: the list is as long as the number of
          // dictionaries, and at two dozen languages an uncapped menu runs off
          // the bottom of the screen with the last entries unreachable.
          className="absolute end-0 z-50 mt-2 max-h-80 w-44 overflow-y-auto rounded-card border border-card-b bg-card p-1.5 shadow-2xl shadow-black/60"
        >
          {locales.map((item) => {
            const isCurrent = item.code === locale

            return (
              <li key={item.code}>
                <Link
                  href={hrefFor(item.code)}
                  // A different language is a different document, so the whole
                  // tree is replaced anyway; `hrefLang` states which language is
                  // on the other end of the link.
                  hrefLang={item.htmlLang}
                  aria-current={isCurrent ? 'true' : undefined}
                  className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-sm transition-colors hover:bg-regular ${
                    isCurrent ? 'bg-regular/60 text-accent' : 'text-white/70'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-white/25">{item.short}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
