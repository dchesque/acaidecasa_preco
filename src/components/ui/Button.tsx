'use client'

import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25',
      secondary: 'bg-white border border-purple-300 text-purple-600 hover:bg-purple-50',
      outline: 'border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white transition-all duration-200',
      ghost: 'text-purple-600 hover:bg-purple-50',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
      success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm font-medium',
      md: 'px-4 py-2 text-sm font-medium',
      lg: 'px-6 py-3 text-base font-medium',
      xl: 'px-8 py-4 text-lg font-medium'
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button