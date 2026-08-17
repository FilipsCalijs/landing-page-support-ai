'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from './ui/Logo'
import Icon from './ui/Icon'
import LanguageSwitcher from './LanguageSwitcher'
import { links, at, linkProps } from '@/lib/links'

/**
 * Sticky header: wordmark, menu, socials, language.
 *
 * No log-in and no sign-up button, on purpose: the page has one thing it asks
 * for - the upload CTA in the hero - and a second and third button in the header
 * competed with it. `locales` comes from the server, so the JSON of every
 * language does not have to be shipped to the browser to draw the switcher.
 */
export default function Navbar({ content, locales, locale }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-200 ${
        scrolled ? 'border-divider bg-card/95 backdrop-blur-xl' : 'border-transparent bg-card'
      }`}
    >
      <div className="container-x">
        <div className="flex h-[72px] items-center justify-between gap-4 lg:h-[100px]">
          <Logo label={content.logoLabel} locale={locale} />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-9">
              {content.links.map((label, i) => (
                <li key={i}>
                  <Link
                    href={at(links.nav, i)}
                    className="text-sm text-fg transition-colors hover:text-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <ul className="me-1 flex items-center gap-1">
              {content.social.map((label, i) => (
                <li key={i}>
                  <Link
                    {...linkProps(links.social[i]?.href)}
                    aria-label={label}
                    className="grid h-8 w-8 place-items-center rounded-full border border-divider bg-regular text-white/70 transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon name={links.social[i]?.icon} className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>

            <LanguageSwitcher label={content.langLabel} locales={locales} locale={locale} />
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <LanguageSwitcher label={content.langLabel} locales={locales} locale={locale} />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? content.menuClose : content.menuOpen}
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center rounded-btn text-fg transition-colors hover:bg-card"
            >
              <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="border-t border-divider bg-body lg:hidden">
          <div className="container-x py-4">
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {content.links.map((label, i) => (
                  <li key={i} className="border-b border-card-b last:border-0">
                    <Link
                      href={at(links.nav, i)}
                      onClick={() => setOpen(false)}
                      className="block py-3.5 text-base font-medium text-white/80 transition-colors hover:text-accent"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <ul className="mt-5 flex items-center gap-2">
              {content.social.map((label, i) => (
                <li key={i}>
                  <Link
                    {...linkProps(links.social[i]?.href)}
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-btn border border-card-b text-white/60 transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon name={links.social[i]?.icon} className="h-5 w-5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </header>
  )
}
