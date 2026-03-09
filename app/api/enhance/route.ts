import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL =
  process.env.IMAGE_ENHANCE_API_URL ?? 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const fileEntry = formData.get('image')
    const scaleEntry = formData.get('scale')
    const faceEnhanceEntry = formData.get('face_enhance')

    if (!(fileEntry instanceof File)) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    const file = fileEntry
    const scale = typeof scaleEntry === 'string' ? scaleEntry : '2'
    const faceEnhanceBool =
      typeof faceEnhanceEntry === 'string'
        ? faceEnhanceEntry === 'true'
        : true

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 413 }
      )
    }

    const apiFormData = new FormData()
    apiFormData.append('image', file)
    apiFormData.append('scale', scale)
    apiFormData.append('face_enhance', faceEnhanceBool.toString())

    console.log('[v0] Sending request to API:', { url: `${API_BASE_URL}/enhance-image`, fileSize: file.size })

    const response = await fetch(`${API_BASE_URL}/enhance-image`, {
      method: 'POST',
      body: apiFormData,
      headers: {
        Accept: 'application/json',
      },
    })

    console.log('[v0] API response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.log('[v0] API error response:', errorData)

      return NextResponse.json(
        {
          error:
            errorData.detail ||
            'Image enhancement failed. Please try again.',
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('[v0] API success response:', { url: result.url, processingTime: result.processing_time })

    return NextResponse.json({
      url: result.url,
      processing_time: result.processing_time,
      original_size_kb: result.original_size_kb,
      scale: result.scale,
      face_enhance: result.face_enhance,
    })
  } catch (error) {
    console.error('[v0] API Route Error:', error instanceof Error ? error.message : error)
    
    if (error instanceof TypeError) {
      console.error('[v0] Connection error - Backend may not be running at:', API_BASE_URL)
      return NextResponse.json(
        {
          error:
            'Cannot connect to enhancement service. Please ensure your backend is running at ' + API_BASE_URL,
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
