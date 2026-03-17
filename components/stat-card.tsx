import { Card } from '@/components/ui/card'

interface StatCardProps {
  value: string | number
  label: string
  highlight?: boolean
}

export function StatCard({ value, label, highlight = false }: StatCardProps) {
  return (
    <Card
      className={`group relative p-6 sm:p-8 md:p-10 flex items-center justify-center text-center transition-all duration-400 hover:shadow-2xl hover:-translate-y-2 border overflow-hidden ${
        highlight
          ? 'bg-gradient-to-br from-primary/20 via-primary/12 to-accent/15 border-primary/50 hover:border-primary/70 hover:shadow-primary/30'
          : 'bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:bg-gradient-to-br hover:from-primary/15 hover:to-accent/10'
      }`}
    >
      {/* Decorative Gradient Orb */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-primary/25 to-accent/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-xl"></div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-3">
        
        {/* Value */}
        <div
          className={`font-bold tracking-tighter leading-none whitespace-nowrap transition-all duration-300
          text-[clamp(2rem,4vw,3.2rem)] ${
            highlight
              ? 'text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text group-hover:from-accent group-hover:to-primary'
              : 'text-foreground group-hover:text-primary'
          }`}
        >
          {value}
        </div>

        {/* Label */}
        <p className="text-[clamp(0.8rem,1.4vw,1rem)] font-medium text-foreground/70 group-hover:text-foreground transition-colors duration-300 tracking-wide">
          {label}
        </p>

      </div>
    </Card>
  )
}