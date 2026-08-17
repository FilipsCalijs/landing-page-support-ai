import { site } from './site'

import en from '@/content/en.json'
import ar from '@/content/ar.json'
import de from '@/content/de.json'
import el from '@/content/el.json'
import es from '@/content/es.json'
import fi from '@/content/fi.json'
import fr from '@/content/fr.json'
import hi from '@/content/hi.json'
import id from '@/content/id.json'
import it from '@/content/it.json'
import ko from '@/content/ko.json'
import pl from '@/content/pl.json'
import brPt from '@/content/br-pt.json'
import ru from '@/content/ru.json'
import sv from '@/content/sv.json'
import th from '@/content/th.json'
import uk from '@/content/uk.json'
import vi from '@/content/vi.json'
import zhTw from '@/content/zh-tw.json'
import ja from '@/content/ja.json'
import tr from '@/content/tr.json'
import nl from '@/content/nl.json'

/**
 * Copy loader. Every visible string on the site lives in /content/<lang>.json -
 * one file per language, named after the language code, which is also the domain
 * that serves it (en -> the .com, ru -> the .ru). Adding a language is adding a
 * file and one line here; nothing in the components changes.
 *
 * Two rules make the files independent of each other:
 *
 * 1. A missing key falls back to English, so a half-translated file still
 *    renders instead of printing "undefined" at someone.
 * 2. A list is never merged item by item - the language's own list wins whole.
 *    That is what lets ru.json carry four questions while en.json carries ten:
 *    each page shows its own count. Merging lists position by position would
 *    quietly pad the short one with English entries, which is the bug this
 *    avoids. The flip side is that an item in a list is all-or-nothing: leave
 *    `title` out of one of them and it is empty, not English.
 */

// The order here is the order of the language menu. Portuguese ships as br-pt
// (Brazilian), which is the variant this market actually searches in - the
// dictionary key is br-pt while `htmlLang` inside the file is the standard
// pt-BR, because that is what belongs in <html lang> and in hreflang.
const FILES = {
  en,
  ar,
  de,
  el,
  es,
  fi,
  fr,
  hi,
  id,
  it,
  ko,
  pl,
  'br-pt': brPt,
  ru,
  sv,
  th,
  uk,
  vi,
  'zh-tw': zhTw,
  ja,
  tr,
  nl,
}

// Written as {brand} in the JSON rather than spelled out, because the name comes
// from the environment (Coolify can change it without a rebuild) and it appears
// inside sentences - "{brand} - home" - that a translation has to be free to
// reorder.
const BRAND = `${site.name}${site.nameSuffix}`

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function merge(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) return override

  const out = { ...base }

  for (const [key, value] of Object.entries(override)) {
    out[key] = key in base ? merge(base[key], value) : value
  }

  return out
}

/**
 * Languages written right to left. A property of the language itself, not of the
 * copy, so it is decided here rather than being a key someone has to remember to
 * put in every file. Base tags only - "ar" covers ar-EG and the rest.
 */
const RTL = new Set(['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'ug', 'yi', 'dv'])

export function directionOf(locale) {
  const base = String(getContent(locale).meta.htmlLang).toLowerCase().split('-')[0]
  return RTL.has(base) ? 'rtl' : 'ltr'
}

/**
 * Collapses {label, href} to "label" anywhere it appears.
 *
 * URLs left /content some time ago - they are the same in every language, so
 * they live in lib/links.js - but translation files keep arriving in the older
 * shape, and an object where a component expects a string crashes the render
 * with "Objects are not valid as a React child". Rather than let a pasted file
 * take the page down, the loader accepts both shapes and drops the href.
 */
function stripHrefs(value) {
  if (Array.isArray(value)) return value.map(stripHrefs)

  if (isPlainObject(value)) {
    // A link: nothing but a label and a destination, and the destination is not
    // ours to render. Anything richer (a tools card, a table row) is left alone.
    const keys = Object.keys(value)
    if ('href' in value && 'label' in value && keys.every((k) => ['href', 'label', 'icon'].includes(k))) {
      return value.label
    }

    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== 'href')
        .map(([key, item]) => [key, stripHrefs(item)])
    )
  }

  return value
}

/** Replaces {brand} anywhere in the tree, so the JSON never repeats the name. */
function fillBrand(value) {
  if (typeof value === 'string') return value.replace(/\{brand\}/g, BRAND)
  if (Array.isArray(value)) return value.map(fillBrand)

  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillBrand(v)]))
  }

  return value
}

// Walking every string of every dictionary is cheap, but it is the same result
// every time - one pass per language for the life of the process.
const cache = new Map()

export function getContent(locale = site.defaultLocale) {
  const code = FILES[locale] ? locale : site.defaultLocale

  if (!cache.has(code)) {
    cache.set(code, stripHrefs(fillBrand(code === 'en' ? en : merge(en, FILES[code])))) 
  }

  return cache.get(code)
}

/**
 * Language codes, in menu order. These are the URL prefixes: /de, /br-pt, /zh-tw.
 * Derived from the files that exist rather than from a hand-kept list, so a
 * language with no file cannot be routed to or offered.
 */
export const locales = Object.keys(FILES)

/** Whether a URL segment is one of our languages. Used to 404 the rest. */
export function isLocale(code) {
  return Object.prototype.hasOwnProperty.call(FILES, code)
}

/**
 * What the switcher renders: the code goes in the href, the label in the menu,
 * `short` on the closed button. `htmlLang` is the standards-compliant tag
 * (pt-BR for br-pt), which is what hreflang has to carry.
 */
export function getLocales() {
  return Object.entries(FILES).map(([code, dict]) => ({
    code,
    label: dict.meta.label,
    short: dict.meta.short,
    htmlLang: dict.meta.htmlLang,
  }))
}
