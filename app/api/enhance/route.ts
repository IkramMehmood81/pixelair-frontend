// app/api/enhance/route.ts
// Next.js App Router API route — proxies image to FastAPI backend

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.API_URL ?? 'http://localhost:8000'
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function POST(req: NextRequest) {
  try {
    // ── 1. Parse incoming multipart form ──────────────────────────────────
    const formData = await req.formData()
    const file = formData.get('image') as File | null
    const scale = formData.get('scale') ?? '2'
    const faceEnhance = formData.get('face_enhance') ?? 'false'

    // ── 2. Validate ────────────────────────────────────────────────────────
    if (!file) {
      return NextResponse.json({ error: 'No image provided.' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a JPEG, PNG, or WebP image.' },
        { status: 415 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10 MB.' },
        { status: 413 }
      )
    }

    const scaleNum = Number(scale)
    if (![2, 4].includes(scaleNum)) {
      return NextResponse.json({ error: 'Scale must be 2 or 4.' }, { status: 400 })
    }

    // ── 3. Forward to FastAPI backend ──────────────────────────────────────
    const backendForm = new FormData()
    backendForm.append('image', file)
    backendForm.append('scale', String(scaleNum))
    backendForm.append('face_enhance', faceEnhance === 'true' ? 'true' : 'false')

    const backendRes = await fetch(`${BACKEND_URL}/enhance-image`, {
      method: 'POST',
      body: backendForm,
      // No Content-Type header — let fetch set multipart boundary automatically
      signal: AbortSignal.timeout(120_000), // 2-min timeout
    })

    // ── 4. Handle backend errors ───────────────────────────────────────────
    if (!backendRes.ok) {
      let detail = 'Backend enhancement failed.'
      try {
        const errBody = await backendRes.json()
        detail = errBody?.detail ?? detail
      } catch {
        // backend returned non-JSON
      }
      return NextResponse.json({ error: detail }, { status: backendRes.status })
    }

    // ── 5. Return success ──────────────────────────────────────────────────
    const data = await backendRes.json()
    return NextResponse.json(data)

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error.'

    // Timeout
    if (message.includes('abort') || message.includes('timeout')) {
      return NextResponse.json(
        { error: 'Enhancement timed out. Please try again.' },
        { status: 504 }
      )
    }

    console.error('[/api/enhance]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}