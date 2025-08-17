'use client'

import React, { forwardRef, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex w-full rounded-xl border-2 bg-white px-4 py-3 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: [
          'border-gray-200 text-gray-900',
          'hover:border-gray-300',
          'focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
        ],
        error: [
          'border-danger-300 text-gray-900 bg-danger-50/50',
          'hover:border-danger-400',
          'focus:border-danger-500 focus:ring-4 focus:ring-danger-500/10'
        ],
        success: [
          'border-success-300 text-gray-900 bg-success-50/50',
          'hover:border-success-400',
          'focus:border-success-500 focus:ring-4 focus:ring-success-500/10'
        ]
      },
      size: {
        sm: 'h-9 px-3 py-2 text-xs',
        md: 'h-11 px-4 py-3 text-sm',
        lg: 'h-12 px-5 py-3 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  helperText?: string
  error?: string
  success?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant,
    size,
    type,
    label,
    helperText,
    error,
    success,
    leftIcon,
    rightIcon,
    loading = false,
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    
    // Determinar variant baseado no estado
    const currentVariant = error ? 'error' : success ? 'success' : variant
    
    // Para inputs de senha, adicionar toggle de visibilidade
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type
    
    const hasLeftIcon = leftIcon || loading
    const hasRightIcon = rightIcon || isPassword
    
    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label className={cn(
            'block text-sm font-medium transition-colors duration-200',
            error ? 'text-danger-600' : 
            success ? 'text-success-600' : 
            'text-gray-700'
          )}>
            {label}
          </label>
        )}
        
        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {hasLeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary-600" />
              ) : leftIcon ? (
                <span className="text-gray-400">
                  {React.cloneElement(leftIcon as React.ReactElement, { 
                    className: 'h-4 w-4' 
                  })}
                </span>
              ) : null}
            </div>
          )}
          
          {/* Input */}
          <input
            type={inputType}
            className={cn(
              inputVariants({ variant: currentVariant, size }),
              hasLeftIcon && 'pl-10',
              hasRightIcon && 'pr-10',
              className
            )}
            ref={ref}
            disabled={disabled || loading}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {/* Right Icon / Password Toggle */}
          {hasRightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  disabled={disabled || loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              ) : rightIcon ? (
                <span className="text-gray-400">
                  {React.cloneElement(rightIcon as React.ReactElement, { 
                    className: 'h-4 w-4' 
                  })}
                </span>
              ) : null}
            </div>
          )}
        </div>
        
        {/* Helper Text / Error / Success */}
        {(helperText || error || success) && (
          <div className="flex items-start gap-1">
            <p className={cn(
              'text-xs',
              error ? 'text-danger-600' : 
              success ? 'text-success-600' : 
              'text-gray-500'
            )}>
              {error || success || helperText}
            </p>
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Textarea component
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: string
  success?: string
  autoResize?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label,
    helperText,
    error,
    success,
    autoResize = false,
    disabled,
    ...props
  }, ref) => {
    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        const target = e.target as HTMLTextAreaElement
        target.style.height = 'auto'
        target.style.height = `${target.scrollHeight}px`
      }
    }

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label className={cn(
            'block text-sm font-medium transition-colors duration-200',
            error ? 'text-danger-600' : 
            success ? 'text-success-600' : 
            'text-gray-700'
          )}>
            {label}
          </label>
        )}
        
        {/* Textarea */}
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-xl border-2 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none',
            error ? [
              'border-danger-300 bg-danger-50/50',
              'hover:border-danger-400',
              'focus:border-danger-500 focus:ring-4 focus:ring-danger-500/10'
            ] : success ? [
              'border-success-300 bg-success-50/50',
              'hover:border-success-400',
              'focus:border-success-500 focus:ring-4 focus:ring-success-500/10'
            ] : [
              'border-gray-200',
              'hover:border-gray-300',
              'focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
            ],
            autoResize && 'resize-none overflow-hidden',
            className
          )}
          ref={ref}
          disabled={disabled}
          onInput={handleInput}
          {...props}
        />
        
        {/* Helper Text / Error / Success */}
        {(helperText || error || success) && (
          <div className="flex items-start gap-1">
            <p className={cn(
              'text-xs',
              error ? 'text-danger-600' : 
              success ? 'text-success-600' : 
              'text-gray-500'
            )}>
              {error || success || helperText}
            </p>
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

// Input Group para agrupar inputs relacionados
export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'sm' | 'md' | 'lg'
}

const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, orientation = 'vertical', spacing = 'md', children, ...props }, ref) => {
    const spacingClasses = {
      sm: orientation === 'horizontal' ? 'gap-2' : 'space-y-2',
      md: orientation === 'horizontal' ? 'gap-4' : 'space-y-4',
      lg: orientation === 'horizontal' ? 'gap-6' : 'space-y-6'
    }

    return (
      <div
        ref={ref}
        className={cn(
          orientation === 'horizontal' ? 'flex items-end' : 'flex flex-col',
          spacingClasses[spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

InputGroup.displayName = 'InputGroup'

export { Input, Textarea, InputGroup, inputVariants }