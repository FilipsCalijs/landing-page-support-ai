/**
 * Media for the benefit rows, by position.
 *
 * Not in content/*.json, and not because of tidiness: `benefits.items` is a list,
 * and a language's own list wins whole rather than being merged item by item. A
 * file path put in en.json would therefore be missing from all 21 translations,
 * and every one of them would have to repeat the same `/cards/card1.jpeg`. The
 * alt text is copy and stays in the language files; the file is not.
 *
 * Entry i belongs to benefit i. Most languages carry six benefits and English
 * four, so there are entries for seven - the tail is simply unused by a shorter
 * language, and a language that grows a seventh row already has artwork for it.
 * A row past the end of this list falls back to a grey placeholder.
 *
 * `width`/`height` are the intrinsic pixels of the file. They reserve the box
 * before it loads, so they must match the file rather than describe a wish.
 *
 * `cap` limits how wide a shape is allowed to get. The row is `h-auto`, so
 * nothing is ever cropped - the aspect ratio is kept and the height follows the
 * width. That is exactly the problem with a square or a portrait: given the full
 * half-container it becomes 600px tall and its row towers over the others. The
 * cap holds it to a sensible size and centres it instead.
 */
export const benefitMedia = [
  {
    // Side-by-side before/after, wide - the one shape that can fill its half.
    type: 'image',
    src: '/cards/card1.jpeg',
    width: 564,
    height: 354,
  },
  {
    // The same idea at 2048 square. Capped, or the row is as tall as it is wide.
    type: 'image',
    src: '/cards/card3.jpeg',
    width: 2048,
    height: 2048,
    cap: 'square',
  },
  {
    // Silent, looping, decorative footage - treated as an illustration, not as a
    // video anyone is meant to control.
    type: 'video',
    src: '/cards/card3.webm',
    mime: 'video/webm',
    width: 960,
    height: 720,
  },
  {
    // Cut out against nothing, so `contain` rather than `cover`: the transparent
    // edges are part of the artwork.
    type: 'image',
    src: '/cards/explore-feature-duo.webp',
    width: 1000,
    height: 796,
    fit: 'contain',
    cap: 'square',
  },
  {
    // Laptop mockup, also a cutout.
    type: 'image',
    src: '/cards/socmolnoh4vq9jikzwid.png',
    width: 600,
    height: 600,
    fit: 'contain',
    cap: 'square',
  },
  {
    type: 'video',
    src: '/cards/txt2video.mp4',
    mime: 'video/mp4',
    width: 640,
    height: 720,
    cap: 'portrait',
  },
  {
    // Seventh slot. No language has a seventh benefit today; this is here so the
    // one that does is not the moment someone discovers the list ran out.
    type: 'video',
    src: '/cards/upscale.mp4',
    mime: 'video/mp4',
    width: 640,
    height: 720,
    cap: 'portrait',
  },
]

/** Media for benefit i, or null when the list does not reach that far. */
export function benefitMediaAt(i) {
  return benefitMedia[i] || null
}
