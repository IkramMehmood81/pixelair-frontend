'use client'

/**
 * CookieConsent — GDPR/AdSense compliant cookie banner
 *
 * THREE-STATE consent model:
 * ─────────────────────────────────────────────────────────────────────
 * null       → Banner shown. NPA ads run immediately (no personal data).
 * 'accepted' → Personalised ads on next/current load. Banner dismissed.
 * 'declined' → NPA ads. Banner dismissed. No personal cookies placed.
 *
 * Fires CustomEvent 'cookieConsentUpdate' → AdSenseLoader reacts.
 *
 * Consent is stored in localStorage so it persists across sessions.
 * "Manage Cookies" in footer clears localStorage and reloads the page.
 * ─────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'

export type ConsentState = 'accepted' | 'declined' | null

const STORAGE_KEY = 'cookie_consent'

export function getCookieConsent(): ConsentState {
  if (typeof window === 'undefined') return null
  const val = localStorage.getItem(STORAGE_KEY)
  if (val === 'accepted' || val === 'declined') return val
  return null
}

export function dispatchConsentEvent(state: ConsentState) {
  window.dispatchEvent(
    new CustomEvent('cookieConsentUpdate', { detail: { consent: state } })
  )
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const existing = getCookieConsent()

    if (existing === null) {
      // First visit — show banner after brief delay (avoids flash on paint)
      const t = setTimeout(() => setVisible(true), 900)
      return () => clearTimeout(t)
    }

    // Returning visitor — re-fire stored preference so AdSenseLoader
    // can configure itself correctly for this page load
    dispatchConsentEvent(existing)
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    dispatchConsentEvent('accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined')
    dispatchConsentEvent('declined')
    setVisible(false)
  }

  if (!mounted || !visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
      style={{
        position:  'fixed',
        bottom:    0,
        left:      0,
        right:     0,
        zIndex:    9999,
        padding:   '12px 16px',
        // Backdrop blur to visually separate from page content
        backdropFilter: 'blur(2px)',
      }}
    >
      <div style={{
        maxWidth:       '900px',
        margin:         '0 auto',
        background:     'hsl(var(--card))',
        border:         '1px solid hsl(var(--border))',
        borderRadius:   '12px',
        boxShadow:      '0 -4px 40px rgba(0,0,0,0.45)',
        padding:        '14px 20px',
        display:        'flex',
        flexDirection:  'row',
        alignItems:     'center',
        gap:            '16px',
        flexWrap:       'nowrap',    // CRITICAL: prevents word-wrap layout bug
      }}>

        {/* Cookie icon */}
        <span style={{ fontSize: '20px', flexShrink: 0 }} aria-hidden="true">
          🍪
        </span>

        {/* Text block — flex:1 + minWidth:0 prevents overflow into button area */}
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          <p style={{
            margin:      '0 0 2px 0',
            fontSize:    '13px',
            fontWeight:  600,
            color:       'hsl(var(--foreground))',
            whiteSpace:  'nowrap',
            overflow:    'hidden',
            textOverflow:'ellipsis',
          }}>
            We use cookies to keep this tool free
          </p>
          <p style={{
            margin:      0,
            fontSize:    '11.5px',
            color:       'hsl(var(--muted-foreground))',
            lineHeight:  1.45,
            // Allow text to wrap on very small screens, but never cause layout break
            overflowWrap:'break-word',
          }}>
            Ads always show — they fund free access. Accepting makes them personalised
            (more relevant). Declining shows contextual ads only. No personal data
            stored either way.{' '}
            <Link
              href="/privacy#advertising"
              style={{ color: 'hsl(var(--primary))', textDecoration: 'underline' }}
            >
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Buttons — flexShrink:0 keeps them from being squished */}
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={handleDecline}
            aria-label="Decline personalised ads — contextual ads will still show"
            style={{
              padding:      '8px 16px',
              borderRadius: '8px',
              border:       '1px solid hsl(var(--border))',
              background:   'transparent',
              color:        'hsl(var(--muted-foreground))',
              fontSize:     '12px',
              fontWeight:   600,
              cursor:       'pointer',
              whiteSpace:   'nowrap',
              transition:   'color 0.15s, border-color 0.15s',
            }}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            aria-label="Accept personalised advertising cookies"
            style={{
              padding:      '8px 20px',
              borderRadius: '8px',
              border:       'none',
              background:   'hsl(var(--primary))',
              color:        'hsl(var(--primary-foreground))',
              fontSize:     '12px',
              fontWeight:   700,
              cursor:       'pointer',
              whiteSpace:   'nowrap',
              boxShadow:    '0 2px 14px hsl(var(--primary) / 0.4)',
              transition:   'opacity 0.15s',
            }}
          >
            Accept All
          </button>
        </div>

      </div>
    </div>
  )
}