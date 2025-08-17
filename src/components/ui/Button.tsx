'use client'

import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group',
  {
    variants: {
      variant: {
        // Primary - Gradiente roxo com sombra colorida
        primary: [
          'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary',
          'hover:shadow-lg hover:shadow-primary-500/25 hover:scale-[1.02] hover:-translate-y-0.5',
          'active:scale-[0.98] active:translate-y-0',
          'disabled:bg-gray-300 disabled:shadow-none disabled:transform-none'
        ],
        
        // Secondary - Branco com borda roxa
        secondary: [
          'bg-white text-primary-600 border-2 border-primary-200 shadow-sm',
          'hover:bg-primary-50 hover:border-primary-300 hover:shadow-md hover:scale-[1.02]',
          'active:scale-[0.98] active:bg-primary-100',
          'disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200'
        ],
        
        // Danger - Gradiente vermelho
        danger: [
          'bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-danger',
          'hover:shadow-lg hover:shadow-danger-500/25 hover:scale-[1.02] hover:-translate-y-0.5',
          'active:scale-[0.98] active:translate-y-0',
          'disabled:bg-gray-300 disabled:shadow-none disabled:transform-none'
        ],
        
        // Ghost - Transparente com hover
        ghost: [
          'bg-transparent text-gray-700 hover:bg-primary-50 hover:text-primary-700',
          'hover:scale-[1.02] active:scale-[0.98]',
          'disabled:text-gray-400 disabled:hover:bg-transparent'
        ],
        
        // Tropical - Gradiente verde para CTAs especiais
        tropical: [
          'bg-gradient-to-r from-tropical-mint-500 to-tropical-mint-600 text-white shadow-success',
          'hover:shadow-lg hover:shadow-tropical-mint-500/25 hover:scale-[1.02] hover:-translate-y-0.5',
          'active:scale-[0.98] active:translate-y-0',
          'disabled:bg-gray-300 disabled:shadow-none disabled:transform-none'
        ],
        
        // Outline variant
        outline: [
          'border border-gray-300 bg-white text-gray-700 shadow-sm',
          'hover:bg-gray-50 hover:border-gray-400 hover:scale-[1.02]',
          'active:scale-[0.98] active:bg-gray-100',
          'disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200'
        ],

        // Success variant
        success: [
          'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-success',
          'hover:shadow-lg hover:shadow-success-500/25 hover:scale-[1.02] hover:-translate-y-0.5',
          'active:scale-[0.98] active:translate-y-0',
          'disabled:bg-gray-300 disabled:shadow-none disabled:transform-none'
        ]
      },
      
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10 p-0'
      },
      
      fullWidth: {
        true: 'w-full',
        false: 'w-auto'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    asChild = false, 
    loading = false,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    const isDisabled = disabled || loading
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="shrink-0">{icon}</span>
        )}
        
        {children && (
          <span className={cn(
            'truncate',
            loading && 'ml-2'
          )}>
            {children}
          </span>
        )}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="shrink-0">{icon}</span>
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

// Button Group component para agrupar botões
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
}

const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = 'horizontal', size = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex',
          orientation === 'horizontal' 
            ? 'flex-row -space-x-px' 
            : 'flex-col -space-y-px',
          '[&>*:first-child]:rounded-l-xl [&>*:last-child]:rounded-r-xl',
          orientation === 'vertical' && '[&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none',
          '[&>*:not(:first-child):not(:last-child)]:rounded-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ButtonGroup.displayName = 'ButtonGroup'

export { Button, ButtonGroup, buttonVariants }
export default Button