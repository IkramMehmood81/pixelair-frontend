'use client'

import { useState, useEffect } from 'react'
import { Download, RotateCcw, Loader, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ComparisonSlider } from '@/components/comparison-slider'
import { EnhancementStats } from '@/components/enhancement-stats'
import { GradientSection } from '@/components/gradient-section'
import { CTASection } from '@/components/cta-section'

export default function EnhancePage() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [isEnhanced, setIsEnhanced] = useState(false)
  const [originalImage, setOriginalImage] = useState<string>('')
  const [enhancedImage, setEnhancedImage] = useState<string>('')

  useEffect(() => {
    const stored = sessionStorage.getItem('originalImage')
    if (stored) {
      setOriginalImage(stored)
      simulateEnhancement(stored)
    } else {
      setIsProcessing(false)
    }
  }, [])

  const simulateEnhancement = async (imageData: string) => {
    await new Promise(resolve => setTimeout(resolve, 2500))
    setEnhancedImage(imageData)
    setIsEnhanced(true)
    setIsProcessing(false)
  }

  const handleDownload = () => {
    if (!enhancedImage) return
    const link = document.createElement('a')
    link.href = enhancedImage
    link.download = `enhanced-image-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleNewEnhance = () => {
    sessionStorage.removeItem('originalImage')
    window.location.href = '/'
  }

  if (!originalImage && !isProcessing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto px-4 text-center py-20">
            <h1 className="text-3xl font-bold text-foreground mb-4">No Image to Enhance</h1>
            <p className="text-muted-foreground mb-8">Please upload an image first.</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/" className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Go Back Home
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {isProcessing ? (
          // Processing State
          <GradientSection className="flex items-center justify-center min-h-[70vh]">
            <div className="max-w-md w-full mx-auto px-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Loader className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Enhancing Your Image</h1>
              <p className="text-muted-foreground mb-8">
                Our AI is analyzing and enhancing your photo. This usually takes a few seconds.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Analyzing image quality</p>
                <p>✓ Applying enhancement filters</p>
                <p>⟳ Optimizing colors and clarity</p>
              </div>
            </div>
          </GradientSection>
        ) : isEnhanced && enhancedImage ? (
          <>
            <GradientSection>
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Success Header */}
                <div className="flex items-center gap-3 mb-8">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Enhancement Complete</h1>
                </div>

                {/* Before / After side by side */}
                <div className="grid md:grid-cols-2 gap-4 mb-10">
                  {/* Original */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Original</p>
                    <div className="rounded-xl overflow-hidden border border-border bg-card aspect-square">
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Enhanced */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">Enhanced</p>
                    <div className="rounded-xl overflow-hidden border border-primary/40 bg-card aspect-square relative">
                      <img
                        src={enhancedImage}
                        alt="Enhanced"
                        className="w-full h-full object-contain"
                      />
                      {/* "Enhanced" badge */}
                      <span className="absolute top-2 right-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                        AI Enhanced
                      </span>
                    </div>
                  </div>
                </div>

                {/* Drag-to-compare strip */}
                <div className="mb-10">
                  <p className="text-sm text-muted-foreground mb-3">Drag to compare</p>
                  <div className="rounded-xl overflow-hidden border border-border" style={{ maxHeight: '420px' }}>
                    <ComparisonSlider
                      beforeImage={originalImage}
                      afterImage={enhancedImage}
                      beforeLabel="Original"
                      afterLabel="Enhanced"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-10">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Enhancement Applied</h2>
                  <EnhancementStats
                    clarity={85}
                    colorGrade={92}
                    noiseReduction={78}
                    sharpness={88}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Enhanced Image
                  </Button>
                  <Button
                    onClick={handleNewEnhance}
                    size="lg"
                    variant="outline"
                    className="flex-1"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Enhance Another
                  </Button>
                </div>

              </div>
            </GradientSection>

            <CTASection
              title="Satisfied with Your Results?"
              description="Share your enhanced photos or enhance more images. Your photos deserve the best."
              primaryCTA={{ text: 'Enhance More Photos', href: '/' }}
              secondaryCTA={{ text: 'Share on Social', href: '#' }}
            />
          </>
        ) : (
          // Error State
          <GradientSection className="flex items-center justify-center min-h-[70vh]">
            <div className="max-w-md w-full mx-auto px-4 text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4">Enhancement Failed</h1>
              <p className="text-muted-foreground mb-8">
                Something went wrong while processing your image. Please try again.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/" className="flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Try Again
                </Link>
              </Button>
            </div>
          </GradientSection>
        )}
      </main>

      <Footer />
    </div>
  )
}