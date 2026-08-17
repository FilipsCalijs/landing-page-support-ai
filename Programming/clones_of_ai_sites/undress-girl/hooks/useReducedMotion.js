'use client'

import { useEffect, useState } from 'react'

/**
 * Tracks `prefers-reduced-motion`. Starts at `false` and settles in an effect,
 * so the server render and the first client render agree - reading matchMedia
 * during render would be a hydration mismatch.
 *
 * Callers are expected to act on this in JS, not to hand the decision to CSS: a
 * global `animation-duration: 0.01ms !important` reset swallows keyframes whole,
 * which turns "reduced motion" into "the feature is broken".
 */
export default function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)

    update()
    query.addEventListener('change', update)

    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}
