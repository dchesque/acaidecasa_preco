import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility para combinar classes Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatters
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

// Utilities para cores baseadas em valores
export function getStatusColor(value: number, thresholds: { low: number; medium: number }) {
  if (value >= thresholds.medium) return 'success'
  if (value >= thresholds.low) return 'warning'
  return 'danger'
}

export function getMarginColor(margin: number) {
  if (margin >= 100) return 'text-success-600 bg-success-50 border-success-200'
  if (margin >= 50) return 'text-warning-600 bg-warning-50 border-warning-200'
  return 'text-danger-600 bg-danger-50 border-danger-200'
}

// Utilities para animações
export function generateStaggerDelay(index: number, baseDelay: number = 50) {
  return `${index * baseDelay}ms`
}

// Debounce function
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  waitFor: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }
}

// Throttle function
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null
  let lastExecTime = 0
  
  return (...args: Parameters<T>) => {
    const currentTime = Date.now()
    
    if (currentTime - lastExecTime > delay) {
      func(...args)
      lastExecTime = currentTime
    } else {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
        lastExecTime = Date.now()
      }, delay - (currentTime - lastExecTime))
    }
  }
}

// Utility para gerar IDs únicos
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Utility para deep copy
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any
  if (obj instanceof Object) {
    const clonedObj = {} as any
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

// Utility para validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Utility para truncar texto
export function truncate(text: string, length: number = 50): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + '...'
}

// Utility para capitalizar primeira letra
export function capitalize(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Utility para gerar cores aleatórias para avatars
export function generateAvatarColor(name: string): string {
  const colors = [
    'bg-primary-500',
    'bg-tropical-mint-500',
    'bg-tropical-orange-500',
    'bg-tropical-pink-500',
    'bg-info-500',
    'bg-warning-500',
  ]
  
  const hash = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  return colors[hash % colors.length]
}

// Utility para scroll suave
export function scrollToElement(elementId: string, offset: number = 0) {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.offsetTop - offset
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }
}

// Utility para detectar dispositivo móvel
export function isMobile(): boolean {
  return window.innerWidth < 768
}

// Utility para copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy text: ', error)
    return false
  }
}

// Utility para download de arquivos
export function downloadFile(data: any, filename: string, type: string = 'application/json') {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}

// Utility para verificar se está em dark mode
export function isDarkMode(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Utility para salvar no localStorage com try/catch
export function safeLocalStorage(key: string, value?: any): any {
  try {
    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } else {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : null
    }
  } catch (error) {
    console.error('LocalStorage error:', error)
    return value !== undefined ? false : null
  }
}

export default {
  cn,
  formatCurrency,
  formatPercentage,
  formatNumber,
  getStatusColor,
  getMarginColor,
  generateStaggerDelay,
  debounce,
  throttle,
  generateId,
  deepClone,
  isValidEmail,
  truncate,
  capitalize,
  generateAvatarColor,
  scrollToElement,
  isMobile,
  copyToClipboard,
  downloadFile,
  isDarkMode,
  safeLocalStorage
}