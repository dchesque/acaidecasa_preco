'use client'

import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils/formatters'
import { 
  calcularMargem, 
  calcularPrecoComMargem, 
  calcularLucro,
  getPrecoPsicologico,
  MargemBadge,
  getMargemColor
} from '@/utils/margemUtils'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Calculator,
  ChevronRight,
  Info
} from 'lucide-react'

interface CalculadoraAvancadaProps {
  custoInicial?: number
  precoAtual?: number
  margemIdeal?: number
  categoria?: string
  onPrecoCalculado?: (preco: number, margem: number) => void
}

interface Cenario {
  label: string
  margem: number
  destacado?: boolean
  descricao: string
  cor: string
}

export default function CalculadoraAvancada({
  custoInicial = 0,
  precoAtual = 0,
  margemIdeal = 50,
  categoria = 'geral',
  onPrecoCalculado
}: CalculadoraAvancadaProps) {
  const [custo, setCusto] = useState(custoInicial)
  const [margem, setMargem] = useState(margemIdeal)
  const [precoManual, setPrecoManual] = useState(precoAtual)
  const [modoCalculo, setModoCalculo] = useState<'margem' | 'preco'>('margem')

  // Calcular preço baseado na margem ou margem baseada no preço
  const precoCalculado = useMemo(() => {
    if (modoCalculo === 'margem') {
      return calcularPrecoComMargem(custo, margem)
    }
    return precoManual
  }, [custo, margem, precoManual, modoCalculo])

  const margemCalculada = useMemo(() => {
    if (modoCalculo === 'preco') {
      return calcularMargem(custo, precoManual)
    }
    return margem
  }, [custo, precoManual, margem, modoCalculo])

  const lucro = useMemo(() => {
    return calcularLucro(custo, precoCalculado)
  }, [custo, precoCalculado])

  // Cenários predefinidos
  const cenarios: Cenario[] = [
    {
      label: 'Conservador',
      margem: 35,
      descricao: 'Margem mínima recomendada',
      cor: 'from-yellow-400 to-yellow-600'
    },
    {
      label: 'Padrão',
      margem: 50,
      destacado: true,
      descricao: 'Margem ideal para maioria dos produtos',
      cor: 'from-emerald-400 to-emerald-600'
    },
    {
      label: 'Premium',
      margem: 70,
      descricao: 'Para produtos diferenciados',
      cor: 'from-purple-400 to-purple-600'
    }
  ]

  // Preços psicológicos sugeridos
  const precosPsicologicos = useMemo(() => {
    return getPrecoPsicologico(precoCalculado)
  }, [precoCalculado])

  const handleCustoChange = (value: string) => {
    const num = parseFloat(value) || 0
    setCusto(num)
  }

  const handleMargemChange = (value: number) => {
    setMargem(value)
    setModoCalculo('margem')
  }

  const handlePrecoManualChange = (value: string) => {
    const num = parseFloat(value) || 0
    setPrecoManual(num)
    setModoCalculo('preco')
  }

  const aplicarCenario = (cenarioMargem: number) => {
    setMargem(cenarioMargem)
    setModoCalculo('margem')
  }

  const aplicarPrecoSugerido = (preco: number) => {
    setPrecoManual(preco)
    setModoCalculo('preco')
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
          <Calculator className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Calculadora Avançada de Preços</h3>
          <p className="text-sm text-gray-500">Simule diferentes cenários de precificação</p>
        </div>
      </div>

      {/* Input de Custo */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custo do Produto
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
          <input
            type="number"
            value={custo}
            onChange={(e) => handleCustoChange(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="0,00"
            step="0.01"
          />
        </div>
      </div>

      {/* Régua Visual de Margem */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            Margem de Lucro
          </label>
          <span className="text-lg font-bold text-purple-600">
            {margemCalculada.toFixed(1)}%
          </span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max="90"
            value={margem}
            onChange={(e) => handleMargemChange(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, 
                #ef4444 0%, 
                #eab308 30%, 
                #22c55e 50%, 
                #10b981 70%, 
                #8b5cf6 90%)`
            }}
          />
          
          <div className="flex justify-between mt-3 text-xs text-gray-500">
            <span>Prejuízo</span>
            <span>Baixa (30%)</span>
            <span>Ideal (50%)</span>
            <span>Ótima (70%)</span>
            <span>Premium</span>
          </div>
        </div>

        <div className="mt-3">
          <MargemBadge margem={margemCalculada} />
        </div>
      </div>

      {/* Resultado do Cálculo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-gray-600">Preço Sugerido</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(precoCalculado)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-600">Lucro por Unidade</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(lucro)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Percent className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-600">Margem</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {margemCalculada.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Simulador de Cenários */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Cenários Predefinidos</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {cenarios.map((cenario) => {
            const precoComCenario = calcularPrecoComMargem(custo, cenario.margem)
            const lucroComCenario = calcularLucro(custo, precoComCenario)
            const isAtivo = Math.abs(margem - cenario.margem) < 1
            
            return (
              <button
                key={cenario.label}
                onClick={() => aplicarCenario(cenario.margem)}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  isAtivo 
                    ? 'border-purple-500 bg-purple-50' 
                    : cenario.destacado
                    ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-400'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {cenario.destacado && (
                  <span className="absolute -top-2 -right-2 px-2 py-1 bg-emerald-500 text-white text-xs rounded-full">
                    Recomendado
                  </span>
                )}
                
                <div className="text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">{cenario.label}</span>
                    <span className={`text-sm font-bold ${
                      isAtivo ? 'text-purple-600' : 'text-gray-600'
                    }`}>
                      {cenario.margem}%
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-3">{cenario.descricao}</p>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Preço:</span>
                      <span className="font-medium">{formatCurrency(precoComCenario)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lucro:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(lucroComCenario)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Preços Psicológicos Sugeridos */}
      {precosPsicologicos.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Preços Psicológicos Sugeridos
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {precosPsicologicos.map((preco, index) => {
              const margemComPreco = calcularMargem(custo, preco)
              const diferenca = ((preco - precoCalculado) / precoCalculado) * 100
              
              return (
                <button
                  key={index}
                  onClick={() => aplicarPrecoSugerido(preco)}
                  className="p-3 rounded-lg border border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 transition-all"
                >
                  <p className="text-lg font-bold text-gray-800">
                    {formatCurrency(preco)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {diferenca > 0 ? '+' : ''}{diferenca.toFixed(1)}%
                  </p>
                  <p className="text-xs font-medium text-purple-600 mt-1">
                    Margem: {margemComPreco.toFixed(1)}%
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Input de Preço Manual */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ou defina um preço manual
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
            <input
              type="number"
              value={precoManual}
              onChange={(e) => handlePrecoManualChange(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0,00"
              step="0.01"
            />
          </div>
          {modoCalculo === 'preco' && (
            <div className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <div className="text-center">
                <p className="text-xs text-gray-500">Margem resultante</p>
                <p className="text-lg font-bold text-purple-600">
                  {margemCalculada.toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botão de Aplicar */}
      {onPrecoCalculado && (
        <button
          onClick={() => onPrecoCalculado(precoCalculado, margemCalculada)}
          className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
        >
          Aplicar Preço Calculado
        </button>
      )}
    </div>
  )
}