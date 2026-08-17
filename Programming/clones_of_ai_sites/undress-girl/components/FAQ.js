'use client'

import { useState } from 'react'
import SectionHeading from './ui/SectionHeading'
import Icon from './ui/Icon'

export default function FAQ({ content }) {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" aria-labelledby="faq-title" className="py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading
          id="faq-title"
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={content.subtitle}
        />

        <ul className="mx-auto mt-12 max-w-3xl divide-y divide-divider overflow-hidden rounded-card border border-card-b bg-card lg:mt-16">
          {content.items.map((item, i) => {
            const isOpen = open === i

            return (
              <li key={i}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-start transition-colors hover:bg-regular/50 sm:px-6"
                  >
                    <span className="text-sm font-semibold sm:text-base">{item.q}</span>
                    <Icon
                      name="chevron"
                      className={`h-5 w-5 shrink-0 text-accent transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      strokeWidth={2}
                    />
                  </button>
                </h3>

                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  hidden={!isOpen}
                  className="px-5 pb-5 sm:px-6"
                >
                  <p className="text-sm leading-relaxed text-white/50 sm:text-base">{item.a}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
