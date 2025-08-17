'use client'

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { 
  CATEGORIAS_GLOBAIS, 
  TipoModulo, 
  CategoriaModulo, 
  getCategoriaStyle,
  getCategoriasModulo 
} from '@/config/categorias'

interface CategoriaSelectorProps<T extends TipoModulo> {
  modulo: T
  value: CategoriaModulo<T> | ''
  onChange: (categoria: CategoriaModulo<T>) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CategoriaSelector<T extends TipoModulo>({
  modulo,
  value,
  onChange,
  placeholder = 'Selecione uma categoria',
  required = false,
  disabled = false,
  showIcon = true,
  size = 'md',
  className = ''
}: CategoriaSelectorProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const categorias = getCategoriasModulo(modulo)

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const selectedStyle = value ? getCategoriaStyle(modulo, value) : null

  const handleSelect = (categoria: CategoriaModulo<T>) => {
    onChange(categoria)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent
          ${sizeClasses[size]}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
          ${isOpen ? 'ring-2 ring-purple-500 border-transparent' : ''}
          flex items-center justify-between
        `}
      >
        <div className="flex items-center gap-2 flex-1">
          {value ? (
            <>
              {showIcon && selectedStyle && (
                <span className="text-base">{selectedStyle.icon}</span>
              )}
              <span 
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  selectedStyle?.color || 'bg-gray-100 text-gray-800'
                }`}
              >
                {value}
              </span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {!required && (
            <button
              type="button"
              onClick={() => handleSelect('' as CategoriaModulo<T>)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="text-gray-500">{placeholder}</span>
              {!value && <Check className="h-4 w-4 text-purple-600" />}
            </button>
          )}
          
          {categorias.map((categoria) => {
            const style = getCategoriaStyle(modulo, categoria)
            const isSelected = value === categoria
            
            return (
              <button
                key={categoria}
                type="button"
                onClick={() => handleSelect(categoria)}
                className="w-full px-3 py-2 text-left hover:bg-purple-50 flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  {showIcon && (
                    <span className="text-base">{style.icon}</span>
                  )}
                  <span 
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${style.color}`}
                  >
                    {categoria}
                  </span>
                </div>
                {isSelected && <Check className="h-4 w-4 text-purple-600" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Badge component para exibir categorias
interface CategoriaBadgeProps<T extends TipoModulo> {
  modulo: T
  categoria: CategoriaModulo<T>
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function CategoriaBadge<T extends TipoModulo>({
  modulo,
  categoria,
  showIcon = true,
  size = 'md'
}: CategoriaBadgeProps<T>) {
  const style = getCategoriaStyle(modulo, categoria)
  
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  }

  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full font-medium ${style.color} ${sizeClasses[size]}`}
    >
      {showIcon && <span>{style.icon}</span>}
      {categoria}
    </span>
  )
}

// Hook para facilitar o uso
export function useCategoriaSelector<T extends TipoModulo>(
  modulo: T,
  initialValue: CategoriaModulo<T> | '' = ''
) {
  const [categoria, setCategoria] = useState<CategoriaModulo<T> | ''>(initialValue)
  
  return {
    categoria,
    setCategoria,
    reset: () => setCategoria(''),
    isValid: categoria !== '',
    categorias: getCategoriasModulo(modulo)
  }
}

export default CategoriaSelector