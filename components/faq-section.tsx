import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  items: FAQItem[]
  title?: string
  description?: string
}

export function FAQSection({ items, title, description }: FAQSectionProps) {
  return (
    <div className="w-full">
      {title && (
        <div className="mb-6 xs:mb-7 sm:mb-8 text-center px-2 xs:px-0">
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground mb-3 xs:mb-4">{title}</h2>
          {description && (
            <p className="text-muted-foreground text-sm xs:text-base sm:text-lg max-w-2xl mx-auto">{description}</p>
          )}
        </div>
      )}

      <Card className="p-4 xs:p-6 sm:p-8 bg-card border-border">
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-border last:border-0">
              <AccordionTrigger className="text-xs xs:text-sm sm:text-base text-foreground hover:text-primary transition-colors py-3 xs:py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs xs:text-sm text-muted-foreground pt-2 pb-3 xs:pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  )
}
