import Link from 'next/link'
import DisplayHeading from './ui/DisplayHeading'
import Icon from './ui/Icon'
import { links, at, linkProps } from '@/lib/links'

// Icon-only cells: the mark carries the meaning visually, the sr-only label
// carries it for anyone who cannot see the mark. A bare <svg> in a cell reads as
// an empty cell in a screen reader's table mode.
const MARKS = {
  yes: { icon: 'check', className: 'text-accent' },
  no: { icon: 'close', className: 'text-white/35' },
  partial: { icon: 'dash', className: 'text-accent/70' },
}

function Cell({ value, legend }) {
  const mark = MARKS[value]

  if (!mark) {
    return <span className="text-sm text-white/50 sm:text-base">{value}</span>
  }

  return (
    <>
      <Icon
        name={mark.icon}
        className={`h-5 w-5 ${mark.className}`}
        strokeWidth={mark.icon === 'check' ? 2.5 : 2}
      />
      <span className="sr-only">{legend[value]}</span>
    </>
  )
}

/**
 * Comparison table: one row per capability, one column per option, plus a
 * closing row of links.
 *
 * A real <table> with <th scope>, not a grid of divs - the whole point of the
 * section is that "row X, column Y" is a fact, and scope is what lets a screen
 * reader announce "Lorem ipsum, column two: yes" instead of a loose tick.
 *
 * Four columns do not fit a 320px screen, so the table scrolls inside its own
 * container rather than pushing the page sideways. The container is focusable
 * (tabIndex 0) because a scroll region that only responds to a mouse wheel is
 * unreachable from a keyboard.
 */
export default function Comparison({ content }) {
  const cellClass = 'px-5 py-4 text-start align-middle sm:px-6'

  return (
    <section id="comparison" aria-labelledby="comparison-title" className="py-16 sm:py-24">
      <div className="container-x">
        <DisplayHeading
          id="comparison-title"
          parts={content.heading}
          subline={content.subline}
          uppercase
        />

        <div
          role="region"
          aria-labelledby="comparison-title"
          tabIndex={0}
          className="mt-12 overflow-x-auto rounded-card border border-card-b lg:mt-16"
        >
          <table className="w-full min-w-[720px] border-collapse">
            <caption className="sr-only">{content.caption}</caption>

            <thead>
              <tr className="bg-regular/40">
                <th
                  scope="col"
                  className={`${cellClass} w-[34%] border-e border-divider text-sm font-bold sm:text-base`}
                >
                  {content.rowHeader}
                </th>
                {content.columns.map((column, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={`${cellClass} text-sm font-bold sm:text-base ${
                      i === 0 ? 'text-accent' : 'text-fg'
                    }`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-divider">
              {/* Position, not label: two rows can end up with the same text in
                  a language that has not been finished, and a duplicate key is
                  a row that silently never renders. */}
              {content.rows.map((row, r) => (
                <tr key={r} className="bg-card/60">
                  <th
                    scope="row"
                    className={`${cellClass} border-e border-divider text-sm font-normal text-white/75 sm:text-base`}
                  >
                    {row.label}
                  </th>
                  {row.cells.map((cell, i) => (
                    <td key={`${r}-${i}`} className={cellClass}>
                      <Cell value={cell} legend={content.legend} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

            <tfoot className="border-t border-divider">
              <tr className="bg-regular/25">
                {/* Empty corner: the row-label column has no link of its own. */}
                <td className="border-e border-divider" />
                {/* No label, no link: an empty string would otherwise render as
                    a bare arrow sitting in the cell with nothing to click. */}
                {content.cta.map((label, i) => (
                  <td key={i} className={cellClass}>
                    {label ? (
                      <Link
                        {...linkProps(at(links.comparisonCta, i))}
                        className={`inline-flex min-h-11 items-center gap-2 text-sm font-bold transition-colors sm:text-base ${
                          i === 0 ? 'text-accent hover:text-accent-h' : 'text-fg hover:text-accent'
                        }`}
                      >
                        <span>{label}</span>
                        <Icon name="arrow" className="h-4 w-4" strokeWidth={2} />
                      </Link>
                    ) : null}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  )
}
