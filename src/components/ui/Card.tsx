'use client'

import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-xl border transition-all duration-200',
  {
    variants: {
      variant: {
        // Card básico - Fundo branco, border sutil
        default: [
          'bg-white border-gray-200 shadow-sm',
          'hover:shadow-md'
        ],
        
        // Card com elevação - Para destaque
        elevated: [
          'bg-white border-gray-200 shadow-lg',
          'hover:shadow-xl hover:-translate-y-1'
        ],
        
        // Card métrica - Com gradiente sutil
        metric: [
          'bg-gradient-to-br from-white to-gray-50/50 border-gray-200 shadow-lg',
          'hover:shadow-xl hover:scale-[1.02]'
        ],
        
        // Card outline - Apenas borda
        outline: [
          'bg-transparent border-gray-300',
          'hover:border-gray-400 hover:bg-gray-50/50'
        ],
        
        // Card com gradiente
        gradient: [
          'bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200',
          'hover:from-primary-100 hover:to-primary-200/50'
        ],
        
        // Card glassmorphism
        glass: [
          'glassmorphism border-white/20',
          'hover:bg-white/20'
        ]
      },
      
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
      },
      
      interactive: {
        true: 'cursor-pointer hover-lift',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      interactive: false
    }
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, interactive, className }))}
      {...props}
    />
  )
)
Card.displayName = 'Card'

// Card Header component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient'
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5 p-6',
        variant === 'gradient' && 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-t-xl -m-6 mb-6',
        className
      )}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

// Card Title component
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const CardTitle = forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, as: Comp = 'h3', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

// Card Description component
const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

// Card Content component
const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

// Card Footer component
const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

// Metric Card - Componente especializado para métricas
export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    label?: string
    positive?: boolean
  }
  loading?: boolean
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  ({ 
    className, 
    title, 
    value, 
    icon, 
    trend, 
    loading = false,
    variant = 'default',
    ...props 
  }, ref) => {
    const variantStyles = {
      default: 'border-gray-200',
      primary: 'border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/50',
      success: 'border-success-200 bg-gradient-to-br from-success-50 to-success-100/50',
      warning: 'border-warning-200 bg-gradient-to-br from-warning-50 to-warning-100/50',
      danger: 'border-danger-200 bg-gradient-to-br from-danger-50 to-danger-100/50'
    }

    const iconColors = {
      default: 'text-gray-600',
      primary: 'text-primary-600',
      success: 'text-success-600',
      warning: 'text-warning-600',
      danger: 'text-danger-600'
    }

    return (
      <Card
        ref={ref}
        variant="metric"
        className={cn(
          variantStyles[variant],
          'relative overflow-hidden',
          className
        )}
        {...props}
      >
        <CardContent className="pb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <p className="text-sm font-medium text-gray-600">
                {title}
              </p>
              
              {loading ? (
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  {value}
                </p>
              )}
              
              {trend && !loading && (
                <div className="flex items-center gap-1">
                  <span className={cn(
                    'text-sm font-medium',
                    trend.positive ? 'text-success-600' : 'text-danger-600'
                  )}>
                    {trend.positive ? '+' : '-'}{Math.abs(trend.value)}%
                  </span>
                  {trend.label && (
                    <span className="text-xs text-gray-500">
                      {trend.label}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {icon && (
              <div className={cn(
                'p-3 rounded-xl bg-white/80 backdrop-blur-sm',
                iconColors[variant]
              )}>
                {React.cloneElement(icon as React.ReactElement, { 
                  className: 'h-6 w-6' 
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)
MetricCard.displayName = 'MetricCard'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  MetricCard,
  cardVariants
}