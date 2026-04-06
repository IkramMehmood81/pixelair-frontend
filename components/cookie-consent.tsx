'use client'

/**
 * CookieConsent — GDPR/AdSense compliant cookie banner
 *
 * EXACT BEHAVIOUR:
 * ─────────────────────────────────────────────────────────────────────
 * ACCEPTED → stored in localStorage (permanent)
 *            → banner NEVER shown again on any future visit
 *            → personalised ads load immediately on every visit
 *
 * DECLINED → stored in sessionStorage only (current tab/session)
 *            → banner dismissed for this session
 *            → on NEXT visit (new tab or browser restart) banner shows again
 *            → NPA ads always run regardless
 *
 * null (no decision) → banner shown after 900ms
 *                    → NPA ads run in background immediately
 *
 * MOBILE LAYOUT:
 *   < 600px → stacks vertically: icon + text on top, buttons full-width below
 *   ≥ 600px → horizontal single row
 * ─────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'

export type ConsentState = 'accepted' | 'declined' | null

const PERMANENT_KEY = 'cookie_consent'      // localStorage  — persists forever
const SESSION_KEY   = 'cookie_consent_session' // sessionStorage — current session only

export function getCookieConsent(): ConsentState {
  if (typeof window === 'undefined') return null

  // Check permanent acceptance first
  if (localStorage.getItem(PERMANENT_KEY) === 'accepted') return 'accepted'

  // Check session-only decline (dismissed this session but not permanently)
  if (sessionStorage.getItem(SESSION_KEY) === 'declined') return 'declined'

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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Detect mobile for layout switching
    const mq = window.matchMedia('(max-width: 599px)')
    setIsMobile(mq.matches)
    const onResize = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onResize)

    const existing = getCookieConsent()

    if (existing === null) {
      // No decision at all — show banner
      const t = setTimeout(() => setVisible(true), 900)
      return () => {
        clearTimeout(t)
        mq.removeEventListener('change', onResize)
      }
    }

    // Has a decision — fire event for AdSenseLoader, don't show banner
    dispatchConsentEvent(existing)
    return () => mq.removeEventListener('change', onResize)
  }, [])

  const handleAccept = () => {
    // Permanent — never ask again
    localStorage.setItem(PERMANENT_KEY, 'accepted')
    sessionStorage.removeItem(SESSION_KEY) // clean up any session flag
    dispatchConsentEvent('accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    // Session only — will ask again on next visit
    sessionStorage.setItem(SESSION_KEY, 'declined')
    // Do NOT write to localStorage — ensures banner shows on next visit
    dispatchConsentEvent('declined')
    setVisible(false)
  }

  if (!mounted || !visible) return null

  // ── Shared styles ──────────────────────────────────────────────────
  const overlay: React.CSSProperties = {
    position:       'fixed',
    bottom:         0,
    left:           0,
    right:          0,
    zIndex:         9999,
    padding:        isMobile ? '10px 12px' : '12px 16px',
    backdropFilter: 'blur(3px)',
  }

  const card: React.CSSProperties = {
    maxWidth:      '920px',
    margin:        '0 auto',
    background:    'hsl(var(--card))',
    border:        '1px solid hsl(var(--border))',
    borderRadius:  '14px',
    boxShadow:     '0 -4px 40px rgba(0,0,0,0.5)',
    padding:       isMobile ? '14px 16px' : '14px 20px',
    display:       'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems:    isMobile ? 'stretch'  : 'center',
    gap:           isMobile ? '12px'     : '16px',
  }

  const textBlock: React.CSSProperties = {
    flex:    '1 1 0',
    minWidth: 0,
  }

  const title: React.CSSProperties = {
    margin:     '0 0 4px 0',
    fontSize:   '13px',
    fontWeight: 700,
    color:      'hsl(var(--foreground))',
    display:    'flex',
    alignItems: 'center',
    gap:        '6px',
  }

  const body: React.CSSProperties = {
    margin:     0,
    fontSize:   '11.5px',
    color:      'hsl(var(--muted-foreground))',
    lineHeight: 1.5,
  }

  const btnRow: React.CSSProperties = {
    display:        'flex',
    gap:            '8px',
    flexShrink:     0,
    width:          isMobile ? '100%' : 'auto',
    flexDirection:  'row',
  }

  const declineBtn: React.CSSProperties = {
    flex:         isMobile ? 1 : undefined,
    padding:      isMobile ? '10px 0' : '9px 18px',
    borderRadius: '8px',
    border:       '1px solid hsl(var(--border))',
    background:   'transparent',
    color:        'hsl(var(--muted-foreground))',
    fontSize:     '12px',
    fontWeight:   600,
    cursor:       'pointer',
    whiteSpace:   'nowrap',
    textAlign:    'center',
  }

  const acceptBtn: React.CSSProperties = {
    flex:         isMobile ? 1 : undefined,
    padding:      isMobile ? '10px 0' : '9px 22px',
    borderRadius: '8px',
    border:       'none',
    background:   'hsl(var(--primary))',
    color:        'hsl(var(--primary-foreground))',
    fontSize:     '12px',
    fontWeight:   700,
    cursor:       'pointer',
    whiteSpace:   'nowrap',
    textAlign:    'center',
    boxShadow:    '0 2px 14px hsl(var(--primary) / 0.4)',
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Cookie consent" style={overlay}>
      <div style={card}>

        {/* Top row on mobile: icon + title together */}
        <div style={textBlock}>
          <p style={title}>
            <span aria-hidden="true">🍪</span>
            We use cookies to keep this tool free
          </p>
          <p style={body}>
            Ads always show — they fund free access for everyone. Accepting makes
            them personalised (more relevant &amp; higher value). Declining shows
            contextual ads only — no personal data stored.{' '}
            <Link
              href="/privacy#advertising"
              style={{ color: 'hsl(var(--primary))', textDecoration: 'underline' }}
            >
              Privacy Policy
            </Link>
          </p>
         
        </div>

        {/* Buttons */}
        <div style={btnRow}>
          <button
            onClick={handleDecline}
            aria-label="Decline personalised ads — contextual ads will still show"
            style={declineBtn}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            aria-label="Accept all cookies for personalised ads"
            style={acceptBtn}
          >
            Accept All
          </button>
        </div>

      </div>
    </div>
  )
}