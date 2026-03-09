import { Card } from '@/components/ui/card'

interface StepProps {
  number: number
  title: string
  description: string
  icon?: React.ReactNode
}

export function Step({ number, title, description, icon }: StepProps) {
  return (
    <div className="flex gap-3 xs:gap-4 sm:gap-6">
      {/* Number Badge */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-10 xs:w-12 h-10 xs:h-12 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
          <span className="text-base xs:text-lg font-bold text-primary-foreground">{number}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base xs:text-lg font-semibold text-foreground mb-2 leading-snug">{title}</h3>
        <p className="text-sm xs:text-base text-muted-foreground leading-relaxed">{description}</p>
        {icon && (
          <div className="mt-3 xs:mt-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
