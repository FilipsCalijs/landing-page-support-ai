'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import useReducedMotion from '@/hooks/useReducedMotion'

/*
 * One round trip: down, hold on the result, back up, hold on the source - and
 * the next slide follows immediately after it. The four add up to 3000ms, which
 * is what makes the slide change once every three seconds.
 *
 * The advance is not a separate timer. A 3s interval running against a longer
 * sweep would swap the images mid-travel, with the line halfway down a photo
 * that is already the next one; tying both to this cycle means the change can
 * only happen at the moment the line is back at the top.
 */
const DOWN_MS = 1100
const HOLD_MS = 400
const UP_MS = 1100
const REST_MS = 400
const CYCLE_MS = DOWN_MS + HOLD_MS + UP_MS + REST_MS

// The media track is 0.75fr of the 1320px shell, so the frame renders at about
// 460px on a wide screen and full width on a phone.
const SIZES = '(min-width: 1024px) 460px, 92vw'

const HIDDEN = 'inset(0 0 100% 0)'

/** 0 = line at the top, nothing revealed. 1 = line at the bottom, all revealed. */
function progressAt(elapsed) {
  if (elapsed < DOWN_MS) return elapsed / DOWN_MS
  if (elapsed < DOWN_MS + HOLD_MS) return 1
  if (elapsed < DOWN_MS + HOLD_MS + UP_MS) {
    return 1 - (elapsed - DOWN_MS - HOLD_MS) / UP_MS
  }
  return 0
}

// Logical sides, so the brackets sit in the frame's corners in both directions:
// `start` is the left in English and the right in Arabic. rounded-s/e-* and
// border-s/e are the same idea for the radius and the rule.
const CORNERS = [
  'start-3 top-3 rounded-ss-[10px] border-s border-t sm:start-4 sm:top-4',
  'end-3 top-3 rounded-se-[10px] border-e border-t sm:end-4 sm:top-4',
  'start-3 bottom-3 rounded-es-[10px] border-b border-s sm:start-4 sm:bottom-4',
  'end-3 bottom-3 rounded-ee-[10px] border-b border-e sm:end-4 sm:bottom-4',
]

/**
 * Before/after frame with a scanning line: the line travels down over the source
 * image and leaves the result behind it, holds, then travels back up and takes
 * the result with it. One round trip is one slide; the next slide starts only
 * once the line is back at the top.
 *
 * Every slide is in the DOM at once, stacked, with all but the current one at
 * opacity 0. That is not decoration - it is what makes the second and third
 * slide work. Rendering only the active pair meant their files started
 * downloading at the instant the slide became active, and the image pipeline
 * needs over a second on the larger sources, so the line swept across an empty
 * box and the photo appeared somewhere near the end of its own slide. Mounted,
 * every pair is fetched when the section nears the viewport, seconds before it
 * is needed.
 *
 * The sweep is driven by requestAnimationFrame writing inline styles into the
 * layers through refs - not by CSS keyframes - for two reasons:
 *
 * 1. The revealed area must always end exactly at the line. Both directions run
 *    the same `inset(0 0 (1 - progress)*100% 0)`, so the reveal edge and the
 *    line are the same number by construction. Flipping the inset side on the
 *    way back would put the edge at the top while the line is at the bottom.
 * 2. Reduced motion is decided here, in JS: the loop never starts and the result
 *    frame is shown statically. A CSS animation would be swallowed whole by the
 *    usual global `animation-duration: 0.01ms !important` reset, which reads as
 *    "the component is broken" rather than "motion is off".
 *
 * Slides come in whole through `content`: path, alt and intrinsic size per
 * frame. The files are the square pairs in /public/before_after.
 *
 * The index is not held here. Showcase owns it, because the copy beside the
 * frame is part of the slide and has to change on the same tick.
 */
export default function BeforeAfter({ content, index, onIndexChange }) {
  const { ariaLabel, pagerLabel, slideLabel, slides } = content
  const reducedMotion = useReducedMotion()

  // One reveal node per slide, by position.
  const layersRef = useRef([])
  const lineRef = useRef(null)

  // The loop runs outside React's render, so it reads the current slide from a
  // ref rather than from the prop it closed over on the frame it started.
  const activeRef = useRef(index)
  // The cycle's origin. Picking a slide by hand clears it, and the next frame
  // re-seeds it to `now`. That restarts the sweep for the chosen slide instead
  // of dropping the viewer into the middle of a pass that was already half over.
  const startRef = useRef(0)

  useEffect(() => {
    activeRef.current = index
  }, [index])

  useEffect(() => {
    if (reducedMotion) return undefined

    let frame = 0

    // Every layer, not just the one leaving: a layer that is skipped past keeps
    // the clip it was left with, and would come back mid-reveal.
    const resetLayers = () => {
      for (const layer of layersRef.current) {
        if (layer) layer.style.clipPath = HIDDEN
      }
    }

    const tick = (now) => {
      if (!startRef.current) startRef.current = now

      let elapsed = now - startRef.current

      if (elapsed >= CYCLE_MS) {
        startRef.current += CYCLE_MS
        elapsed -= CYCLE_MS

        const next = (activeRef.current + 1) % slides.length
        activeRef.current = next
        resetLayers()
        onIndexChange(next)
      }

      const progress = progressAt(elapsed)
      const layer = layersRef.current[activeRef.current]

      if (layer) {
        layer.style.clipPath = `inset(0 0 ${(1 - progress) * 100}% 0)`
      }

      if (lineRef.current) {
        lineRef.current.style.transform = `translateY(${progress * 100}%)`
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [reducedMotion, slides.length, onIndexChange])

  /**
   * Jump to a slide from the pager. The sweep is rewound to the top by hand
   * because the loop only writes styles on its next frame - without this the
   * new photo would appear under a line still sitting wherever it was.
   */
  const show = (slideIndex) => {
    activeRef.current = slideIndex
    onIndexChange(slideIndex)

    if (reducedMotion) return

    startRef.current = 0

    for (const layer of layersRef.current) {
      if (layer) layer.style.clipPath = HIDDEN
    }

    if (lineRef.current) {
      lineRef.current.style.transform = 'translateY(0%)'
    }
  }

  return (
    <div aria-label={ariaLabel} role="group">
      <div className="relative aspect-square w-full overflow-hidden rounded-card bg-body">
        {slides.map((slide, slideIndex) => {
          const isCurrent = slideIndex === index

          return (
            <div
              key={slideIndex}
              aria-hidden={!isCurrent}
              className={`absolute inset-0 transition-opacity duration-300 ${
                isCurrent ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <Image
                src={slide.before.src}
                alt={slide.before.alt}
                width={slide.before.width}
                height={slide.before.height}
                sizes={SIZES}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div
                ref={(node) => {
                  layersRef.current[slideIndex] = node
                }}
                className="absolute inset-0"
                style={{ clipPath: reducedMotion ? 'none' : HIDDEN }}
              >
                <Image
                  src={slide.after.src}
                  alt={slide.after.alt}
                  width={slide.after.width}
                  height={slide.after.height}
                  sizes={SIZES}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          )
        })}

        {reducedMotion ? null : (
          <div
            ref={lineRef}
            className="pointer-events-none absolute inset-0 will-change-transform"
            aria-hidden="true"
          >
            {/* Trail above the line over the part already revealed, and a soft
                spill below it. Without the pair the line reads as a flat rule. */}
            <span className="absolute inset-x-0 -top-14 h-14 bg-gradient-to-t from-accent/25 to-transparent" />
            <span className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-accent/15 to-transparent" />
            <span className="absolute inset-x-0 top-0 h-[2px] bg-accent shadow-[0_0_20px_5px_rgba(252,153,24,0.55)]" />
          </div>
        )}

        {CORNERS.map((corner) => (
          <span
            key={corner}
            className={`pointer-events-none absolute h-6 w-6 border-white/45 sm:h-7 sm:w-7 ${corner}`}
            aria-hidden="true"
          >
            <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
          </span>
        ))}
      </div>

      {/* Real controls now, so they are buttons: each one reports whether its
          slide is showing and switches to it on click. Keyed by position - alt
          text is copy, and copy is the one thing that can turn out identical
          (or empty) across entries. */}
      <div
        role="group"
        aria-label={pagerLabel}
        className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-pill border border-card-b bg-card px-3 py-2"
      >
        {slides.map((item, slideIndex) => {
          const isCurrent = slideIndex === index

          return (
            <button
              key={slideIndex}
              type="button"
              onClick={() => show(slideIndex)}
              aria-label={slideLabel.replace('{n}', slideIndex + 1)}
              aria-current={isCurrent ? 'true' : undefined}
              // A 4px dot is not a thumb-sized target. The pseudo element grows
              // the hit area to about 36px tall without moving anything, since
              // it is out of flow and the pill keeps its size. Sideways it
              // reaches half the gap, so neighbouring targets meet but never
              // overlap - overlapping ones mis-fire.
              className="relative flex items-center after:absolute after:-inset-x-1 after:-inset-y-4 after:content-['']"
            >
              <span
                className={
                  isCurrent
                    ? 'h-1 w-6 rounded-full bg-fg transition-all duration-300'
                    : 'h-1 w-1 rounded-full bg-white/30 transition-all duration-300'
                }
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
