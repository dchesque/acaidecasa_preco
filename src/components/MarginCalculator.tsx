'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MarginCalculatorProps {
  initialCost?: number
  initialPrice?: number
}

export default function MarginCalculator({ initialCost = 0, initialPrice = 0 }: MarginCalculatorProps) {
  const [custo, setCusto] = useState(initialCost)
  const [precoVenda, setPrecoVenda] = useState(initialPrice)
  const [simulacao, setSimulacao] = useState('')

  const calcular = (custoValue: number, precoValue: number) => {
    const markup = precoValue - custoValue
    const percentualMargem = custoValue > 0 ? ((precoValue - custoValue) / custoValue) * 100 : 0
    return { markup, percentualMargem }
  }

  const resultado = calcular(custo, precoVenda)
  const simulacaoResult = simulacao ? calcular(custo, parseFloat(simulacao) || 0) : null

  const getMargemColor = (margem: number) => {
    if (margem >= 50) return 'text-green-600 bg-green-50 border-green-200'
    if (margem >= 20) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getMargemIcon = (margem: number) => {
    if (margem >= 50) return <TrendingUp className="h-5 w-5" />
    if (margem >= 20) return <Minus className="h-5 w-5" />
    return <TrendingDown className="h-5 w-5" />
  }

  const getMargemLabel = (margem: number) => {
    if (margem >= 50) return 'Excelente'
    if (margem >= 20) return 'Boa'
    return 'Baixa'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Calculadora de Margem</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Entradas */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custo do Item (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={custo}
              onChange={(e) => setCusto(parseFloat(e.target.value) || 0)}
              className="w-full border rounded-lg px-4 py-3 text-lg"
              placeholder="0,00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço de Venda (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={precoVenda}
              onChange={(e) => setPrecoVenda(parseFloat(e.target.value) || 0)}
              className="w-full border rounded-lg px-4 py-3 text-lg"
              placeholder="0,00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Simulação: "E se eu vendesse por..." (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={simulacao}
              onChange={(e) => setSimulacao(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-lg border-blue-200 focus:border-blue-500"
              placeholder="Ex: 15,00"
            />
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-4">
          {/* Resultado Principal */}
          <div className={`border rounded-lg p-4 ${getMargemColor(resultado.percentualMargem)}`}>
            <div className="flex items-center gap-2 mb-3">
              {getMargemIcon(resultado.percentualMargem)}
              <span className="font-semibold">Margem {getMargemLabel(resultado.percentualMargem)}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Markup:</span>
                <span className="font-bold text-lg">R$ {resultado.markup.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Margem:</span>
                <span className="font-bold text-2xl">{resultado.percentualMargem.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Simulação */}
          {simulacaoResult && simulacao && (
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-900 mb-3">Simulação</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Preço simulado:</span>
                  <span className="font-medium">R$ {parseFloat(simulacao).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Markup:</span>
                  <span className="font-bold text-blue-700">R$ {simulacaoResult.markup.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Margem:</span>
                  <span className="font-bold text-blue-700">{simulacaoResult.percentualMargem.toFixed(1)}%</span>
                </div>
                <div className="text-xs text-blue-600 mt-2">
                  Diferença: {(simulacaoResult.percentualMargem - resultado.percentualMargem) >= 0 ? '+' : ''}
                  {(simulacaoResult.percentualMargem - resultado.percentualMargem).toFixed(1)}%
                </div>
              </div>
            </div>
          )}

          {/* Guia de margens */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-900 mb-3">Guia de Margens</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>≥50% - Excelente margem</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>20-50% - Boa margem</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>&lt;20% - Margem baixa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fórmulas */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Fórmulas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>Markup:</strong> Preço de Venda - Custo
          </div>
          <div>
            <strong>% Margem:</strong> ((Preço de Venda - Custo) ÷ Custo) × 100
          </div>
        </div>
      </div>
    </div>
  )
}