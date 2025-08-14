'use client'

import { ItemReceita, Insumo } from '@/types'
import { DollarSign, Calculator, AlertTriangle } from 'lucide-react'

interface CalculadoraCustoProps {
  ingredientes: ItemReceita[]
  insumos: Insumo[]
  rendimento: number
}

export default function CalculadoraCusto({ ingredientes, insumos, rendimento }: CalculadoraCustoProps) {
  const custoTotal = ingredientes.reduce((total, item) => {
    const insumo = insumos.find(i => i.id === item.insumoId)
    if (insumo) {
      return total + (item.quantidade * insumo.precoPorGrama)
    }
    return total
  }, 0)

  const custoPorGrama = rendimento > 0 ? custoTotal / rendimento : 0
  const temErros = rendimento <= 0 || ingredientes.length === 0

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-900">Resumo de Custos</h3>
      </div>

      {temErros && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <p className="text-sm text-yellow-700">
            {rendimento <= 0 && 'Informe o rendimento em gramas. '}
            {ingredientes.length === 0 && 'Adicione pelo menos um ingrediente.'}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Custo Total:</span>
          <span className="text-2xl font-bold text-blue-900">
            R$ {custoTotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700">Rendimento:</span>
          <span className="text-lg font-medium text-gray-900">
            {rendimento}g
          </span>
        </div>

        <div className="border-t border-blue-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Custo por Grama:</span>
            <span className="text-xl font-bold text-green-600">
              R$ {custoPorGrama.toFixed(4)}
            </span>
          </div>
        </div>

        {ingredientes.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Detalhamento:</h4>
            <div className="space-y-2">
              {ingredientes.map((item) => {
                const insumo = insumos.find(i => i.id === item.insumoId)
                if (!insumo) return null
                
                const subtotal = item.quantidade * insumo.precoPorGrama
                const percentual = custoTotal > 0 ? (subtotal / custoTotal) * 100 : 0
                
                return (
                  <div key={item.insumoId} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {insumo.nome} ({item.quantidade}g)
                    </span>
                    <div className="text-right">
                      <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                      <span className="text-gray-500 ml-2">({percentual.toFixed(1)}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}