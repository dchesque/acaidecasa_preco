'use client'

import { cn } from '@/utils/cn'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
  }
  variant?: 'default' | 'gradient' | 'highlight'
  className?: string
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className
}) => {
  const variants = {
    default: 'bg-white/90 backdrop-blur-sm border border-white/50 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10',
    gradient: 'bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-md border border-purple-100/50 shadow-lg',
    highlight: 'bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-200 backdrop-blur-sm shadow-lg shadow-purple-500/10'
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <div className={cn(
      'rounded-lg p-6 transition-all duration-300',
      variants[variant],
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {Icon && (
            <div className="p-3 rounded-full bg-purple-100">
              <Icon className="h-6 w-6 text-purple-600" />
            </div>
          )}
          <div className={cn("ml-4", !Icon && "ml-0")}>
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
        </div>
        {trend && (
          <div className={cn("text-sm font-semibold", trendColors[trend.direction])}>
            {trend.direction === 'up' && '+'}
            {trend.direction === 'down' && '-'}
            {trend.value}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-purple-600">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

export default MetricCard