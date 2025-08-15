'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { CopoPadrao } from '@/types'
import Navigation from '@/components/Navigation'
import { 
  Plus,
  Search,
  Edit2,
  Trash2,
  Coffee,
  TrendingUp,
  DollarSign,
  Percent,
  Filter,
  Package,
  Cherry,
  Calculator,
  Sparkles
} from 'lucide-react'

export default function CoposPage() {
  const { 
    coposPadrao, 
    embalagens,
    addCopoPadrao, 
    updateCopoPadrao, 
    deleteCopoPadrao,
    calcularCustoCopo,
    criarCoposPadrao
  } = useApp()

  const [searchTerm, setSearchTerm] = useState('')
  const [tamanhoFilter, setTamanhoFilter] = useState<'all' | '180ml' | '300ml' | '400ml' | '500ml'>('all')
  const [tipoFilter, setTipoFilter] = useState<'all' | 'tradicional' | 'zero' | 'cupuacu'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingCopo, setEditingCopo] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    tamanho: '400ml' as const,
    porcaoGramas: 300,
    precoBase: 0,
    tipoAcai: 'tradicional' as const,
    categoria: '100%_puro' as const,
    embalagens: [] as string[],
    precoVenda: 0,
    margem: 80,
    ativo: true
  })

  // Estatísticas
  const totalCopos = coposPadrao.length
  const coposAtivos = coposPadrao.filter(c => c.ativo).length
  const margemMedia = coposPadrao.length > 0 
    ? coposPadrao.reduce((acc, c) => acc + c.margem, 0) / coposPadrao.length 
    : 0
  const receitaEstimada = coposPadrao.filter(c => c.ativo).reduce((acc, c) => acc + c.precoVenda, 0)

  // Filtros
  const filteredCopos = useMemo(() => {
    return coposPadrao.filter(copo => {
      const matchesSearch = copo.tamanho.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          copo.tipoAcai.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTamanho = tamanhoFilter === 'all' || copo.tamanho === tamanhoFilter
      const matchesTipo = tipoFilter === 'all' || copo.tipoAcai === tipoFilter
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && copo.ativo) ||
                           (statusFilter === 'inactive' && !copo.ativo)
      
      return matchesSearch && matchesTamanho && matchesTipo && matchesStatus
    })
  }, [coposPadrao, searchTerm, tamanhoFilter, tipoFilter, statusFilter])

  // Mapear tamanho para porção
  const tamanhoToPorcao = {
    '180ml': 180,
    '300ml': 230, 
    '400ml': 300,
    '500ml': 400
  }

  const openModal = (copo?: CopoPadrao) => {
    if (copo) {
      setEditingCopo(copo.id)
      setFormData({
        tamanho: copo.tamanho,
        porcaoGramas: copo.porcaoGramas,
        precoBase: copo.precoBase,
        tipoAcai: copo.tipoAcai,
        categoria: copo.categoria,
        embalagens: copo.embalagens,
        precoVenda: copo.precoVenda,
        margem: copo.margem,
        ativo: copo.ativo
      })
    } else {
      setEditingCopo(null)
      setFormData({
        tamanho: '400ml',
        porcaoGramas: 300,
        precoBase: 0,
        tipoAcai: 'tradicional',
        categoria: '100%_puro',
        embalagens: [],
        precoVenda: 0,
        margem: 80,
        ativo: true
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCopo(null)
  }

  const handleTamanhoChange = (novoTamanho: string) => {
    const porcao = tamanhoToPorcao[novoTamanho as keyof typeof tamanhoToPorcao]
    setFormData(prev => ({
      ...prev,
      tamanho: novoTamanho as '180ml' | '300ml' | '400ml' | '500ml',
      porcaoGramas: porcao
    }))
  }

  const calcularPreview = () => {
    const custos = calcularCustoCopo({
      embalagens: formData.embalagens,
      tipoAcai: formData.tipoAcai,
      porcaoGramas: formData.porcaoGramas
    })
    
    const precoVenda = formData.margem > 0 
      ? custos.custoTotal * (1 + formData.margem / 100)
      : formData.precoVenda

    return {
      ...custos,
      precoVenda,
      lucro: precoVenda - custos.custoTotal
    }
  }

  const preview = calcularPreview()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const custos = calcularCustoCopo({
      embalagens: formData.embalagens,
      tipoAcai: formData.tipoAcai,
      porcaoGramas: formData.porcaoGramas
    })
    
    const precoVenda = formData.margem > 0 
      ? custos.custoTotal * (1 + formData.margem / 100)
      : formData.precoVenda
    
    const copoData = {
      ...formData,
      precoVenda
    }
    
    if (editingCopo) {
      updateCopoPadrao(editingCopo, copoData)
    } else {
      addCopoPadrao(copoData)
    }
    
    closeModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este copo?')) {
      deleteCopoPadrao(id)
    }
  }


  const getTipoAcaiColor = (tipo: string) => {
    switch (tipo) {
      case 'tradicional': return 'bg-purple-100 text-purple-800'
      case 'zero': return 'bg-blue-100 text-blue-800'
      case 'cupuacu': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Copos Padronizados</h1>
              <p className="text-gray-600 mt-2">Gerencie seus copos de açaí com tamanhos e porções padronizadas</p>
            </div>
            <div className="flex items-center gap-3">
              {coposPadrao.length === 0 && (
                <button
                  onClick={criarCoposPadrao}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Criar Copos Padrão
                </button>
              )}
              <button
                onClick={() => openModal()}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Novo Copo
              </button>
            </div>
          </div>

          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Coffee className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Copos</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalCopos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Copos Ativos</p>
                  <p className="text-2xl font-semibold text-gray-900">{coposAtivos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <Percent className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Margem Média</p>
                  <p className="text-2xl font-semibold text-gray-900">{margemMedia.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Receita Estimada</p>
                  <p className="text-2xl font-semibold text-gray-900">R$ {receitaEstimada.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar copos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={tamanhoFilter}
                    onChange={(e) => setTamanhoFilter(e.target.value as 'all' | '180ml' | '300ml' | '400ml' | '500ml')}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">Todos os Tamanhos</option>
                    <option value="180ml">180ml</option>
                    <option value="300ml">300ml</option>
                    <option value="400ml">400ml</option>
                    <option value="500ml">500ml</option>
                  </select>
                </div>
                <select
                  value={tipoFilter}
                  onChange={(e) => setTipoFilter(e.target.value as 'all' | 'tradicional' | 'zero' | 'cupuacu')}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="tradicional">Tradicional</option>
                  <option value="zero">Zero</option>
                  <option value="cupuacu">Cupuaçu</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Copos */}
          {filteredCopos.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Coffee className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-semibold text-gray-900">
                {coposPadrao.length === 0 ? 'Nenhum copo cadastrado' : 'Nenhum copo encontrado'}
              </h3>
              <p className="mt-1 text-gray-500">
                {coposPadrao.length === 0 
                  ? 'Comece criando copos padrão ou cadastre um copo personalizado.'
                  : 'Tente ajustar os filtros de busca.'
                }
              </p>
              {coposPadrao.length === 0 && (
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={criarCoposPadrao}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Criar Copos Padrão
                  </button>
                  <button
                    onClick={() => openModal()}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Criar Copo Personalizado
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCopos.map((copo) => (
                <div key={copo.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-purple-100">
                          <Coffee className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold text-gray-900 text-lg">{copo.tamanho}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipoAcaiColor(copo.tipoAcai)}`}>
                              {copo.tipoAcai}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">{copo.porcaoGramas}g</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(copo)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(copo.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Breakdown de Custos */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <Cherry className="h-4 w-4 mr-1" />
                          Açaí:
                        </span>
                        <span className="font-medium">R$ {copo.custoAcai.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <Package className="h-4 w-4 mr-1" />
                          Embalagem:
                        </span>
                        <span className="font-medium">R$ {copo.custoEmbalagem.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold border-t pt-2">
                        <span className="text-gray-900">Custo Total:</span>
                        <span className="text-gray-900">R$ {copo.custoTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Preço e Margem */}
                    <div className="bg-purple-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Preço de Venda:</span>
                        <span className="text-xl font-bold text-purple-600">R$ {copo.precoVenda.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Margem:</span>
                        <span className="text-sm font-semibold text-green-600">{copo.margem.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Lucro:</span>
                        <span className="text-sm font-semibold text-green-600">
                          R$ {(copo.precoVenda - copo.custoTotal).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Status e Embalagens */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        copo.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {copo.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {copo.embalagens.length} embalagem{copo.embalagens.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal de Copo */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl bg-white shadow-lg rounded-lg">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCopo ? 'Editar Copo' : 'Novo Copo'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tamanho *
                  </label>
                  <select
                    required
                    value={formData.tamanho}
                    onChange={(e) => handleTamanhoChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="180ml">180ml (180g)</option>
                    <option value="300ml">300ml (230g)</option>
                    <option value="400ml">400ml (300g)</option>
                    <option value="500ml">500ml (400g)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Porção (g)
                  </label>
                  <input
                    type="number"
                    value={formData.porcaoGramas}
                    onChange={(e) => setFormData({ ...formData, porcaoGramas: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Açaí *
                  </label>
                  <select
                    required
                    value={formData.tipoAcai}
                    onChange={(e) => setFormData({ ...formData, tipoAcai: e.target.value as 'tradicional' | 'zero' | 'cupuacu' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="tradicional">Tradicional</option>
                    <option value="zero">Zero</option>
                    <option value="cupuacu">Cupuaçu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value as '100%_puro' | 'com_adicional' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="100%_puro">100% Puro</option>
                    <option value="com_adicional">Com Adicional</option>
                  </select>
                </div>
              </div>

              {/* Seleção de Embalagens */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Embalagens Necessárias
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {embalagens.filter(e => e.ativa).map((embalagem) => (
                    <label key={embalagem.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.embalagens.includes(embalagem.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              embalagens: [...prev.embalagens, embalagem.id]
                            }))
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              embalagens: prev.embalagens.filter(id => id !== embalagem.id)
                            }))
                          }
                        }}
                        className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{embalagem.nome}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margem (%) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="50"
                  required
                  value={formData.margem}
                  onChange={(e) => setFormData({ ...formData, margem: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
                  Copo ativo
                </label>
              </div>

              {/* Preview de Custos */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Calculator className="h-4 w-4 mr-2" />
                  Preview de Custos
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Custo Açaí:</span>
                    <span className="ml-2 font-medium">R$ {preview.custoAcai.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Custo Embalagem:</span>
                    <span className="ml-2 font-medium">R$ {preview.custoEmbalagem.toFixed(2)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Custo Total:</span>
                    <span className="ml-2 font-bold text-lg text-purple-600">R$ {preview.custoTotal.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Preço Venda:</span>
                    <span className="ml-2 font-bold text-green-600">R$ {preview.precoVenda.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Lucro:</span>
                    <span className="ml-2 font-bold text-green-600">R$ {preview.lucro.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingCopo ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}