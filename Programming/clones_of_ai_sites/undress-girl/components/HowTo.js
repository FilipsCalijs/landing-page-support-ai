import DisplayHeading from './ui/DisplayHeading'

/**
 * Three numbered steps.
 *
 * An <ol>, because the order is the content: the steps only make sense done in
 * sequence, and a list is what says so to a screen reader. The number in the
 * circle is therefore decoration - it repeats what the list already conveys, so
 * it is hidden from assistive tech rather than read out twice.
 *
 * The warm glow is a gradient on the card itself, matching the figure row above,
 * so the two bands of cards read as the same family.
 */
export default function HowTo({ content }) {
  return (
    <section id="how-to" aria-labelledby="how-to-title" className="py-16 sm:py-24">
      <div className="container-x">
        <DisplayHeading id="how-to-title" parts={content.heading} subline={content.subline} />

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {content.steps.map((step, i) => (
            <li
              key={i}
              className="rounded-[24px] border border-card-b bg-card bg-[radial-gradient(120%_120%_at_15%_120%,rgba(252,153,24,0.22),rgba(252,153,24,0.05)_45%,transparent_70%)] p-6 sm:p-7"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-pill border border-accent/60 text-base font-bold text-accent"
              >
                {i + 1}
              </span>

              <h3 className="mt-6 text-lg font-bold leading-snug sm:text-xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50 sm:text-base">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
