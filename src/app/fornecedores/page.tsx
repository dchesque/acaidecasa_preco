'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import { 
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Truck,
  Package,
  TrendingUp,
  DollarSign,
  Filter,
  Building2,
  CheckCircle,
  XCircle,
  Settings,
  BarChart3,
  Eye,
  MoreVertical
} from 'lucide-react'
import GerenciadorProdutosFornecedor from '@/components/GerenciadorProdutosFornecedor'
import ComparadorFornecedoresVisual from '@/components/ComparadorFornecedoresVisual'

export default function FornecedoresPage() {
  const { 
    fornecedores, 
    produtosFornecedores, 
    insumos,
    addFornecedor, 
    updateFornecedor, 
    deleteFornecedor,
    calcularEconomiaTotal
  } = useApp()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingFornecedor, setEditingFornecedor] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'lista' | 'comparacao'>('lista')
  const [managingProducts, setManagingProducts] = useState<{ id: string, nome: string } | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  
  const [formData, setFormData] = useState({
    nome: '',
    contato: {
      telefone: '',
      email: '',
      endereco: ''
    },
    observacoes: '',
    ativo: true
  })

  // Estatísticas
  const totalFornecedores = fornecedores.length
  const fornecedoresAtivos = fornecedores.filter(f => f.ativo).length
  const totalProdutos = produtosFornecedores.length
  const economiaPotencial = calcularEconomiaTotal()

  // Filtros e busca
  const filteredFornecedores = useMemo(() => {
    return fornecedores.filter(fornecedor => {
      const matchesSearch = fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fornecedor.contato.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fornecedor.contato.telefone?.includes(searchTerm)
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && fornecedor.ativo) ||
                           (statusFilter === 'inactive' && !fornecedor.ativo)
      
      return matchesSearch && matchesStatus
    })
  }, [fornecedores, searchTerm, statusFilter])

  const openModal = (fornecedor?: any) => {
    if (fornecedor) {
      setEditingFornecedor(fornecedor.id)
      setFormData({
        nome: fornecedor.nome,
        contato: fornecedor.contato,
        observacoes: fornecedor.observacoes || '',
        ativo: fornecedor.ativo
      })
    } else {
      setEditingFornecedor(null)
      setFormData({
        nome: '',
        contato: {
          telefone: '',
          email: '',
          endereco: ''
        },
        observacoes: '',
        ativo: true
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingFornecedor(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingFornecedor) {
      updateFornecedor(editingFornecedor, formData)
    } else {
      addFornecedor(formData)
    }
    
    closeModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      deleteFornecedor(id)
    }
  }

  const getProdutoCount = (fornecedorId: string) => {
    return produtosFornecedores.filter(p => p.fornecedorId === fornecedorId && p.ativo).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Fornecedores</h1>
                <p className="text-gray-600 mt-2">Gerencie fornecedores e compare preços</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('lista')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'lista'
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Building2 className="h-4 w-4 inline mr-2" />
                    Lista de Fornecedores
                  </button>
                  <button
                    onClick={() => setActiveTab('comparacao')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'comparacao'
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 inline mr-2" />
                    Comparação Visual
                  </button>
                </div>
                {activeTab === 'lista' && (
                  <button
                    onClick={() => openModal()}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Novo Fornecedor
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content Switching */}
          {managingProducts ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setManagingProducts(null)}
                  className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
                >
                  ← Voltar aos Fornecedores
                </button>
              </div>
              <GerenciadorProdutosFornecedor 
                fornecedorId={managingProducts.id}
                fornecedorNome={managingProducts.nome}
              />
            </div>
          ) : activeTab === 'comparacao' ? (
            <ComparadorFornecedoresVisual />
          ) : (
            <>
              {/* Cards de Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Fornecedores</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalFornecedores}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Fornecedores Ativos</p>
                  <p className="text-2xl font-semibold text-gray-900">{fornecedoresAtivos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Produtos Cadastrados</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalProdutos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Economia Potencial</p>
                  <p className="text-2xl font-semibold text-gray-900">R$ {economiaPotencial.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar fornecedores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seletor de visualização */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Visualização:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'table'
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Tabela
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'cards'
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Cards
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Fornecedores */}
          {filteredFornecedores.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Truck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-semibold text-gray-900">Nenhum fornecedor encontrado</h3>
              <p className="mt-1 text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece cadastrando seu primeiro fornecedor.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => openModal()}
                  className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Adicionar Fornecedor
                </button>
              )}
            </div>
          ) : viewMode === 'table' ? (
            /* Visualização em Tabela */
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-purple-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                        Fornecedor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                        Produtos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFornecedores.map((fornecedor) => (
                      <tr key={fornecedor.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${fornecedor.ativo ? 'bg-green-100' : 'bg-red-100'}`}>
                              <Building2 className={`h-5 w-5 ${fornecedor.ativo ? 'text-green-600' : 'text-red-600'}`} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{fornecedor.nome}</div>
                              {fornecedor.observacoes && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {fornecedor.observacoes}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {fornecedor.contato.telefone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-3 w-3 mr-1" />
                                {fornecedor.contato.telefone}
                              </div>
                            )}
                            {fornecedor.contato.email && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-3 w-3 mr-1" />
                                {fornecedor.contato.email}
                              </div>
                            )}
                            {fornecedor.contato.endereco && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span className="truncate max-w-xs">{fornecedor.contato.endereco}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {getProdutoCount(fornecedor.id)}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">produtos</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {fornecedor.ativo ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="w-3 h-3 mr-1" />
                              Inativo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setManagingProducts({ id: fornecedor.id, nome: fornecedor.nome })}
                              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Gerenciar Produtos"
                            >
                              <Settings className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openModal(fornecedor)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(fornecedor.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Visualização em Cards */
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredFornecedores.map((fornecedor) => (
                <div key={fornecedor.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${fornecedor.ativo ? 'bg-green-100' : 'bg-red-100'}`}>
                          <Building2 className={`h-6 w-6 ${fornecedor.ativo ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold text-gray-900">{fornecedor.nome}</h3>
                          <div className="flex items-center mt-1">
                            {fornecedor.ativo ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Ativo
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3 mr-1" />
                                Inativo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(fornecedor)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(fornecedor.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Informações de Contato */}
                    <div className="space-y-2 mb-4">
                      {fornecedor.contato.telefone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {fornecedor.contato.telefone}
                        </div>
                      )}
                      {fornecedor.contato.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {fornecedor.contato.email}
                        </div>
                      )}
                      {fornecedor.contato.endereco && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {fornecedor.contato.endereco}
                        </div>
                      )}
                    </div>

                    {/* Métricas */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Produtos:</span>
                        <span className="font-medium text-gray-900">{getProdutoCount(fornecedor.id)}</span>
                      </div>
                    </div>

                    {fornecedor.observacoes && (
                      <div className="mt-3 text-sm text-gray-600">
                        <strong>Obs:</strong> {fornecedor.observacoes}
                      </div>
                    )}
                    {/* Botão para Gerenciar Produtos */}
                    <div className="mt-4 pt-4 border-t">
                      <button
                        onClick={() => setManagingProducts({ id: fornecedor.id, nome: fornecedor.nome })}
                        className="w-full bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 text-sm flex items-center justify-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Gerenciar Produtos
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
            </>
          )}
        </main>
      </div>

      {/* Modal de Fornecedor */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-lg bg-white shadow-lg rounded-lg">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingFornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Informações Básicas</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Fornecedor *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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
                    Fornecedor ativo
                  </label>
                </div>
              </div>

              {/* Informações de Contato */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Contato</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={formData.contato.telefone}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contato: { ...formData.contato, telefone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contato.email}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contato: { ...formData.contato, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={formData.contato.endereco}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contato: { ...formData.contato, endereco: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    rows={3}
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
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
                  {editingFornecedor ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}