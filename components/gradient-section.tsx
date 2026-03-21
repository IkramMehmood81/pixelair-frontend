interface GradientSectionProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function GradientSection({ children, className = '', id }: GradientSectionProps) {
  return (
    <section 
      id={id}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Vibrant Purple Gradient Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-background to-accent/12 pointer-events-none" />
      
      {/* Secondary Gradient Layer for Depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/8 to-transparent opacity-70 pointer-events-none" />
      
      {/* Decorative Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-primary/30 to-transparent rounded-full blur-3xl pointer-events-none opacity-50" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-l from-accent/25 to-transparent rounded-full blur-3xl pointer-events-none opacity-45" />
      
      {/* Subtle Grid Pattern - Optional */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to right, var(--primary) 0.5px, transparent 0.5px), linear-gradient(to bottom, var(--primary) 0.5px, transparent 0.5px)',
            backgroundSize: '5rem 5rem',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}