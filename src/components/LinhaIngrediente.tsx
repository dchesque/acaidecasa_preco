'use client'

import { ItemReceita, Insumo } from '@/types'
import { Trash2 } from 'lucide-react'

interface LinhaIngredienteProps {
  item: ItemReceita
  insumo: Insumo
  onChange: (item: ItemReceita) => void
  onRemove: () => void
}

export default function LinhaIngrediente({ item, insumo, onChange, onRemove }: LinhaIngredienteProps) {
  const subtotal = item.quantidade * insumo.precoPorGrama

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{insumo.nome}</p>
        <p className="text-sm text-gray-500 capitalize">{insumo.tipo.replace('_', ' ')}</p>
        <p className="text-xs text-gray-400">R$ {insumo.precoPorGrama.toFixed(4)}/g</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={item.quantidade}
            onChange={(e) => onChange({
              ...item,
              quantidade: parseFloat(e.target.value) || 0
            })}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
            placeholder="0"
          />
          <span className="text-sm font-medium text-gray-600">g</span>
        </div>

        <div className="w-32">
          <input
            type="text"
            value={item.observacao || ''}
            onChange={(e) => onChange({
              ...item,
              observacao: e.target.value
            })}
            placeholder="Observação"
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>

        <div className="text-right min-w-[80px]">
          <p className="text-sm font-bold text-green-600">
            R$ {subtotal.toFixed(2)}
          </p>
        </div>

        <button
          onClick={onRemove}
          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
          title="Remover ingrediente"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}