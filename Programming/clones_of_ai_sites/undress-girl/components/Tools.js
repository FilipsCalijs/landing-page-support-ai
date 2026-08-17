import Image from 'next/image'
import SectionHeading from './ui/SectionHeading'
import Button from './ui/Button'
import Icon from './ui/Icon'
import { links, at, linkProps } from '@/lib/links'

// One card is a third of the 1320px container at desktop, a half at tablet and
// the full column width on a phone - so the optimizer is told to serve a small
// file rather than the intrinsic 800px to every device.
const SIZES = '(min-width: 1024px) 420px, (min-width: 640px) 46vw, 92vw'

/**
 * Six-card tool grid. Every card is a preview image, a title, a short body and
 * a link out; one of them carries a highlight pill.
 *
 * The previews are the real files from /public/photo-modes, all 800x500; the
 * width/height passed below are those intrinsic numbers, which is what reserves
 * the box before the file lands and holds CLS at 0. The copy is still lorem in
 * lib/content.js.
 *
 * A Server Component: nothing here needs JS, and the card copy is indexable text.
 */
export default function Tools({ content }) {
  return (
    <section id="tools" aria-labelledby="tools-title" className="py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading id="tools-title" title={content.title} />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {/* Keyed by position, not by the title: the title is copy, and copy is
              the one thing that can come back identical or empty from a
              half-finished translation - which collapses two entries onto one
              key and leaves React reusing the wrong card. */}
          {content.items.map((item, i) => (
            <li
              key={i}
              className="flex flex-col rounded-[24px] border border-card-b bg-card p-4 sm:p-5"
            >
              <div className="relative overflow-hidden rounded-btn">
                <Image
                  src={item.image}
                  width={800}
                  height={500}
                  sizes={SIZES}
                  alt={item.imageAlt}
                  loading="lazy"
                  className="block h-auto w-full object-cover"
                />

                {item.badge ? (
                  <span className="absolute end-3 top-3 rounded-pill bg-grad-accent px-3 py-1 text-xs font-bold text-black">
                    {content.badge}
                  </span>
                ) : null}
              </div>

              {/* h3, not h2: the section heading above is the h2 on this page. */}
              <h3 className="mt-5 text-lg font-bold sm:text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50 sm:text-base">
                {item.body}
              </p>

              {/* mt-auto on the wrapper pins the button to the bottom of the
                  card, so the row of buttons lines up even when one card's body
                  wraps to an extra line; pt-6 keeps the gap when it does not. */}
              <div className="mt-auto pt-6">
                <Button
                  {...linkProps(at(links.tools, i))}
                  variant="outline"
                  size="md"
                  className="gap-3"
                  aria-label={`${content.cta} - ${item.title}`}
                >
                  <span>{content.cta}</span>
                  <Icon name="arrow" className="h-4 w-4" strokeWidth={2} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
