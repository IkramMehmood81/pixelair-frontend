/**
 * app/page.tsx — Hydration-proof home page
 *
 * HYDRATION STRATEGY (permanent fix):
 * ─────────────────────────────────────
 * Rule 1: The server renders the IDLE/HERO state only. This is always
 *         identical between server and client on first paint. ✅
 *
 * Rule 2: All stage-dependent UI (enhancing, done, error panels) is
 *         wrapped with {isClient && ...}. The server never renders these,
 *         so there is zero chance of a server/client mismatch. ✅
 *
 * Rule 3: NO suppressHydrationWarning anywhere in this file. That attribute
 *         masks real bugs instead of fixing them. We fix the root cause instead.
 *
 * Rule 4: No conditional classNames based on client-only state at initial
 *         render. The hero section className is always identical.
 *
 * Rule 5: All clamp() values are in inline style props, not Tailwind
 *         arbitrary-value className strings. This avoids SSR/JIT divergence.
 *
 * Browser extension text injection (Grammarly, Translate, etc.):
 *   These modify text nodes AFTER hydration. React 18 can detect and warn
 *   about this. The fix is to add suppressHydrationWarning ONLY on the
 *   specific text-bearing <span>, never on parent containers. We do this
 *   for the badge span only, since that's the only static text that
 *   extensions commonly modify.
 */

'use client'

import { useState, useCallback, useEffect, useRef, Suspense } from 'react'
import {
  Zap, Shield, Wand2, Download,
  CheckCircle2, Loader, AlertCircle, RotateCcw, CheckCircle,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Button }           from '@/components/ui/button'
import { Header }           from '@/components/header'
import { Footer }           from '@/components/footer'
import { UploadZone }       from '@/components/upload-zone'
import { FeatureCard }      from '@/components/feature-card'
import { StatCard }         from '@/components/stat-card'
import { GradientSection }  from '@/components/gradient-section'
import { CTASection }       from '@/components/cta-section'
import { Step }             from '@/components/step'
import { TestimonialCard }  from '@/components/testimonial-card'
import { ComparisonSlider } from '@/components/comparison-slider'
import { EnhancementStats } from '@/components/enhancement-stats'
import { useToast }         from '@/hooks/use-toast'
import { useIsClient }      from '@/hooks/use-is-client'

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE          = 10 * 1024 * 1024
const MAX_CANVAS_DIM         = 1024
const CANVAS_QUALITY         = 0.7
const MIN_ENHANCE_DISPLAY_MS = 4000

const DEMO_BEFORE = '/demo-before.jpg'
const DEMO_AFTER  = '/demo-after.jpg'

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = 'idle' | 'enhancing' | 'done' | 'error'

interface EnhanceResult {
  url:              string
  processing_time:  number
  original_size_kb: number
  scale:            number
  face_enhance:     boolean
}

// ─── Processing steps (all static — safe to declare at module level) ──────────

const STEPS = [
  { id: 'upload',  label: 'Image received & validated'    },
  { id: 'sending', label: 'Sending to AI enhancement engine'  },
  { id: 'enhance', label: 'Sharpening & enhancing pixels' },
  { id: 'finish',  label: 'Finalising your enhanced image'    },
] as const

// ─── Pure helper functions (no side-effects, safe on server) ──────────────────

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

// ─── Browser-only helpers (only called from event handlers / effects) ─────────

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
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(file); return }
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
            canvas.width = 0
            canvas.height = 0
          },
          'image/jpeg',
          CANVAS_QUALITY,
        )
      }
      img.onerror = () => resolve(file)
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

async function downloadImage(url: string, filename: string) {
  try {
    const res     = await fetch(url)
    const blob    = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a       = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, '_blank')
  }
}

// ─── Static sub-components (no client-only state, safe to SSR) ───────────────

function TrustSignals() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
      {[
        'Image deleted after processing',
        'No watermarks added',
        'No sign-up required',
        'Results in ~8–12 seconds',
      ].map((signal) => (
        <div key={signal} className="flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span className="text-xs text-muted-foreground">{signal}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Main page component ──────────────────────────────────────────────────────

function HomePageInner() {
  const { toast }    = useToast()
  const searchParams = useSearchParams()

  // isClient: false on server + initial client paint, true after hydration.
  // Used to gate ALL rendering that must differ between server and client.
  const isClient = useIsClient()

  // All state starts at stable defaults that match the server render exactly.
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [preview,      setPreview]      = useState<string>('')
  const [enhanceScale, setEnhanceScale] = useState<'2x' | '4x'>('2x')
  const [faceEnhance,  setFaceEnhance]  = useState(false)
  const [stage,        setStage]        = useState<Stage>('idle')
  const [activeStep,   setActiveStep]   = useState(0)
  const [enhancedUrl,  setEnhancedUrl]  = useState('')
  const [result,       setResult]       = useState<EnhanceResult | null>(null)
  const [errorMsg,     setErrorMsg]     = useState('')

  const previewRef = useRef<string>('')
  const abortRef   = useRef<AbortController | null>(null)

  // ── Cross-page scroll ────────────────────────────────────────────────────
  // Safe: runs only in useEffect, no SSR impact
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

  // ── Step animation ───────────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'enhancing') return
    const id = setInterval(() => setActiveStep(s => Math.min(s + 1, STEPS.length - 1)), 2200)
    return () => clearInterval(id)
  }, [stage])

  // ── Scroll to section when stage changes ─────────────────────────────────
  useEffect(() => {
    if (!isClient) return
    const targetId =
      stage === 'enhancing' ? 'upload-enhancing' :
      stage === 'done'      ? 'upload-done'      :
      stage === 'error'     ? 'upload-idle'      : null
    if (!targetId) return
    let raf2: number
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = document.getElementById(targetId)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        else window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    })
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2) }
  }, [stage, isClient])

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => () => { abortRef.current?.abort() }, [])

  // ── File selection ───────────────────────────────────────────────────────
  // toast from useToast is stable (memoised internally) — safe in deps
  const handleFileSelect = useCallback((file: File | null) => {
    if (file === null) {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
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
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    const objectUrl = URL.createObjectURL(file)
    setUploadedFile(file)
    setPreview(objectUrl)
    previewRef.current = objectUrl
  }, [toast])

  // ── Enhancement ──────────────────────────────────────────────────────────
  const runEnhancement = useCallback(async (
    file: File, scale: '2x' | '4x', face: boolean,
  ) => {
    setStage('enhancing')
    setActiveStep(0)
    setErrorMsg('')
    const displayStart = Date.now()

    try {
      const compressed = await compressImage(file)
      const form = new FormData()
      form.append('image',        compressed)
      form.append('scale',        scale === '4x' ? '4' : '2')
      form.append('face_enhance', String(face))

      abortRef.current = new AbortController()

      const [res] = await Promise.all([
        fetch('/api/enhance', { method: 'POST', body: form, signal: abortRef.current.signal }),
        new Promise<void>(resolve => {
          const elapsed   = Date.now() - displayStart
          const remaining = Math.max(0, MIN_ENHANCE_DISPLAY_MS - elapsed)
          setTimeout(resolve, remaining)
        }),
      ])

      let data: Record<string, unknown> = {}
      try { data = await res.json() }
      catch { throw new Error('Enhancement failed. Please try again.') }

      if (!res.ok)   throw new Error((data?.error as string) ?? `Server error ${res.status}`)
      if (!data.url) throw new Error('Enhancement failed. Please try again.')

      setResult(data as unknown as EnhanceResult)
      setEnhancedUrl(data.url as string)
      setActiveStep(STEPS.length - 1)
      setStage('done')

    } catch (err: unknown) {
      const elapsed   = Date.now() - displayStart
      const remaining = Math.max(0, MIN_ENHANCE_DISPLAY_MS - elapsed)
      if (remaining > 0) await new Promise(r => setTimeout(r, remaining))
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
    abortRef.current?.abort()
    handleFileSelect(null)
    setStage('idle')
    setEnhancedUrl('')
    setResult(null)
    setErrorMsg('')
    setActiveStep(0)
  }

  const handleRetry = () => {
    if (uploadedFile) runEnhancement(uploadedFile, enhanceScale, faceEnhance)
  }

  const displayPreview = previewRef.current || preview

  // ── Derived display flags ─────────────────────────────────────────────────
  // showHero: true on server (stage='idle') and client when idle/error.
  // We intentionally keep this simple boolean — no client-only branching.
  const showHero      = stage === 'idle' || stage === 'error'
  const showEnhancing = isClient && stage === 'enhancing'
  const showDone      = isClient && stage === 'done' && !!enhancedUrl
  const showSections  = showHero  // features/testimonials visible when hero visible

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ── Hero — always rendered on server + client when idle/error ─────
            NEVER conditionally change className or text content of this section
            based on client-only state. It must be 100% identical server/client.
        ─────────────────────────────────────────────────────────────────────── */}
        {showHero && (
          <section
            className="relative py-10 sm:py-14 bg-gradient-to-b from-background via-background to-card/30 overflow-hidden"
            aria-label="AI Image Enhancer"
          >
            {/* Decorative bg orb */}
            <div className="absolute inset-0 -z-10 opacity-30" aria-hidden="true">
              <div className="absolute top-10 xs:top-16 sm:top-20 right-0 xs:right-10 w-48 xs:w-56 sm:w-72 h-48 xs:h-56 sm:h-72 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 w-full">

              {/* Badge + H1 + subheading — 100% static, no dynamic text */}
              <div className="text-center mb-8" style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>

                {/* Badge — suppressHydrationWarning ONLY on the text span.
                    This is the correct, surgical use: only suppress on the exact
                    node that browser extensions (Grammarly, Translate) modify.
                    Do NOT put it on parent containers. */}
                <div className="inline-flex items-center gap-2 px-3 xs:px-3.5 py-1.5 xs:py-2 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium tracking-tight text-primary hover:border-primary/40 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" aria-hidden="true" />
                  {/* suppressHydrationWarning here ONLY — browser extensions modify this text */}
                  <span suppressHydrationWarning>Free · No sign-up · Privacy guaranteed</span>
                </div>

                <h1
                  className="font-bold tracking-tight text-balance text-foreground leading-tight mt-4"
                  style={{ fontSize: 'clamp(1.75rem, 6vw, 4.25rem)' }}
                >
                  Turn Blurry, Low-Quality Photos
                  <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    Into Sharp HD Images — Free
                  </span>
                </h1>

                <p
                  className="text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed font-light px-2 xs:px-0 mt-4"
                  style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                >
                  Upload any blurry or low-resolution image. Our AI sharpens, restores, and enhances it in seconds. No sign-up. No watermarks. Completely free.
                </p>
              </div>

              {/* Two-column: Demo left | Upload right */}
              <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-start justify-center">

                {/* LEFT — Before/After demo */}
                <div className="w-full md:flex-1 md:max-w-[480px]">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-2 px-1">
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-destructive/70" aria-hidden="true" />
                      Before
                    </span>
                    <span className="flex items-center gap-1">
                      After
                      <span className="inline-block w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-border shadow-lg">
                    <ComparisonSlider
                      beforeImage={DEMO_BEFORE}
                      afterImage={DEMO_AFTER}
                      beforeLabel="Original (blurry)"
                      afterLabel="AI Enhanced (sharp)"
                    />
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    ← Drag to compare · Fix blurry photos in seconds
                  </p>

                  {/* Stat cards — 4-col always, clamp handles visual sizing */}
                  <div
                    className="grid grid-cols-4 mt-4"
                    style={{ gap: 'clamp(4px, 1.5vw, 10px)' }}
                  >
                    <StatCard value="500K+" label="Enhanced" highlight />
                    <StatCard value="100%"  label="Free" />
                    <StatCard value="2s"    label="Average" />
                    <StatCard value="∞"     label="No Limits" />
                  </div>
                </div>

                {/* RIGHT — Upload zone */}
                <div className="w-full md:flex-1 md:max-w-[420px]" id="upload-idle">

                  <UploadZone onFileSelect={handleFileSelect} selectedFile={uploadedFile} preview={preview} />

                  {/* Error banner — isClient guard prevents server/client mismatch
                      since errorMsg is always '' on first render */}
                  {isClient && stage === 'error' && errorMsg && (
                    <div className="mt-4 p-4 rounded-xl border border-destructive/40 bg-destructive/10 flex items-start gap-3" role="alert">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-destructive">{errorMsg}</p>
                        {uploadedFile && (
                          <button onClick={handleRetry} className="mt-2 text-xs text-primary hover:underline cursor-pointer">
                            Try again →
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Settings + enhance button — only shown after client mounts
                      because uploadedFile is always null on server */}
                  {isClient && uploadedFile ? (
                    <div className="mt-4 space-y-4">
                      <div className="p-5 rounded-lg border border-border bg-card">
                        <h3 className="font-semibold text-foreground mb-4">Enhancement Settings</h3>
                        <div className="grid sm:grid-cols-2 gap-6">

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

                          <div className="space-y-3">
                            <span className="text-sm font-medium text-foreground">Face Enhancement</span>
                            <div className="flex items-center gap-3">
                              <label
                                aria-label={`Face enhancement ${faceEnhance ? 'enabled' : 'disabled'}`}
                                className="cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={faceEnhance}
                                  onChange={(e) => setFaceEnhance(e.target.checked)}
                                  className="sr-only"
                                />
                                <div className={[
                                  'relative inline-flex h-8 w-14 items-center rounded-full transition-colors pointer-events-none',
                                  faceEnhance ? 'bg-primary' : 'bg-border',
                                ].join(' ')}>
                                  <span className={[
                                    'inline-block h-6 w-6 transform rounded-full bg-white transition-transform pointer-events-none',
                                    faceEnhance ? 'translate-x-7' : 'translate-x-1',
                                  ].join(' ')} />
                                </div>
                              </label>
                              <span className="text-sm text-muted-foreground">
                                {faceEnhance ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-accent/10 text-sm text-muted-foreground">
                          Processing time depends on image size and scale. 2x is much faster than 4x.
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleEnhance}
                          size="lg"
                          className="flex-1 py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                          aria-label="Enhance the uploaded image with AI"
                        >
                          <Wand2 className="w-5 h-5 mr-2" aria-hidden="true" />
                          Enhance My Image Free →
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

                      <TrustSignals />
                    </div>
                  ) : (
                    /* Server render + no-file state — static, always identical */
                    <div className="mt-4">
                      <TrustSignals />
                    </div>
                  )}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ── Enhancing ─────────────────────────────────────────────────────
            isClient guard: server never renders this, so no mismatch possible.
        ─────────────────────────────────────────────────────────────────────── */}
        {showEnhancing && (
          <GradientSection id="upload-enhancing" className="flex items-center justify-center min-h-[75vh]">
            <div className="max-w-md w-full mx-auto px-4 text-center">
              <div className="relative w-20 h-20 mb-8 mx-auto" role="status" aria-label="Enhancing image with AI">
                <div className="absolute inset-0 rounded-full border-4 border-border" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary" aria-hidden="true" />
                </div>
              </div>

              <h2
                className="font-bold text-foreground mb-2"
                style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}
              >
                Sharpening Your Image
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                AI image enhancer {enhanceScale}{faceEnhance ? ' + Face Restoration' : ''} — usually takes 8–12 seconds
              </p>

              <div className="text-left space-y-3 max-w-xs mx-auto">
                {STEPS.map((step, i) => {
                  const isDone   = i < activeStep
                  const isActive = i === activeStep
                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center" aria-hidden="true">
                        {isDone
                          ? <CheckCircle2 className="w-5 h-5 text-primary" />
                          : isActive
                            ? <Loader className="w-4 h-4 text-primary animate-spin" />
                            : <div className="w-4 h-4 rounded-full border-2 border-border" />
                        }
                      </div>
                      <span className={`text-sm ${isDone || isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </GradientSection>
        )}

        {/* ── Done ──────────────────────────────────────────────────────────
            isClient guard: server never renders this.
        ─────────────────────────────────────────────────────────────────────── */}
        {showDone && (
          <>
            <GradientSection id="upload-done">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h1
                        className="font-bold text-foreground"
                        style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.875rem)' }}
                      >
                        Image Enhancement Complete
                      </h1>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        AI sharpened &amp; upscaled {result?.scale ?? (enhanceScale === '4x' ? 4 : 2)}x
                        {(result?.face_enhance ?? faceEnhance) ? ' + Face Restoration' : ''}
                        {result ? ` · ${result.processing_time}s` : ''}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground hidden sm:flex"
                    aria-label="Download enhanced image — no watermark"
                  >
                    <Download className="w-4 h-4 mr-1.5" aria-hidden="true" /> Download Free
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Original (blurry){result?.original_size_kb != null ? ` · ${Number(result.original_size_kb).toFixed(0)} KB` : ''}
                    </p>
                    <div className="rounded-xl overflow-hidden border border-border bg-card">
                      <img
                        src={displayPreview}
                        alt="Original blurry photo before AI image enhancement"
                        className="w-full object-contain max-h-[420px]"
                        draggable={false}
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Enhanced — Sharp HD {result?.scale ?? (enhanceScale === '4x' ? 4 : 2)}x
                    </p>
                    <div className="rounded-xl overflow-hidden border border-primary/40 bg-card relative">
                      <img
                        src={enhancedUrl}
                        alt="Photo after free AI image enhancement — sharpened and upscaled"
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

                <div className="mb-8">
                  <p className="text-sm text-muted-foreground mb-3">← Drag to compare before / after AI enhancement →</p>
                  <div className="rounded-xl overflow-hidden border border-border max-h-[420px]">
                    <ComparisonSlider
                      beforeImage={displayPreview}
                      afterImage={enhancedUrl}
                      beforeLabel="Original (blurry)"
                      afterLabel={`AI Enhanced — Sharp ${result?.scale ?? (enhanceScale === '4x' ? 4 : 2)}x`}
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4">AI Enhancement Applied</h2>
                  <EnhancementStats clarity={85} colourGrade={92} noiseReduction={78} sharpness={88} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    aria-label="Download AI enhanced image for free — no watermark"
                  >
                    <Download className="w-5 h-5 mr-2" aria-hidden="true" />
                    Download Enhanced Image Free
                  </Button>
                  <Button
                    onClick={handleEnhanceAnother}
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    aria-label="Sharpen another blurry photo"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" aria-hidden="true" />
                    Enhance Another Photo
                  </Button>
                </div>

              </div>
            </GradientSection>

            <section className="py-16 sm:py-20 bg-gradient-to-b from-background to-primary/5 text-center px-4">
              <h2
                className="font-bold text-foreground mb-3"
                style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.875rem)' }}
              >
                Happy with Your Enhanced Photo?
              </h2>
              <p
                className="text-muted-foreground mb-8 max-w-xl mx-auto"
                style={{ fontSize: 'clamp(0.875rem, 1.6vw, 1rem)' }}
              >
                Fix more blurry or low-quality images — no sign-up, no watermarks, completely free.
              </p>
              <button
                onClick={handleEnhanceAnother}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold shadow-xl shadow-primary/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                Sharpen Another Photo Free
              </button>
            </section>
          </>
        )}

        {/* ── Features · How It Works · Testimonials · SEO · CTA ────────────
            Shown alongside the hero (when idle/error). Purely static content
            so it renders identically on server and client.
        ─────────────────────────────────────────────────────────────────────── */}
        {showSections && (
          <>
            <GradientSection id="features">
              <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
                <div className="text-center px-2 xs:px-0" style={{ marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
                  <h2
                    className="font-bold text-foreground tracking-tight"
                    style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
                  >
                    Why Our Free AI Image Enhancer Works
                  </h2>
                  <p
                    className="text-muted-foreground font-light max-w-2xl mx-auto mt-3"
                    style={{ fontSize: 'clamp(0.875rem, 1.8vw, 1.125rem)' }}
                  >
                    Sharpen blurry photos, restore old pictures, and increase image resolution — powered by CodeFormer AI
                  </p>
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6">
                  <FeatureCard icon={Zap}      title="Lightning Fast"   description="Sharpen blurry photos in seconds. Optimised for speed without sacrificing quality." highlight />
                  <FeatureCard icon={Shield}   title="100% Private"     description="Your images are never stored. Complete privacy with automatic deletion after enhancement." />
                  <FeatureCard icon={Wand2}    title="AI-Powered"       description="CodeFormer AI delivers professional-grade photo sharpening, face restoration, and noise reduction." />
                  <FeatureCard icon={Download} title="Unlimited & Free" description="No watermarks, no limits, no premium tier. Restore old photos and upscale images completely free." />
                </div>
              </div>
            </GradientSection>

            <GradientSection id="how-it-works">
              <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
                <div className="text-center px-2 xs:px-0" style={{ marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
                  <h2
                    className="font-bold text-foreground tracking-tight"
                    style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
                  >
                    How to Fix Blurry Photos Online
                  </h2>
                  <p
                    className="text-muted-foreground font-light mt-3"
                    style={{ fontSize: 'clamp(0.875rem, 1.8vw, 1.125rem)' }}
                  >
                    Three steps to sharpen blurry images and increase photo resolution with AI
                  </p>
                </div>
                <div className="space-y-4 xs:space-y-5 sm:space-y-6 max-w-3xl mx-auto">
                  <Step number={1} title="Upload Your Blurry Photo"    description="Select or drag-and-drop any image. Supports PNG, JPG, and WebP up to 10MB. Works on portraits, old photos, landscapes, and product shots." />
                  <Step number={2} title="AI Sharpens & Restores"      description="Our AI image enhancer automatically detects faces, upscales resolution, reduces noise, and sharpens blurry details in 8–12 seconds." />
                  <Step number={3} title="Download Your Sharp HD Image" description="Get your enhanced image instantly. No watermarks, no restrictions — your high-resolution photo is ready to share, print, or use anywhere." />
                </div>
              </div>
            </GradientSection>

            <GradientSection>
              <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
                <div className="text-center px-2 xs:px-0" style={{ marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
                  <h2
                    className="font-bold text-foreground tracking-tight"
                    style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
                  >
                    500,000+ Photos Enhanced — and Counting
                  </h2>
                  <p
                    className="text-muted-foreground font-light max-w-2xl mx-auto mt-3"
                    style={{ fontSize: 'clamp(0.875rem, 1.8vw, 1.125rem)' }}
                  >
                    Photographers, designers, and everyday users trust our free AI photo enhancer online
                  </p>
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
                  <TestimonialCard quote="I used this to sharpen old family photos that were blurry and low-resolution. The AI image enhancer restored details I thought were lost forever."  author="Sarah Chen"       role="Photographer"     rating={5} />
                  <TestimonialCard quote="I restore old photos for clients and this free AI image enhancer gives results that rival paid tools. No watermarks, no sign-up — unbeatable."      author="Marcus Rodriguez" role="Photo Restorer"    rating={5} />
                  <TestimonialCard quote="Needed to fix a blurry product photo at 11pm before a deadline. This tool sharpened it in seconds. Free, private, and it just works."             author="Emma Williams"    role="E-commerce Owner" rating={5} />
                </div>
              </div>
            </GradientSection>

            <GradientSection>
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                <h2
                  className="font-bold text-foreground tracking-tight"
                  style={{ fontSize: 'clamp(1.3rem, 3vw, 1.875rem)' }}
                >
                  The Free AI Image Enhancer Built for Real Results
                </h2>
                <p className="text-muted-foreground leading-relaxed" style={{ fontSize: 'clamp(0.875rem, 1.6vw, 1rem)' }}>
                  Whether you need to sharpen a blurry photo online, restore old family pictures, or upscale image resolution for print or social media — PhotoGenerator.ai handles it all in one click. Our AI image enhancer uses CodeFormer to fix blurry photos, reduce noise, and increase image quality without any cost or account required. Unlike most tools that limit free usage or add watermarks, every enhancement here is completely free and private. Your image is deleted immediately after processing — we never store or share your photos.
                </p>
                <p className="text-muted-foreground leading-relaxed" style={{ fontSize: 'clamp(0.875rem, 1.6vw, 1rem)' }}>
                  Need to upscale an image free online? Choose 2x for fast results or 4x for maximum resolution. Have a portrait or old photo with faces? Enable face restoration for dramatically sharper eyes, skin, and facial detail — powered by the same AI used by professional photographers and digital restorers worldwide.
                </p>
              </div>
            </GradientSection>

            <CTASection
              title="Fix Blurry Photos in Seconds — Free"
              description="Join 500,000+ users who sharpen, restore, and upscale images with our free AI image enhancer. No sign-up, no watermarks, no limits."
              primaryCTA={{ text: 'Enhance My Image Free →', href: '#upload-idle' }}
              secondaryCTA={{ text: 'How It Works', href: '#how-it-works' }}
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
