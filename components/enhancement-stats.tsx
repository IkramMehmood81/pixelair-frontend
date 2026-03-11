import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2 } from 'lucide-react'

interface EnhancementStatsProps {
  clarity?: number
  colourGrade?: number
  /** @deprecated Use colourGrade */
  colorGrade?: number
  noiseReduction?: number
  sharpness?: number
}

export function EnhancementStats({
  clarity = 85,
  colourGrade,
  colorGrade,
  noiseReduction = 78,
  sharpness = 88,
}: EnhancementStatsProps) {
  const resolvedColourGrade = colourGrade ?? colorGrade ?? 92

  const stats = [
    { label: 'Clarity Boost',   value: clarity },
    { label: 'Colour Grading',  value: resolvedColourGrade },
    { label: 'Noise Reduction', value: noiseReduction },
    { label: 'Sharpness',       value: sharpness },
  ]

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-centre gap-2 mb-6">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Enhancement Applied</h3>
      </div>

      <div className="space-y-6">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="flex items-centre justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{stat.label}</span>
              <span className="text-sm text-primary font-semibold">{stat.value}%</span>
            </div>
            <Progress value={stat.value} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  )
}
