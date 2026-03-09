import { Badge } from '@/components/ui/badge'

interface DesignBadgeProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'muted'
  children: React.ReactNode
  icon?: React.ReactNode
}

export function DesignBadge({ variant = 'primary', children, icon }: DesignBadgeProps) {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
    secondary: 'bg-secondary/10 text-secondary-foreground border-secondary/20 hover:bg-secondary/20',
    accent: 'bg-accent/10 text-accent-foreground border-accent/20 hover:bg-accent/20',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
    muted: 'bg-muted text-muted-foreground border-muted hover:bg-muted/80',
  }

  return (
    <Badge className={`${variants[variant]} flex items-center gap-2`}>
      {icon}
      {children}
    </Badge>
  )
}
