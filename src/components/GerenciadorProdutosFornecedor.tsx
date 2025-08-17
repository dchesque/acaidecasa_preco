'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { 
  Plus,
  Edit2,
  Trash2,
  Package,
  Clock,
  Percent,
  DollarSign
} from 'lucide-react'

interface GerenciadorProdutosFornecedorProps {
  fornecedorId: string
  fornecedorNome: string
}

export default function GerenciadorProdutosFornecedor({ 
  fornecedorId, 
  fornecedorNome 
}: GerenciadorProdutosFornecedorProps) {
  const { 
    produtosFornecedores, 
    insumos, 
    addProdutoFornecedor,
    updateProdutoFornecedor,
    deleteProdutoFornecedor
  } = useApp()

  const [showModal, setShowModal] = useState(false)
  const [editingProduto, setEditingProduto] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    insumoId: '',
    precoUnitario: 0,
    unidade: 'g',
    quantidadeMinima: 0,
    tempoEntregaDias: 0,
    percentualDesconto: 0,
    ativo: true
  })

  const produtosFornecedor = produtosFornecedores.filter(p => p.fornecedorId === fornecedorId)
  const insumosDisponiveis = insumos.filter(i => i.ativo)

  const openModal = (produto?: any) => {
    if (produto) {
      setEditingProduto(produto.id)
      setFormData({
        insumoId: produto.insumoId,
        precoUnitario: produto.precoUnitario,
        unidade: produto.unidade,
        quantidadeMinima: produto.quantidadeMinima || 0,
        tempoEntregaDias: produto.tempoEntregaDias || 0,
        percentualDesconto: produto.percentualDesconto,
        ativo: produto.ativo
      })
    } else {
      setEditingProduto(null)
      setFormData({
        insumoId: '',
        precoUnitario: 0,
        unidade: 'g',
        quantidadeMinima: 0,
        tempoEntregaDias: 0,
        percentualDesconto: 0,
        ativo: true
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduto(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingProduto) {
      updateProdutoFornecedor(editingProduto, formData)
    } else {
      addProdutoFornecedor({
        ...formData,
        fornecedorId
      })
    }
    
    closeModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      deleteProdutoFornecedor(id)
    }
  }

  const getInsumoNome = (insumoId: string) => {
    const insumo = insumos.find(i => i.id === insumoId)
    return insumo?.nome || 'Insumo não encontrado'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Itens de {fornecedorNome}
          </h3>
          <p className="text-gray-600 text-sm">
            Gerencie os insumos e preços oferecidos por este fornecedor
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Item
        </button>
      </div>

      {produtosFornecedor.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum item cadastrado</h3>
          <p className="mt-1 text-gray-500">
            Adicione insumos que este fornecedor oferece para começar a comparar preços.
          </p>
          <button
            onClick={() => openModal()}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Adicionar Primeiro Item
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insumo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Desconto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço Final
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entrega
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produtosFornecedor.map((produto) => (
                <tr key={produto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getInsumoNome(produto.insumoId)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Unidade: {produto.unidade}
                          {produto.quantidadeMinima && produto.quantidadeMinima > 0 && (
                            <span className="ml-2">• Min: {produto.quantidadeMinima}{produto.unidade}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      R$ {produto.precoUnitario.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {produto.percentualDesconto > 0 ? (
                      <div className="flex items-center text-green-600">
                        <Percent className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          {produto.percentualDesconto.toFixed(1)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Sem desconto</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        R$ {produto.precoComDesconto.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {produto.tempoEntregaDias && produto.tempoEntregaDias > 0 ? (
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {produto.tempoEntregaDias} {produto.tempoEntregaDias === 1 ? 'dia' : 'dias'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Não informado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      produto.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openModal(produto)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(produto.id)}
                        className="text-red-600 hover:text-red-800"
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
      )}

      {/* Modal de Produto */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl bg-white shadow-lg rounded-lg">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProduto ? 'Editar Item' : 'Novo Item'}
              </h3>
              <p className="text-gray-600 text-sm">
                Fornecedor: {fornecedorNome}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insumo *
                  </label>
                  <select
                    required
                    value={formData.insumoId}
                    onChange={(e) => setFormData({ ...formData, insumoId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Selecione um insumo</option>
                    {insumosDisponiveis.map((insumo) => (
                      <option key={insumo.id} value={insumo.id}>
                        {insumo.nome} ({insumo.unidadeMedida})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Unitário (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.precoUnitario}
                    onChange={(e) => setFormData({ ...formData, precoUnitario: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidade de Medida
                  </label>
                  <select
                    value={formData.unidade}
                    onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="g">Gramas (g)</option>
                    <option value="kg">Quilogramas (kg)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="l">Litros (l)</option>
                    <option value="unidade">Unidade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade Mínima
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantidadeMinima}
                    onChange={(e) => setFormData({ ...formData, quantidadeMinima: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tempo de Entrega (dias)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.tempoEntregaDias}
                    onChange={(e) => setFormData({ ...formData, tempoEntregaDias: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.percentualDesconto}
                    onChange={(e) => setFormData({ ...formData, percentualDesconto: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="ativo-produto"
                      checked={formData.ativo}
                      onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="ativo-produto" className="ml-2 block text-sm text-gray-900">
                      Item ativo
                    </label>
                  </div>
                </div>
              </div>

              {/* Preview do Preço */}
              {formData.precoUnitario > 0 && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Preview do Preço</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Preço Original:</span>
                      <span className="ml-2 font-medium">R$ {formData.precoUnitario.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Desconto:</span>
                      <span className="ml-2 font-medium text-green-600">
                        {formData.percentualDesconto.toFixed(1)}%
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Preço Final:</span>
                      <span className="ml-2 font-bold text-lg text-purple-600">
                        R$ {(formData.precoUnitario * (1 - formData.percentualDesconto / 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

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
                  {editingProduto ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}