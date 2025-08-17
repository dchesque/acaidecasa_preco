'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ImpactoVisualProps {
  valor: number
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showPercentage?: boolean
  format?: 'number' | 'currency' | 'percentage'
}

export function ImpactoVisual({ 
  valor, 
  size = 'md', 
  showIcon = true, 
  showPercentage = true,
  format = 'percentage'
}: ImpactoVisualProps) {
  const isPositivo = valor > 0
  const isNeutro = Math.abs(valor) < 0.01
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }
  
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `R$ ${Math.abs(val).toFixed(2)}`
      case 'percentage':
        return `${Math.abs(val).toFixed(1)}%`
      case 'number':
        return Math.abs(val).toFixed(1)
      default:
        return Math.abs(val).toFixed(1)
    }
  }
  
  if (isNeutro) {
    return (
      <div className={`flex items-center gap-1 text-gray-500 ${sizeClasses[size]}`}>
        {showIcon && <Minus className={iconSizes[size]} />}
        <span className="font-medium">
          {format === 'percentage' ? '0%' : '0'}
        </span>
      </div>
    )
  }
  
  const colorClass = isPositivo ? 'text-green-600' : 'text-red-600'
  const IconComponent = isPositivo ? TrendingUp : TrendingDown
  const prefix = isPositivo ? '+' : '-'
  
  return (
    <div className={`flex items-center gap-1 ${colorClass} ${sizeClasses[size]}`}>
      {showIcon && <IconComponent className={iconSizes[size]} />}
      <span className="font-bold">
        {prefix}{formatValue(valor)}
      </span>
      {showPercentage && format !== 'percentage' && (
        <span className="text-xs opacity-75">
          ({prefix}{Math.abs((valor / 100) * 100).toFixed(1)}%)
        </span>
      )}
    </div>
  )
}

export default ImpactoVisual