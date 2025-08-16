'use client'

import { cn } from '@/utils/cn'
import { CheckCircle, XCircle, Clock, AlertCircle, Star } from 'lucide-react'

interface StatusBadgeProps {
  status: 'ativo' | 'inativo' | 'pendente' | 'processando' | 'premium'
  showIcon?: boolean
  className?: string
  children?: React.ReactNode
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  showIcon = true, 
  className,
  children 
}) => {
  const configs = {
    ativo: {
      classes: 'bg-green-100 text-green-800 border border-green-200',
      icon: CheckCircle,
      text: 'Ativo'
    },
    inativo: {
      classes: 'bg-red-100 text-red-800 border border-red-200',
      icon: XCircle,
      text: 'Inativo'
    },
    pendente: {
      classes: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      icon: Clock,
      text: 'Pendente'
    },
    processando: {
      classes: 'bg-blue-100 text-blue-800 border border-blue-200',
      icon: AlertCircle,
      text: 'Processando'
    },
    premium: {
      classes: 'bg-purple-100 text-purple-800 border border-purple-200',
      icon: Star,
      text: 'Premium'
    }
  }

  const config = configs[status]
  const Icon = config.icon

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
      config.classes,
      className
    )}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {children || config.text}
    </span>
  )
}

export default StatusBadge