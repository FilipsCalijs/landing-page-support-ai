/**
 * Three-up figure row, sitting directly under the hero.
 *
 * Marked up as a description list: each figure is the <dd> of its <dt> label,
 * which is what makes "320.000" mean something to a screen reader instead of
 * being read as a loose number. `flex-col-reverse` puts the value on top
 * visually while the DOM keeps the label first, so the pairing stays valid.
 *
 * The warm glow is a background gradient on the card itself rather than an extra
 * element - one paint, nothing to position, and it clips with the border radius.
 */
export default function Stats({ content }) {
  return (
    <section aria-label={content.a11yLabel} className="pb-4 sm:pb-8">
      <div className="container-x">
        <dl className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {content.items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col-reverse rounded-btn border border-card-b bg-card bg-[radial-gradient(90%_150%_at_50%_150%,rgba(252,153,24,0.28),rgba(252,153,24,0.07)_45%,transparent_70%)] px-6 py-7 sm:px-8 sm:py-9"
            >
              <dt className="mt-4 text-sm font-semibold leading-snug sm:text-base">
                {item.label}
              </dt>
              <dd className="text-[32px] font-black leading-none tracking-tight text-accent-2 sm:text-[40px]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
