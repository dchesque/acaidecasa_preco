'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import EmbalagensModal from '@/components/EmbalagensModal'
import { Plus, Edit, Trash2, Package, Search, Filter, Eye, Layers, Grid3X3, X, Truck } from 'lucide-react'
import { Embalagem } from '@/types'
// import { getTextColor, getLighterColor } from '@/utils/colorGenerator'

export default function EmbalagensPage() {
  const { 
    embalagens, 
    categoriasEmbalagem, 
    fornecedores,
    updateEmbalagem, 
    deleteEmbalagem,
    deleteCategoriaEmbalagem 
  } = useApp()
  
  const [showModal, setShowModal] = useState(false)
  const [editingEmbalagem, setEditingEmbalagem] = useState<Embalagem | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedEmbalagem, setSelectedEmbalagem] = useState<Embalagem | null>(null)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFornecedor, setSelectedFornecedor] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('todos')
  const [viewMode, setViewMode] = useState<'categorias' | 'grid'>('categorias')

  // Embalagens filtradas
  const embalagensFiltradas = useMemo(() => {
    return embalagens.filter(embalagem => {
      const matchSearch = embalagem.nome.toLowerCase().includes(searchTerm.toLowerCase())
      const matchFornecedor = !selectedFornecedor || embalagem.fornecedorId === selectedFornecedor
      const matchCategoria = !selectedCategoria || embalagem.categoriaId === selectedCategoria
      const matchStatus = selectedStatus === 'todos' || 
        (selectedStatus === 'ativa' && embalagem.ativa) ||
        (selectedStatus === 'inativa' && !embalagem.ativa)
      
      return matchSearch && matchFornecedor && matchCategoria && matchStatus
    })
  }, [embalagens, searchTerm, selectedFornecedor, selectedCategoria, selectedStatus])

  // Embalagens agrupadas por categoria
  const embalagensPorCategoria = useMemo(() => {
    const grupos: { [key: string]: { categoria: { id: string; nome: string; cor: string } | null; embalagens: Embalagem[] } } = {}
    
    embalagensFiltradas.forEach(embalagem => {
      const categoriaId = embalagem.categoriaId || 'sem-categoria'
      if (!grupos[categoriaId]) {
        const categoria = categoriaId === 'sem-categoria' 
          ? { id: 'sem-categoria', nome: 'Sem Categoria', cor: '#9CA3AF' }
          : categoriasEmbalagem.find(c => c.id === categoriaId)
        
        grupos[categoriaId] = {
          categoria,
          embalagens: []
        }
      }
      grupos[categoriaId].embalagens.push(embalagem)
    })
    
    return Object.values(grupos).sort((a, b) => {
      if (a.categoria?.id === 'sem-categoria') return 1
      if (b.categoria?.id === 'sem-categoria') return -1
      return a.categoria?.nome.localeCompare(b.categoria?.nome) || 0
    })
  }, [embalagensFiltradas, categoriasEmbalagem])

  // Fornecedores que têm embalagens
  const fornecedoresComEmbalagens = useMemo(() => {
    const fornecedorIds = [...new Set(embalagens.map(e => e.fornecedorId).filter(Boolean))]
    return fornecedores.filter(f => fornecedorIds.includes(f.id))
  }, [embalagens, fornecedores])

  const handleEdit = (embalagem: Embalagem) => {
    setEditingEmbalagem(embalagem)
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta embalagem?')) {
      deleteEmbalagem(id)
    }
  }

  const handleDeleteCategoria = (categoriaId: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria? As embalagens associadas ficarão sem categoria.')) {
      try {
        deleteCategoriaEmbalagem(categoriaId)
      } catch (error: unknown) {
        alert(error instanceof Error ? error.message : 'Erro desconhecido')
      }
    }
  }

  const toggleStatus = (embalagem: Embalagem) => {
    updateEmbalagem(embalagem.id, { ativa: !embalagem.ativa })
  }

  const viewDetails = (embalagem: Embalagem) => {
    setSelectedEmbalagem(embalagem)
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Embalagens</h1>
              <p className="text-gray-600 mt-2">
                Gerencie embalagens com categorização, fornecedores e precificação avançada
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode(viewMode === 'categorias' ? 'grid' : 'categorias')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                {viewMode === 'categorias' ? <Grid3X3 className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
                {viewMode === 'categorias' ? 'Visualização Grid' : 'Por Categorias'}
              </button>
              <button
                onClick={() => {
                  setEditingEmbalagem(null)
                  setShowModal(true)
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Nova Embalagem
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-900">Filtros</h3>
              {(searchTerm || selectedFornecedor || selectedCategoria || selectedStatus !== 'todos') && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Limpar filtros
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <select
                value={selectedFornecedor}
                onChange={(e) => setSelectedFornecedor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Todos os fornecedores</option>
                {fornecedoresComEmbalagens.map(fornecedor => (
                  <option key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nome}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Todas as categorias</option>
                {categoriasEmbalagem.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="todos">Todos os status</option>
                <option value="ativa">Apenas ativas</option>
                <option value="inativa">Apenas inativas</option>
              </select>
            </div>
          </div>

          {/* Conteúdo Principal */}
          {viewMode === 'categorias' ? (
            /* Visualização por Categorias */
            <div className="space-y-8">
              {embalagensPorCategoria.map(({ categoria, embalagens }) => (
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
                        {embalagens.length}
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

                  {/* Cards das Embalagens */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {embalagens.map((embalagem) => (
                      <EmbalagemCard
                        key={embalagem.id}
                        embalagem={embalagem}
                        fornecedorNome={getFornecedorNome(embalagem.fornecedorId)}
                        categoria={categoria}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={toggleStatus}
                        onViewDetails={viewDetails}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Visualização Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {embalagensFiltradas.map((embalagem) => {
                const categoria = embalagem.categoriaId 
                  ? categoriasEmbalagem.find(c => c.id === embalagem.categoriaId)
                  : { id: 'sem-categoria', nome: 'Sem Categoria', cor: '#9CA3AF' }
                
                return (
                  <EmbalagemCard
                    key={embalagem.id}
                    embalagem={embalagem}
                    fornecedorNome={getFornecedorNome(embalagem.fornecedorId)}
                    categoria={categoria}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={toggleStatus}
                    onViewDetails={viewDetails}
                  />
                )
              })}
            </div>
          )}

          {/* Estado Vazio */}
          {embalagensFiltradas.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {embalagens.length === 0 ? 'Nenhuma embalagem cadastrada' : 'Nenhuma embalagem encontrada'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {embalagens.length === 0 
                  ? 'Comece criando sua primeira embalagem.'
                  : 'Tente ajustar os filtros ou criar uma nova embalagem.'
                }
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <EmbalagensModal 
        isOpen={showModal} 
        onClose={() => {
          setShowModal(false)
          setEditingEmbalagem(null)
        }}
        editingEmbalagem={editingEmbalagem}
      />

      {/* Modal de Detalhes */}
      {showDetailModal && selectedEmbalagem && (
        <DetailModal 
          embalagem={selectedEmbalagem}
          fornecedorNome={getFornecedorNome(selectedEmbalagem.fornecedorId)}
          categoria={selectedEmbalagem.categoriaId 
            ? categoriasEmbalagem.find(c => c.id === selectedEmbalagem.categoriaId)
            : undefined
          }
          onClose={() => {
            setShowDetailModal(false)
            setSelectedEmbalagem(null)
          }}
        />
      )}
    </div>
  )
}

// Componente do Card de Embalagem
interface EmbalagemCardProps {
  embalagem: Embalagem
  fornecedorNome?: string | null
  categoria?: { id: string; nome: string; cor: string } | null
  onEdit: (embalagem: Embalagem) => void
  onDelete: (id: string) => void
  onToggleStatus: (embalagem: Embalagem) => void
  onViewDetails: (embalagem: Embalagem) => void
}

function EmbalagemCard({ 
  embalagem, 
  fornecedorNome, 
  categoria, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onViewDetails 
}: EmbalagemCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 border-l-4`}
      style={{ borderLeftColor: categoria?.cor || '#9CA3AF' }}
    >
      {/* Header com imagem e informações */}
      <div className="flex gap-3 mb-3">
        {embalagem.imagemUrl ? (
          <img
            src={embalagem.imagemUrl}
            alt={embalagem.nome}
            className="w-12 h-12 object-cover rounded-lg"
          />
        ) : (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            embalagem.ativa ? 'bg-purple-100' : 'bg-gray-100'
          }`}>
            <Package className={`h-6 w-6 ${
              embalagem.ativa ? 'text-purple-600' : 'text-gray-400'
            }`} />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {embalagem.nome}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-lg font-bold text-purple-600">
              R$ {embalagem.precoUnitarioCalculado?.toFixed(4) || embalagem.precoUnitario?.toFixed(2)}
            </span>
            {embalagem.tipoPrecificacao === 'lote' && (
              <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
                LOTE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="space-y-2 mb-3">
        {fornecedorNome && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Truck className="h-3 w-3" />
            <span className="truncate">{fornecedorNome}</span>
          </div>
        )}
        
        {categoria && categoria.id !== 'sem-categoria' && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: categoria.cor }}
            />
            <span className="text-sm text-gray-600 truncate">{categoria.nome}</span>
          </div>
        )}

        {embalagem.observacoes && (
          <div className="text-xs text-gray-500 truncate" title={embalagem.observacoes}>
            💬 {embalagem.observacoes}
          </div>
        )}
      </div>

      {/* Status e ações */}
      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          embalagem.ativa 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {embalagem.ativa ? 'Ativa' : 'Inativa'}
        </span>
        
        <div className="flex gap-1">
          <button
            onClick={() => onViewDetails(embalagem)}
            className="p-1.5 text-gray-400 hover:text-blue-600"
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(embalagem)}
            className="p-1.5 text-gray-400 hover:text-blue-600"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(embalagem.id)}
            className="p-1.5 text-gray-400 hover:text-red-600"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Modal de Detalhes
interface DetailModalProps {
  embalagem: Embalagem
  fornecedorNome?: string | null
  categoria?: { id: string; nome: string; cor: string } | null
  onClose: () => void
}

function DetailModal({ embalagem, fornecedorNome, categoria, onClose }: DetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Detalhes da Embalagem</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Imagem e informações principais */}
          <div className="flex gap-6">
            {embalagem.imagemUrl ? (
              <img
                src={embalagem.imagemUrl}
                alt={embalagem.nome}
                className="w-32 h-32 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{embalagem.nome}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Preço:</span>
                  <span className="text-xl font-bold text-purple-600">
                    R$ {embalagem.precoUnitarioCalculado?.toFixed(4) || embalagem.precoUnitario?.toFixed(2)}
                  </span>
                  {embalagem.tipoPrecificacao === 'lote' && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Precificação em Lote
                    </span>
                  )}
                </div>
                
                {embalagem.tipoPrecificacao === 'lote' && embalagem.precoLote && embalagem.quantidadeLote && (
                  <div className="text-sm text-gray-600">
                    <span>Lote: R$ {embalagem.precoLote.toFixed(2)} / {embalagem.quantidadeLote} unidades</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    embalagem.ativa 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {embalagem.ativa ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fornecedorNome && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Fornecedor</h4>
                <p className="text-gray-600">{fornecedorNome}</p>
              </div>
            )}
            
            {categoria && categoria.id !== 'sem-categoria' && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Categoria</h4>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: categoria.cor }}
                  />
                  <span className="text-gray-600">{categoria.nome}</span>
                </div>
              </div>
            )}
          </div>

          {embalagem.observacoes && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{embalagem.observacoes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}