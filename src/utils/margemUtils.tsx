import React from 'react'

export interface MargemStyle {
  bg: string
  border: string
  text: string
  icon: string
  label: string
  gradient: string
}

export const getMargemColor = (margem: number): MargemStyle => {
  if (margem >= 70) return {
    bg: 'bg-purple-50',
    border: 'border-purple-500',
    text: 'text-purple-700',
    icon: 'TrendingUp',
    label: 'Premium',
    gradient: 'from-purple-50 to-purple-100'
  }
  if (margem >= 50) return {
    bg: 'bg-emerald-50',
    border: 'border-emerald-500',
    text: 'text-emerald-700',
    icon: 'Check',
    label: 'Ótima',
    gradient: 'from-emerald-50 to-emerald-100'
  }
  if (margem >= 30) return {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    text: 'text-yellow-700',
    icon: 'Minus',
    label: 'Adequada',
    gradient: 'from-yellow-50 to-yellow-100'
  }
  return {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-700',
    icon: 'AlertTriangle',
    label: 'Crítica',
    gradient: 'from-red-50 to-red-100'
  }
}

export const MargemBadge = ({ margem }: { margem: number }) => {
  const style = getMargemColor(margem)
  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${style.bg} ${style.border} border`}>
      <span className={`font-bold text-sm ${style.text}`}>
        {margem.toFixed(1)}%
      </span>
      <span className={`text-xs ${style.text}`}>
        {style.label}
      </span>
    </div>
  )
}

export const MargemProgressBar = ({ margem }: { margem: number }) => {
  const style = getMargemColor(margem)
  const width = Math.min(margem, 100)
  
  return (
    <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-500 bg-gradient-to-r ${style.gradient}`}
        style={{ width: `${width}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
        {margem.toFixed(1)}%
      </span>
    </div>
  )
}

export const calcularMargem = (custo: number, preco: number): number => {
  if (preco === 0) return 0
  return ((preco - custo) / preco) * 100
}

export const calcularPrecoComMargem = (custo: number, margemDesejada: number): number => {
  if (margemDesejada >= 100) return 0
  return custo / (1 - margemDesejada / 100)
}

export const calcularLucro = (custo: number, preco: number): number => {
  return preco - custo
}

export const getPrecoPsicologico = (precoBase: number): number[] => {
  const sugestoes: number[] = []
  
  const decimal = precoBase % 1
  const inteiro = Math.floor(precoBase)
  
  if (decimal < 0.5) {
    sugestoes.push(inteiro + 0.90)
  } else {
    sugestoes.push(inteiro + 0.99)
  }
  
  sugestoes.push(Math.round(precoBase))
  
  if (precoBase < 10) {
    sugestoes.push(9.90)
  } else if (precoBase < 20) {
    sugestoes.push(14.90, 19.90)
  } else if (precoBase < 30) {
    sugestoes.push(24.90, 29.90)
  }
  
  return [...new Set(sugestoes)]
    .filter(p => p > precoBase * 0.9 && p < precoBase * 1.15)
    .sort((a, b) => a - b)
    .slice(0, 4)
}

export const classificarProdutoPorMargem = (margem: number): {
  tipo: 'estrela' | 'premium' | 'revisar' | 'otimizar'
  emoji: string
  descricao: string
} => {
  if (margem >= 50) {
    return {
      tipo: 'estrela',
      emoji: '⭐',
      descricao: 'Alta margem, produto lucrativo'
    }
  } else if (margem >= 35) {
    return {
      tipo: 'premium',
      emoji: '💎',
      descricao: 'Margem adequada, produto premium'
    }
  } else if (margem >= 20) {
    return {
      tipo: 'revisar',
      emoji: '📉',
      descricao: 'Margem baixa, revisar preço'
    }
  } else {
    return {
      tipo: 'otimizar',
      emoji: '🎯',
      descricao: 'Margem crítica, otimizar urgente'
    }
  }
}