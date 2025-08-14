'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import MarginCalculator from '@/components/MarginCalculator'
import { Calculator, Package, Cherry, Sparkles, RotateCcw, Save, Tabs } from 'lucide-react'
import { ProdutoInsumo } from '@/types'

export default function CalculadoraPage() {
  const { embalagens, insumos, addProduto } = useApp()
  const [activeTab, setActiveTab] = useState<'produto' | 'margem'>('margem')
  const [calculadoraData, setCalculadoraData] = useState({
    nome: '',
    tamanho: '400ml' as '180ml' | '300ml' | '400ml' | '500ml',
    tipoAcai: 'tradicional' as 'tradicional' | 'zero',
    categoria: '100%_puro' as '100%_puro' | 'com_adicional',
    embalagens: [] as string[],
    insumos: [] as ProdutoInsumo[],
    margem: 80
  })
  const [showSaveForm, setShowSaveForm] = useState(false)

  const embalagemDisponiveis = embalagens.filter(e => e.ativa)
  const insumosDisponiveis = insumos.filter(i => i.ativo)

  const calcular = () => {
    const custoEmbalagens = calculadoraData.embalagens.reduce((total, embalagemId) => {
      const embalagem = embalagens.find(e => e.id === embalagemId)
      return total + (embalagem?.precoUnitario || 0)
    }, 0)

    const custoInsumos = calculadoraData.insumos.reduce((total, produtoInsumo) => {
      const insumo = insumos.find(i => i.id === produtoInsumo.insumoId)
      if (insumo) {
        return total + (produtoInsumo.quantidade * insumo.precoPorGrama)
      }
      return total
    }, 0)

    const custoTotal = custoEmbalagens + custoInsumos
    const precoVenda = custoTotal * (1 + calculadoraData.margem / 100)
    const lucro = precoVenda - custoTotal

    return {
      custoEmbalagens,
      custoInsumos,
      custoTotal,
      precoVenda,
      margem: calculadoraData.margem,
      lucro
    }
  }

  const resultado = calcular()

  const resetCalculadora = () => {
    setCalculadoraData({
      nome: '',
      tamanho: '400ml',
      tipoAcai: 'tradicional',
      categoria: '100%_puro',
      embalagens: [],
      insumos: [],
      margem: 80
    })
    setShowSaveForm(false)
  }

  const toggleEmbalagem = (embalagemId: string) => {
    const newEmbalagens = calculadoraData.embalagens.includes(embalagemId)
      ? calculadoraData.embalagens.filter(id => id !== embalagemId)
      : [...calculadoraData.embalagens, embalagemId]
    
    setCalculadoraData({...calculadoraData, embalagens: newEmbalagens})
  }

  const addInsumo = (insumoId: string) => {
    const existingIndex = calculadoraData.insumos.findIndex(i => i.insumoId === insumoId)
    if (existingIndex === -1) {
      setCalculadoraData({
        ...calculadoraData,
        insumos: [...calculadoraData.insumos, { insumoId, quantidade: 0 }]
      })
    }
  }

  const updateInsumoQuantidade = (insumoId: string, quantidade: number) => {
    const newInsumos = calculadoraData.insumos.map(i => 
      i.insumoId === insumoId ? { ...i, quantidade } : i
    )
    setCalculadoraData({...calculadoraData, insumos: newInsumos})
  }

  const removeInsumo = (insumoId: string) => {
    const newInsumos = calculadoraData.insumos.filter(i => i.insumoId !== insumoId)
    setCalculadoraData({...calculadoraData, insumos: newInsumos})
  }

  const salvarComoProduto = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!calculadoraData.nome.trim()) {
      alert('Por favor, informe o nome do produto')
      return
    }

    const produtoData = {
      nome: calculadoraData.nome,
      tamanho: calculadoraData.tamanho,
      tipoAcai: calculadoraData.tipoAcai,
      categoria: calculadoraData.categoria,
      embalagens: calculadoraData.embalagens,
      insumos: calculadoraData.insumos,
      precoVenda: resultado.precoVenda,
      margem: calculadoraData.margem,
      ativo: true
    }

    addProduto(produtoData)
    alert('Produto salvo com sucesso!')
    resetCalculadora()
  }

  // Configurações pré-definidas para teste rápido
  const configuracoesRapidas = [
    {
      nome: 'Copo 300ml Simples',
      embalagens: ['copo_300ml', 'tampa', 'colher'],
      insumos: [
        { tipo: 'acai', quantidade: 200 },
        { tipo: 'complemento', quantidade: 20 }
      ]
    },
    {
      nome: 'Copo 400ml Premium',
      embalagens: ['copo_400ml', 'tampa', 'colher'],
      insumos: [
        { tipo: 'acai', quantidade: 250 },
        { tipo: 'complemento', quantidade: 30 },
        { tipo: 'complemento', quantidade: 25 }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calculadoras</h1>
              <p className="text-gray-600 mt-2">Ferramentas para cálculo de custos e margens</p>
            </div>
            {activeTab === 'produto' && (
              <div className="flex gap-2">
                <button
                  onClick={resetCalculadora}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  Limpar
                </button>
                {(calculadoraData.embalagens.length > 0 || calculadoraData.insumos.length > 0) && (
                  <button
                    onClick={() => setShowSaveForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    Salvar Produto
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('margem')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'margem'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Calculator className="h-4 w-4 inline mr-2" />
                  Calculadora de Margem
                </button>
                <button
                  onClick={() => setActiveTab('produto')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'produto'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Package className="h-4 w-4 inline mr-2" />
                  Calculadora de Produto
                </button>
              </nav>
            </div>
          </div>

          {activeTab === 'margem' && <MarginCalculator />}

          {activeTab === 'produto' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Configuração */}
            <div className="xl:col-span-2 space-y-6">
              {/* Configurações do Produto */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Configurações do Produto</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamanho
                    </label>
                    <select
                      value={calculadoraData.tamanho}
                      onChange={(e) => setCalculadoraData({...calculadoraData, tamanho: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="180ml">180ml</option>
                      <option value="300ml">300ml</option>
                      <option value="400ml">400ml</option>
                      <option value="500ml">500ml</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Açaí
                    </label>
                    <select
                      value={calculadoraData.tipoAcai}
                      onChange={(e) => setCalculadoraData({...calculadoraData, tipoAcai: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="tradicional">Tradicional</option>
                      <option value="zero">Zero</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={calculadoraData.categoria}
                      onChange={(e) => setCalculadoraData({...calculadoraData, categoria: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="100%_puro">100% Puro</option>
                      <option value="com_adicional">Com Adicional</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Embalagens */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Embalagens
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {embalagemDisponiveis.map((embalagem) => (
                    <div
                      key={embalagem.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        calculadoraData.embalagens.includes(embalagem.id)
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                      }`}
                      onClick={() => toggleEmbalagem(embalagem.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{embalagem.nome}</p>
                          <p className="text-purple-600 font-bold">
                            R$ {embalagem.precoUnitario.toFixed(2)}
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 ${
                          calculadoraData.embalagens.includes(embalagem.id)
                            ? 'bg-purple-500 border-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {calculadoraData.embalagens.includes(embalagem.id) && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insumos */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Cherry className="h-5 w-5 mr-2" />
                  Insumos
                </h2>

                {/* Insumos selecionados */}
                {calculadoraData.insumos.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <h3 className="font-medium text-gray-700">Insumos Selecionados:</h3>
                    {calculadoraData.insumos.map((produtoInsumo) => {
                      const insumo = insumos.find(i => i.id === produtoInsumo.insumoId)
                      if (!insumo) return null

                      const custoInsumo = produtoInsumo.quantidade * insumo.precoPorGrama

                      return (
                        <div key={produtoInsumo.insumoId} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                          {['acai', 'chocolate', 'mousse', 'sorvete'].includes(insumo.tipo) ? (
                            <Cherry className="h-6 w-6 text-purple-600" />
                          ) : (
                            <Sparkles className="h-6 w-6 text-yellow-600" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{insumo.nome}</p>
                            <p className="text-sm text-gray-500">
                              R$ {insumo.precoPorGrama.toFixed(4)}/g
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                value={produtoInsumo.quantidade}
                                onChange={(e) => updateInsumoQuantidade(
                                  produtoInsumo.insumoId, 
                                  parseFloat(e.target.value) || 0
                                )}
                                className="w-24 px-3 py-2 border border-gray-300 rounded text-center"
                                placeholder="0"
                              />
                              <span className="text-sm font-medium">gramas</span>
                            </div>
                            <div className="text-right min-w-[80px]">
                              <p className="text-lg font-bold text-green-600">
                                R$ {custoInsumo.toFixed(2)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeInsumo(produtoInsumo.insumoId)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Adicionar insumos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adicionar Base Principal
                    </label>
                    <select
                      onChange={(e) => e.target.value && addInsumo(e.target.value)}
                      value=""
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione uma base...</option>
                      {insumosDisponiveis
                        .filter(i => ['acai', 'chocolate', 'mousse', 'sorvete'].includes(i.tipo) && !calculadoraData.insumos.find(fi => fi.insumoId === i.id))
                        .map(insumo => (
                          <option key={insumo.id} value={insumo.id}>
                            {insumo.nome} - R$ {insumo.precoPorGrama.toFixed(4)}/g
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adicionar Complemento
                    </label>
                    <select
                      onChange={(e) => e.target.value && addInsumo(e.target.value)}
                      value=""
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione um complemento...</option>
                      {insumosDisponiveis
                        .filter(i => ['complemento', 'cobertura', 'creme_premium', 'fruta'].includes(i.tipo) && !calculadoraData.insumos.find(fi => fi.insumoId === i.id))
                        .map(insumo => (
                          <option key={insumo.id} value={insumo.id}>
                            {insumo.nome} - R$ {insumo.precoPorGrama.toFixed(4)}/g
                          </option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              </div>

              {/* Margem */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Margem de Lucro</h2>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={calculadoraData.margem}
                    onChange={(e) => setCalculadoraData({...calculadoraData, margem: parseFloat(e.target.value)})}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={calculadoraData.margem}
                      onChange={(e) => setCalculadoraData({...calculadoraData, margem: parseFloat(e.target.value) || 0})}
                      className="w-20 px-3 py-2 border border-gray-300 rounded text-center"
                    />
                    <span className="font-medium">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultado */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Resultado da Precificação
                </h2>

                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Custo Embalagens:</span>
                      <span className="font-medium">R$ {resultado.custoEmbalagens.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Custo Insumos:</span>
                      <span className="font-medium">R$ {resultado.custoInsumos.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Custo Total:</span>
                      <span>R$ {resultado.custoTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Margem de Lucro:</span>
                      <span className="font-medium">{resultado.margem}%</span>
                    </div>
                  </div>

                  <div className="bg-green-100 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Lucro:</span>
                      <span className="font-medium text-green-700">R$ {resultado.lucro.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-purple-100 p-6 rounded-lg border-2 border-purple-300">
                    <div className="flex justify-between text-2xl font-bold text-purple-700">
                      <span>Preço Final:</span>
                      <span>R$ {resultado.precoVenda.toFixed(2)}</span>
                    </div>
                  </div>

                  {resultado.custoTotal > 0 && (
                    <div className="text-center text-sm text-gray-600 mt-4">
                      <p>Rentabilidade: {((resultado.lucro / resultado.precoVenda) * 100).toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            </div>
          )}

        </main>
      </div>
    </div>
  )
}