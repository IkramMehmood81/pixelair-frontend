import { Card } from '@/components/ui/card'

interface StepProps {
  number: number
  title: string
  description: string
  icon?: React.ReactNode
}

/**
 * Step — fluid sizing for all screen sizes.
 * Fixed: text-base xs:text-lg caused inconsistency; now clamp-based.
 */
export function Step({ number, title, description, icon }: StepProps) {
  return (
    <div className="flex gap-4 sm:gap-6">
      {/* Number Badge */}
      <div className="flex-shrink-0">
        <div
          className="flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30"
          style={{ width: 'clamp(2.25rem, 5vw, 3rem)', height: 'clamp(2.25rem, 5vw, 3rem)' }}
        >
          <span
            className="font-bold text-primary-foreground"
            style={{ fontSize: 'clamp(0.85rem, 2vw, 1.125rem)' }}
          >
            {number}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold text-foreground mb-1.5 leading-snug"
          style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.125rem)' }}
        >
          {title}
        </h3>
        <p
          className="text-muted-foreground leading-relaxed"
          style={{ fontSize: 'clamp(0.8rem, 1.6vw, 1rem)' }}
        >
          {description}
        </p>
        {icon && <div className="mt-3">{icon}</div>}
      </div>
    </div>
  )
}
