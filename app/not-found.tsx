import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          {/* 404 Number */}
          <div className="mb-8">
            <div className="text-7xl sm:text-8xl font-bold text-primary/10 mb-4">404</div>
          </div>

          {/* Content */}
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </Button>

            <Button 
              asChild
              variant="outline"
              size="lg"
            >
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Suggestions */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Or check out these helpful links:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Link href="/" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Home
              </Link>
              <Link href="/#features" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-sm text-primary hover:text-primary/80 transition-colors">
                How It Works
              </Link>
              <Link href="/contact" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}