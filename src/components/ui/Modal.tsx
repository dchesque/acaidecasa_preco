'use client'

import React, { forwardRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const modalVariants = cva(
  'fixed inset-0 z-50 flex items-center justify-center p-4',
  {
    variants: {
      variant: {
        // Modal padrão - Fundo blur com overlay escuro
        default: [
          'bg-black/50 backdrop-blur-md',
        ],
        
        // Modal com overlay mais claro
        light: [
          'bg-white/30 backdrop-blur-lg',
        ],
        
        // Modal com overlay tropical
        tropical: [
          'bg-gradient-to-br from-primary-500/20 to-tropical-mint-500/20 backdrop-blur-md',
        ],
        
        // Modal com overlay de perigo
        danger: [
          'bg-danger-500/20 backdrop-blur-md',
        ],
        
        // Modal glassmorphism
        glass: [
          'bg-white/10 backdrop-blur-xl',
        ]
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const modalContentVariants = cva(
  'relative w-full bg-white rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg', 
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[95vw] max-h-[95vh]'
      },
      
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
      }
    },
    defaultVariants: {
      size: 'md',
      padding: 'lg'
    }
  }
)

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalVariants> {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({
    className,
    variant,
    size,
    padding,
    open,
    onClose,
    title,
    description,
    showCloseButton = true,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    children,
    ...props
  }, ref) => {
    
    // Handle escape key
    useEffect(() => {
      if (!closeOnEscape || !open) return
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [closeOnEscape, open, onClose])
    
    // Handle body scroll lock
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
      
      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [open])
    
    if (!open) return null
    
    const modalContent = (
      <div
        className={cn(modalVariants({ variant, className }))}
        onClick={closeOnBackdropClick ? onClose : undefined}
        {...props}
      >
        <div
          ref={ref}
          className={cn(
            modalContentVariants({ size, padding }),
            // Animações de entrada
            'animate-scale-in',
            // Previne fechamento ao clicar no conteúdo
            'relative'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
              <div className="flex-1">
                {title && (
                  <h2 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {description}
                  </p>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  aria-label="Fechar modal"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    )
    
    // Render modal in portal to body
    return createPortal(modalContent, document.body)
  }
)

Modal.displayName = 'Modal'

// Modal Header component
export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'danger' | 'success'
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default: 'border-gray-200',
      gradient: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white border-transparent -m-6 -mb-0 p-6 pb-4 rounded-t-2xl mb-6',
      danger: 'bg-gradient-to-r from-danger-500 to-danger-600 text-white border-transparent -m-6 -mb-0 p-6 pb-4 rounded-t-2xl mb-6',
      success: 'bg-gradient-to-r from-success-500 to-success-600 text-white border-transparent -m-6 -mb-0 p-6 pb-4 rounded-t-2xl mb-6'
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between pb-4 mb-6 border-b',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ModalHeader.displayName = 'ModalHeader'

// Modal Title component
const ModalTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-xl font-semibold text-gray-900', className)}
      {...props}
    />
  )
)

ModalTitle.displayName = 'ModalTitle'

// Modal Description component
const ModalDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('mt-1 text-sm text-gray-600', className)}
      {...props}
    />
  )
)

ModalDescription.displayName = 'ModalDescription'

// Modal Content component
const ModalContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative', className)}
      {...props}
    />
  )
)

ModalContent.displayName = 'ModalContent'

// Modal Footer component
export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'separated' | 'gradient'
}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default: 'mt-6 pt-4',
      separated: 'mt-6 pt-6 border-t border-gray-200',
      gradient: 'bg-gray-50/50 -m-6 -mt-0 p-6 pt-4 mt-6 border-t border-gray-200'
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end gap-3',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ModalFooter.displayName = 'ModalFooter'

// Confirmation Modal - Componente especializado para confirmações
export interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  onConfirm: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger' | 'success'
  loading?: boolean
  icon?: React.ReactNode
}

const ConfirmModal = forwardRef<HTMLDivElement, ConfirmModalProps>(
  ({
    title = 'Confirmar ação',
    description,
    onConfirm,
    onCancel,
    onClose,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    confirmVariant = 'primary',
    loading = false,
    icon,
    ...props
  }, ref) => {
    const handleCancel = () => {
      if (onCancel) {
        onCancel()
      } else {
        onClose()
      }
    }
    
    return (
      <Modal
        ref={ref}
        title={title}
        description={description}
        onClose={onClose}
        size="sm"
        {...props}
      >
        <ModalContent>
          {icon && (
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gray-100">
                {React.cloneElement(icon as React.ReactElement, { 
                  className: 'h-6 w-6 text-gray-600' 
                })}
              </div>
            </div>
          )}
        </ModalContent>
        
        <ModalFooter variant="separated">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 min-w-[100px] flex items-center justify-center gap-2',
              confirmVariant === 'danger' && 'bg-danger-600 hover:bg-danger-700 focus:ring-danger-500',
              confirmVariant === 'success' && 'bg-success-600 hover:bg-success-700 focus:ring-success-500',
              confirmVariant === 'primary' && 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
            )}
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            )}
            {confirmText}
          </button>
        </ModalFooter>
      </Modal>
    )
  }
)

ConfirmModal.displayName = 'ConfirmModal'

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
  ConfirmModal,
  modalVariants
}