/**
 * Centred display heading with one accented segment, plus an optional subline.
 *
 * The heading is data, not markup: `parts` is a list of `{ text, accent }`, so a
 * translation can move the accented words anywhere in the sentence - which it
 * has to be able to do, because word order is not the same in every language.
 * Splitting on a hardcoded index or a marker character would break the moment a
 * locale reorders the phrase.
 *
 * `uppercase` picks between the oversized all-caps treatment and the regular
 * sentence-case one; both are the same component so the two never drift apart.
 */
export default function DisplayHeading({
  id,
  parts,
  subline,
  uppercase = false,
  className = '',
}) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${className}`}>
      <h2
        id={id}
        className={`text-balance font-black tracking-tight ${
          uppercase
            ? 'text-[36px] uppercase leading-[1.05] sm:text-[52px] lg:text-[60px]'
            : 'text-[28px] leading-[1.15] sm:text-[38px] sm:leading-[1.1] lg:text-[44px]'
        }`}
      >
        {parts.map((part, i) => (
          <span key={i} className={part.accent ? 'text-accent' : undefined}>
            {part.text}
            {i < parts.length - 1 ? ' ' : ''}
          </span>
        ))}
      </h2>

      {subline ? (
        <p className="mt-5 text-base font-semibold text-white/50 sm:text-lg">{subline}</p>
      ) : null}
    </div>
  )
}
