'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-background/95 via-background/90 to-background/85 backdrop-blur-2xl border-b border-gradient-to-r from-primary/40 via-primary/20 to-accent/30 shadow-2xl shadow-primary/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18 gap-2 sm:gap-4">
          {/* Responsive Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group transition-all duration-300 flex-shrink-0" aria-label="PhotoGenerator.ai — Home">
            <picture>
              <source media="(min-width:1024px)" srcSet="/logo-large.png" />
              <img
                src="/logo-small.png"
                alt="PhotoGenerator.ai logo"
                className="h-8 sm:h-9 lg:h-10 w-auto object-contain"
                style={{ imageRendering: 'auto' }}
              />
            </picture>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-centre" aria-label="Main navigation">
            <Link
              href="/#features"
              className="px-3 lg:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground/80 hover:text-primary bg-transparent hover:bg-primary/15 rounded-lg transition-all duration-300 relative group whitespace-nowrap"
            >
              Features
              <span className="absolute bottom-0.5 left-3 right-3 lg:left-4 lg:right-4 h-1 bg-gradient-to-r from-primary to-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link
              href="/#how-it-works"
              className="px-3 lg:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground/80 hover:text-primary bg-transparent hover:bg-primary/15 rounded-lg transition-all duration-300 relative group whitespace-nowrap"
            >
              How It Works
              <span className="absolute bottom-0.5 left-3 right-3 lg:left-4 lg:right-4 h-1 bg-gradient-to-r from-primary to-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link
              href="/privacy"
              className="px-3 lg:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground/80 hover:text-primary bg-transparent hover:bg-primary/15 rounded-lg transition-all duration-300 relative group whitespace-nowrap"
            >
              Privacy
              <span className="absolute bottom-0.5 left-3 right-3 lg:left-4 lg:right-4 h-1 bg-gradient-to-r from-primary to-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
          </nav>

          {/* CTA Button */}
          <Button
            asChild
            size="sm"
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold shadow-xl shadow-primary/40 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 active:scale-[0.98] relative overflow-hidden group border border-primary/30 flex-shrink-0 text-xs sm:text-sm"
          >
            <Link href="/#upload" className="whitespace-nowrap" aria-label="Start enhancing images now">
              <span className="relative z-10">Start Now</span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
