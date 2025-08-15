'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { 
  TrendingDown,
  TrendingUp,
  DollarSign,
  Percent,
  CheckCircle,
  Clock,
  Building2,
  Search,
  ArrowRight
} from 'lucide-react'

export default function ComparadorPrecos() {
  const { 
    insumos, 
    obterComparacaoPrecos, 
    aplicarMelhorPreco,
    calcularEconomiaTotal
  } = useApp()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInsumo, setSelectedInsumo] = useState<string>('')

  const insumosComFornecedores = useMemo(() => {
    return insumos
      .filter(i => i.ativo)
      .map(insumo => {
        const comparacao = obterComparacaoPrecos(insumo.id)
        return {
          ...insumo,
          comparacao,
          temFornecedores: comparacao && comparacao.fornecedores.length > 0
        }
      })
      .filter(i => i.temFornecedores)
      .filter(i => 
        searchTerm === '' || 
        i.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [insumos, searchTerm, obterComparacaoPrecos])

  const economiaTotal = calcularEconomiaTotal()

  const handleAplicarMelhorPreco = (insumoId: string, fornecedorId: string) => {
    if (confirm('Tem certeza que deseja aplicar este preço ao insumo? Isso irá alterar o custo atual.')) {
      aplicarMelhorPreco(insumoId, fornecedorId)
    }
  }

  const comparacaoSelecionada = selectedInsumo ? obterComparacaoPrecos(selectedInsumo) : null

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Comparador de Preços</h2>
            <p className="text-green-100 mt-1">
              Compare preços de fornecedores e otimize seus custos
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">R$ {economiaTotal.toFixed(2)}</div>
            <div className="text-green-100">Economia Total Possível</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar insumos com fornecedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Insumos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Insumos com Fornecedores ({insumosComFornecedores.length})
          </h3>
          
          {insumosComFornecedores.length === 0 ? (
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Nenhum insumo com fornecedores
              </h3>
              <p className="mt-1 text-gray-500">
                Cadastre produtos nos fornecedores para poder comparar preços.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {insumosComFornecedores.map((insumo) => {
                const comparacao = insumo.comparacao!
                const isSelected = selectedInsumo === insumo.id
                const hasEconomia = comparacao.melhorPreco.economia > 0

                return (
                  <div
                    key={insumo.id}
                    className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all hover:shadow-md ${
                      isSelected 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedInsumo(isSelected ? '' : insumo.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{insumo.nome}</h4>
                        <p className="text-sm text-gray-600">
                          {comparacao.fornecedores.length} fornecedor{comparacao.fornecedores.length !== 1 ? 'es' : ''}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          R$ {(insumo.precoReal / insumo.quantidadeComprada).toFixed(4)}/g
                        </div>
                        {hasEconomia && (
                          <div className="flex items-center text-green-600 text-sm">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            -R$ {comparacao.melhorPreco.economia.toFixed(4)}
                            <span className="ml-1">
                              (-{comparacao.melhorPreco.economiaPercentual.toFixed(1)}%)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Detalhes da Comparação */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comparação Detalhada
          </h3>
          
          {!comparacaoSelecionada ? (
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Selecione um insumo
              </h3>
              <p className="mt-1 text-gray-500">
                Clique em um insumo da lista para ver a comparação detalhada.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {comparacaoSelecionada.insumoNome}
                </h4>
                
                {/* Preço Atual */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Preço Atual:</span>
                    <span className="text-lg font-bold text-gray-900">
                      R$ {(
                        insumos.find(i => i.id === selectedInsumo)!.precoReal / 
                        insumos.find(i => i.id === selectedInsumo)!.quantidadeComprada
                      ).toFixed(4)}/g
                    </span>
                  </div>
                </div>

                {/* Lista de Fornecedores */}
                <div className="space-y-3">
                  {comparacaoSelecionada.fornecedores
                    .sort((a, b) => a.precoComDesconto - b.precoComDesconto)
                    .map((fornecedor, index) => {
                      const isMelhor = fornecedor.fornecedorId === comparacaoSelecionada.melhorPreco.fornecedorId
                      const precoAtual = insumos.find(i => i.id === selectedInsumo)!.precoReal / 
                                       insumos.find(i => i.id === selectedInsumo)!.quantidadeComprada
                      const economia = precoAtual - fornecedor.precoComDesconto
                      const economiaPercentual = precoAtual > 0 ? (economia / precoAtual) * 100 : 0

                      return (
                        <div
                          key={fornecedor.fornecedorId}
                          className={`p-4 rounded-lg border-2 ${
                            isMelhor 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Building2 className={`h-5 w-5 mr-2 ${isMelhor ? 'text-green-600' : 'text-gray-400'}`} />
                              <span className="font-medium text-gray-900">
                                {fornecedor.fornecedorNome}
                              </span>
                              {isMelhor && (
                                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Melhor Preço
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Preço Original:</span>
                              <div className="font-medium">R$ {fornecedor.preco.toFixed(4)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Desconto:</span>
                              <div className="font-medium text-green-600">
                                {fornecedor.desconto.toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Preço Final:</span>
                              <div className="font-bold text-lg">
                                R$ {fornecedor.precoComDesconto.toFixed(4)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Entrega:</span>
                              <div className="font-medium flex items-center">
                                {fornecedor.tempoEntrega ? (
                                  <>
                                    <Clock className="h-4 w-4 mr-1" />
                                    {fornecedor.tempoEntrega} dias
                                  </>
                                ) : (
                                  'Não informado'
                                )}
                              </div>
                            </div>
                          </div>

                          {economia > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-green-600">
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                  <span className="text-sm font-medium">
                                    Economia: R$ {economia.toFixed(4)} ({economiaPercentual.toFixed(1)}%)
                                  </span>
                                </div>
                                {isMelhor && (
                                  <button
                                    onClick={() => handleAplicarMelhorPreco(selectedInsumo, fornecedor.fornecedorId)}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                                  >
                                    Aplicar Preço
                                    <ArrowRight className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}