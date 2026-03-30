import { Card } from '@/components/ui/card'

interface StatCardProps {
  value: string | number
  label: string
  highlight?: boolean
}

/**
 * StatCard — fluid responsive, no truncation
 *
 * Key fixes:
 * - Removed overflow-hidden from Card (was clipping wrapped labels)
 * - Removed whitespace-nowrap on label (was forcing ellipsis truncation)
 * - Inline style for clamp() — avoids Tailwind JIT/SSR hydration mismatches
 *   that occur with arbitrary clamp() in className strings
 * - Lower floor values: 0.75rem value, 0.55rem label — readable on 320px phones
 * - gap and padding via inline style for same SSR-safety reason
 */
export function StatCard({ value, label, highlight = false }: StatCardProps) {
  return (
    <Card
      className={[
        'flex flex-col items-center justify-center text-center',
        'min-w-0 w-full transition-all duration-300',
        highlight
          ? 'bg-primary/15 border-primary/40'
          : 'bg-card/70 border-primary/20',
      ].join(' ')}
      style={{
        padding: 'clamp(6px, 2vw, 16px) clamp(4px, 1.5vw, 12px)',
        gap: 'clamp(2px, 0.8vw, 6px)',
      }}
    >
      <div
        className={[
          'font-bold leading-none whitespace-nowrap',
          highlight ? 'text-primary' : 'text-foreground',
        ].join(' ')}
        style={{ fontSize: 'clamp(0.75rem, 3.5vw, 2rem)' }}
      >
        {value}
      </div>
      <p
        className="text-muted-foreground text-center leading-tight w-full"
        style={{
          fontSize: 'clamp(0.55rem, 1.6vw, 0.8rem)',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          hyphens: 'auto',
        }}
      >
        {label}
      </p>
    </Card>
  )
}
