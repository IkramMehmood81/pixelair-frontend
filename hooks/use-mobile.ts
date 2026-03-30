/**
 * useIsMobile — SSR-safe mobile detection
 *
 * Previous version bug:
 *   useState<boolean | undefined>(undefined) → on server = undefined → !!undefined = false
 *   useEffect fires → setIsMobile(window.innerWidth < 768) → possibly true
 *   If true: server rendered false, client re-renders with true → HYDRATION MISMATCH
 *
 * Fix: initialize with null (not undefined/false), only return a value after
 * the effect has run. Callers must handle the null case.
 *
 * For responsive UI: ALWAYS prefer Tailwind CSS breakpoints over this hook.
 * Only use this hook when you NEED JS logic that differs by screen size
 * (e.g. different event handlers, different data fetching, etc.)
 *
 * ❌ BAD:  const isMobile = useIsMobile(); return isMobile ? <A/> : <B/>
 * ✅ GOOD: <div className="block md:hidden"><A/></div>
 *          <div className="hidden md:block"><B/></div>
 */

import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile(): boolean | null {
  // null = "we don't know yet" (server + first paint)
  // This prevents the server/client mismatch
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const handleChange = () => {
      setIsMobile(mql.matches)
    }

    // Set initial value
    setIsMobile(mql.matches)

    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}
