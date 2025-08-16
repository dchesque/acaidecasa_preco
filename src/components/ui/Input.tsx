'use client'

import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, icon, ...props }, ref) => {
    const getInputClasses = () => {
      if (error) {
        return 'border-red-300 focus:ring-red-500 bg-red-50/50'
      }
      if (success) {
        return 'border-green-300 focus:ring-green-500 bg-green-50/50'
      }
      return 'border-gray-300 focus:ring-purple-500 focus:border-transparent'
    }

    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-purple-700 bg-white px-2 -mt-2 ml-3">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'block w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:outline-none',
              getInputClasses(),
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input