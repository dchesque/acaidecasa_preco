'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import { Plus, Edit, Trash2, ShoppingBag, Package, Cherry, Sparkles, Calculator } from 'lucide-react'
import { Produto, ProdutoInsumo } from '@/types'

export default function ProdutosPage() {
  const { produtos, embalagens, insumos, addProduto, updateProduto, deleteProduto, calcularCustoProduto } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    embalagens: [] as string[],
    insumos: [] as ProdutoInsumo[],
    margem: 80,
    ativo: true
  })

  const embalagemDisponiveis = embalagens.filter(e => e.ativa)
  const insumosDisponiveis = insumos.filter(i => i.ativo)

  const calcularPreview = () => {
    if (formData.embalagens.length === 0 && formData.insumos.length === 0) {
      return {
        custoEmbalagens: 0,
        custoInsumos: 0,
        custoTotal: 0,
        precoVenda: 0,
        margem: formData.margem,
        lucro: 0
      }
    }

    const custoEmbalagens = formData.embalagens.reduce((total, embalagemId) => {
      const embalagem = embalagens.find(e => e.id === embalagemId)
      return total + (embalagem?.precoUnitario || 0)
    }, 0)

    const custoInsumos = formData.insumos.reduce((total, produtoInsumo) => {
      const insumo = insumos.find(i => i.id === produtoInsumo.insumoId)
      if (insumo) {
        return total + (produtoInsumo.quantidade * insumo.precoPorGrama)
      }
      return total
    }, 0)

    const custoTotal = custoEmbalagens + custoInsumos
    const precoVenda = custoTotal * (1 + formData.margem / 100)
    const lucro = precoVenda - custoTotal

    return {
      custoEmbalagens,
      custoInsumos,
      custoTotal,
      precoVenda,
      margem: formData.margem,
      lucro
    }
  }

  const preview = calcularPreview()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const produtoData = {
      nome: formData.nome,
      descricao: formData.descricao,
      embalagens: formData.embalagens,
      insumos: formData.insumos,
      precoVenda: preview.precoVenda,
      margem: formData.margem,
      ativo: formData.ativo
    }

    if (editingProduto) {
      updateProduto(editingProduto.id, produtoData)
    } else {
      addProduto(produtoData)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      embalagens: [],
      insumos: [],
      margem: 80,
      ativo: true
    })
    setShowForm(false)
    setEditingProduto(null)
  }

  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto)
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      embalagens: produto.embalagens,
      insumos: produto.insumos,
      margem: produto.margem,
      ativo: produto.ativo
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduto(id)
    }
  }

  const toggleEmbalagem = (embalagemId: string) => {
    const newEmbalagens = formData.embalagens.includes(embalagemId)
      ? formData.embalagens.filter(id => id !== embalagemId)
      : [...formData.embalagens, embalagemId]
    
    setFormData({...formData, embalagens: newEmbalagens})
  }

  const addInsumo = (insumoId: string) => {
    const existingIndex = formData.insumos.findIndex(i => i.insumoId === insumoId)
    if (existingIndex === -1) {
      setFormData({
        ...formData,
        insumos: [...formData.insumos, { insumoId, quantidade: 0 }]
      })
    }
  }

  const updateInsumoQuantidade = (insumoId: string, quantidade: number) => {
    const newInsumos = formData.insumos.map(i => 
      i.insumoId === insumoId ? { ...i, quantidade } : i
    )
    setFormData({...formData, insumos: newInsumos})
  }

  const removeInsumo = (insumoId: string) => {
    const newInsumos = formData.insumos.filter(i => i.insumoId !== insumoId)
    setFormData({...formData, insumos: newInsumos})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
              <p className="text-gray-600 mt-2">Gerencie seus produtos com cálculo automático de preços</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Novo Produto
            </button>
          </div>

          {/* Formulário */}
          {showForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6">
                {editingProduto ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Produto
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ex: Copo 400ml Açaí com Chocolate"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Margem de Lucro (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.margem}
                      onChange={(e) => setFormData({...formData, margem: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="80"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Descrição do produto..."
                  />
                </div>

                {/* Seleção de Embalagens */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Embalagens
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {embalagemDisponiveis.map((embalagem) => (
                      <div
                        key={embalagem.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          formData.embalagens.includes(embalagem.id)
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => toggleEmbalagem(embalagem.id)}
                      >
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-500 mr-2" />
                          <div>
                            <p className="font-medium text-sm">{embalagem.nome}</p>
                            <p className="text-purple-600 font-bold text-sm">
                              R$ {embalagem.precoUnitario.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seleção de Insumos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Insumos
                  </label>
                  
                  {/* Insumos selecionados */}
                  {formData.insumos.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {formData.insumos.map((produtoInsumo) => {
                        const insumo = insumos.find(i => i.id === produtoInsumo.insumoId)
                        if (!insumo) return null

                        return (
                          <div key={produtoInsumo.insumoId} className="flex items-center gap-3 p-3 border rounded-lg">
                            {insumo.tipo === 'acai' ? (
                              <Cherry className="h-5 w-5 text-purple-600" />
                            ) : (
                              <Sparkles className="h-5 w-5 text-yellow-600" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{insumo.nome}</p>
                              <p className="text-xs text-gray-500">
                                R$ {insumo.precoPorGrama.toFixed(4)}/g
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                value={produtoInsumo.quantidade}
                                onChange={(e) => updateInsumoQuantidade(
                                  produtoInsumo.insumoId, 
                                  parseFloat(e.target.value) || 0
                                )}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="0"
                              />
                              <span className="text-sm text-gray-500">g</span>
                              <button
                                type="button"
                                onClick={() => removeInsumo(produtoInsumo.insumoId)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-green-600">
                                R$ {(produtoInsumo.quantidade * insumo.precoPorGrama).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Adicionar insumos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        Adicionar Açaí
                      </label>
                      <select
                        onChange={(e) => e.target.value && addInsumo(e.target.value)}
                        value=""
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Selecione um açaí...</option>
                        {insumosDisponiveis
                          .filter(i => i.tipo === 'acai' && !formData.insumos.find(fi => fi.insumoId === i.id))
                          .map(insumo => (
                            <option key={insumo.id} value={insumo.id}>
                              {insumo.nome} - R$ {insumo.precoPorGrama.toFixed(4)}/g
                            </option>
                          ))
                        }
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        Adicionar Complemento
                      </label>
                      <select
                        onChange={(e) => e.target.value && addInsumo(e.target.value)}
                        value=""
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Selecione um complemento...</option>
                        {insumosDisponiveis
                          .filter(i => i.tipo === 'complemento' && !formData.insumos.find(fi => fi.insumoId === i.id))
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

                {/* Preview do custo */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Preview do Produto
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Custo Embalagens:</span>
                        <span className="font-medium">R$ {preview.custoEmbalagens.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Custo Insumos:</span>
                        <span className="font-medium">R$ {preview.custoInsumos.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold border-t pt-2">
                        <span>Custo Total:</span>
                        <span>R$ {preview.custoTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Margem de Lucro:</span>
                        <span className="font-medium">{preview.margem}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Lucro:</span>
                        <span className="font-medium text-green-600">R$ {preview.lucro.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2 text-purple-600">
                        <span>Preço Final:</span>
                        <span>R$ {preview.precoVenda.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
                    Produto ativo
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
                  >
                    {editingProduto ? 'Atualizar' : 'Salvar'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de produtos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {produtos.map((produto) => {
              const custo = calcularCustoProduto(produto)
              return (
                <div
                  key={produto.id}
                  className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                    produto.ativo ? 'border-l-green-500' : 'border-l-gray-400'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${
                        produto.ativo ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <ShoppingBag className={`h-6 w-6 ${
                          produto.ativo ? 'text-purple-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {produto.nome}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {produto.descricao}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(produto)}
                        className="p-2 text-gray-400 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(produto.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Custo Embalagens:</span>
                      <span>R$ {custo.custoEmbalagens.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Custo Insumos:</span>
                      <span>R$ {custo.custoInsumos.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Custo Total:</span>
                      <span>R$ {custo.custoTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Margem:</span>
                      <span>{produto.margem}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Lucro:</span>
                      <span className="text-green-600 font-medium">R$ {custo.lucro.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-purple-600 border-t pt-2">
                      <span>Preço Final:</span>
                      <span>R$ {produto.precoVenda.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      produto.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {produtos.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto cadastrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando seu primeiro produto de açaí.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}