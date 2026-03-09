import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    text: string
    onClick: () => void
  }
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="p-8 sm:p-12 border-border bg-card">
      <div className="flex flex-col items-center text-center gap-4 max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl">
          {icon}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        {action && (
          <Button
            onClick={action.onClick}
            className="mt-4 bg-primary hover:bg-primary/90"
          >
            {action.text}
          </Button>
        )}
      </div>
    </Card>
  )
}
