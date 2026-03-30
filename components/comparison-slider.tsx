'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface ComparisonSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

/**
 * ComparisonSlider — responsive labels, no overlap
 *
 * Root causes fixed:
 * 1. Labels were `text-xs` fixed size — on narrow containers (300px mobile)
 *    both labels (~120px each) overlapped. Fixed with:
 *    - clamp() font-size via inline style
 *    - max-width: 44% on each label so they physically can't overlap
 *    - text-overflow: ellipsis as last resort (only fires if text > 44% width)
 * 2. Labels used fixed px padding — now clamps with viewport
 * 3. bottom/left/right offsets were fixed 12px — now clamp-scaled
 */
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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX)
  }, [updatePosition])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    updatePosition(e.touches[0].clientX)
  }, [updatePosition])

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

  // Shared label style — computed once, applied to both
  const labelBase: React.CSSProperties = {
    position: 'absolute',
    bottom: 'clamp(4px, 1.5vw, 12px)',
    // Fluid font + padding
    fontSize: 'clamp(0.5rem, 1.8vw, 0.75rem)',
    padding: 'clamp(2px, 0.5vw, 4px) clamp(4px, 1.2vw, 10px)',
    borderRadius: '6px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    pointerEvents: 'none',
    // Cap width so left+right labels can never overlap
    // 44% each + gap in center = 88% max, always safe
    maxWidth: '44%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-card border border-border rounded-xl overflow-hidden select-none"
      style={{ cursor: 'col-resize' }}
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
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M6 1L1 6L6 11" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M2 1L7 6L2 11" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Before label — anchored LEFT, max-width 44% */}
      <span
        style={{
          ...labelBase,
          left: 'clamp(4px, 1.5vw, 12px)',
          background: 'rgba(0,0,0,0.65)',
          color: '#ffffff',
          backdropFilter: 'blur(4px)',
        }}
      >
        {beforeLabel}
      </span>

      {/* After label — anchored RIGHT, max-width 44% */}
      <span
        style={{
          ...labelBase,
          right: 'clamp(4px, 1.5vw, 12px)',
          background: 'hsl(var(--primary) / 0.85)',
          color: '#ffffff',
          backdropFilter: 'blur(4px)',
        }}
      >
        {afterLabel}
      </span>
    </div>
  )
}
