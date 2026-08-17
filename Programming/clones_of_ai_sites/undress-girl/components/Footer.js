import Link from 'next/link'
import Logo from './ui/Logo'
import { site } from '@/lib/site'
import { links, at, linkProps } from '@/lib/links'

export default function Footer({ content, locale }) {
  return (
    <footer className="border-t border-divider bg-body">
      <div className="container-x py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-8">
          <div className="max-w-sm">
            <Logo label={content.logoLabel} locale={locale} idSuffix="-footer" />
            <p className="mt-4 text-sm leading-relaxed text-white/50">{content.description}</p>
          </div>

          {content.columns.map((column, i) => (
            <nav key={i} aria-label={column.title}>
              <h2 className="text-sm font-semibold">{column.title}</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((label, j) => (
                  <li key={j}>
                    <Link
                      {...linkProps(at(links.footerColumns[i], j))}
                      className="text-sm text-white/50 transition-colors hover:text-accent"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-divider pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/25">
            © {new Date().getFullYear()} {site.name}. {content.copyright}
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {content.legal.map((label, i) => (
              <li key={i}>
                <Link
                  {...linkProps(at(links.footerLegal, i))}
                  className="text-sm text-white/25 transition-colors hover:text-accent"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
