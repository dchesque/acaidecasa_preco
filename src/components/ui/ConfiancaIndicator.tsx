'use client'

interface ConfiancaIndicatorProps {
  valor: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showPercentage?: boolean
}

export function ConfiancaIndicator({ 
  valor, 
  size = 'md', 
  showLabel = false, 
  showPercentage = true 
}: ConfiancaIndicatorProps) {
  const getColor = (confianca: number) => {
    if (confianca >= 80) return 'from-green-400 to-green-500'
    if (confianca >= 60) return 'from-yellow-400 to-yellow-500'
    if (confianca >= 40) return 'from-orange-400 to-orange-500'
    return 'from-red-400 to-red-500'
  }
  
  const getLabel = (confianca: number) => {
    if (confianca >= 80) return 'Alta'
    if (confianca >= 60) return 'Boa'
    if (confianca >= 40) return 'Média'
    return 'Baixa'
  }
  
  const sizeConfig = {
    sm: {
      width: 'w-12',
      height: 'h-1.5',
      text: 'text-xs'
    },
    md: {
      width: 'w-16',
      height: 'h-2',
      text: 'text-xs'
    },
    lg: {
      width: 'w-20',
      height: 'h-2.5',
      text: 'text-sm'
    }
  }
  
  const { width, height, text } = sizeConfig[size]
  
  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span className={`${text} text-gray-600 font-medium min-w-[40px]`}>
          {getLabel(valor)}
        </span>
      )}
      
      <div className={`${width} bg-gray-200 rounded-full ${height}`}>
        <div 
          className={`bg-gradient-to-r ${getColor(valor)} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(Math.max(valor, 0), 100)}%` }}
        />
      </div>
      
      {showPercentage && (
        <span className={`${text} text-gray-500 min-w-[30px]`}>
          {valor}%
        </span>
      )}
    </div>
  )
}

export default ConfiancaIndicator