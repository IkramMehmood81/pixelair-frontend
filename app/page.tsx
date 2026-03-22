'use client'

/**
 * app/page.tsx — Home page (upload + enhance + result — all in one)
 *
 * STATELESS PIPELINE
 * ──────────────────
 *  1. User picks image → canvas-compressed to ≤1024px/JPEG-0.7 in browser
 *  2. POST /api/enhance (multipart) → FastAPI → Replicate → returns JSON {url}
 *  3. Replicate CDN URL is stored in React state (memory only, no storage)
 *  4. Show original (Object-URL) + enhanced (CDN URL) side-by-side
 *  5. User clicks Download or Enhance Another
 *
 * Nothing is stored anywhere:
 *  • No sessionStorage / localStorage
 *  • No temp store / image_id
 *  • No navigation between pages
 *  • Original preview = Object-URL (lives in browser memory for this session only)
 *  • Enhanced image  = Replicate CDN URL (hosted by Replicate, not us)
 */

import { useState, useCallback, useEffect, useRef, Suspense } from 'react'
import {
  Zap, Shield, Wand2, Download, ArrowRight,
  CheckCircle2, Loader, AlertCircle, RotateCcw,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { UploadZone } from '@/components/upload-zone'
import { FeatureCard } from '@/components/feature-card'
import { StatCard } from '@/components/stat-card'
import { GradientSection } from '@/components/gradient-section'
import { CTASection } from '@/components/cta-section'
import { Step } from '@/components/step'
import { TestimonialCard } from '@/components/testimonial-card'
import { ComparisonSlider } from '@/components/comparison-slider'
import { EnhancementStats } from '@/components/enhancement-stats'
import { useToast } from '@/hooks/use-toast'

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE   = 10 * 1024 * 1024  // 10 MB (matches API limit)
const MAX_CANVAS_DIM  = 1024              // compress before sending
const CANVAS_QUALITY  = 0.7

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = 'idle' | 'enhancing' | 'done' | 'error'

interface EnhanceResult {
  url: string
  processing_time: number
  original_size_kb: number
  scale: number
  face_enhance: boolean
}

// ─── Processing steps ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 'upload',  label: 'Image received &amp; validated' },
  { id: 'sending', label: 'Sending to Real-ESRGAN AI' },
  { id: 'enhance', label: 'Upscaling &amp; enhancing pixels' },
  { id: 'finish',  label: 'Finalising output image' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function friendlyError(raw: string): string {
  if (!raw) return 'Enhancement failed. Please try again.'
  const lower = raw.toLowerCase()
  if (lower.includes('timeout') || lower.includes('timed out'))
    return 'Enhancement timed out. Please try again with a smaller image.'
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('econnrefused'))
    return 'Network error. Please check your connection and try again.'
  if (lower.includes('too large') || lower.includes('413'))
    return 'Image is too large. Please use an image under 10 MB.'
  if (lower.includes('unsupported') || lower.includes('415'))
    return 'Unsupported image format. Please use JPEG, PNG, or WebP.'
  return 'Enhancement failed. Please try again.'
}

/** Canvas-compress a File to ≤MAX_CANVAS_DIM px / JPEG quality CANVAS_QUALITY */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > MAX_CANVAS_DIM || height > MAX_CANVAS_DIM) {
          const ratio = Math.min(MAX_CANVAS_DIM / width, MAX_CANVAS_DIM / height)
          width  = Math.round(width  * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width; canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(file); return }
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
            canvas.width = 0; canvas.height = 0  // free memory
          },
          'image/jpeg',
          CANVAS_QUALITY,
        )
      }
      img.onerror = () => {
        console.warn('[compressImage] failed to load image for compression — sending original file')
        resolve(file)
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

/** Download a URL (CDN or blob) as a file */
async function downloadImage(url: string, filename: string) {
  try {
    const res  = await fetch(url)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl; a.download = filename
    document.body.appendChild(a); a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, '_blank')
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

function HomePageInner() {
  const { toast } = useToast()
  const searchParams = useSearchParams()

  // ── Upload state ──────────────────────────────────────────────────────────
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [preview,      setPreview]      = useState<string>('')   // Object-URL
  const [enhanceScale, setEnhanceScale] = useState<'2x' | '4x'>('2x')
  const [faceEnhance,  setFaceEnhance]  = useState(false)

  // ── Enhancement pipeline state ────────────────────────────────────────────
  const [stage,         setStage]       = useState<Stage>('idle')
  const [activeStep,    setActiveStep]  = useState(0)
  const [enhancedUrl,   setEnhancedUrl] = useState('')
  const [result,        setResult]      = useState<EnhanceResult | null>(null)
  const [errorMsg,      setErrorMsg]    = useState('')
  const previewRef = useRef<string>('')  // keeps preview alive after file cleared
  const abortRef   = useRef<AbortController | null>(null)  // cancels in-flight enhance fetch

  // ── Cross-page scroll (?scroll= param from header nav) ───────────────────
  useEffect(() => {
    const target = searchParams.get('scroll')
    if (!target) return
    const id = requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    const url = new URL(window.location.href)
    url.searchParams.delete('scroll')
    window.history.replaceState({}, '', url.toString())
    return () => cancelAnimationFrame(id)
  }, [searchParams])

  // ── Step animation while enhancing ───────────────────────────────────────
  useEffect(() => {
    if (stage !== 'enhancing') return
    const id = setInterval(() => setActiveStep(s => Math.min(s + 1, STEPS.length - 1)), 2200)
    return () => clearInterval(id)
  }, [stage])

  // ── Abort in-flight request on unmount ───────────────────────────────────
  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  // ── Scroll to #upload section ─────────────────────────────────────────────
  const scrollTo = (id: string) => {
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    )
  }

  // ── File selection ────────────────────────────────────────────────────────
  const handleFileSelect = useCallback((file: File | null) => {
    if (file === null) {
      if (preview) URL.revokeObjectURL(preview)
      setUploadedFile(null)
      setPreview('')
      previewRef.current = ''
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: 'File too large', description: 'Please upload an image under 10 MB.', variant: 'destructive' })
      return
    }
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file type', description: 'Please upload a PNG, JPG, or WebP image.', variant: 'destructive' })
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    const objectUrl = URL.createObjectURL(file)
    setUploadedFile(file)
    setPreview(objectUrl)
    previewRef.current = objectUrl
  }, [preview, toast])

  // ── Core enhancement — stateless, no storage anywhere ────────────────────
  const runEnhancement = useCallback(async (
    file: File,
    scale: '2x' | '4x',
    face: boolean,
  ) => {
    setStage('enhancing')
    setActiveStep(0)
    setErrorMsg('')

    try {
      // 1. Canvas compress (in browser, no server storage)
      const compressed = await compressImage(file)

      // 2. Build FormData and POST to /api/enhance
      //    /api/enhance → FastAPI → Replicate → returns {url, processing_time, ...}
      //    The enhanced image lives on Replicate's CDN — we never store it ourselves
      const form = new FormData()
      form.append('image',        compressed)
      form.append('scale',        scale === '4x' ? '4' : '2')
      form.append('face_enhance', String(face))

      abortRef.current = new AbortController()
      const res = await fetch('/api/enhance', { method: 'POST', body: form, signal: abortRef.current.signal })

      let data: Record<string, unknown> = {}
      try { data = await res.json() }
      catch { throw new Error('Enhancement failed. Please try again.') }

      if (!res.ok) throw new Error((data?.error as string) ?? `Server error ${res.status}`)
      if (!data.url) throw new Error('Enhancement failed. Please try again.')

      // 3. Store CDN url in React state — no sessionStorage, no temp store
      setResult(data as unknown as EnhanceResult)
      setEnhancedUrl(data.url as string)
      setActiveStep(STEPS.length - 1)
      setStage('done')

      // Scroll up to show result
      requestAnimationFrame(() => {
        document.getElementById('upload-done')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })

    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : 'Unexpected error.'
      setErrorMsg(friendlyError(raw))
      setStage('error')
    }
  }, [])

  const handleEnhance = async () => {
    if (!uploadedFile || stage === 'enhancing') return
    await runEnhancement(uploadedFile, enhanceScale, faceEnhance)
  }

  const handleDownload = () => {
    if (!enhancedUrl) return
    const scale = result?.scale ?? (enhanceScale === '4x' ? 4 : 2)
    downloadImage(enhancedUrl, `photogenerator-${scale}x-${Date.now()}.png`)
  }

  const handleEnhanceAnother = () => {
    // Abort any in-flight enhancement then reset state
    abortRef.current?.abort()
    handleFileSelect(null)
    setStage('idle')
    setEnhancedUrl('')
    setResult(null)
    setErrorMsg('')
    setActiveStep(0)
    requestAnimationFrame(() =>
      document.getElementById('upload-idle')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    )
  }

  const handleRetry = () => {
    if (uploadedFile) runEnhancement(uploadedFile, enhanceScale, faceEnhance)
  }

  // The preview to show on the done/error states — uses ref so it survives
  const displayPreview = previewRef.current || preview

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[70vh] flex items-center justify-center py-10 sm:py-14 bg-gradient-to-b from-background via-background to-card/30 overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute top-10 xs:top-16 sm:top-20 right-0 xs:right-10 w-48 xs:w-56 sm:w-72 h-48 xs:h-56 sm:h-72 bg-primary/5 rounded-full blur-3xl" />
          </div>
          <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center space-y-5 xs:space-y-6 sm:space-y-7">

              <div className="inline-flex items-center gap-2 px-3 xs:px-3.5 py-1.5 xs:py-2 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium tracking-tight text-primary hover:border-primary/40 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
                <span className="truncate xs:truncate-none">AI-Powered Image Enhancement</span>
              </div>

              <div className="space-y-3 xs:space-y-4 sm:space-y-5">
                <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-balance text-foreground leading-tight">
                  Transform Your
                  <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    Photos Instantly
                  </span>
                </h1>
                <p className="text-sm xs:text-base sm:text-lg md:text-xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed font-light px-2 xs:px-0">
                  Professional-grade image enhancement powered by advanced AI. No sign-up required. Completely free. Your privacy is guaranteed.
                </p>
              </div>

              <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 xs:gap-4 pt-2 px-2 xs:px-0">
                <button
                  onClick={() => scrollTo('upload-idle')}
                  aria-label="Start enhancing your photos"
                  className="flex items-center justify-center gap-3 px-6 xs:px-8 py-4 xs:py-5 rounded-xl text-sm xs:text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  Start Enhancing <ArrowRight className="w-4 xs:w-5 h-4 xs:h-5" />
                </button>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  aria-label="See how it works"
                  className="flex items-center justify-center px-6 xs:px-8 py-4 xs:py-5 rounded-xl text-sm xs:text-base font-semibold border border-border hover:border-primary/40 hover:bg-primary/5 text-foreground transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  See How It Works
                </button>
              </div>

              <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <StatCard value="500K+" label="Enhanced" highlight />
                <StatCard value="100%"  label="Free" />
                <StatCard value="2s"    label="Average" />
                <StatCard value="∞"     label="No Limits" />
              </div>

            </div>
          </div>
        </section>

        {/* ── Upload + Enhance (idle state) ────────────────────────────────── */}
        {(stage === 'idle' || stage === 'error') && (
          <GradientSection id="upload-idle">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  Upload Your Image
                </h2>
                <p className="text-muted-foreground text-lg font-light">
                  Drag and drop or select a file to begin enhancement
                </p>
              </div>

              <UploadZone onFileSelect={handleFileSelect} selectedFile={uploadedFile} preview={preview} />

              {/* Error banner */}
              {stage === 'error' && errorMsg && (
                <div className="mt-6 p-4 rounded-xl border border-destructive/40 bg-destructive/10 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">{errorMsg}</p>
                    {uploadedFile && (
                      <button
                        onClick={handleRetry}
                        className="mt-2 text-xs text-primary hover:underline cursor-pointer"
                      >
                        Try again →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {uploadedFile && (
                <div className="mt-8 space-y-4">
                  {/* Settings */}
                  <div className="p-6 rounded-lg border border-border bg-card">
                    <h3 className="font-semibold text-foreground mb-4">Enhancement Settings</h3>
                    <div className="grid sm:grid-cols-2 gap-6">

                      {/* Upscale factor — native radio (iOS-safe) */}
                      <div className="space-y-3">
                        <span className="text-sm font-medium text-foreground">Upscale Factor</span>
                        <div className="flex gap-2" role="radiogroup" aria-label="Upscale factor selection">
                          {(['2x', '4x'] as const).map((scale) => (
                            <label
                              key={scale}
                              className={[
                                'relative px-4 py-2 rounded-lg font-medium cursor-pointer select-none transition-colors',
                                enhanceScale === scale
                                  ? 'bg-primary text-primary-foreground'
                                  : 'border border-border bg-background hover:border-primary text-foreground',
                              ].join(' ')}
                            >
                              <input
                                type="radio"
                                name="upscale-factor"
                                value={scale}
                                checked={enhanceScale === scale}
                                onChange={() => setEnhanceScale(scale)}
                                className="sr-only"
                                aria-label={`Upscale ${scale}`}
                              />
                              <span className="pointer-events-none">{scale}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">2x is much faster than 4x</p>
                      </div>

                      {/* Face enhancement — native checkbox (iOS-safe) */}
                      <div className="space-y-3">
                        <span className="text-sm font-medium text-foreground">Face Enhancement</span>
                        <div className="flex items-center gap-3">
                          <label aria-label={`Face enhancement ${faceEnhance ? 'enabled' : 'disabled'}`} className="cursor-pointer">
                            <input
                              type="checkbox"
                              checked={faceEnhance}
                              onChange={(e) => setFaceEnhance(e.target.checked)}
                              className="sr-only"
                            />
                            <div className={['relative inline-flex h-8 w-14 items-center rounded-full transition-colors pointer-events-none', faceEnhance ? 'bg-primary' : 'bg-border'].join(' ')}>
                              <span className={['inline-block h-6 w-6 transform rounded-full bg-white transition-transform pointer-events-none', faceEnhance ? 'translate-x-7' : 'translate-x-1'].join(' ')} />
                            </div>
                          </label>
                          <span className="text-sm text-muted-foreground">{faceEnhance ? 'Enabled' : 'Disabled'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-accent/10 text-sm text-muted-foreground">
                      Processing time depends on image size and scale. 2x is much faster than 4x.
                    </div>
                  </div>

                  {/* Enhance / Clear buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleEnhance}
                      size="lg"
                      className="flex-1 py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                      aria-label="Enhance the uploaded image"
                    >
                      <Wand2 className="w-5 h-5 mr-2" />
                      Enhance Image
                    </Button>
                    <Button
                      onClick={() => handleFileSelect(null)}
                      variant="outline"
                      size="lg"
                      className="px-6"
                      aria-label="Clear the selected image"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </GradientSection>
        )}

        {/* ── Enhancing (processing state) ─────────────────────────────────── */}
        {stage === 'enhancing' && (
          <GradientSection id="upload-enhancing" className="flex items-center justify-center min-h-[75vh]">
            <div className="max-w-md w-full mx-auto px-4 text-center">
              <div className="relative w-20 h-20 mb-8" role="status" aria-label="Enhancing image">
                <div className="absolute inset-0 rounded-full border-4 border-border" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-2">Enhancing Your Image</h1>
              <p className="text-muted-foreground text-sm mb-8">
                Real-ESRGAN {enhanceScale}{faceEnhance ? ' + Face Restore' : ''} — usually under 15 seconds
              </p>

              <div className="text-left space-y-3 max-w-xs mx-auto">
                {STEPS.map((step, i) => {
                  const isDone   = i < activeStep
                  const isActive = i === activeStep
                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        {isDone   ? <CheckCircle2 className="w-5 h-5 text-primary" />
                        : isActive ? <Loader className="w-4 h-4 text-primary animate-spin" />
                        :            <div className="w-4 h-4 rounded-full border-2 border-border" />}
                      </div>
                      <span
                        className={`text-sm ${isDone || isActive ? 'text-foreground' : 'text-muted-foreground'}`}
                        dangerouslySetInnerHTML={{ __html: step.label }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </GradientSection>
        )}

        {/* ── Done (result state) ───────────────────────────────────────────── */}
        {stage === 'done' && enhancedUrl && (
          <>
            <GradientSection id="upload-done">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Enhancement Complete</h1>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Real-ESRGAN {result?.scale ?? (enhanceScale === '4x' ? 4 : 2)}x
                        {(result?.face_enhance ?? faceEnhance) ? ' + Face Restore' : ''}
                        {result ? ` · ${result.processing_time}s` : ''}
                      </p>
                    </div>
                  </div>
                  {/* Download button — top right on desktop */}
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground hidden sm:flex"
                    aria-label="Download enhanced image"
                  >
                    <Download className="w-4 h-4 mr-1.5" /> Download
                  </Button>
                </div>

                {/* Before / After thumbnails */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Original{result ? ` · ${result.original_size_kb.toFixed(0)} KB` : ''}
                    </p>
                    <div className="rounded-xl overflow-hidden border border-border bg-card">
                      <img
                        src={displayPreview}
                        alt="Original image before enhancement"
                        className="w-full object-contain max-h-[420px]"
                        draggable={false}
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Enhanced {result?.scale ?? (enhanceScale === '4x' ? 4 : 2)}x
                    </p>
                    <div className="rounded-xl overflow-hidden border border-primary/40 bg-card relative">
                      <img
                        src={enhancedUrl}
                        alt="Enhanced image after AI processing"
                        className="w-full object-contain max-h-[420px]"
                        draggable={false}
                        crossOrigin="anonymous"
                        loading="lazy"
                      />
                      <span className="absolute top-2 right-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium pointer-events-none">
                        AI Enhanced
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compare slider */}
                <div className="mb-8">
                  <p className="text-sm text-muted-foreground mb-3">← Drag to compare before / after →</p>
                  <div className="rounded-xl overflow-hidden border border-border max-h-[420px]">
                    <ComparisonSlider
                      beforeImage={displayPreview}
                      afterImage={enhancedUrl}
                      beforeLabel="Original"
                      afterLabel={`Enhanced ${result?.scale ?? (enhanceScale === '4x' ? 4 : 2)}x`}
                    />
                  </div>
                </div>

                {/* Enhancement stats */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Enhancement Applied</h2>
                  <EnhancementStats clarity={85} colourGrade={92} noiseReduction={78} sharpness={88} />
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    aria-label="Download enhanced image"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Enhanced Image
                  </Button>
                  <Button
                    onClick={handleEnhanceAnother}
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    aria-label="Enhance another image"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Enhance Another
                  </Button>
                </div>

              </div>
            </GradientSection>

            <section className="py-16 sm:py-20 bg-gradient-to-b from-background to-primary/5 text-center px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Satisfied with Your Results?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Enhance more images — no sign-up, no watermarks, completely free.
              </p>
              <button
                onClick={handleEnhanceAnother}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold shadow-xl shadow-primary/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                Enhance Another Photo
              </button>
            </section>
          </>
        )}

        {/* ── Features, How It Works, Testimonials, CTA — only shown on idle/error ── */}
        {(stage === 'idle' || stage === 'error') && (
        <>
        <GradientSection id="features">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 xs:space-y-4 mb-12 xs:mb-14 sm:mb-16 px-2 xs:px-0">
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight">Why Choose PhotoGenerator.ai</h2>
              <p className="text-muted-foreground text-sm xs:text-base sm:text-lg font-light max-w-2xl mx-auto">Built for creators who demand quality and simplicity</p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6">
              <FeatureCard icon={Zap}      title="Lightning Fast"  description="Enhanced images in seconds. Optimised for speed without sacrificing quality." highlight />
              <FeatureCard icon={Shield}   title="100% Private"    description="Your images are never stored. Complete privacy with automatic deletion." />
              <FeatureCard icon={Wand2}    title="AI-Powered"      description="State-of-the-art algorithms deliver professional-grade results." />
              <FeatureCard icon={Download} title="Unlimited"       description="No watermarks, no limits, no premium tier. Completely free." />
            </div>
          </div>
        </GradientSection>

        {/* ── How It Works ──────────────────────────────────────────────────── */}
        <GradientSection id="how-it-works">
          <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 xs:space-y-4 mb-12 xs:mb-14 sm:mb-16 px-2 xs:px-0">
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight">Simple Three-Step Process</h2>
              <p className="text-muted-foreground text-sm xs:text-base sm:text-lg font-light">Quality enhancement made effortless</p>
            </div>
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 max-w-3xl mx-auto">
              <Step number={1} title="Upload Your Image"            description="Select or drag-and-drop any image. We support PNG, JPG, and WebP formats up to 10MB." />
              <Step number={2} title="AI Analysis &amp; Enhancement" description="Our advanced AI instantly analyses and enhances your image with clarity boost, noise reduction, and colour optimisation." />
              <Step number={3} title="Download &amp; Share"           description="Get your enhanced image immediately. Share directly or download in high quality — no watermarks, no restrictions." />
            </div>
          </div>
        </GradientSection>

        {/* ── Testimonials ──────────────────────────────────────────────────── */}
        <GradientSection>
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 xs:space-y-4 mb-12 xs:mb-14 sm:mb-16 px-2 xs:px-0">
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight">Trusted by Creators</h2>
              <p className="text-muted-foreground text-sm xs:text-base sm:text-lg font-light max-w-2xl mx-auto">Photographers and content creators love PhotoGenerator.ai</p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
              <TestimonialCard quote="PhotoGenerator.ai completely transformed my photo workflow. The quality is exceptional and it's truly free."    author="Sarah Chen"       role="Photographer"     rating={5} />
              <TestimonialCard quote="I use it daily. The AI enhancement is spot-on, and there are no hidden paywalls or watermarks."                 author="Marcus Rodriguez" role="Content Creator"   rating={5} />
              <TestimonialCard quote="Finally a tool that respects user privacy while delivering professional results. Highly recommend."             author="Emma Williams"    role="Digital Marketer" rating={5} />
            </div>
          </div>
        </GradientSection>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <CTASection
          title="Ready to Enhance Your Photos?"
          description="Join thousands of creators improving their images with PhotoGenerator.ai. Get started instantly — no sign-up required."
          primaryCTA={{ text: 'Start Enhancing', href: '#upload-idle' }}
          secondaryCTA={{ text: 'Learn More', href: '#how-it-works' }}
        />
        </>
        )}

      </main>
      <Footer />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageInner />
    </Suspense>
  )
}