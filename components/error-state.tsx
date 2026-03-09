import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ErrorStateProps {
  title: string
  message: string
  action?: {
    text: string
    onClick: () => void
  }
  icon?: React.ReactNode
}

export function ErrorState({
  title,
  message,
  action,
  icon,
}: ErrorStateProps) {
  return (
    <Card className="p-8 sm:p-12 bg-destructive/5 border-destructive/20 max-w-md mx-auto">
      <div className="flex flex-col items-center text-center gap-4">
        {icon || (
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>

        {action && (
          <Button
            onClick={action.onClick}
            className="mt-4 w-full bg-destructive hover:bg-destructive/90"
          >
            {action.text}
          </Button>
        )}
      </div>
    </Card>
  )
}
