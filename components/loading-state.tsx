import { Loader } from 'lucide-react'

interface LoadingStateProps {
  message?: string
  submessage?: string
  fullScreen?: boolean
}

export function LoadingState({
  message = 'Loading...',
  submessage,
  fullScreen = false,
}: LoadingStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-border" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground">{message}</p>
        {submessage && <p className="text-sm text-muted-foreground mt-1">{submessage}</p>}
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return <div className="flex items-center justify-center py-12">{content}</div>
}
