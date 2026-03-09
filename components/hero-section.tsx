import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  title: string
  subtitle: string
  description: string
  primaryCTA: {
    text: string
    onClick?: () => void
    href?: string
  }
  secondaryCTA?: {
    text: string
    onClick?: () => void
    href?: string
  }
  image?: ReactNode
  badge?: string
}

export function HeroSection({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  image,
  badge,
}: HeroSectionProps) {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Vibrant Purple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-background to-primary/8 pointer-events-none" />
      
      {/* Large Decorative Gradient Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl pointer-events-none opacity-70 animate-pulse" />
      <div className="absolute -bottom-20 left-20 w-full h-96 bg-gradient-to-t from-primary/25 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-gradient-to-l from-accent/30 to-transparent rounded-full blur-3xl pointer-events-none opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${image ? '' : 'max-w-3xl'}`}>
          {/* Content - Premium Typography */}
          <div className="space-y-8 animate-fade-in">
            {badge && (
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/40 backdrop-blur-md hover:from-primary/30 hover:to-accent/20 hover:border-primary/60 transition-all duration-300 group shadow-lg shadow-primary/20">
                <span className="relative w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse"></span>
                <span className="text-xs font-bold text-primary tracking-widest uppercase group-hover:text-accent transition-colors duration-300">{badge}</span>
              </div>
            )}

            <div className="space-y-5 sm:space-y-6">
              <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground text-balance leading-[1.1] sm:leading-[1.15] tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-accent font-semibold tracking-tight leading-relaxed">{subtitle}</p>
              )}
            </div>

            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-foreground/70 text-balance leading-relaxed max-w-2xl font-light">
              {description}
            </p>

            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4 pt-4">
              <Button 
                size="lg"
                className="px-6 xs:px-8 py-5 xs:py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-[0.98] group w-full xs:w-auto text-sm sm:text-base"
                onClick={primaryCTA.onClick}
              >
                <span className="relative flex items-center justify-center xs:justify-start gap-2">
                  {primaryCTA.text}
                  <ArrowRight className="w-4 xs:w-5 h-4 xs:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>

              {secondaryCTA && (
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-6 xs:px-8 py-5 xs:py-6 border-primary/30 hover:border-primary/50 hover:bg-primary/5 font-semibold transition-all duration-300 w-full xs:w-auto text-sm sm:text-base"
                  onClick={secondaryCTA.onClick}
                >
                  {secondaryCTA.text}
                </Button>
              )}
            </div>
          </div>

          {/* Image Section */}
          {image && (
            <div className="hidden lg:block animate-slide-right">
              <div className="relative">
                {/* Decorative Frame */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl blur-2xl"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  {image}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
