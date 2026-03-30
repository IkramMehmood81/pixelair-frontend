/**
 * useIsClient — SSR-safe client detection hook
 *
 * THE INDUSTRY STANDARD PATTERN for Next.js App Router.
 *
 * Why this exists:
 * ─────────────────
 * Next.js renders components TWICE:
 *   1. On the server (Node.js) — window/document do not exist
 *   2. On the client (browser) — after hydration
 *
 * If your component renders different JSX on server vs client
 * (based on window.innerWidth, localStorage, navigator, etc.)
 * React throws a hydration mismatch error.
 *
 * How to use:
 * ─────────────
 *   const isClient = useIsClient()
 *
 *   // For things that MUST differ between server/client:
 *   if (!isClient) return <ServerFallback />   // renders on server + first client paint
 *   return <ClientOnlyUI />                    // renders only after hydration
 *
 *   // For conditional rendering:
 *   {isClient && <BrowserOnlyComponent />}
 *
 * What NOT to do:
 * ─────────────────
 *   ❌ typeof window !== 'undefined'  → causes mismatch if used in JSX
 *   ❌ useState(window.innerWidth)    → crashes on server
 *   ❌ useEffect that changes visible JSX immediately → causes flash
 *
 * Reference: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
 */

import { useEffect, useState } from 'react'

export function useIsClient(): boolean {
  // Start as false — server always renders false, first client paint also false.
  // This guarantees server HTML === initial client HTML → no mismatch.
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Only runs in browser, after hydration is complete.
    // Setting state here triggers a SECOND render which React handles
    // as a normal state update (not a hydration mismatch).
    setIsClient(true)
  }, [])

  return isClient
}
