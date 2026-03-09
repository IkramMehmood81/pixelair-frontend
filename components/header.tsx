'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-background/95 via-background/90 to-background/85 backdrop-blur-2xl border-b border-gradient-to-r from-primary/40 via-primary/20 to-accent/30 shadow-2xl shadow-primary/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18 gap-2 sm:gap-4">
          {/* Logo - Vibrant Purple Design */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group transition-all duration-300 flex-shrink-0">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/25 rounded-lg sm:rounded-xl blur-lg group-hover:from-primary/50 group-hover:to-accent/35 transition-all duration-300 shadow-lg shadow-primary/30"></div>
              <div className="relative bg-gradient-to-br from-primary/25 via-primary/15 to-accent/10 rounded-lg sm:rounded-xl p-2 sm:p-2.5 border border-primary/50 shadow-lg group-hover:shadow-2xl group-hover:border-accent/50 transition-all duration-300">
                <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-primary group-hover:text-accent transition-colors duration-300 group-hover:scale-110" strokeWidth={2.5} />
              </div>
            </div>
            <span className="hidden sm:inline font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-accent group-hover:to-primary transition-all duration-300">ProEnhance</span>
          </Link>

          {/* Navigation - Vibrant Hover Effects (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center">
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

          {/* CTA Button - Vibrant and Interactive */}
          <Button 
            asChild 
            size="sm"
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold shadow-xl shadow-primary/40 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 active:scale-[0.98] relative overflow-hidden group border border-primary/30 flex-shrink-0 text-xs sm:text-sm"
          >
            <Link href="/#upload" className="whitespace-nowrap">
              <span className="relative z-10">Start Now</span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
