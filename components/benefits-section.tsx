import { Check } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Benefit {
  title: string
  description: string
}

interface BenefitsSectionProps {
  title: string
  benefits: Benefit[]
  image?: React.ReactNode
}

export function BenefitsSection({ title, benefits, image }: BenefitsSectionProps) {
  return (
    <div className="w-full">
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">{title}</h2>
      
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Benefits List */}
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-6 bg-card hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Image/Content */}
        {image && (
          <div className="hidden lg:block">
            {image}
          </div>
        )}
      </div>
    </div>
  )
}
