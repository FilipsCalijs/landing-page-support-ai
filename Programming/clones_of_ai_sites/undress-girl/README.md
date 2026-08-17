# Landing template

Next.js 14 (App Router, JavaScript only) + Tailwind CSS landing page template.
Dark design system, SSR on every page, placeholder content throughout.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things live

```
content/
  <lang>.json     every visible string of that language (22 files, see below)
app/
  [locale]/
    layout.js     root layout - <html lang>, global metadata, 404s unknown codes
    page.js       home page - per-language metadata, hreflang, JSON-LD graph
  globals.css     Tailwind directives, CSS vars, scrollbar
  robots.js       /robots.txt
  sitemap.js      /sitemap.xml - every language, cross-linked
middleware.js     sends "/" to the visitor's language
components/
  Navbar · Hero · FAQ · Footer
  AgeGate · LanguageSwitcher
  ui/  Button · SectionHeading · Icon · Logo · BikiniMark
lib/
  site.js         env-driven constants + placehold.co helper
  content.js      loads content/*.json - merge, fallback, {brand}
  links.js        every URL on the site (not copy - shared by all languages)
```

## Routing

Every page lives under a language: `/en`, `/de`, `/br-pt`, `/zh-tw`. The bare `/`
redirects (307) to whichever language the browser asked for in `Accept-Language`,
falling back to `NEXT_PUBLIC_DEFAULT_LOCALE`. An unknown code is a 404, not a
silent fallback - a URL that answers 200 with the wrong language gets indexed.

The file name is the URL segment. `br-pt` and `zh-tw` are the segments; the
standards tags `pt-BR` and `zh-TW` live in `meta.htmlLang` and are what go into
`<html lang>`, `hreflang` and the sitemap.

Pages are prerendered per language (`generateStaticParams`), and each one lists
every translation in `alternates.languages` plus an `x-default`.

## Adding copy and languages

Every string a visitor can see - headings, buttons, alt text, aria labels, the
tab title, the meta description - lives in `content/<lang>.json`. There is no
copy in the components. One file per language, named after the language code,
which is also the domain that serves it (`en` → the .com, `ru` → the .ru).

Adding a language is adding a file and one line in `lib/content.js`; the language
switcher lists the files that exist, so nothing has to be kept in sync by hand.

Two rules keep the files independent:

- a key that is missing falls back to `en.json`, so a half-finished translation
  still renders;
- a **list is never merged item by item** - the language's own list wins whole.
  `ru.json` with four questions and `en.json` with ten means four on the Russian
  page and ten on the English one. Sections, cards, table rows and steps all work
  this way; nothing in the components assumes a count.

### The 22 languages

Order below is the order of the language menu. **Full** = the whole page is
translated. **Meta** = the file carries the language identity, the tab title and
the meta description; every other string falls back to `en.json` until someone
fills it in.

| File | Language | URL | `<html lang>` | State |
| --- | --- | --- | --- | --- |
| `en.json` | English | `/en` | `en` | Full |
| `ar.json` | العربية | `/ar` | `ar` | Full |
| `de.json` | Deutsch | `/de` | `de` | Full |
| `el.json` | Ελληνικά | `/el` | `el` | Full |
| `es.json` | Español | `/es` | `es` | Full |
| `fi.json` | Suomi | `/fi` | `fi` | Full |
| `fr.json` | Français | `/fr` | `fr` | Full |
| `hi.json` | हिन्दी | `/hi` | `hi` | Full |
| `id.json` | Bahasa Indonesia | `/id` | `id` | Full |
| `it.json` | Italiano | `/it` | `it` | Full |
| `ko.json` | 한국어 | `/ko` | `ko` | Meta |
| `pl.json` | Polski | `/pl` | `pl` | Full |
| `br-pt.json` | Português | `/br-pt` | `pt-BR` | Full |
| `ru.json` | Русский | `/ru` | `ru` | Full |
| `sv.json` | Svenska | `/sv` | `sv` | Full |
| `th.json` | ไทย | `/th` | `th` | Full |
| `uk.json` | Українська | `/uk` | `uk` | Full |
| `vi.json` | Tiếng Việt | `/vi` | `vi` | Full |
| `zh-tw.json` | 繁體中文 | `/zh-tw` | `zh-TW` | Full |
| `ja.json` | 日本語 | `/ja` | `ja` | Full |
| `tr.json` | Türkçe | `/tr` | `tr` | Full |
| `nl.json` | Nederlands | `/nl` | `nl` | Full |

### Right-to-left

Arabic is served `dir="rtl"` and the page mirrors: reading order, nav, grids,
paddings, the corner brackets on the before/after frame, the tilt of the hero
card, and the arrows, which turn round to keep pointing forward. The telegram mark
does not flip — a mirrored logo is a broken logo.

Direction is decided in `lib/content.js` (`directionOf`) from the language tag,
not from a key in the JSON: it is a property of the language, not of the copy, so
a new RTL language needs nothing but its base tag in the `RTL` set.

Components use logical properties for anything direction-sensitive — `ms`/`me`,
`ps`/`pe`, `start`/`end`, `text-start`, `border-s`/`border-e`, `rounded-ss` —
plus Tailwind's `rtl:` variant where a composition has to mirror outright. Adding
`ml-4` or `left-0` to a component silently breaks Arabic; use the logical form.

The accent gradient runs the same way in both directions. It is decorative and
reads fine mirrored, so it was left alone.

Do not publish a "Meta" locale as a public URL: it would serve English body copy
under a foreign `lang`, which search engines read as duplicate content.

`getContent(locale)` is the only entry point; `locales` and `isLocale` come from
the same module, so the router, the middleware, the sitemap and the switcher all
read one list.

## Adding pages

Create `app/[locale]/<route>/page.js`, export `generateStaticParams` and
`generateMetadata` (canonical `/${locale}/<route>`, plus `alternates.languages`),
and add the route to the `routes` array in `app/sitemap.js`.

Links to it belong in `lib/links.js` and must carry the language:
`/de/pricing`, not `/pricing`. In-page anchors (`#faq`) never do.

## Age gate

`components/AgeGate.js` shows the age and consent notice once per visitor, over a
blurred page. Copy lives in `gate` in every language file: `rules` is a numbered
list read at its own length, so a market needing a fifth line just gets a fifth
entry.

It renders nothing on the server and decides after mount, which keeps hydration
clean and leaves the page itself indexable — a crawler is never stopped by a wall
it has to click through. Acceptance is kept in `localStorage` under
`age-gate-accepted-v1`, not in a cookie: nothing server-side reads it, and a
cookie would ride along on every request for nothing. **Bump the key** in that
file when the terms change and everyone sees the notice again.

It is deliberately not dismissible — no Escape, no click-outside — because
dismissing it is a legal confirmation. Tab wraps inside it instead.

## Brand and icon

The name comes from the environment (`NEXT_PUBLIC_SITE_NAME` +
`NEXT_PUBLIC_SITE_NAME_SUFFIX`), so the wordmark reads as the domain with the TLD
in the accent colour. Language files never spell it out; they write `{brand}` and
`lib/content.js` fills it in.

The mark is a bikini top, drawn as flat shapes so it survives 16px in a tab. It
exists twice on purpose: `components/ui/BikiniMark.js` for the page and
`app/icon.svg` for the favicon — a React component cannot be served as
`/icon.svg`, and generating it at build time would mean pulling in `next/og` for a
500-byte image. **Change one, change the other.**

Each instance needs its own `idSuffix`: the gradient is referenced by id, and two
marks sharing one id makes the second inherit the first one's fill.

## Links

`lib/links.js` holds every URL. Nothing in `content/*.json` carries an `href` —
a URL is not copy, it is the same in every language, and it used to be duplicated
across all 22 files.

Off-site links go through `linkProps()`, which adds `target="_blank"` and
`rel="sponsored noopener"`. The outbound links here are affiliate and referral
URLs; Google asks that paid links be marked, and an unmarked one is a risk to the
domain rather than a boost.

The comparison table is the one place where the links differ per column: each
column's link goes to the product in that column. Everything else points at the
offer, and the telegram buttons at the bot.

**Still placeholders:** the legal links (terms, privacy, 18+ policy, refunds) all
point at the offer because there are no policy documents yet. They need real
pages before launch.

## Deploy (Coolify)

Build the included Dockerfile. Set **Port = 3000**, **Health check = /**, and add
env vars from `.env.example` through the Coolify UI.
