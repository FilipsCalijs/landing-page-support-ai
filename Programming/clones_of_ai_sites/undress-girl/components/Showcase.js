'use client'

import { useState } from 'react'
import BeforeAfter from './BeforeAfter'
import SectionHeading from './ui/SectionHeading'
import Button from './ui/Button'
import Icon from './ui/Icon'
import { linkProps, links } from '@/lib/links'

/**
 * Two-column band: the before/after frame on the left, the pitch on the right.
 *
 * The heading and the paragraph belong to the slide, not to the section - they
 * change in the same instant the photo does, whether that came from the timer or
 * from a click on the pager. That is why the current index lives here and not
 * inside BeforeAfter: the frame and the copy have to read the same number, and
 * the only way to guarantee that is for there to be one number.
 *
 * No card or panel around the frame - the corner brackets are its framing, and a
 * second border on top of them reads as a mistake.
 */
export default function Showcase({ content }) {
  const [index, setIndex] = useState(0)

  const slide = content.slides[index] || content.slides[0]

  // The section is the slides; with none there is nothing to head or to show.
  if (!slide) return null

  return (
    <section id="showcase" aria-labelledby="showcase-title" className="py-16 sm:py-24">
      <div className="container-x">
        {/* Asymmetric split: the frame is square, so at 50/50 it stood twice as
            tall as the copy beside it and `items-center` padded the text column
            out with dead space. Narrowing the media track to 0.75fr shrinks the
            frame instead of pushing the row taller, and the two columns end up
            close to the same height. */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-10">
          <BeforeAfter content={content} index={index} onIndexChange={setIndex} />

          <div>
            {/* Keyed by index so React replays the entrance on every change:
                without it the words are simply different from one frame to the
                next, which reads as a glitch rather than as a swap. */}
            <div key={index} className="motion-safe:animate-fade-up">
              <SectionHeading
                id="showcase-title"
                align="left"
                title={slide.title}
                subtitle={slide.body}
              />
            </div>

            {/* Outside the keyed block: the button is the same offer for every
                slide, and re-animating it would say otherwise. */}
            <Button {...linkProps(links.showcaseCta)} size="lg" className="mt-8 gap-3">
              <span>{content.cta}</span>
              <Icon name="arrow" className="h-5 w-5" strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
