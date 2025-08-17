'use client'

import { useState, useMemo } from 'react'
import { ItemCardapio } from '@/types'
import { useApp } from '@/contexts/AppContext'
import { formatCurrency } from '@/utils/formatters'
import { 
  calcularMargem, 
  calcularPrecoComMargem, 
  MargemBadge,
  getMargemColor 
} from '@/utils/margemUtils'
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Layers,
  Calculator,
  Percent,
  DollarSign
} from 'lucide-react'

interface PrecificacaoLoteProps {
  selectedItems: string[]
  onClose: () => void
  onApply: (updates: { id: string; precoVenda: number; percentualMargem: number }[]) => void
}

type TipoAjuste = 'margem' | 'percentual' | 'valor'

interface ModalConfirmacaoProps {
  isOpen: boolean
  resumo: {
    antes: { margemMedia: number; precoMedio: number; lucroMedio: number }
    depois: { margemMedia: number; precoMedio: number; lucroMedio: number }
  }
  produtos: ItemCardapio[]
  updates: { id: string; precoVenda: number; percentualMargem: number }[]
  onConfirm: () => void
  onCancel: () => void
}

function ModalConfirmacao({ isOpen, resumo, produtos, updates, onConfirm, onCancel }: ModalConfirmacaoProps) {
  const [criarBackup, setCriarBackup] = useState(true)
  
  if (!isOpen) return null
  
  const diferencaMargem = resumo.depois.margemMedia - resumo.antes.margemMedia
  const diferencaPreco = resumo.depois.precoMedio - resumo.antes.precoMedio
  const diferencaLucro = resumo.depois.lucroMedio - resumo.antes.lucroMedio
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Confirmar Alteração em Lote</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <p className="font-medium text-yellow-800">
              Você está prestes a alterar {updates.length} produtos:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">📊 Resumo Antes:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Margem média:</span>
                  <span className="font-medium">{resumo.antes.margemMedia.toFixed(1)}%</span>
                </li>
                <li className="flex justify-between">
                  <span>Preço médio:</span>
                  <span className="font-medium">{formatCurrency(resumo.antes.precoMedio)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Lucro médio:</span>
                  <span className="font-medium">{formatCurrency(resumo.antes.lucroMedio)}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🎯 Resumo Depois:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Margem média:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600">{resumo.depois.margemMedia.toFixed(1)}%</span>
                    <span className={`text-xs ${diferencaMargem >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ({diferencaMargem >= 0 ? '+' : ''}{diferencaMargem.toFixed(1)}%)
                    </span>
                  </div>
                </li>
                <li className="flex justify-between">
                  <span>Preço médio:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600">{formatCurrency(resumo.depois.precoMedio)}</span>
                    <span className={`text-xs ${diferencaPreco >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ({diferencaPreco >= 0 ? '+' : ''}{formatCurrency(diferencaPreco)})
                    </span>
                  </div>
                </li>
                <li className="flex justify-between">
                  <span>Lucro médio:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600">{formatCurrency(resumo.depois.lucroMedio)}</span>
                    <span className={`text-xs ${diferencaLucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ({diferencaLucro >= 0 ? '+' : ''}{formatCurrency(diferencaLucro)})
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-yellow-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={criarBackup}
                onChange={(e) => setCriarBackup(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-yellow-700">
                Criar backup dos preços atuais antes de aplicar
              </span>
            </label>
          </div>
        </div>
        
        {/* Preview dos produtos afetados */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Produtos que serão alterados:</h4>
          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left p-2">Produto</th>
                  <th className="text-center p-2">Preço Atual</th>
                  <th className="text-center p-2">Novo Preço</th>
                  <th className="text-center p-2">Diferença</th>
                </tr>
              </thead>
              <tbody>
                {produtos.slice(0, 10).map(produto => {
                  const update = updates.find(u => u.id === produto.id)
                  const diferenca = update ? update.precoVenda - produto.precoVenda : 0
                  
                  return (
                    <tr key={produto.id} className="border-t border-gray-100">
                      <td className="p-2 font-medium">{produto.nome}</td>
                      <td className="p-2 text-center">{formatCurrency(produto.precoVenda)}</td>
                      <td className="p-2 text-center font-bold text-green-600">
                        {update ? formatCurrency(update.precoVenda) : formatCurrency(produto.precoVenda)}
                      </td>
                      <td className="p-2 text-center">
                        <span className={diferenca >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {diferenca >= 0 ? '+' : ''}{formatCurrency(diferenca)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {produtos.length > 10 && (
                  <tr>
                    <td colSpan={4} className="p-2 text-center text-gray-500 text-xs">
                      ... e mais {produtos.length - 10} produtos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Confirmar Alterações
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PrecificacaoLote({ selectedItems, onClose, onApply }: PrecificacaoLoteProps) {
  const { cardapio } = useApp()
  const [tipoAjuste, setTipoAjuste] = useState<TipoAjuste>('margem')
  const [valorAjuste, setValorAjuste] = useState<number>(50)
  const [showModal, setShowModal] = useState(false)
  
  const produtosSelecionados = useMemo(() => {
    return cardapio.filter(produto => selectedItems.includes(produto.id))
  }, [cardapio, selectedItems])
  
  const calculosPreview = useMemo(() => {
    const updates = produtosSelecionados.map(produto => {
      let novoPreco = produto.precoVenda
      
      switch (tipoAjuste) {
        case 'margem':
          novoPreco = calcularPrecoComMargem(produto.custo, valorAjuste)
          break
        case 'percentual':
          novoPreco = produto.precoVenda * (1 + valorAjuste / 100)
          break
        case 'valor':
          novoPreco = produto.precoVenda + valorAjuste
          break
      }
      
      return {
        id: produto.id,
        precoVenda: novoPreco,
        percentualMargem: calcularMargem(produto.custo, novoPreco)
      }
    })
    
    return updates
  }, [produtosSelecionados, tipoAjuste, valorAjuste])
  
  const resumoComparativo = useMemo(() => {
    const antes = {
      margemMedia: produtosSelecionados.reduce((acc, p) => acc + p.percentualMargem, 0) / produtosSelecionados.length,
      precoMedio: produtosSelecionados.reduce((acc, p) => acc + p.precoVenda, 0) / produtosSelecionados.length,
      lucroMedio: produtosSelecionados.reduce((acc, p) => acc + p.markup, 0) / produtosSelecionados.length
    }
    
    const depois = {
      margemMedia: calculosPreview.reduce((acc, p) => acc + p.percentualMargem, 0) / calculosPreview.length,
      precoMedio: calculosPreview.reduce((acc, p) => acc + p.precoVenda, 0) / calculosPreview.length,
      lucroMedio: calculosPreview.reduce((acc, update) => {
        const produto = produtosSelecionados.find(p => p.id === update.id)!
        return acc + (update.precoVenda - produto.custo)
      }, 0) / calculosPreview.length
    }
    
    return { antes, depois }
  }, [produtosSelecionados, calculosPreview])
  
  const impactoMedio = resumoComparativo.depois.precoMedio - resumoComparativo.antes.precoMedio
  
  if (selectedItems.length === 0) return null
  
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 p-6 transform transition-transform duration-300 ease-out animate-slide-up z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Layers className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Precificação em Lote</h3>
                <p className="text-sm text-gray-600">
                  {selectedItems.length} {selectedItems.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-end">
            {/* Tipo de Ajuste */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Ajuste
              </label>
              <select
                value={tipoAjuste}
                onChange={(e) => setTipoAjuste(e.target.value as TipoAjuste)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="margem">Definir Margem (%)</option>
                <option value="percentual">Ajuste Percentual (%)</option>
                <option value="valor">Ajuste em Reais (R$)</option>
              </select>
            </div>
            
            {/* Valor do Ajuste */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor do Ajuste
              </label>
              <div className="relative">
                {tipoAjuste === 'margem' && (
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                )}
                {tipoAjuste === 'valor' && (
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                )}
                {tipoAjuste === 'percentual' && (
                  <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                )}
                <input
                  type="number"
                  value={valorAjuste}
                  onChange={(e) => setValorAjuste(Number(e.target.value))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={
                    tipoAjuste === 'margem' ? '50' :
                    tipoAjuste === 'percentual' ? '10' : '2.50'
                  }
                  step={tipoAjuste === 'valor' ? '0.01' : '1'}
                />
              </div>
            </div>
            
            {/* Preview do Impacto */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview do Impacto
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Margem Média</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="font-bold text-gray-900">
                        {resumoComparativo.depois.margemMedia.toFixed(1)}%
                      </span>
                      <span className={`text-xs flex items-center gap-1 ${
                        resumoComparativo.depois.margemMedia >= resumoComparativo.antes.margemMedia
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {resumoComparativo.depois.margemMedia >= resumoComparativo.antes.margemMedia
                          ? <TrendingUp className="h-3 w-3" />
                          : <TrendingDown className="h-3 w-3" />
                        }
                        {(resumoComparativo.depois.margemMedia - resumoComparativo.antes.margemMedia).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-600">Preço Médio</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="font-bold text-gray-900">
                        {formatCurrency(resumoComparativo.depois.precoMedio)}
                      </span>
                      <span className={`text-xs flex items-center gap-1 ${
                        impactoMedio >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {impactoMedio >= 0
                          ? <TrendingUp className="h-3 w-3" />
                          : <TrendingDown className="h-3 w-3" />
                        }
                        {formatCurrency(Math.abs(impactoMedio))}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-600">Lucro Médio</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="font-bold text-green-600">
                        {formatCurrency(resumoComparativo.depois.lucroMedio)}
                      </span>
                      <span className={`text-xs flex items-center gap-1 ${
                        resumoComparativo.depois.lucroMedio >= resumoComparativo.antes.lucroMedio
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {resumoComparativo.depois.lucroMedio >= resumoComparativo.antes.lucroMedio
                          ? <TrendingUp className="h-3 w-3" />
                          : <TrendingDown className="h-3 w-3" />
                        }
                        {formatCurrency(Math.abs(resumoComparativo.depois.lucroMedio - resumoComparativo.antes.lucroMedio))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Botão de Aplicar */}
            <div>
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Aplicar a {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'itens'}
              </button>
            </div>
          </div>
          
          {/* Preview dos produtos */}
          {produtosSelecionados.length <= 5 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Preview das alterações:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {produtosSelecionados.map(produto => {
                  const update = calculosPreview.find(u => u.id === produto.id)!
                  const diferenca = update.precoVenda - produto.precoVenda
                  
                  return (
                    <div key={produto.id} className="bg-gray-50 rounded-lg p-3">
                      <h5 className="font-medium text-sm text-gray-900 mb-2 truncate">
                        {produto.nome}
                      </h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Atual:</span>
                          <span>{formatCurrency(produto.precoVenda)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Novo:</span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(update.precoVenda)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Diferença:</span>
                          <span className={diferenca >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {diferenca >= 0 ? '+' : ''}{formatCurrency(diferenca)}
                          </span>
                        </div>
                        <div className="mt-2">
                          <MargemBadge margem={update.percentualMargem} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ModalConfirmacao
        isOpen={showModal}
        resumo={resumoComparativo}
        produtos={produtosSelecionados}
        updates={calculosPreview}
        onConfirm={() => {
          onApply(calculosPreview)
          setShowModal(false)
          onClose()
        }}
        onCancel={() => setShowModal(false)}
      />
    </>
  )
}