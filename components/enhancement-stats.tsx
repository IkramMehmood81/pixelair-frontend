import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2 } from 'lucide-react'

interface EnhancementStatsProps {
  clarity?: number
  colorGrade?: number
  noiseReduction?: number
  sharpness?: number
}

export function EnhancementStats({
  clarity = 85,
  colorGrade = 92,
  noiseReduction = 78,
  sharpness = 88,
}: EnhancementStatsProps) {
  const stats = [
    { label: 'Clarity Boost', value: clarity },
    { label: 'Color Grading', value: colorGrade },
    { label: 'Noise Reduction', value: noiseReduction },
    { label: 'Sharpness', value: sharpness },
  ]

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Enhancement Applied</h3>
      </div>

      <div className="space-y-6">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{stat.label}</span>
              <span className="text-sm text-primary font-semibold">{stat.value}%</span>
            </div>
            <Progress 
              value={stat.value} 
              className="h-2"
            />
          </div>
        ))}
      </div>
    </Card>
  )
}
