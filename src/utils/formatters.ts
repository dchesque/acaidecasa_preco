// Formatadores para valores monetários e percentuais brasileiros

export const formatCurrency = (value: number, size: 'small' | 'medium' | 'large' = 'medium'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const formatPercentage = (value: number, showSign: boolean = true): string => {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100)

  if (showSign && value > 0) {
    return `+${formatted}`
  }
  
  return formatted
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value)
}

// Classes CSS para diferentes tamanhos de valores monetários
export const currencyClasses = {
  small: 'text-sm font-medium text-gray-600',
  medium: 'text-lg font-semibold text-gray-700', 
  large: 'text-2xl font-bold text-purple-600'
}

// Classes CSS para percentuais
export const percentageClasses = {
  positive: 'text-green-600 font-semibold',
  negative: 'text-red-600 font-semibold',
  neutral: 'text-gray-600 font-semibold'
}

export const getPercentageClass = (value: number): string => {
  if (value > 0) return percentageClasses.positive
  if (value < 0) return percentageClasses.negative
  return percentageClasses.neutral
}