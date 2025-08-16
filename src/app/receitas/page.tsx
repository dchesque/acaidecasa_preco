'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import ReceitaModal from '@/components/ReceitaModal'
import ReceitaDetalhadaModal from '@/components/ReceitaDetalhadaModal'
import CategoriasReceitaModal from '@/components/CategoriasReceitaModal'
import { Receita } from '@/types'
import { 
  Plus,
  Filter,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Clock,
  ChefHat,
  DollarSign,
  Weight,
  Calendar,
  Settings,
  TrendingUp,
  User,
  BarChart3,
  Layers,
  FileText
} from 'lucide-react'

export default function ReceitasPage() {
  const { 
    receitas, 
    categoriasReceita,
    deleteReceita, 
    updateReceita,
    duplicarReceita,
    escalarReceita
  } = useApp()
  
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas')
  const [filtroAtivo, setFiltroAtivo] = useState<string>('todos')
  const [filtroPreco, setFiltroPreco] = useState<string>('todos')
  const [filtroTempo, setFiltroTempo] = useState<string>('todos')
  const [busca, setBusca] = useState('')
  const [mostrarReceitaModal, setMostrarReceitaModal] = useState(false)
  const [mostrarReceitaDetalhada, setMostrarReceitaDetalhada] = useState(false)
  const [mostrarCategoriasModal, setMostrarCategoriasModal] = useState(false)
  const [receitaEditando, setReceitaEditando] = useState<Receita | null>(null)
  const [receitaDetalhada, setReceitaDetalhada] = useState<Receita | null>(null)
  const [visualizacao, setVisualizacao] = useState<'cards' | 'categorias'>('categorias')

  // Filtrar receitas com lógica mais avançada
  const receitasFiltradas = useMemo(() => {
    return receitas.filter(receita => {
      // Filtro por categoria
      const matchCategoria = categoriaAtiva === 'todas' || receita.categoriaId === categoriaAtiva
      
      // Filtro por busca (nome e descrição)
      const matchBusca = busca === '' || 
        receita.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (receita.descricao && receita.descricao.toLowerCase().includes(busca.toLowerCase()))
      
      // Filtro por status ativo/inativo
      const matchAtivo = 
        filtroAtivo === 'todos' ||
        (filtroAtivo === 'ativa' && receita.ativa) ||
        (filtroAtivo === 'inativa' && !receita.ativa)
      
      // Filtro por faixa de preço
      const matchPreco = filtroPreco === 'todos' || (() => {
        const custo = receita.custoPorGrama
        switch (filtroPreco) {
          case 'baixo': return custo <= 0.05
          case 'medio': return custo > 0.05 && custo <= 0.15
          case 'alto': return custo > 0.15
          default: return true
        }
      })()
      
      // Filtro por tempo de preparo
      const matchTempo = filtroTempo === 'todos' || (() => {
        const tempo = receita.tempoPreparoMinutos || 0
        switch (filtroTempo) {
          case 'rapido': return tempo <= 30
          case 'medio': return tempo > 30 && tempo <= 60
          case 'lento': return tempo > 60
          default: return true
        }
      })()
      
      return matchCategoria && matchBusca && matchAtivo && matchPreco && matchTempo
    })
  }, [receitas, categoriaAtiva, busca, filtroAtivo, filtroPreco, filtroTempo])

  // Agrupar receitas por categoria
  const receitasPorCategoria = useMemo(() => {
    const grupos: Record<string, Receita[]> = {}
    
    receitasFiltradas.forEach(receita => {
      const categoriaId = receita.categoriaId || 'sem-categoria'
      if (!grupos[categoriaId]) {
        grupos[categoriaId] = []
      }
      grupos[categoriaId].push(receita)
    })
    
    return grupos
  }, [receitasFiltradas])

  // Métricas calculadas
  const metricas = useMemo(() => {
    const receitasAtivas = receitas.filter(r => r.ativa)
    const custoMedio = receitas.length > 0 
      ? receitas.reduce((acc, r) => acc + r.custoPorGrama, 0) / receitas.length 
      : 0
    const rendimentoMedio = receitas.length > 0 
      ? Math.round(receitas.reduce((acc, r) => acc + r.rendimento, 0) / receitas.length)
      : 0
    const categoriaMaisPopular = categoriasReceita.length > 0 
      ? categoriasReceita.reduce((prev, current) => {
          const prevCount = receitas.filter(r => r.categoriaId === prev.id).length
          const currentCount = receitas.filter(r => r.categoriaId === current.id).length
          return currentCount > prevCount ? current : prev
        }).nome
      : 'N/A'

    return {
      total: receitas.length,
      ativas: receitasAtivas.length,
      custoMedio,
      rendimentoMedio,
      categoriaMaisPopular
    }
  }, [receitas, categoriasReceita])

  const handleEdit = (receita: Receita) => {
    setReceitaEditando(receita)
    setMostrarReceitaModal(true)
  }

  const handleDuplicate = (receita: Receita) => {
    try {
      duplicarReceita(receita.id)
    } catch (error) {
      console.error('Erro ao duplicar receita:', error)
    }
  }

  const handleScale = (receita: Receita, fator: number) => {
    try {
      escalarReceita(receita.id, fator)
    } catch (error) {
      console.error('Erro ao escalar receita:', error)
    }
  }

  const handleViewDetails = (receita: Receita) => {
    setReceitaDetalhada(receita)
    setMostrarReceitaDetalhada(true)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getCategoriaInfo = (categoriaId?: string) => {
    if (!categoriaId) return { nome: 'Sem Categoria', cor: '#6B7280' }
    const categoria = categoriasReceita.find(c => c.id === categoriaId)
    return categoria || { nome: 'Categoria Removida', cor: '#6B7280' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Receitas</h1>
              <p className="text-gray-600 mt-2">Sistema completo de gestão de receitas com categorias dinâmicas</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setMostrarCategoriasModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Settings className="h-5 w-5" />
                Gerenciar Categorias
              </button>
              <button
                onClick={() => {
                  setReceitaEditando(null)
                  setMostrarReceitaModal(true)
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Nova Receita
              </button>
            </div>
          </div>

          {/* Filtros Avançados */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Filtros</span>
              </div>
              
              {/* Toggle de Visualização */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setVisualizacao('categorias')}
                  className={`px-3 py-1 rounded text-sm ${
                    visualizacao === 'categorias' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  <Layers className="h-4 w-4 inline mr-1" />
                  Por Categoria
                </button>
                <button
                  onClick={() => setVisualizacao('cards')}
                  className={`px-3 py-1 rounded text-sm ${
                    visualizacao === 'cards' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 inline mr-1" />
                  Lista
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Busca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nome ou descrição..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm"
                  />
                </div>
              </div>
              
              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select 
                  value={categoriaAtiva} 
                  onChange={(e) => setCategoriaAtiva(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="todas">Todas as categorias</option>
                  {categoriasReceita.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={filtroAtivo} 
                  onChange={(e) => setFiltroAtivo(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="ativa">Ativas</option>
                  <option value="inativa">Inativas</option>
                </select>
              </div>

              {/* Faixa de Preço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custo/g</label>
                <select 
                  value={filtroPreco} 
                  onChange={(e) => setFiltroPreco(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="baixo">Baixo (≤ R$ 0,05)</option>
                  <option value="medio">Médio (R$ 0,05 - 0,15)</option>
                  <option value="alto">Alto (&gt; R$ 0,15)</option>
                </select>
              </div>

              {/* Tempo de Preparo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tempo</label>
                <select 
                  value={filtroTempo} 
                  onChange={(e) => setFiltroTempo(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="rapido">Rápido (≤ 30min)</option>
                  <option value="medio">Médio (30-60min)</option>
                  <option value="lento">Lento (&gt; 60min)</option>
                </select>
              </div>
            </div>

            {/* Indicador de Filtros Ativos */}
            {(busca || categoriaAtiva !== 'todas' || filtroAtivo !== 'todos' || filtroPreco !== 'todos' || filtroTempo !== 'todos') && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Filtros ativos:</span>
                  {busca && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Busca: &quot;{busca}&quot;</span>}
                  {categoriaAtiva !== 'todas' && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Categoria: {getCategoriaInfo(categoriaAtiva).nome}
                    </span>
                  )}
                  {filtroAtivo !== 'todos' && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Status: {filtroAtivo}</span>}
                  {filtroPreco !== 'todos' && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Preço: {filtroPreco}</span>}
                  {filtroTempo !== 'todos' && <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Tempo: {filtroTempo}</span>}
                  <button
                    onClick={() => {
                      setBusca('')
                      setCategoriaAtiva('todas')
                      setFiltroAtivo('todos')
                      setFiltroPreco('todos')
                      setFiltroTempo('todos')
                    }}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Estatísticas Aprimoradas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100">
                  <ChefHat className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Total de Receitas</p>
                  <p className="text-xl font-semibold text-gray-900">{metricas.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Receitas Ativas</p>
                  <p className="text-xl font-semibold text-gray-900">{metricas.ativas}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-100">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Custo Médio/g</p>
                  <p className="text-xl font-semibold text-gray-900">
                    R$ {metricas.custoMedio.toFixed(3)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100">
                  <Weight className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Rendimento Médio</p>
                  <p className="text-xl font-semibold text-gray-900">{metricas.rendimentoMedio}g</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-red-100">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Categoria Popular</p>
                  <p className="text-sm font-semibold text-gray-900">{metricas.categoriaMaisPopular}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          {visualizacao === 'categorias' ? (
            /* Visualização por Categorias */
            <div className="space-y-6">
              {Object.keys(receitasPorCategoria).length === 0 ? (
                <div className="text-center py-12">
                  <ChefHat className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma receita encontrada</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {receitas.length === 0 
                      ? 'Comece criando sua primeira receita.'
                      : 'Tente ajustar os filtros de busca.'
                    }
                  </p>
                </div>
              ) : (
                Object.entries(receitasPorCategoria).map(([categoriaId, receitasCategoria]) => {
                  const categoriaInfo = getCategoriaInfo(categoriaId === 'sem-categoria' ? undefined : categoriaId)
                  
                  return (
                    <div key={categoriaId} className="bg-white rounded-lg shadow overflow-hidden">
                      {/* Header da Categoria */}
                      <div 
                        className="px-6 py-4 border-b"
                        style={{ 
                          backgroundColor: `${categoriaInfo.cor}15`,
                          borderLeft: `4px solid ${categoriaInfo.cor}`
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: categoriaInfo.cor }}
                            />
                            <h3 className="text-lg font-semibold text-gray-900">
                              {categoriaInfo.nome}
                            </h3>
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                              {receitasCategoria.length} receita{receitasCategoria.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Grid de Receitas da Categoria */}
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {receitasCategoria.map((receita) => (
                            <ReceitaCard 
                              key={receita.id} 
                              receita={receita}
                              onEdit={handleEdit}
                              onDuplicate={handleDuplicate}
                              onDelete={deleteReceita}
                              onToggleActive={updateReceita}
                              onViewDetails={handleViewDetails}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          ) : (
            /* Visualização em Lista */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {receitasFiltradas.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <ChefHat className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma receita encontrada</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {receitas.length === 0 
                      ? 'Comece criando sua primeira receita.'
                      : 'Tente ajustar os filtros de busca.'
                    }
                  </p>
                </div>
              ) : (
                receitasFiltradas.map((receita) => (
                  <ReceitaCard 
                    key={receita.id} 
                    receita={receita}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onDelete={deleteReceita}
                    onToggleActive={updateReceita}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modais */}
      <ReceitaModal
        receita={receitaEditando}
        isOpen={mostrarReceitaModal}
        onClose={() => {
          setMostrarReceitaModal(false)
          setReceitaEditando(null)
        }}
        onSave={() => {
          setMostrarReceitaModal(false)
          setReceitaEditando(null)
        }}
      />

      <ReceitaDetalhadaModal
        receita={receitaDetalhada}
        isOpen={mostrarReceitaDetalhada}
        onClose={() => {
          setMostrarReceitaDetalhada(false)
          setReceitaDetalhada(null)
        }}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onScale={handleScale}
      />

      <CategoriasReceitaModal
        isOpen={mostrarCategoriasModal}
        onClose={() => setMostrarCategoriasModal(false)}
      />
    </div>
  )
}

// Componente ReceitaCard
interface ReceitaCardProps {
  receita: Receita
  onEdit: (receita: Receita) => void
  onDuplicate: (receita: Receita) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, data: Partial<Receita>) => void
  onViewDetails: (receita: Receita) => void
}

function ReceitaCard({ 
  receita, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  onToggleActive, 
  onViewDetails 
}: ReceitaCardProps) {
  const { 
    categoriasReceita,
    insumos,
    fornecedores,
    getInsumoPrecoAtivo
  } = useApp()

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getCategoriaInfo = (categoriaId?: string) => {
    if (!categoriaId) return { nome: 'Sem Categoria', cor: '#6B7280' }
    const categoria = categoriasReceita.find(c => c.id === categoriaId)
    return categoria || { nome: 'Categoria Removida', cor: '#6B7280' }
  }

  // Obter principais ingredientes
  const principaisIngredientes = receita.ingredientes.slice(0, 3).map(ing => {
    const insumo = insumos.find(i => i.id === ing.insumoId)
    return insumo?.nome || 'Ingrediente não encontrado'
  })

  // Obter fornecedores únicos
  const fornecedoresUnicos = [...new Set(receita.ingredientes.map(ing => {
    const precoAtivo = getInsumoPrecoAtivo(ing.insumoId)
    if (!precoAtivo) return null
    const fornecedor = fornecedores.find(f => f.id === precoAtivo.fornecedorId)
    return fornecedor?.nome
  }).filter(Boolean))]

  const categoriaInfo = getCategoriaInfo(receita.categoriaId)

  return (
    <div 
      className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer ${
        !receita.ativa ? 'opacity-75' : ''
      }`}
      onClick={() => onViewDetails(receita)}
    >
      {/* Header do Card */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{receita.nome}</h3>
            <span 
              className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: categoriaInfo.cor }}
            >
              {categoriaInfo.nome}
            </span>
          </div>
          
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleActive(receita.id, { ativa: !receita.ativa })}
              className={`p-1 rounded ${receita.ativa ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
              title={receita.ativa ? 'Desativar' : 'Ativar'}
            >
              {receita.ativa ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <button
              onClick={() => onEdit(receita)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDuplicate(receita)}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              title="Duplicar"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={() => confirm('Tem certeza que deseja excluir esta receita?') && onDelete(receita.id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              title="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {receita.descricao && (
          <p className="text-sm text-gray-600 line-clamp-2">{receita.descricao}</p>
        )}
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4">
        {/* Métricas Principais */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-600">Custo/g</p>
            <p className="font-semibold text-green-600">R$ {receita.custoPorGrama.toFixed(3)}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-600">Rendimento</p>
            <p className="font-semibold text-blue-600">{receita.rendimento}g</p>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Custo Total:</span>
            <span className="font-medium">R$ {receita.custoTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ingredientes:</span>
            <span className="font-medium">{receita.ingredientes.length}</span>
          </div>
          {receita.tempoPreparoMinutos && receita.tempoPreparoMinutos > 0 && (
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{receita.tempoPreparoMinutos} min</span>
            </div>
          )}
        </div>

        {/* Principais Ingredientes */}
        {principaisIngredientes.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Principais ingredientes:</p>
            <div className="flex flex-wrap gap-1">
              {principaisIngredientes.map((ingrediente, index) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {ingrediente}
                </span>
              ))}
              {receita.ingredientes.length > 3 && (
                <span className="text-xs text-gray-500">+{receita.ingredientes.length - 3} mais</span>
              )}
            </div>
          </div>
        )}

        {/* Fornecedores */}
        {fornecedoresUnicos.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Fornecedores:</p>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <User className="h-3 w-3" />
              <span>{fornecedoresUnicos.slice(0, 2).join(', ')}</span>
              {fornecedoresUnicos.length > 2 && (
                <span>+{fornecedoresUnicos.length - 2} mais</span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(receita.dataCriacao)}</span>
            </div>
            {receita.observacoes && (
              <div className="flex items-center gap-1 text-yellow-600">
                <FileText className="h-3 w-3" />
                <span>Obs</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}