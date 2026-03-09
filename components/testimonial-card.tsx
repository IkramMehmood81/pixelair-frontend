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
    <Card className="group relative p-8 bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm hover:from-primary/15 hover:to-accent/10 border border-primary/20 hover:border-primary/50 hover:shadow-2xl shadow-lg transition-all duration-400 overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute -right-16 -top-16 w-40 h-40 bg-gradient-to-br from-primary/20 to-accent/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-xl"></div>
      
      <div className="relative z-10 space-y-6">
        {/* Rating - Star System */}
        <div className="flex gap-1.5">
          {Array.from({ length: rating }).map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 fill-accent text-accent transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-0.5"
            />
          ))}
        </div>

        {/* Quote - Premium Typography with Better Styling */}
        <blockquote className="text-foreground leading-relaxed font-light text-base italic space-y-2">
          <p>
            <span className="text-primary/50 font-bold text-lg mr-2">"</span>{quote}<span className="text-primary/50 font-bold text-lg ml-2">"</span>
          </p>
        </blockquote>

        {/* Divider with Gradient */}
        <div className="w-12 h-0.5 bg-gradient-to-r from-primary/40 to-accent/20"></div>

        {/* Author Info - Enhanced Typography */}
        <div className="flex items-center gap-4 pt-2">
          <Avatar className="w-12 h-12 ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all duration-300 flex-shrink-0">
            <AvatarImage src={image} alt={author} />
            <AvatarFallback className="bg-gradient-to-br from-primary/25 to-accent/15 text-accent font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-base text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">{author}</p>
            <p className="text-sm text-foreground/60 font-light tracking-wide">{role}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
