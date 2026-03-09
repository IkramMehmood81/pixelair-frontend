'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-background via-primary/8 to-primary/5 border-t border-gradient-to-r from-primary/40 via-primary/20 to-accent/30 shadow-2xl shadow-primary/20 relative overflow-hidden">
      {/* Decorative Gradient Orbs - Responsive Sizing */}
      <div className="absolute top-0 right-0 w-full h-64 xs:h-80 sm:h-96 bg-gradient-to-bl from-primary/25 via-primary/10 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 xs:w-80 sm:w-96 h-64 xs:h-80 sm:h-96 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-12 xs:py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 xs:gap-8 sm:gap-10 lg:gap-12 mb-8 xs:mb-10 sm:mb-12">
          {/* Brand - Vibrant Purple */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5 xs:gap-6">
            <div className="flex items-center gap-2 xs:gap-3 group">
              <div className="bg-gradient-to-br from-primary/40 to-accent/25 rounded-lg p-2 xs:p-2.5 border border-primary/50 group-hover:from-primary/50 group-hover:to-accent/35 group-hover:border-accent/50 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 flex-shrink-0">
                <Sparkles className="w-4 xs:w-5 h-4 xs:h-5 text-accent group-hover:text-white transition-colors duration-300 group-hover:scale-110" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg xs:text-xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-accent group-hover:to-primary transition-all duration-300">ProEnhance</span>
            </div>
            <p className="text-xs xs:text-sm sm:text-base text-foreground/70 leading-relaxed max-w-xs font-light">
              Professional AI image enhancement. Free forever. Privacy first. Built for creators.
            </p>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-5 xs:gap-6">
            <h4 className="text-xs xs:text-sm font-bold text-foreground tracking-widest uppercase">Product</h4>
            <nav className="flex flex-col gap-2 xs:gap-3">
              <Link 
                href="/" 
                className="text-xs xs:text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light"
              >
                Home
              </Link>
              <Link 
                href="/#features" 
                className="text-xs xs:text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light"
              >
                Features
              </Link>
              <Link 
                href="/#how-it-works" 
                className="text-xs xs:text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light"
              >
                How It Works
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-5 xs:gap-6">
            <h4 className="text-xs xs:text-sm font-bold text-foreground tracking-widest uppercase">Resources</h4>
            <nav className="flex flex-col gap-3">
              <Link 
                href="/contact" 
                className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light"
              >
                Contact
              </Link>
              <Link 
                href="/privacy" 
                className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 font-light"
              >
                Terms of Service
              </Link>
            </nav>
          </div>


        </div>

        <Separator className="my-12 bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

        {/* Bottom - Legal and Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground">
          <p className="tracking-tight font-light">&copy; {currentYear} ProEnhance. All rights reserved.</p>
          <p className="tracking-tight font-light">Designed for creators. Built with precision.</p>
        </div>
      </div>
    </footer>
  )
}
