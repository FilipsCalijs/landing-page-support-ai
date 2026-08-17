import Link from 'next/link'
import Icon from './ui/Icon'
import { ph } from '@/lib/site'
import { linkProps, links } from '@/lib/links'

/**
 * Two-column hero: looping video card on the left (tilted, with an offset panel
 * and a blurred accent glow behind it), copy stack on the right - eyebrow,
 * oversized uppercase headline with an accent first line, lead paragraph,
 * gradient CTA.
 *
 * The clip is /public/inpaint-video.mp4. The poster is still a placeholder -
 * it is what shows for the first frames and on a failed load, so a real still
 * from the clip belongs here once there is one.
 */
export default function Hero({ content }) {
  // Optional: an empty list in the JSON drops the line entirely, and the
  // headline then sits at the top of the column instead of under a 16px gap
  // left behind by something that is not there.
  const [eyebrowLead, eyebrowTail] = content.eyebrow || []

  return (
    <section className="relative overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-14 lg:pb-28 lg:pt-16">
      <div className="container-x">
        {/* Not a grid any more. Two fractional tracks each centre their own
            content, so the card and the copy drifted apart to opposite ends of
            the row with a wide dead zone between them. As a centred flex row the
            pair is one group: the gap below is the actual distance between them,
            and the group as a whole sits in the middle of the container. */}
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:justify-center lg:gap-8">
          {/* video card. Fixed width and shrink-0 from lg, otherwise the flex
              row would squeeze it to make room for a long headline. */}
          <div className="order-2 w-full max-w-[300px] sm:max-w-[380px] lg:order-1 lg:shrink-0">
            {/* The whole stack drifts as one, so the card and its double never
                separate. `motion-safe:` keeps it still for anyone who asked for
                reduced motion - the global reset in globals.css only zeroes
                durations, which would freeze this mid-drift instead. */}
            <div className="relative w-full motion-safe:animate-float">
              {/* blurred accent glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 -z-10 bg-grad-accent opacity-20 blur-[80px]"
              />

              {/* The same clip again, behind and out of focus. A flat dark panel
                  used to sit here; a blurred copy of the actual footage carries
                  its colour, so the card reads as one object with depth rather
                  than as artwork pasted onto a rectangle. Decorative: no label,
                  hidden from assistive tech, and it costs one extra decode of a
                  file the browser has already downloaded. */}
              <video
                aria-hidden="true"
                // The offset and the tilt mirror with the page: on a
                // right-to-left layout the double belongs on the other side of
                // the card, leaning the other way.
                className="pointer-events-none absolute inset-0 -z-10 h-full w-full translate-x-[20px] translate-y-[14px] rotate-[7deg] scale-[1.03] rounded-[18px] object-cover opacity-50 blur-[7px] rtl:-translate-x-[20px] rtl:-rotate-[7deg]"
                autoPlay
                muted
                loop
                playsInline
                tabIndex={-1}
              >
                <source src="/inpaint-video.mp4" type="video/mp4" />
              </video>

              {/* Cast shadow under the stack. Warm rather than black: on a black
                  page a black shadow is invisible, and this is what makes the
                  card look lifted off the background instead of glued to it. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-6 left-1/2 -z-10 h-10 w-[78%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-2xl"
              />

              {/* Intrinsic size of the file. Without it the element is 300x150
                  until metadata lands and the whole hero jumps. */}
              <video
                className="relative block h-auto w-full rotate-[3deg] rounded-[14px] object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/15 rtl:-rotate-[3deg]"
                width={1252}
                height={1320}
                autoPlay
                muted
                loop
                playsInline
                poster={ph(1252, 1320, 'Poster')}
                aria-label={content.imageAlt}
              >
                {/* One source only: card1.webm is a different clip, not a webm
                    encode of this one, so listing it here would serve Chrome and
                    Safari two different videos. */}
                <source src="/inpaint-video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* copy. Its own text stays centred, but the block itself is now
              sized to its content (max-w caps the paragraph measure) and sits
              directly beside the card instead of being centred inside a wide
              track. Left-aligned below lg, where it is the full column width and
              there is nothing to balance it against. */}
          <div className="order-1 flex w-full flex-col lg:order-2 lg:max-w-[600px] lg:items-center lg:text-center">
            {eyebrowLead ? (
              <p className="flex items-center gap-4 text-base text-white/50">
                <span>{eyebrowLead}</span>
                {eyebrowTail ? (
                  <>
                    <Icon name="star" className="h-2.5 w-2.5 text-white/50" />
                    <span>{eyebrowTail}</span>
                  </>
                ) : null}
              </p>
            ) : null}

            <h1 className={`${eyebrowLead ? 'mt-4 ' : ''}flex flex-col text-[50px] font-black uppercase leading-[60px] tracking-tight sm:text-[56px] sm:leading-[64px] lg:text-[64px] lg:leading-[74px]`}>
              {content.titleLines.map((line, i) => (
                <span key={i} className={i === 0 ? 'text-accent' : undefined}>
                  {line}
                </span>
              ))}
            </h1>

            <p className="mt-6 max-w-md text-lg leading-[30px] sm:text-xl lg:mx-auto">
              <strong className="block font-normal text-fg">{content.subtitleStrong}</strong>
              <span className="text-white/75">{content.subtitle}</span>
            </p>

            <Link
              {...linkProps(links.heroCta)}
              className="mt-8 inline-flex w-max items-center gap-5 rounded-btn bg-grad-accent px-9 py-6 text-base font-normal text-black transition-[background] duration-300 hover:bg-grad-accent-h"
            >
              <Icon name="upload" className="h-5 w-5" strokeWidth={2} />
              <span aria-hidden="true" className="h-[1em] w-0.5 bg-black" />
              <span>{content.cta}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
