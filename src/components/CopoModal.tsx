'use client'

import React, { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Copo, CopoInsumo, CopoEmbalagem } from '@/types'
import { 
  X, 
  Plus, 
  Search,
  Trash2,
  Calculator,
  Coffee,
  Package,
  ChefHat,
  Users,
  AlertCircle,
  Minus
} from 'lucide-react'

interface CopoModalProps {
  isOpen: boolean
  onClose: () => void
  editingCopo?: Copo | null
}

export default function CopoModal({ isOpen, onClose, editingCopo }: CopoModalProps) {
  const { 
    categoriasCopo,
    insumos,
    embalagens,
    fornecedores,
    addCopo,
    updateCopo,
    addCategoriaCopo,
    calcularCustoDetalheCopo,
    getInsumoPrecoAtivo
  } = useApp()

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoriaId: '',
    insumos: [] as CopoInsumo[],
    embalagens: [] as CopoEmbalagem[],
    observacoes: '',
    ativo: true
  })

  const [insumoSearch, setInsumoSearch] = useState('')
  const [embalagemSearch, setEmbalagemSearch] = useState('')
  const [showQuickCategory, setShowQuickCategory] = useState(false)
  const [quickCategoryName, setQuickCategoryName] = useState('')

  // Inicializar dados quando modal abrir/fechar
  React.useEffect(() => {
    if (isOpen) {
      if (editingCopo) {
        setFormData({
          nome: editingCopo.nome,
          descricao: editingCopo.descricao || '',
          categoriaId: editingCopo.categoriaId || '',
          insumos: editingCopo.insumos,
          embalagens: editingCopo.embalagens,
          observacoes: editingCopo.observacoes || '',
          ativo: editingCopo.ativo
        })
      } else {
        setFormData({
          nome: '',
          descricao: '',
          categoriaId: '',
          insumos: [],
          embalagens: [],
          observacoes: '',
          ativo: true
        })
      }
    }
  }, [isOpen, editingCopo])

  // Filtrar insumos ativos para busca
  const filteredInsumos = useMemo(() => {
    if (!isOpen) return []
    return insumos
      .filter(insumo => 
        insumo.ativo && 
        insumo.nome.toLowerCase().includes(insumoSearch.toLowerCase()) &&
        !formData.insumos.some(ci => ci.insumoId === insumo.id)
      )
      .slice(0, 5) // Limitar a 5 resultados
  }, [isOpen, insumos, insumoSearch, formData.insumos])

  // Filtrar embalagens ativas para busca
  const filteredEmbalagens = useMemo(() => {
    if (!isOpen) return []
    return embalagens
      .filter(embalagem => 
        embalagem.ativa && 
        embalagem.nome.toLowerCase().includes(embalagemSearch.toLowerCase()) &&
        !formData.embalagens.some(ce => ce.embalagemId === embalagem.id)
      )
      .slice(0, 5) // Limitar a 5 resultados
  }, [isOpen, embalagens, embalagemSearch, formData.embalagens])

  // Calcular custos em tempo real
  const custoPreview = useMemo(() => {
    if (!isOpen) return { custoInsumos: 0, custoEmbalagens: 0, custoTotal: 0, insumos: [], embalagens: [], fornecedoresEnvolvidos: [] }
    return calcularCustoDetalheCopo(formData)
  }, [isOpen, formData, calcularCustoDetalheCopo])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCopo) {
      updateCopo(editingCopo.id, formData)
    } else {
      addCopo(formData)
    }
    
    onClose()
  }

  const addInsumo = (insumoId: string) => {
    setFormData(prev => ({
      ...prev,
      insumos: [...prev.insumos, { insumoId, quantidade: 100 }] // 100g padrão
    }))
    setInsumoSearch('')
  }

  const updateInsumoQuantidade = (insumoId: string, quantidade: number) => {
    setFormData(prev => ({
      ...prev,
      insumos: prev.insumos.map(insumo =>
        insumo.insumoId === insumoId ? { ...insumo, quantidade } : insumo
      )
    }))
  }

  const removeInsumo = (insumoId: string) => {
    setFormData(prev => ({
      ...prev,
      insumos: prev.insumos.filter(insumo => insumo.insumoId !== insumoId)
    }))
  }

  const addEmbalagem = (embalagemId: string) => {
    setFormData(prev => ({
      ...prev,
      embalagens: [...prev.embalagens, { embalagemId, quantidade: 1 }] // 1 unidade padrão
    }))
    setEmbalagemSearch('')
  }

  const updateEmbalagemQuantidade = (embalagemId: string, quantidade: number) => {
    setFormData(prev => ({
      ...prev,
      embalagens: prev.embalagens.map(embalagem =>
        embalagem.embalagemId === embalagemId ? { ...embalagem, quantidade } : embalagem
      )
    }))
  }

  const removeEmbalagem = (embalagemId: string) => {
    setFormData(prev => ({
      ...prev,
      embalagens: prev.embalagens.filter(embalagem => embalagem.embalagemId !== embalagemId)
    }))
  }

  const handleQuickCategory = () => {
    if (quickCategoryName.trim()) {
      addCategoriaCopo({ nome: quickCategoryName.trim() })
      setQuickCategoryName('')
      setShowQuickCategory(false)
    }
  }

  const getInsumoInfo = (insumoId: string) => {
    const insumo = insumos.find(i => i.id === insumoId)
    const precoAtivo = getInsumoPrecoAtivo(insumoId)
    const fornecedor = precoAtivo ? fornecedores.find(f => f.id === precoAtivo.fornecedorId) : null
    return { insumo, precoAtivo, fornecedor }
  }

  const getEmbalagemInfo = (embalagemId: string) => {
    const embalagem = embalagens.find(e => e.id === embalagemId)
    const fornecedor = embalagem?.fornecedorId ? fornecedores.find(f => f.id === embalagem.fornecedorId) : null
    return { embalagem, fornecedor }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl bg-white shadow-lg rounded-lg max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCopo ? 'Editar Copo' : 'Novo Copo'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {editingCopo ? 'Modifique os dados do copo' : 'Crie um novo copo personalizando insumos e embalagens'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Coffee className="h-4 w-4 mr-2" />
              Informações Básicas
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Copo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Açaí 300ml Tradicional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.categoriaId}
                    onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Sem categoria</option>
                    {categoriasCopo.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowQuickCategory(true)}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                {showQuickCategory && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={quickCategoryName}
                      onChange={(e) => setQuickCategoryName(e.target.value)}
                      placeholder="Nome da nova categoria"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleQuickCategory}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Criar
                    </button>
                    <button
                      type="button"
                      onClick={() => {setShowQuickCategory(false); setQuickCategoryName('')}}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (opcional)
              </label>
              <input
                type="text"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Descrição breve do copo..."
              />
            </div>
          </div>

          {/* Seção de Insumos */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <ChefHat className="h-4 w-4 mr-2" />
              Insumos
            </h4>

            {/* Busca de Insumos */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adicionar Insumo
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={insumoSearch}
                  onChange={(e) => setInsumoSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Buscar insumos..."
                />
              </div>
              
              {insumoSearch && filteredInsumos.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm max-h-32 overflow-y-auto">
                  {filteredInsumos.map((insumo) => {
                    const precoAtivo = getInsumoPrecoAtivo(insumo.id)
                    const fornecedor = precoAtivo ? fornecedores.find(f => f.id === precoAtivo.fornecedorId) : null
                    
                    return (
                      <button
                        key={insumo.id}
                        type="button"
                        onClick={() => addInsumo(insumo.id)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">{insumo.nome}</div>
                            {fornecedor && (
                              <div className="text-xs text-gray-500">Fornecedor: {fornecedor.nome}</div>
                            )}
                          </div>
                          {precoAtivo && (
                            <div className="text-sm text-gray-600">
                              R$ {precoAtivo.precoComDesconto.toFixed(4)}/{precoAtivo.unidade}
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Lista de Insumos Adicionados */}
            {formData.insumos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>Nenhum insumo adicionado</p>
                <p className="text-sm">Use a busca acima para adicionar insumos</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.insumos.map((copoInsumo) => {
                  const { insumo, precoAtivo, fornecedor } = getInsumoInfo(copoInsumo.insumoId)
                  const custoPorGrama = precoAtivo ? precoAtivo.precoComDesconto / (precoAtivo.unidade === 'kg' ? 1000 : 1) : 0
                  const subtotal = copoInsumo.quantidade * custoPorGrama

                  return (
                    <div key={copoInsumo.insumoId} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{insumo?.nome}</div>
                          {fornecedor && (
                            <div className="text-sm text-gray-600">Fornecedor: {fornecedor.nome}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={copoInsumo.quantidade}
                              onChange={(e) => updateInsumoQuantidade(copoInsumo.insumoId, parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <span className="text-sm text-gray-600">g</span>
                          </div>
                          <div className="text-sm font-medium text-purple-600 min-w-[60px] text-right">
                            R$ {subtotal.toFixed(2)}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeInsumo(copoInsumo.insumoId)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div className="bg-blue-100 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-900">Subtotal Insumos:</span>
                    <span className="font-bold text-blue-900">R$ {custoPreview.custoInsumos.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Seção de Embalagens */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Embalagens
            </h4>

            {/* Busca de Embalagens */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adicionar Embalagem
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={embalagemSearch}
                  onChange={(e) => setEmbalagemSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Buscar embalagens..."
                />
              </div>
              
              {embalagemSearch && filteredEmbalagens.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm max-h-32 overflow-y-auto">
                  {filteredEmbalagens.map((embalagem) => {
                    const fornecedor = embalagem.fornecedorId ? fornecedores.find(f => f.id === embalagem.fornecedorId) : null
                    
                    return (
                      <button
                        key={embalagem.id}
                        type="button"
                        onClick={() => addEmbalagem(embalagem.id)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">{embalagem.nome}</div>
                            {fornecedor && (
                              <div className="text-xs text-gray-500">Fornecedor: {fornecedor.nome}</div>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            R$ {embalagem.precoUnitarioCalculado.toFixed(2)}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Lista de Embalagens Adicionadas */}
            {formData.embalagens.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>Nenhuma embalagem adicionada</p>
                <p className="text-sm">Use a busca acima para adicionar embalagens</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.embalagens.map((copoEmbalagem) => {
                  const { embalagem, fornecedor } = getEmbalagemInfo(copoEmbalagem.embalagemId)
                  const subtotal = copoEmbalagem.quantidade * (embalagem?.precoUnitarioCalculado || 0)

                  return (
                    <div key={copoEmbalagem.embalagemId} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{embalagem?.nome}</div>
                          {fornecedor && (
                            <div className="text-sm text-gray-600">Fornecedor: {fornecedor.nome}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={copoEmbalagem.quantidade}
                              onChange={(e) => updateEmbalagemQuantidade(copoEmbalagem.embalagemId, parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <span className="text-sm text-gray-600">un</span>
                          </div>
                          <div className="text-sm font-medium text-green-600 min-w-[60px] text-right">
                            R$ {subtotal.toFixed(2)}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeEmbalagem(copoEmbalagem.embalagemId)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div className="bg-green-100 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-900">Subtotal Embalagens:</span>
                    <span className="font-bold text-green-900">R$ {custoPreview.custoEmbalagens.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview de Custos */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Calculator className="h-4 w-4 mr-2" />
              Preview de Custos
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-600">Custo Insumos:</span>
                <span className="ml-2 font-medium">R$ {custoPreview.custoInsumos.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-600">Custo Embalagens:</span>
                <span className="ml-2 font-medium">R$ {custoPreview.custoEmbalagens.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-purple-900">Custo Total:</span>
                <span className="font-bold text-xl text-purple-900">R$ {custoPreview.custoTotal.toFixed(2)}</span>
              </div>
            </div>
            
            {custoPreview.fornecedoresEnvolvidos.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                <div className="flex items-center mb-2">
                  <Users className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Fornecedores Envolvidos:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {custoPreview.fornecedoresEnvolvidos.map((fornecedor, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-white text-xs font-medium text-gray-700 rounded border"
                    >
                      {fornecedor.nome} ({fornecedor.itens.length} item{fornecedor.itens.length !== 1 ? 's' : ''})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Observações e Status */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações (opcional)
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Anotações sobre este copo..."
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
          </div>

          {/* Validação */}
          {(formData.insumos.length === 0 || formData.embalagens.length === 0) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <div className="text-sm text-yellow-800">
                  <strong>Atenção:</strong> É recomendado adicionar pelo menos 1 insumo e 1 embalagem para criar um copo completo.
                </div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formData.insumos.length === 0 && formData.embalagens.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {editingCopo ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}