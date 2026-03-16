'use client'

import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-background via-primary/8 to-primary/5 border-t border-gradient-to-r from-primary/40 via-primary/20 to-accent/30 shadow-2xl shadow-primary/20 relative overflow-hidden">
      {/* Decorative Gradient Orbs */}
      <div className="absolute top-0 right-0 w-full h-64 xs:h-80 sm:h-96 bg-gradient-to-bl from-primary/25 via-primary/10 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 xs:w-80 sm:w-96 h-64 xs:h-80 sm:h-96 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-12 xs:py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 xs:gap-8 sm:gap-10 lg:gap-12 mb-8 xs:mb-10 sm:mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5 xs:gap-6">
            <Link href="/" aria-label="PhotoGenerator.ai — Home">
              <picture>
                <source media="(min-width:1024px)" srcSet="/logo-large.png" />
                <img
                  src="/logo-small.png"
                  alt="PhotoGenerator.ai logo"
                  className="h-8 sm:h-9 lg:h-14 w-auto object-contain"
                  loading="lazy"
                />
              </picture>
            </Link>
            <p className="text-xs xs:text-sm sm:text-base text-foreground/70 leading-relaxed max-w-xs font-light">
              Professional AI image enhancement. Free forever. Privacy first. Built for creators.
            </p>
            <a
              href="mailto:support@photogenerator.ai"
              className="text-xs xs:text-sm text-primary hover:underline font-medium transition-colors"
              aria-label="Email support"
            >
              support@photogenerator.ai
            </a>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-5 xs:gap-6">
            <h4 className="text-xs xs:text-sm font-bold text-foreground tracking-widest uppercase">Product</h4>
            <nav className="flex flex-col gap-2 xs:gap-3" aria-label="Product links">
              <Link href="/" className="text-xs xs:text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light">
                Home
              </Link>
              <Link href="/#features" className="text-xs xs:text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-xs xs:text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light">
                How It Works
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-5 xs:gap-6">
            <h4 className="text-xs xs:text-sm font-bold text-foreground tracking-widest uppercase">Resources</h4>
            <nav className="flex flex-col gap-3" aria-label="Resource links">
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light">
                Contact
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light">
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-5 xs:gap-6">
            <h4 className="text-xs xs:text-sm font-bold text-foreground tracking-widest uppercase">Support</h4>
            <nav className="flex flex-col gap-3" aria-label="Support links">
              <a href="mailto:support@photogenerator.ai" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light">
                General Support
              </a>
              <a href="mailto:support@photogenerator.ai" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light">
                Bug Reports
              </a>
              <a href="mailto:support@photogenerator.ai" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light">
                Privacy Concerns
              </a>
            </nav>
          </div>
        </div>

        <Separator className="my-12 bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground">
          <p className="tracking-tight font-light">&copy; {currentYear} PhotoGenerator.ai. All rights reserved.</p>
          <p className="tracking-tight font-light">Designed for creators. Built with precision.</p>
        </div>
      </div>
    </footer>
  )
}
