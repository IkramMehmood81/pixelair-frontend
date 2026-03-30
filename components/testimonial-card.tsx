import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  image?: string
  rating?: number
}

/**
 * TestimonialCard — fluid padding, clamp-based font sizes.
 * Fixed: p-8 was over-padding on mobile xs:grid-cols-2 layout.
 */
export function TestimonialCard({
  quote,
  author,
  role,
  image,
  rating = 5,
}: TestimonialCardProps) {
  const initials = author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <Card
      className="group relative bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm hover:from-primary/15 hover:to-accent/10 border border-primary/20 hover:border-primary/50 hover:shadow-2xl shadow-lg transition-all duration-400 overflow-hidden"
      style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}
    >
      <div className="absolute -right-16 -top-16 w-40 h-40 bg-gradient-to-br from-primary/20 to-accent/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Stars */}
        <div className="flex gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-accent text-accent transition-all duration-300 group-hover:scale-110" />
          ))}
        </div>

        {/* Quote */}
        <blockquote
          className="text-foreground leading-relaxed font-light italic"
          style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}
        >
          <span className="text-primary/50 font-bold text-lg mr-1">"</span>
          {quote}
          <span className="text-primary/50 font-bold text-lg ml-1">"</span>
        </blockquote>

        {/* Divider */}
        <div className="w-10 h-0.5 bg-gradient-to-r from-primary/40 to-accent/20" />

        {/* Author */}
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all duration-300 flex-shrink-0">
            <AvatarImage src={image} alt={author} />
            <AvatarFallback className="bg-gradient-to-br from-primary/25 to-accent/15 text-accent font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p
              className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug truncate"
              style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}
            >
              {author}
            </p>
            <p
              className="text-foreground/60 font-light tracking-wide truncate"
              style={{ fontSize: 'clamp(0.7rem, 1.3vw, 0.875rem)' }}
            >
              {role}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
