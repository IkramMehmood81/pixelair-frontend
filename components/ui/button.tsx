import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-lg font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-2xl border border-primary/30',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-md hover:shadow-lg',
        outline:
          'border border-primary/40 bg-background text-foreground hover:bg-primary/10 hover:border-primary/60 shadow-md hover:shadow-lg transition-all',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg',
        ghost:
          'hover:bg-primary/15 hover:text-primary dark:hover:bg-primary/25 transition-colors duration-300',
        link: 'text-primary hover:text-accent underline-offset-4 hover:underline font-semibold',
      },
      size: {
        default: 'h-11 px-5 py-3 text-sm has-[>svg]:px-4',
        sm: 'h-9 px-3.5 py-2 text-xs rounded-md gap-1.5 has-[>svg]:px-2.5',
        lg: 'h-13 px-8 py-3.5 text-base rounded-lg has-[>svg]:px-6',
        icon: 'size-11',
        'icon-sm': 'size-9',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
