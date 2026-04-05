import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface Feature {
  name: string
  included: boolean
}

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: Feature[]
  highlighted?: boolean
  ctaText?: string
  onCTA?: () => void
}

export function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
  ctaText = 'Get Started',
  onCTA,
}: PricingCardProps) {
  return (
    <Card className={`relative p-8 transition-all duration-300 ${
      highlighted 
        ? 'border-primary/50 shadow-xl scale-105 bg-gradient-to-br from-primary/5 to-accent/5' 
        : 'bg-card hover:shadow-lg hover:border-primary/30'
    }`}>
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">{name}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <div className="mb-6">
        <div className="text-4xl font-bold text-foreground mb-1">
          {price}
        </div>
      </div>

      <Button 
        onClick={onCTA}
        className={`w-full mb-8 ${
          highlighted 
            ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
            : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground border-primary/20'
        }`}
        size="lg"
      >
        {ctaText}
      </Button>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <Check className={`w-5 h-5 flex-shrink-0 ${
              feature.included ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <span className={feature.included ? 'text-foreground' : 'text-muted-foreground line-through'}>
              {feature.name}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
