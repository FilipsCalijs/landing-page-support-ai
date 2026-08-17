export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', id }) {
  // 'left' means the reading side, not the physical left: text-start follows dir.
  const alignment = align === 'left' ? 'text-start items-start' : 'text-center items-center mx-auto'

  return (
    <div className={`flex flex-col ${alignment} max-w-2xl`}>
      {eyebrow ? (
        <span className="mb-4 inline-flex items-center rounded-pill border border-card-b bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
          {eyebrow}
        </span>
      ) : null}

      <h2
        id={id}
        className="text-balance text-[32px] font-black leading-9 tracking-tight sm:text-[42px] sm:leading-[48px] lg:text-[52px] lg:leading-[58px]"
      >
        {title}
      </h2>

      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  )
}
