import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  highlight?: boolean
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  highlight = false 
}: FeatureCardProps) {
  return (
    <Card className={`group relative p-8 transition-all duration-400 hover:-translate-y-3 border overflow-hidden ${
      highlight 
        ? 'bg-gradient-to-br from-primary/25 via-primary/15 to-accent/15 border-primary/50 hover:border-primary/70 hover:shadow-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40' 
        : 'bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm border-primary/20 hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/20 hover:to-accent/15 hover:shadow-2xl shadow-lg shadow-primary/10'
    }`}>
      {/* Background Accent Glow */}
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-2xl"></div>
      
      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Icon Container */}
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-400 ${
          highlight
            ? 'bg-gradient-to-br from-primary/40 to-accent/25 group-hover:from-primary/50 group-hover:to-accent/35 shadow-xl shadow-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/40'
            : 'bg-gradient-to-br from-primary/30 to-accent/15 group-hover:from-primary/40 group-hover:to-accent/25 shadow-lg shadow-primary/20 group-hover:shadow-xl'
        }`}>
          <Icon className={`w-7 h-7 transition-all duration-400 ${
            highlight 
              ? 'text-accent group-hover:text-white group-hover:scale-125' 
              : 'text-primary group-hover:text-accent group-hover:scale-125'
          }`} strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h3 className="font-bold text-xl text-foreground tracking-tight group-hover:text-accent transition-colors duration-300 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-base text-foreground/70 leading-relaxed font-light group-hover:text-foreground/85 transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Border Gradient on Hover */}
      <div className="absolute inset-0 border rounded-lg border-transparent bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/20 group-hover:to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"></div>
    </Card>
  )
}
