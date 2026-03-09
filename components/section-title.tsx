interface SectionTitleProps {
  tag?: string
  title: string
  description?: string
  align?: 'left' | 'center' | 'right'
}

export function SectionTitle({
  tag,
  title,
  description,
  align = 'center',
}: SectionTitleProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className={`${alignClasses[align]} mb-12 xs:mb-14 sm:mb-16 space-y-3 xs:space-y-4`}>
      {tag && (
        <div className="inline-flex items-center gap-2 xs:gap-2.5 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-gradient-to-r from-primary/15 to-accent/10 border border-primary/30 backdrop-blur-sm">
          <span className="relative w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse flex-shrink-0"></span>
          <p className="text-xs font-bold text-primary uppercase tracking-widest">{tag}</p>
        </div>
      )}
      
      <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold text-foreground text-balance leading-tight">
        {title}
      </h2>
      
      {description && (
        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-foreground/70 text-balance max-w-3xl mx-auto leading-relaxed font-light px-2 xs:px-0">
          {description}
        </p>
      )}
    </div>
  )
}
