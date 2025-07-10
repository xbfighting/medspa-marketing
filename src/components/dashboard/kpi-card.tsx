import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: LucideIcon
  className?: string
}

export function KPICard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  className 
}: KPICardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      case 'stable':
        return 'text-gray-400'
    }
  }

  const formatChange = (change: number) => {
    if (change === 0) return '0%'
    const sign = change > 0 ? '+' : ''
    return `${sign}${change}%`
  }

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-2">
          {value}
        </div>
        <div className="flex items-center text-xs">
          {getTrendIcon()}
          <span className={cn("ml-1", getTrendColor())}>
            {formatChange(change)}
          </span>
          <span className="text-gray-500 ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  )
}