'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import FormularioCardapio from '@/components/FormularioCardapio'
import { ItemCardapio } from '@/types'
import { 
  Plus,
  Filter,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  DollarSign,
  TrendingUp,
  Package,
  BookOpen,
  ShoppingBag,
  ChefHat,
  Target,
  Cherry
} from 'lucide-react'

const categorias = {
  todas: 'Todas as Categorias',
  chocolates: 'Chocolates',
  mousses: 'Mousses',
  sorvetes: 'Sorvetes', 
  coberturas: 'Coberturas',
  cremes_premium: 'Cremes Premium',
  frutas: 'Frutas',
  complementos: 'Complementos',
  receitas: 'Receitas',
  copos: 'Copos',
  combinados: 'Combinados'
}

const tipos = {
  todos: 'Todos os Tipos',
  complemento: '🍫 Complementos',
  receita: '📝 Receitas',
  copo: '🥤 Copos',
  combinado: '🎯 Combinados'
}

const getCategoriaColor = (categoria: string) => {
  const colors: Record<string, string> = {
    chocolates: 'bg-orange-100 text-orange-800',
    mousses: 'bg-purple-100 text-purple-800',
    sorvetes: 'bg-blue-100 text-blue-800',
    coberturas: 'bg-yellow-100 text-yellow-800',
    cremes_premium: 'bg-pink-100 text-pink-800',
    frutas: 'bg-green-100 text-green-800',
    complementos: 'bg-gray-100 text-gray-800',
    receitas: 'bg-indigo-100 text-indigo-800',
    copos: 'bg-cyan-100 text-cyan-800',
    combinados: 'bg-red-100 text-red-800'
  }
  return colors[categoria] || colors.complementos
}

const getTipoIcon = (tipo: string) => {
  const icons: Record<string, any> = {
    complemento: Cherry,
    receita: ChefHat,
    copo: ShoppingBag,
    combinado: Target
  }
  return icons[tipo] || Cherry
}

const getTipoColor = (tipo: string) => {
  const colors: Record<string, string> = {
    complemento: 'bg-orange-100 text-orange-600',
    receita: 'bg-purple-100 text-purple-600',
    copo: 'bg-blue-100 text-blue-600',
    combinado: 'bg-green-100 text-green-600'
  }
  return colors[tipo] || colors.complemento
}

export default function CardapioPage() {
  const { cardapio, deleteItemCardapio, updateItemCardapio } = useApp()
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas')
  const [tipoAtivo, setTipoAtivo] = useState<string>('todos')
  const [filtroAtivo, setFiltroAtivo] = useState<string>('todos')
  const [busca, setBusca] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [itemEditando, setItemEditando] = useState<ItemCardapio | null>(null)

  // Filtrar itens do cardápio
  const itensCardapioFiltrados = cardapio.filter(item => {
    const matchCategoria = categoriaAtiva === 'todas' || item.categoria === categoriaAtiva
    const matchTipo = tipoAtivo === 'todos' || item.tipo === tipoAtivo
    const matchBusca = item.nome.toLowerCase().includes(busca.toLowerCase())
    const matchAtivo = 
      filtroAtivo === 'todos' ||
      (filtroAtivo === 'ativo' && item.ativo) ||
      (filtroAtivo === 'inativo' && !item.ativo)
    
    return matchCategoria && matchTipo && matchBusca && matchAtivo
  })

  const handleEdit = (item: ItemCardapio) => {
    setItemEditando(item)
    setMostrarFormulario(true)
  }

  const handleDuplicate = (item: ItemCardapio) => {
    setItemEditando({
      ...item,
      nome: `${item.nome} (Cópia)`,
      id: ''
    })
    setMostrarFormulario(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item do cardápio?')) {
      deleteItemCardapio(id)
    }
  }

  const toggleStatus = (item: ItemCardapio) => {
    updateItemCardapio(item.id, { ativo: !item.ativo })
  }

  // Estatísticas do cardápio
  const estatisticas = {
    totalItens: cardapio.length,
    itensAtivos: cardapio.filter(item => item.ativo).length,
    margemMedia: cardapio.length > 0 
      ? cardapio.reduce((acc, item) => acc + item.percentualMargem, 0) / cardapio.length 
      : 0,
    precoMedio: cardapio.length > 0 
      ? cardapio.reduce((acc, item) => acc + item.precoVenda, 0) / cardapio.length 
      : 0
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
              <h1 className="text-3xl font-bold text-gray-900">Cardápio</h1>
              <p className="text-gray-600 mt-2">Sistema completo de gestão do cardápio de vendas</p>
            </div>
            <button
              onClick={() => {
                setItemEditando(null)
                setMostrarFormulario(true)
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
            >
              <Plus className="h-5 w-5" />
              Novo Item
            </button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Itens</p>
                  <p className="text-2xl font-semibold text-gray-900">{estatisticas.totalItens}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Itens Ativos</p>
                  <p className="text-2xl font-semibold text-gray-900">{estatisticas.itensAtivos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Margem Média</p>
                  <p className="text-2xl font-semibold text-gray-900">{estatisticas.margemMedia.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Preço Médio</p>
                  <p className="text-2xl font-semibold text-gray-900">R$ {estatisticas.precoMedio.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar item..."
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
                  {Object.entries(categorias).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <select 
                value={tipoAtivo} 
                onChange={(e) => setTipoAtivo(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
                {Object.entries(tipos).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <select 
                value={filtroAtivo} 
                onChange={(e) => setFiltroAtivo(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
                <option value="todos">Todos os status</option>
                <option value="ativo">Ativos</option>
                <option value="inativo">Inativos</option>
              </select>
            </div>
          </div>

          {/* Lista de itens do cardápio */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itensCardapioFiltrados.map((item) => {
              const IconeTipo = getTipoIcon(item.tipo)
              
              return (
                <div key={item.id} className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 ${!item.ativo ? 'opacity-75' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-lg ${getTipoColor(item.tipo)}`}>
                          <IconeTipo className="h-4 w-4" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.nome}</h3>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoriaColor(item.categoria)}`}>
                          {categorias[item.categoria as keyof typeof categorias]}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(item.tipo)}`}>
                          {tipos[item.tipo as keyof typeof tipos].replace(/\p{Emoji}/gu, '').trim()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleStatus(item)}
                        className={`p-1 rounded ${item.ativo ? 'text-green-600' : 'text-gray-400'}`}
                        title={item.ativo ? 'Desativar' : 'Ativar'}
                      >
                        {item.ativo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(item)}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Duplicar"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {item.observacoes && (
                    <p className="text-sm text-gray-600 mb-4">{item.observacoes}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Custo:</span>
                      <span className="font-medium">R$ {item.custo.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Preço de Venda:</span>
                      <span className="font-bold text-green-600">R$ {item.precoVenda.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Markup:</span>
                      <span className="font-medium">R$ {item.markup.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Margem:</span>
                      <span className={`font-medium ${item.percentualMargem >= 100 ? 'text-green-600' : item.percentualMargem >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {item.percentualMargem.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Informações específicas por tipo */}
                  {item.tipo === 'combinado' && item.composicao && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-xs text-gray-600 mb-1">Composição:</p>
                      <div className="text-xs text-gray-600">
                        {item.composicao.length} item{item.composicao.length !== 1 ? 'ns' : ''} no combinado
                      </div>
                    </div>
                  )}

                  {item.dataCriacao && (
                    <div className="border-t pt-3 mt-3 text-xs text-gray-400">
                      Criado em {formatDate(item.dataCriacao)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {itensCardapioFiltrados.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum item encontrado</h3>
              <p className="mt-1 text-sm text-gray-600">
                {cardapio.length === 0 
                  ? 'Comece criando seu primeiro item no cardápio.'
                  : 'Tente ajustar os filtros de busca.'}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modal do formulário */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {itemEditando?.id ? 'Editar Item do Cardápio' : 'Novo Item do Cardápio'}
              </h2>
              <button
                onClick={() => {
                  setMostrarFormulario(false)
                  setItemEditando(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <FormularioCardapio
              item={itemEditando}
              onSave={() => {
                setMostrarFormulario(false)
                setItemEditando(null)
              }}
              onCancel={() => {
                setMostrarFormulario(false)
                setItemEditando(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}