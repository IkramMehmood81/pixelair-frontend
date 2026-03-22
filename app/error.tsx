'use client'
import { useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[app/error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground text-sm">
              An unexpected error occurred. Please try again.
            </p>
          </div>
          <Button
            onClick={reset}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try again
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}