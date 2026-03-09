import { Card } from '@/components/ui/card'

interface ImageShowcaseProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  columns?: 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
}

export function ImageShowcase({ images, columns = 2, gap = 'md' }: ImageShowcaseProps) {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
  }

  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={`grid ${colClasses[columns]} ${gapClasses[gap]}`}>
      {images.map((image, index) => (
        <Card key={index} className="overflow-hidden bg-card border-border hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="aspect-square overflow-hidden bg-secondary">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          {image.caption && (
            <div className="p-4">
              <p className="text-sm text-muted-foreground text-center">{image.caption}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
