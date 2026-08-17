import Image from 'next/image'
import DisplayHeading from './ui/DisplayHeading'
import { benefitMediaAt } from '@/lib/media'
import { ph } from '@/lib/site'

/**
 * Uncapped media fills its half of the 1320px container - ~640px at desktop, the
 * full column below that. A capped one never gets there, so it is told a smaller
 * number: `sizes` is what the optimizer picks a file for, and asking for 640px to
 * paint 340 is a download nothing can show.
 */
const SIZES = {
  none: '(min-width: 1024px) 640px, 92vw',
  square: '(min-width: 1024px) 440px, 92vw',
  portrait: '(min-width: 1024px) 340px, 92vw',
}

// The cap classes, by shape. Static strings, because Tailwind reads the source -
// a class assembled at runtime is a class that never gets generated.
const CAPS = {
  square: 'mx-auto max-w-[440px]',
  portrait: 'mx-auto max-w-[300px] sm:max-w-[340px]',
}

const FRAME = 'block h-auto w-full rounded-btn'

/**
 * The delivered cards come in four different shapes - wide, square, 4:3 and
 * portrait - and the row is `h-auto`, so each one keeps its aspect ratio and sets
 * its own height. Left alone, a 2048x2048 square would be 640px tall and tower
 * over the row above it.
 *
 * `cap` is the fix: hold the tall shapes to a sensible width and centre them in
 * their half of the row rather than stretching them to fill it. `contain` is for
 * the cutouts, whose transparent edges are part of the artwork.
 */
function frameFor(media) {
  const fit = media?.fit === 'contain' ? 'object-contain' : 'object-cover'
  const cap = CAPS[media?.cap] || ''

  return `${FRAME} ${fit} ${cap}`.trim()
}

/**
 * The picture for one row: the real file when there is one, the grey placeholder
 * when there is not.
 *
 * Video and image are both possible, because the delivered cards are a mix of
 * stills and clips. A clip here is an illustration rather than something to
 * watch: no controls, muted, looping. `playsInline` is what stops iOS from
 * hijacking it into a fullscreen player on play.
 *
 * The alt text comes from the language file either way. On the video it lands on
 * `aria-label`, since <video> has no alt attribute - without it a screen reader
 * announces nothing but "video".
 */
function Media({ media, alt, title }) {
  const className = frameFor(media)

  if (!media) {
    return (
      <Image
        src={ph(760, 560, title)}
        width={760}
        height={560}
        sizes={SIZES.none}
        alt={alt}
        loading="lazy"
        className={className}
      />
    )
  }

  if (media.type === 'video') {
    return (
      <video
        // Intrinsic size of the file, as on the images: without it the element is
        // 300x150 until metadata arrives and the row jumps.
        width={media.width}
        height={media.height}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
        className={className}
      >
        <source src={media.src} type={media.mime} />
      </video>
    )
  }

  return (
    <Image
      src={media.src}
      width={media.width}
      height={media.height}
      sizes={SIZES[media.cap] || SIZES.none}
      alt={alt}
      loading="lazy"
      className={className}
    />
  )
}

/**
 * Alternating rows: copy on one side, a preview on the other, flipping sides
 * every row on desktop.
 *
 * The flip is `lg:order-*` only. The DOM order is copy-then-media in every row,
 * so the mobile stack and the crawler read the same sequence all the way down
 * instead of the reading order inverting halfway through the section.
 *
 * No CTA in the rows: one button per row repeated four times says nothing the
 * page CTA does not already say, and it is what left the old cards with a
 * button floating in empty space.
 *
 * The files live in lib/media.js by position - see the note there for why they
 * are not in the language files.
 */
export default function Benefits({ content }) {
  return (
    <section id="benefits" aria-labelledby="benefits-title" className="py-16 sm:py-24">
      <div className="container-x">
        <DisplayHeading id="benefits-title" parts={content.heading} />

        <div className="mt-12 flex flex-col gap-6 lg:mt-16 lg:gap-8">
          {content.items.map((item, i) => (
            <article
              key={i}
              className="grid items-center gap-6 rounded-[24px] border border-card-b bg-card p-4 sm:gap-8 sm:p-6 lg:grid-cols-2 lg:gap-12 lg:p-8"
            >
              <div className={i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}>
                <h3 className="text-xl font-bold leading-snug sm:text-2xl">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/50 sm:text-base">
                  {item.body}
                </p>
              </div>

              <div className={i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}>
                <Media media={benefitMediaAt(i)} alt={item.imageAlt} title={item.title} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
