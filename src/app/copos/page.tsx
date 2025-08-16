'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Copo } from '@/types'
import Navigation from '@/components/Navigation'
import CategoriasCopoModal from '@/components/CategoriasCopoModal'
import CopoModal from '@/components/CopoModal'
import CopoDetalhadoModal from '@/components/CopoDetalhadoModal'
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
  ChefHat,
  Users,
  Settings,
  Eye,
  Copy,
  BarChart3
} from 'lucide-react'

export default function CoposPage() {
  const { 
    copos,
    categoriasCopo,
    deleteCopo,
    duplicarCopo
  } = useApp()

  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [custoFilter, setCustoFilter] = useState({ min: '', max: '' })
  
  const [showCopoModal, setShowCopoModal] = useState(false)
  const [showCategoriaModal, setShowCategoriaModal] = useState(false)
  const [showDetalheModal, setShowDetalheModal] = useState(false)
  const [editingCopo, setEditingCopo] = useState<Copo | null>(null)
  const [viewingCopo, setViewingCopo] = useState<Copo | null>(null)
  

  // Estatísticas
  const totalCopos = copos.length
  const coposAtivos = copos.filter(c => c.ativo).length
  const custoMedio = copos.length > 0 
    ? copos.reduce((acc, c) => acc + c.custoTotal, 0) / copos.length 
    : 0
  const categoriaComMaisCopos = categoriasCopo.length > 0 
    ? categoriasCopo.reduce((prev, current) => {
        const prevCount = copos.filter(c => c.categoriaId === prev.id).length
        const currentCount = copos.filter(c => c.categoriaId === current.id).length
        return currentCount > prevCount ? current : prev
      }, categoriasCopo[0])
    : null

  // Filtros
  const filteredCopos = useMemo(() => {
    return copos.filter(copo => {
      const matchesSearch = copo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (copo.descricao && copo.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategoria = categoriaFilter === 'all' || 
                              copo.categoriaId === categoriaFilter ||
                              (categoriaFilter === 'sem-categoria' && !copo.categoriaId)
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && copo.ativo) ||
                           (statusFilter === 'inactive' && !copo.ativo)
      
      const matchesCusto = (!custoFilter.min || copo.custoTotal >= parseFloat(custoFilter.min)) &&
                          (!custoFilter.max || copo.custoTotal <= parseFloat(custoFilter.max))
      
      return matchesSearch && matchesCategoria && matchesStatus && matchesCusto
    })
  }, [copos, searchTerm, categoriaFilter, statusFilter, custoFilter])

  // Agrupar copos por categoria
  const coposPorCategoria = useMemo(() => {
    const grupos: { [key: string]: { categoria: any; copos: Copo[] } } = {}
    
    filteredCopos.forEach(copo => {
      const categoriaId = copo.categoriaId || 'sem-categoria'
      if (!grupos[categoriaId]) {
        grupos[categoriaId] = {
          categoria: categoriaId === 'sem-categoria' 
            ? { id: 'sem-categoria', nome: 'Sem Categoria', cor: '#6B7280' }
            : categoriasCopo.find(c => c.id === categoriaId),
          copos: []
        }
      }
      grupos[categoriaId].copos.push(copo)
    })
    
    return Object.values(grupos).sort((a, b) => {
      if (a.categoria.id === 'sem-categoria') return 1
      if (b.categoria.id === 'sem-categoria') return -1
      return a.categoria.nome.localeCompare(b.categoria.nome)
    })
  }, [filteredCopos, categoriasCopo])

  const openCopoModal = (copo?: Copo) => {
    setEditingCopo(copo || null)
    setShowCopoModal(true)
  }
  
  const closeCopoModal = () => {
    setShowCopoModal(false)
    setEditingCopo(null)
  }
  
  const openDetalheModal = (copo: Copo) => {
    setViewingCopo(copo)
    setShowDetalheModal(true)
  }
  
  const closeDetalheModal = () => {
    setShowDetalheModal(false)
    setViewingCopo(null)
  }





  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este copo?')) {
      deleteCopo(id)
    }
  }
  
  const handleDuplicate = (id: string) => {
    const novoId = duplicarCopo(id)
    if (novoId) {
      alert('Copo duplicado com sucesso!')
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
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Copos</h1>
              <p className="text-gray-600 mt-2">Crie e gerencie copos personalizados com insumos e embalagens específicos</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCategoriaModal(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <Settings className="h-5 w-5" />
                Categorias
              </button>
              <button
                onClick={() => openCopoModal()}
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
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Custo Médio</p>
                  <p className="text-2xl font-semibold text-gray-900">R$ {custoMedio.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categorias</p>
                  <p className="text-2xl font-semibold text-gray-900">{categoriasCopo.length}</p>
                  {categoriaComMaisCopos && (
                    <p className="text-xs text-gray-500 mt-1">Popular: {categoriaComMaisCopos.nome}</p>
                  )}
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
                    placeholder="Buscar copos por nome ou descrição..."
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
                    value={categoriaFilter}
                    onChange={(e) => setCategoriaFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">Todas as Categorias</option>
                    <option value="sem-categoria">Sem Categoria</option>
                    {categoriasCopo.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </select>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Min"
                    value={custoFilter.min}
                    onChange={(e) => setCustoFilter(prev => ({ ...prev, min: e.target.value }))}
                    className="w-20 border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Max"
                    value={custoFilter.max}
                    onChange={(e) => setCustoFilter(prev => ({ ...prev, max: e.target.value }))}
                    className="w-20 border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Copos por Categoria */}
          {filteredCopos.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Coffee className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-semibold text-gray-900">
                {copos.length === 0 ? 'Nenhum copo cadastrado' : 'Nenhum copo encontrado'}
              </h3>
              <p className="mt-1 text-gray-500">
                {copos.length === 0 
                  ? 'Comece criando seu primeiro copo personalizado.'
                  : 'Tente ajustar os filtros de busca.'
                }
              </p>
              {copos.length === 0 && (
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => openCopoModal()}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Criar Primeiro Copo
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {coposPorCategoria.map((grupo) => (
                <div key={grupo.categoria.id} className="bg-white rounded-lg shadow">
                  {/* Header da Categoria */}
                  <div 
                    className="px-6 py-4 border-b border-gray-200 rounded-t-lg"
                    style={{ backgroundColor: `${grupo.categoria.cor}15` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: grupo.categoria.cor }}
                        />
                        <h2 className="text-lg font-semibold text-gray-900">{grupo.categoria.nome}</h2>
                        <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {grupo.copos.length} copo{grupo.copos.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Copos */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {grupo.copos.map((copo) => (
                        <div key={copo.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-between">
                            {/* Informações Principais */}
                            <div className="flex items-center flex-1">
                              <div className="p-2 rounded-lg bg-purple-100 mr-4">
                                <Coffee className="h-6 w-6 text-purple-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                  <h3 className="font-semibold text-gray-900 text-lg truncate">{copo.nome}</h3>
                                  <span className={`ml-3 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    copo.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {copo.ativo ? 'Ativo' : 'Inativo'}
                                  </span>
                                </div>
                                {copo.descricao && (
                                  <p className="text-gray-600 text-sm mt-1">{copo.descricao}</p>
                                )}
                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                  <ChefHat className="h-4 w-4 mr-1" />
                                  <span>{copo.insumos.length} insumo{copo.insumos.length !== 1 ? 's' : ''}</span>
                                  <Package className="h-4 w-4 ml-4 mr-1" />
                                  <span>{copo.embalagens.length} embalagem{copo.embalagens.length !== 1 ? 's' : ''}</span>
                                  {copo.observacoes && (
                                    <>
                                      <Users className="h-4 w-4 ml-4 mr-1" />
                                      <span>Com observações</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Custos */}
                            <div className="flex items-center space-x-6 ml-4">
                              <div className="text-right">
                                <div className="text-sm text-gray-600">Custo Total</div>
                                <div className="text-xl font-bold text-purple-600">R$ {copo.custoTotal.toFixed(2)}</div>
                                <div className="text-xs text-gray-500">
                                  Insumos: R$ {copo.custoInsumos.toFixed(2)} | Embalagens: R$ {copo.custoEmbalagens.toFixed(2)}
                                </div>
                              </div>

                              {/* Ações */}
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => openDetalheModal(copo)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                  title="Ver detalhes"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => openCopoModal(copo)}
                                  className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                                  title="Editar"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDuplicate(copo.id)}
                                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                  title="Duplicar"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(copo.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modais */}
      <CategoriasCopoModal 
        isOpen={showCategoriaModal}
        onClose={() => setShowCategoriaModal(false)}
      />
      
      <CopoModal 
        isOpen={showCopoModal}
        onClose={closeCopoModal}
        editingCopo={editingCopo}
      />
      
      <CopoDetalhadoModal 
        isOpen={showDetalheModal}
        onClose={closeDetalheModal}
        copo={viewingCopo}
        onEdit={() => {
          closeDetalheModal()
          openCopoModal(viewingCopo!)
        }}
        onDuplicate={() => {
          if (viewingCopo) {
            handleDuplicate(viewingCopo.id)
            closeDetalheModal()
          }
        }}
      />
    </div>
  )
}