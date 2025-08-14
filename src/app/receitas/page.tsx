'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import FormularioReceita from '@/components/FormularioReceita'
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
  Calendar
} from 'lucide-react'

const categorias = ['creme', 'mousse', 'cobertura', 'outro'] as const

const getCategoriaLabel = (categoria: string) => {
  const labels: Record<string, string> = {
    creme: 'Creme',
    mousse: 'Mousse',
    cobertura: 'Cobertura',
    outro: 'Outro'
  }
  return labels[categoria] || categoria
}

const getCategoriaColor = (categoria: string) => {
  const colors: Record<string, string> = {
    creme: 'bg-yellow-100 text-yellow-800',
    mousse: 'bg-purple-100 text-purple-800',
    cobertura: 'bg-blue-100 text-blue-800',
    outro: 'bg-gray-100 text-gray-800'
  }
  return colors[categoria] || colors.outro
}

export default function ReceitasPage() {
  const { receitas, deleteReceita, updateReceita } = useApp()
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas')
  const [filtroAtivo, setFiltroAtivo] = useState<string>('todos')
  const [busca, setBusca] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [receitaEditando, setReceitaEditando] = useState<Receita | null>(null)

  // Filtrar receitas
  const receitasFiltradas = receitas.filter(receita => {
    const matchCategoria = categoriaAtiva === 'todas' || receita.categoria === categoriaAtiva
    const matchBusca = receita.nome.toLowerCase().includes(busca.toLowerCase())
    const matchAtivo = 
      filtroAtivo === 'todos' ||
      (filtroAtivo === 'ativa' && receita.ativa) ||
      (filtroAtivo === 'inativa' && !receita.ativa)
    
    return matchCategoria && matchBusca && matchAtivo
  })

  const handleEdit = (receita: Receita) => {
    setReceitaEditando(receita)
    setMostrarFormulario(true)
  }

  const handleDuplicate = (receita: Receita) => {
    setReceitaEditando({
      ...receita,
      nome: `${receita.nome} (Cópia)`,
      id: ''
    })
    setMostrarFormulario(true)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Receitas</h1>
              <p className="text-gray-600 mt-2">Gerencie suas receitas de complementos caseiros</p>
            </div>
            <button
              onClick={() => {
                setReceitaEditando(null)
                setMostrarFormulario(true)
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nova Receita
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar receita..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="border rounded-lg px-3 py-2 w-64"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select 
                  value={categoriaAtiva} 
                  onChange={(e) => setCategoriaAtiva(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="todas">Todas as categorias</option>
                  {categorias.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {getCategoriaLabel(categoria)}
                    </option>
                  ))}
                </select>
              </div>

              <select 
                value={filtroAtivo} 
                onChange={(e) => setFiltroAtivo(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
                <option value="todos">Todos os status</option>
                <option value="ativa">Ativas</option>
                <option value="inativa">Inativas</option>
              </select>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <ChefHat className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Receitas</p>
                  <p className="text-2xl font-semibold text-gray-900">{receitas.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Receitas Ativas</p>
                  <p className="text-2xl font-semibold text-gray-900">{receitas.filter(r => r.ativa).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Custo Médio/g</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    R$ {receitas.length > 0 
                      ? (receitas.reduce((acc, r) => acc + r.custoPorGrama, 0) / receitas.length).toFixed(3)
                      : '0,000'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <Weight className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rendimento Médio</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {receitas.length > 0 
                      ? Math.round(receitas.reduce((acc, r) => acc + r.rendimento, 0) / receitas.length)
                      : 0
                    }g
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de receitas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {receitasFiltradas.map((receita) => (
              <div key={receita.id} className={`bg-white rounded-lg shadow p-6 ${!receita.ativa ? 'opacity-75' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{receita.nome}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoriaColor(receita.categoria)}`}>
                      {getCategoriaLabel(receita.categoria)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateReceita(receita.id, { ativa: !receita.ativa })}
                      className={`p-1 rounded ${receita.ativa ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      {receita.ativa ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(receita)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(receita)}
                      className="p-1 text-green-600 hover:text-green-800"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteReceita(receita.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {receita.descricao && (
                  <p className="text-sm text-gray-600 mb-4">{receita.descricao}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Custo Total:</span>
                    <span className="font-medium">R$ {receita.custoTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Custo por Grama:</span>
                    <span className="font-medium">R$ {receita.custoPorGrama.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rendimento:</span>
                    <span className="font-medium">{receita.rendimento}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ingredientes:</span>
                    <span className="font-medium">{receita.ingredientes.length}</span>
                  </div>
                </div>

                {receita.tempoPreparoMinutos && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <Clock className="h-4 w-4" />
                    <span>{receita.tempoPreparoMinutos} minutos</span>
                  </div>
                )}

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>Criada em {formatDate(receita.dataCriacao)}</span>
                </div>
              </div>
            ))}
          </div>

          {receitasFiltradas.length === 0 && (
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
          )}
        </main>
      </div>

      {/* Modal do formulário - será implementado no próximo componente */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {receitaEditando?.id ? 'Editar Receita' : 'Nova Receita'}
              </h2>
              <button
                onClick={() => {
                  setMostrarFormulario(false)
                  setReceitaEditando(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <FormularioReceita
              receita={receitaEditando}
              onSave={() => {
                setMostrarFormulario(false)
                setReceitaEditando(null)
              }}
              onCancel={() => {
                setMostrarFormulario(false)
                setReceitaEditando(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}