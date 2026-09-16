"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * `useReducedMotion` resolves via `matchMedia` on the client but SSR always
 * assumes `false` — components that use the raw value directly in a
 * className or inline `initial`/animation prop produce different markup on
 * the server vs. the first client render for anyone with the OS preference
 * enabled. React's hydration-mismatch recovery does not patch attribute/
 * style differences in this case, so affected content can stay stuck at
 * `opacity: 0` permanently for exactly the users this preference is meant
 * to help.
 *
 * This mirrors the real value one tick later (after mount), so the first
 * client render matches SSR exactly, then a normal — patchable — re-render
 * applies the reduced-motion branch.
 */
export function useStableReducedMotion(): boolean {
  const preference = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  // Deliberate mount-detection gate, not a data sync — this is the standard
  // fix for the hydration mismatch documented above, not the effect misuse
  // this lint rule otherwise guards against.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  return mounted && Boolean(preference);
}
