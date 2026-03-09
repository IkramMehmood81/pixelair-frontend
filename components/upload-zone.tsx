'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  selectedFile?: File | null
  preview?: string
}

export function UploadZone({ onFileSelect, selectedFile, preview }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        onFileSelect(file)
      }
    }
  }, [onFileSelect])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="w-full">
      {preview ? (
        <div className="space-y-3 xs:space-y-4">
          <div className="relative bg-card border border-border rounded-lg xs:rounded-xl overflow-hidden">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-auto max-h-64 xs:max-h-96 object-contain"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleClick}
              className="flex-1 bg-primary hover:bg-primary/90 text-sm xs:text-base"
            >
              Change Image
            </Button>
            <Button 
              onClick={() => {
                setIsDragActive(false)
                onFileSelect(null as any)
              }}
              variant="outline"
              size="icon"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg xs:rounded-xl p-6 xs:p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-primary/2.5'
          }`}
        >
          <div className="flex flex-col items-center gap-3 xs:gap-4">
            <div className={`p-2.5 xs:p-3 rounded-lg ${isDragActive ? 'bg-primary/10' : 'bg-secondary'}`}>
              <Upload className={`w-6 xs:w-8 h-6 xs:h-8 ${isDragActive ? 'text-primary' : 'text-primary'}`} />
            </div>
            <div className="px-2 xs:px-0">
              <p className="font-semibold text-sm xs:text-base text-foreground">
                {isDragActive ? 'Drop your image here' : 'Drop image or click to upload'}
              </p>
              <p className="text-xs xs:text-sm text-muted-foreground mt-1">
                PNG, JPG, WebP up to 10MB
              </p>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}
