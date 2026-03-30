'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface CTALink {
  text: string
  href: string
}

interface CTASectionProps {
  title: string
  description: string
  primaryCTA?: CTALink
  secondaryCTA?: CTALink
}

function scrollToId(href: string) {
  // If it's an anchor like #upload-idle, smooth-scroll to it
  if (href.startsWith('#')) {
    const id = href.slice(1)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    window.location.href = href
  }
}

export function CTASection({
  title,
  description,
  primaryCTA = { text: 'Get Started', href: '#upload-idle' },
  secondaryCTA,
}: CTASectionProps) {
  return (
    <section className="relative py-16 xs:py-20 sm:py-28 md:py-32 lg:py-40 overflow-hidden">
      {/* Vibrant Purple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/15 pointer-events-none" />
      
      {/* Large Decorative Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 xs:h-80 sm:h-96 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 xs:w-80 sm:w-96 h-64 xs:h-80 sm:h-96 bg-gradient-to-tl from-accent/30 via-primary/15 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 -left-20 xs:-left-32 sm:-left-40 w-64 xs:w-80 sm:w-96 h-64 xs:h-80 sm:h-96 bg-gradient-to-r from-primary/25 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none" />
      
      <div className="relative max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 text-center space-y-8 xs:space-y-10">
        <div className="space-y-5 xs:space-y-6">
          <h2
            className="font-bold text-foreground text-balance tracking-tight"
            style={{ fontSize: 'clamp(1.75rem, 6vw, 4.25rem)', lineHeight: 1.1 }}
          >
            {title}
          </h2>
          <p
            className="text-foreground/70 text-balance max-w-3xl mx-auto leading-relaxed font-light px-2 xs:px-0"
            style={{ fontSize: 'clamp(0.9rem, 2vw, 1.375rem)' }}
          >
            {description}
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 xs:gap-4 pt-6 xs:pt-8 px-2 xs:px-0">
          {primaryCTA.href.startsWith('#') ? (
            <Button
              onClick={() => scrollToId(primaryCTA.href)}
              size="lg"
              className="w-full xs:w-auto px-6 xs:px-8 py-5 xs:py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold shadow-2xl shadow-primary/40 hover:shadow-3xl hover:shadow-primary/60 group border border-primary/30 text-sm xs:text-base flex items-center justify-center gap-2 xs:gap-3 cursor-pointer"
            >
              {primaryCTA.text}
              <ArrowRight className="w-4 xs:w-5 h-4 xs:h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          ) : (
            <Button
              asChild
              size="lg"
              className="w-full xs:w-auto px-6 xs:px-8 py-5 xs:py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold shadow-2xl shadow-primary/40 hover:shadow-3xl hover:shadow-primary/60 group border border-primary/30 text-sm xs:text-base"
            >
              <Link href={primaryCTA.href} className="flex items-center justify-center xs:justify-start gap-2 xs:gap-3">
                {primaryCTA.text}
                <ArrowRight className="w-4 xs:w-5 h-4 xs:h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </Button>
          )}

          {secondaryCTA && (
            secondaryCTA.href.startsWith('#') ? (
              <Button
                onClick={() => scrollToId(secondaryCTA.href)}
                size="lg"
                variant="outline"
                className="w-full xs:w-auto px-6 xs:px-8 py-5 xs:py-6 border-primary/50 hover:border-primary/70 bg-transparent hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/15 text-foreground hover:text-primary shadow-lg shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 text-sm xs:text-base cursor-pointer"
              >
                {secondaryCTA.text}
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full xs:w-auto px-6 xs:px-8 py-5 xs:py-6 border-primary/50 hover:border-primary/70 bg-transparent hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/15 text-foreground hover:text-primary shadow-lg shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 text-sm xs:text-base"
              >
                <Link href={secondaryCTA.href}>
                  {secondaryCTA.text}
                </Link>
              </Button>
            )
          )}
        </div>
      </div>
    </section>
  )
}