'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import InsumoModal from '@/components/InsumoModal'
import CategoriasInsumoModal from '@/components/CategoriasInsumoModal'
import PrecoFornecedorModal from '@/components/PrecoFornecedorModal'
import { Plus, Edit, Trash2, Package, Search, Filter, Eye, Layers, Grid3X3, Truck, Tag, DollarSign, AlertTriangle } from 'lucide-react'
import { Insumo } from '@/types'

export default function InsumosPage() {
  const { 
    insumos, 
    categoriasInsumo, 
    fornecedores,
    precosInsumoFornecedor,
    updateInsumo, 
    deleteInsumo,
    deleteCategoriaInsumo,
    getInsumoPrecoAtivo,
    calcularCustoPorGrama
  } = useApp()
  
  const [showModal, setShowModal] = useState(false)
  const [showCategoriasModal, setShowCategoriasModal] = useState(false)
  const [showPrecoModal, setShowPrecoModal] = useState(false)
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null)
  const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFornecedor, setSelectedFornecedor] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('todos')
  const [precoMin, setPrecoMin] = useState('')
  const [precoMax, setPrecoMax] = useState('')
  const [viewMode, setViewMode] = useState<'categorias' | 'lista'>('categorias')

  // Insumos filtrados
  const insumosFiltrados = useMemo(() => {
    return insumos.filter(insumo => {
      const matchSearch = insumo.nome.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchFornecedor = !selectedFornecedor || 
        precosInsumoFornecedor.some(p => p.insumoId === insumo.id && p.fornecedorId === selectedFornecedor && p.ativo)
      
      const matchCategoria = !selectedCategoria || insumo.categoriaId === selectedCategoria
      
      const matchStatus = selectedStatus === 'todos' || 
        (selectedStatus === 'ativo' && insumo.ativo) ||
        (selectedStatus === 'inativo' && !insumo.ativo)
      
      // Filtro por preço
      const custoPorGrama = calcularCustoPorGrama(insumo.id)
      const matchPrecoMin = !precoMin || custoPorGrama >= parseFloat(precoMin)
      const matchPrecoMax = !precoMax || custoPorGrama <= parseFloat(precoMax)
      
      return matchSearch && matchFornecedor && matchCategoria && matchStatus && matchPrecoMin && matchPrecoMax
    })
  }, [insumos, searchTerm, selectedFornecedor, selectedCategoria, selectedStatus, precoMin, precoMax, precosInsumoFornecedor, calcularCustoPorGrama])

  // Insumos agrupados por categoria
  const insumosPorCategoria = useMemo(() => {
    const grupos: { [key: string]: { categoria: { id: string; nome: string; cor: string } | null; insumos: Insumo[] } } = {}
    
    insumosFiltrados.forEach(insumo => {
      const categoriaId = insumo.categoriaId || 'sem-categoria'
      if (!grupos[categoriaId]) {
        const categoria = categoriaId === 'sem-categoria' 
          ? { id: 'sem-categoria', nome: 'Sem Categoria', cor: '#9CA3AF' }
          : categoriasInsumo.find(c => c.id === categoriaId)
        
        grupos[categoriaId] = {
          categoria,
          insumos: []
        }
      }
      grupos[categoriaId].insumos.push(insumo)
    })
    
    return Object.values(grupos).sort((a, b) => {
      if (a.categoria?.id === 'sem-categoria') return 1
      if (b.categoria?.id === 'sem-categoria') return -1
      return a.categoria?.nome.localeCompare(b.categoria?.nome) || 0
    })
  }, [insumosFiltrados, categoriasInsumo])

  // Fornecedores que têm insumos
  const fornecedoresComInsumos = useMemo(() => {
    const fornecedorIds = [...new Set(precosInsumoFornecedor.map(p => p.fornecedorId))]
    return fornecedores.filter(f => fornecedorIds.includes(f.id))
  }, [precosInsumoFornecedor, fornecedores])

  const handleEdit = (insumo: Insumo) => {
    setEditingInsumo(insumo)
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este insumo? Todos os preços associados também serão removidos.')) {
      deleteInsumo(id)
    }
  }

  const handleDeleteCategoria = (categoriaId: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria? Os insumos associados ficarão sem categoria.')) {
      try {
        deleteCategoriaInsumo(categoriaId)
      } catch (error: unknown) {
        alert(error instanceof Error ? error.message : 'Erro ao excluir categoria')
      }
    }
  }

  const toggleStatus = (insumo: Insumo) => {
    updateInsumo(insumo.id, { ativo: !insumo.ativo })
  }

  const viewDetails = (insumo: Insumo) => {
    setSelectedInsumo(insumo)
    setShowDetailModal(true)
  }

  const getFornecedorNome = (fornecedorId?: string) => {
    if (!fornecedorId) return null
    return fornecedores.find(f => f.id === fornecedorId)?.nome
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedFornecedor('')
    setSelectedCategoria('')
    setSelectedStatus('todos')
    setPrecoMin('')
    setPrecoMax('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Insumos</h1>
              <p className="text-gray-600 mt-2">
                Núcleo central de precificação com fornecedores e categorização
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCategoriasModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Tag className="h-5 w-5" />
                Categorias
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'categorias' ? 'lista' : 'categorias')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                {viewMode === 'categorias' ? <Grid3X3 className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
                {viewMode === 'categorias' ? 'Visualização Lista' : 'Por Categorias'}
              </button>
              <button
                onClick={() => {
                  setEditingInsumo(null)
                  setShowModal(true)
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Novo Insumo
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-900">Filtros</h3>
              {(searchTerm || selectedFornecedor || selectedCategoria || selectedStatus !== 'todos' || precoMin || precoMax) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  Limpar filtros
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <select
                value={selectedFornecedor}
                onChange={(e) => setSelectedFornecedor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todos os fornecedores</option>
                {fornecedoresComInsumos.map(fornecedor => (
                  <option key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nome}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todas as categorias</option>
                {categoriasInsumo.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="todos">Todos os status</option>
                <option value="ativo">Apenas ativos</option>
                <option value="inativo">Apenas inativos</option>
              </select>

              <input
                type="number"
                step="0.001"
                placeholder="Preço mín."
                value={precoMin}
                onChange={(e) => setPrecoMin(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="number"
                step="0.001"
                placeholder="Preço máx."
                value={precoMax}
                onChange={(e) => setPrecoMax(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Conteúdo Principal */}
          {viewMode === 'categorias' ? (
            /* Visualização por Categorias */
            <div className="space-y-8">
              {insumosPorCategoria.map(({ categoria, insumos }) => (
                <div key={categoria?.id} className="space-y-4">
                  {/* Header da Categoria */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: categoria?.cor }}
                      />
                      <h2 className="text-xl font-semibold text-gray-900">
                        {categoria?.nome}
                      </h2>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                        {insumos.length}
                      </span>
                    </div>
                    {categoria?.id !== 'sem-categoria' && (
                      <button
                        onClick={() => handleDeleteCategoria(categoria?.id)}
                        className="text-gray-400 hover:text-red-600 text-sm"
                      >
                        Excluir categoria
                      </button>
                    )}
                  </div>

                  {/* Lista de Insumos */}
                  <div className="space-y-3">
                    {insumos.map((insumo) => (
                      <InsumoListItem
                        key={insumo.id}
                        insumo={insumo}
                        categoria={categoria}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={toggleStatus}
                        onViewDetails={viewDetails}
                        onManagePrecos={(insumo) => {
                          setSelectedInsumo(insumo)
                          setShowPrecoModal(true)
                        }}
                        getFornecedorNome={getFornecedorNome}
                        getInsumoPrecoAtivo={getInsumoPrecoAtivo}
                        calcularCustoPorGrama={calcularCustoPorGrama}
                        precosInsumoFornecedor={precosInsumoFornecedor}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Visualização Lista */
            <div className="space-y-3">
              {insumosFiltrados.map((insumo) => {
                const categoria = insumo.categoriaId 
                  ? categoriasInsumo.find(c => c.id === insumo.categoriaId)
                  : { id: 'sem-categoria', nome: 'Sem Categoria', cor: '#9CA3AF' }
                
                return (
                  <InsumoListItem
                    key={insumo.id}
                    insumo={insumo}
                    categoria={categoria}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={toggleStatus}
                    onViewDetails={viewDetails}
                    onManagePrecos={(insumo) => {
                      setSelectedInsumo(insumo)
                      setShowPrecoModal(true)
                    }}
                    getFornecedorNome={getFornecedorNome}
                    getInsumoPrecoAtivo={getInsumoPrecoAtivo}
                    calcularCustoPorGrama={calcularCustoPorGrama}
                    precosInsumoFornecedor={precosInsumoFornecedor}
                  />
                )
              })}
            </div>
          )}

          {/* Estado Vazio */}
          {insumosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {insumos.length === 0 ? 'Nenhum insumo cadastrado' : 'Nenhum insumo encontrado'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {insumos.length === 0 
                  ? 'Comece criando seu primeiro insumo.'
                  : 'Tente ajustar os filtros ou criar um novo insumo.'
                }
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <InsumoModal 
        isOpen={showModal} 
        onClose={() => {
          setShowModal(false)
          setEditingInsumo(null)
        }}
        editingInsumo={editingInsumo}
      />

      <CategoriasInsumoModal 
        isOpen={showCategoriasModal}
        onClose={() => setShowCategoriasModal(false)}
      />

      <PrecoFornecedorModal 
        isOpen={showPrecoModal}
        onClose={() => {
          setShowPrecoModal(false)
          setSelectedInsumo(null)
        }}
        insumo={selectedInsumo}
      />
    </div>
  )
}

// Componente do Item de Insumo em Lista
interface InsumoListItemProps {
  insumo: Insumo
  categoria?: { id: string; nome: string; cor: string } | null
  onEdit: (insumo: Insumo) => void
  onDelete: (id: string) => void
  onToggleStatus: (insumo: Insumo) => void
  onViewDetails: (insumo: Insumo) => void
  onManagePrecos: (insumo: Insumo) => void
  getFornecedorNome: (fornecedorId?: string) => string | null
  getInsumoPrecoAtivo: (insumoId: string) => { fornecedorId: string; percentualDesconto: number } | null
  calcularCustoPorGrama: (insumoId: string) => number
  precosInsumoFornecedor: { insumoId: string; fornecedorId: string; ativo: boolean }[]
}

function InsumoListItem({ 
  insumo, 
  categoria, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onViewDetails, 
  onManagePrecos,
  getFornecedorNome,
  getInsumoPrecoAtivo,
  calcularCustoPorGrama,
  precosInsumoFornecedor
}: InsumoListItemProps) {
  const precoAtivo = getInsumoPrecoAtivo(insumo.id)
  const custoPorGrama = calcularCustoPorGrama(insumo.id)
  const fornecedorNome = precoAtivo ? getFornecedorNome(precoAtivo.fornecedorId) : null
  const temMultiplosFornecedores = precosInsumoFornecedor.filter(p => p.insumoId === insumo.id && p.ativo).length > 1
  const temDesconto = precoAtivo && precoAtivo.precoBruto > precoAtivo.precoComDesconto

  return (
    <div
      className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 border-l-4`}
      style={{ borderLeftColor: categoria?.cor || '#9CA3AF' }}
    >
      <div className="flex items-center gap-4">
        {/* Imagem */}
        {insumo.imagemUrl ? (
          <img
            src={insumo.imagemUrl}
            alt={insumo.nome}
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
            insumo.ativo ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <Package className={`h-8 w-8 ${
              insumo.ativo ? 'text-green-600' : 'text-gray-400'
            }`} />
          </div>
        )}
        
        {/* Informações principais */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {insumo.nome}
              </h3>
              {fornecedorNome && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Truck className="h-3 w-3" />
                  <span>{fornecedorNome}</span>
                  {temMultiplosFornecedores && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      +{precosInsumoFornecedor.filter(p => p.insumoId === insumo.id && p.ativo).length - 1} outros
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Preço */}
            <div className="text-right">
              {custoPorGrama > 0 ? (
                <div>
                  <span className="text-2xl font-bold text-green-600">
                    R$ {custoPorGrama.toFixed(3)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">/ {insumo.unidadeMedida}</span>
                  {temDesconto && precoAtivo && (
                    <div className="text-xs text-green-600">
                      {(((precoAtivo.precoBruto - precoAtivo.precoComDesconto) / precoAtivo.precoBruto) * 100).toFixed(1)}% desconto
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Sem preço</span>
                </div>
              )}
            </div>
          </div>

          {/* Informações secundárias */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-4">
              {/* Categoria */}
              {categoria && categoria.id !== 'sem-categoria' && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoria.cor }}
                  />
                  <span className="text-sm text-gray-600">{categoria.nome}</span>
                </div>
              )}

              {/* Unidade */}
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {insumo.unidadeMedida}
              </span>

              {/* Status */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                insumo.ativo 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {insumo.ativo ? 'Ativo' : 'Inativo'}
              </span>

              {/* Observações */}
              {insumo.observacoes && (
                <div className="text-xs text-gray-500" title={insumo.observacoes}>
                  💬 Tem observações
                </div>
              )}
            </div>
            
            {/* Ações */}
            <div className="flex gap-1">
              <button
                onClick={() => onManagePrecos(insumo)}
                className="p-1.5 text-gray-400 hover:text-blue-600"
                title="Gerenciar preços"
              >
                <DollarSign className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewDetails(insumo)}
                className="p-1.5 text-gray-400 hover:text-blue-600"
                title="Ver detalhes"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => onEdit(insumo)}
                className="p-1.5 text-gray-400 hover:text-blue-600"
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(insumo.id)}
                className="p-1.5 text-gray-400 hover:text-red-600"
                title="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}