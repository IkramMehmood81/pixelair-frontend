'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface ComparisonSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

export function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const newPosition = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, newPosition)))
  }, [])

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    updatePosition(e.clientX)
  }, [updatePosition])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    updatePosition(e.clientX)
  }, [isDragging, updatePosition])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX)
  }, [updatePosition])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    updatePosition(e.touches[0].clientX)
  }, [updatePosition])

  // Attach global mouse listeners so drag works even if cursor leaves the element
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={containerRef}
      className="relative bg-card border border-border rounded-xl overflow-hidden select-none"
      style={{ cursor: isDragging ? 'col-resize' : 'col-resize' }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Before image — full width baseline */}
      <img
        src={beforeImage}
        alt={beforeLabel}
        className="w-full h-auto block max-h-[420px] object-contain"
        draggable={false}
      />

      {/* After image — clipped to slider position */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-contain"
          style={{ minWidth: containerRef.current?.offsetWidth ?? '100%' }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-[0_0_8px_rgba(0,0,0,0.4)]"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center gap-0.5">
          {/* Left arrow */}
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M6 1L1 6L6 11" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* Right arrow */}
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M2 1L7 6L2 11" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide pointer-events-none">
        {beforeLabel}
      </div>
      <div className="absolute bottom-3 right-3 bg-primary/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide pointer-events-none">
        {afterLabel}
      </div>
    </div>
  )
}