'use client'

/**
 * AdSenseLoader — Auto Ads only, consent-aware
 *
 * ─── ROOT CAUSE OF ALL ADSENSE ERRORS ──────────────────────────────────────
 * You are using AUTO ADS (configured in AdSense dashboard — no <ins> tags).
 * For Auto Ads, the script tag alone is 100% sufficient.
 * ANY push() call to adsbygoogle causes errors:
 *   - "Only one enable_page_level_ads allowed" → from pushing that object
 *   - "All ins elements already have ads"       → from pushing {} unnecessarily
 *
 * CORRECT approach for Auto Ads in Next.js:
 *   1. Inject the <script> tag — nothing else.
 *   2. Never push anything to adsbygoogle.
 *   3. For NPA (non-personalised ads), set the URL parameter on the script src.
 *
 * NPA consent signal:
 *   Google reads the ?npa=1 URL parameter on the adsbygoogle.js script URL.
 *   accepted  → load script WITHOUT ?npa=1  → personalised ads
 *   declined/null → load script WITH ?npa=1 → contextual ads, no personal cookies
 *
 * Both modes show ads. Only personalisation differs.
 * ───────────────────────────────────────────────────────────────────────────
 */

import { useEffect } from 'react'

interface Props {
  publisherId: string
}

declare global {
  interface Window {
    __adsbygoogle_loaded?: boolean
  }
}

function injectAutoAds(publisherId: string, personalised: boolean) {
  // Survive React StrictMode double-invoke and HMR resets
  // Use DOM check as primary guard — it persists across everything
  if (document.getElementById('adsense-script')) return
  if (window.__adsbygoogle_loaded) return
  window.__adsbygoogle_loaded = true

  const script = document.createElement('script')
  script.id          = 'adsense-script'
  // NPA signal via URL parameter — no push() needed at all
  const npaParam     = personalised ? '' : '&npa=1'
  script.src         = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}${npaParam}`
  script.async       = true
  script.crossOrigin = 'anonymous'
  // DO NOT push anything to adsbygoogle — Auto Ads handles everything
  document.head.appendChild(script)
}

export default function AdSenseLoader({ publisherId }: Props) {
  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent')
    const personalised = stored === 'accepted'
    injectAutoAds(publisherId, personalised)

    // Listen for consent changes in this session
    // Note: NPA mode applies from the NEXT page load if script already injected.
    // This is correct and expected — AdSense consent works per page load.
    function handler(e: Event) {
      const { consent } = (e as CustomEvent<{ consent: string }>).detail
      injectAutoAds(publisherId, consent === 'accepted')
    }

    window.addEventListener('cookieConsentUpdate', handler)
    return () => window.removeEventListener('cookieConsentUpdate', handler)
  }, [publisherId])

  return null
}