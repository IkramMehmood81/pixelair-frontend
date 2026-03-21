'use client'

/**
 * components/header.tsx
 *
 * FIXES IN THIS VERSION
 * ──────────────────────
 * Fix 3 — Cross-page scroll: clicking "Features", "How It Works", or
 *   "Start Now" from /blog, /privacy, /contact etc. did nothing because
 *   scrollIntoView() looks for an element with that id on the CURRENT page.
 *   Those sections only exist on the home page (/), so the element is null.
 *
 *   Fix: when we are NOT on the home page, navigate to "/?scroll=<id>"
 *   instead of scrolling. The home page reads the ?scroll param on mount
 *   and scrolls to the right section. This works on every browser.
 *
 *   usePathname() tells us which page we are on.
 */

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/#features',     label: 'Features',      hash: 'features' },
  { href: '/#how-it-works', label: 'How It Works',  hash: 'how-it-works' },
  { href: '/blog',          label: 'Blog',           hash: null },
  { href: '/about',         label: 'About',          hash: null },
  { href: '/contact',       label: 'Contact',        hash: null },
] as const

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router   = useRouter()

  const isHome = pathname === '/'

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const close = () => setMenuOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /**
   * Navigate to a home-page section.
   *
   * • If already on / → scroll directly (iOS-safe via scrollIntoView).
   * • If on any other page → navigate to /?scroll=<id>.
   *   The home page reads that param on mount and scrolls after hydration.
   */
  const scrollToSection = useCallback((id: string) => {
    setMenuOpen(false)
    if (isHome) {
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      router.push(`/?scroll=${id}`)
    }
  }, [isHome, router])

  const scrollToUpload = useCallback(() => scrollToSection('upload'), [scrollToSection])

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-b from-background/95 via-background/90 to-background/85 backdrop-blur-2xl border-b border-primary/20 shadow-2xl shadow-primary/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">

            {/* ── Logo ───────────────────────────────────────────────────── */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 transition-all duration-300 flex-shrink-0"
              aria-label="PhotoGenerator.ai — Home"
            >
              <picture>
                <source media="(min-width:1024px)" srcSet="/logo-large.png" />
                <img
                  src="/logo-small.png"
                  alt="PhotoGenerator.ai logo"
                  className="h-8 sm:h-9 lg:h-14 w-auto object-contain"
                  style={{ imageRendering: 'auto' }}
                />
              </picture>
            </Link>

            {/* ── Desktop nav ─────────────────────────────────────────────── */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center" aria-label="Main navigation">
              {NAV_LINKS.map(({ href, label, hash }) =>
                hash ? (
                  <button
                    key={href}
                    onClick={() => scrollToSection(hash)}
                    className="px-3 lg:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground/80 hover:text-primary bg-transparent hover:bg-primary/15 rounded-lg transition-all duration-300 relative group whitespace-nowrap cursor-pointer"
                  >
                    {label}
                    <span className="absolute bottom-0.5 left-3 right-3 lg:left-4 lg:right-4 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </button>
                ) : (
                  <Link
                    key={href}
                    href={href}
                    className="px-3 lg:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground/80 hover:text-primary bg-transparent hover:bg-primary/15 rounded-lg transition-all duration-300 relative group whitespace-nowrap no-underline [text-decoration:none] hover:[text-decoration:none]"
                  >
                    {label}
                    <span className="absolute bottom-0.5 left-3 right-3 lg:left-4 lg:right-4 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                )
              )}
            </nav>

            {/* ── Right: CTA + hamburger ──────────────────────────────────── */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={scrollToUpload}
                aria-label="Start enhancing images now"
                className="px-4 sm:px-5 py-2 rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 active:scale-[0.97] border border-primary/30 whitespace-nowrap cursor-pointer"
              >
                Start Now
              </button>

              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile slide-down drawer ─────────────────────────────────────── */}
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="border-t border-primary/20 bg-background/98 backdrop-blur-2xl px-4 py-4 space-y-1">
            {NAV_LINKS.map(({ href, label, hash }) =>
              hash ? (
                <button
                  key={href}
                  onClick={() => scrollToSection(hash)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer"
                >
                  {label}
                </button>
              ) : (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all duration-200 no-underline [text-decoration:none] hover:[text-decoration:none]"
                >
                  {label}
                </Link>
              )
            )}
            <div className="pt-2 pb-1">
              <button
                onClick={scrollToUpload}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                Start Enhancing Now
              </button>
            </div>
          </nav>
        </div>

      </header>

      {/* Backdrop — closes drawer on outside tap */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}