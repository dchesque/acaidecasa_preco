'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { X, Plus, Edit, Trash2, Truck, Calculator, Star, AlertCircle } from 'lucide-react'
import { Insumo, PrecoInsumoFornecedor } from '@/types'

interface PrecoFornecedorModalProps {
  isOpen: boolean
  onClose: () => void
  insumo: Insumo | null
}

const UNIDADES_MEDIDA = [
  { value: 'g', label: 'Gramas (g)' },
  { value: 'kg', label: 'Quilogramas (kg)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'unidade', label: 'Unidade' }
]

export default function PrecoFornecedorModal({ isOpen, onClose, insumo }: PrecoFornecedorModalProps) {
  const { 
    fornecedores,
    precosInsumoFornecedor,
    addPrecoInsumoFornecedor,
    updatePrecoInsumoFornecedor,
    deletePrecoInsumoFornecedor,
    setFornecedorPadrao
  } = useApp()

  const [showForm, setShowForm] = useState(false)
  const [editingPreco, setEditingPreco] = useState<PrecoInsumoFornecedor | null>(null)
  const [formData, setFormData] = useState({
    fornecedorId: '',
    precoBruto: '',
    precoComDesconto: '',
    unidade: 'g',
    quantidadeMinima: '',
    tempoEntregaDias: '',
    ativo: true,
    padrao: false
  })

  // Filtrar preços deste insumo
  const precosDoInsumo = insumo 
    ? precosInsumoFornecedor.filter(p => p.insumoId === insumo.id)
    : []

  const resetForm = () => {
    setFormData({
      fornecedorId: '',
      precoBruto: '',
      precoComDesconto: '',
      unidade: insumo?.unidadeMedida || 'g',
      quantidadeMinima: '',
      tempoEntregaDias: '',
      ativo: true,
      padrao: false
    })
    setShowForm(false)
    setEditingPreco(null)
  }

  useEffect(() => {
    if (editingPreco) {
      setFormData({
        fornecedorId: editingPreco.fornecedorId,
        precoBruto: editingPreco.precoBruto.toString(),
        precoComDesconto: editingPreco.precoComDesconto.toString(),
        unidade: editingPreco.unidade,
        quantidadeMinima: editingPreco.quantidadeMinima?.toString() || '',
        tempoEntregaDias: editingPreco.tempoEntregaDias?.toString() || '',
        ativo: editingPreco.ativo,
        padrao: editingPreco.padrao
      })
      setShowForm(true)
    }
  }, [editingPreco])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!insumo) return

    const precoBruto = parseFloat(formData.precoBruto)
    const precoComDesconto = parseFloat(formData.precoComDesconto)

    if (precoBruto < precoComDesconto) {
      alert('Preço bruto deve ser maior ou igual ao preço com desconto')
      return
    }

    const precoData = {
      insumoId: insumo.id,
      fornecedorId: formData.fornecedorId,
      precoBruto,
      precoComDesconto,
      unidade: formData.unidade,
      quantidadeMinima: formData.quantidadeMinima ? parseInt(formData.quantidadeMinima) : undefined,
      tempoEntregaDias: formData.tempoEntregaDias ? parseInt(formData.tempoEntregaDias) : undefined,
      ativo: formData.ativo,
      padrao: formData.padrao
    }

    if (editingPreco) {
      updatePrecoInsumoFornecedor(editingPreco.id, precoData)
    } else {
      addPrecoInsumoFornecedor(precoData)
    }

    resetForm()
  }

  const handleEdit = (preco: PrecoInsumoFornecedor) => {
    setEditingPreco(preco)
  }

  const handleDelete = (precoId: string) => {
    if (confirm('Tem certeza que deseja excluir este preço?')) {
      deletePrecoInsumoFornecedor(precoId)
    }
  }

  const handleSetPadrao = (fornecedorId: string) => {
    if (insumo) {
      setFornecedorPadrao(insumo.id, fornecedorId)
    }
  }

  const getFornecedorNome = (fornecedorId: string) => {
    return fornecedores.find(f => f.id === fornecedorId)?.nome || 'Fornecedor não encontrado'
  }

  // Calcular desconto percentual
  const calcularDesconto = (precoBruto: number, precoComDesconto: number) => {
    if (precoBruto === 0) return 0
    return ((precoBruto - precoComDesconto) / precoBruto) * 100
  }

  // Fornecedores disponíveis (não cadastrados para este insumo)
  const fornecedoresDisponiveis = fornecedores.filter(f => 
    f.ativo && !precosDoInsumo.some(p => p.fornecedorId === f.id)
  )

  if (!isOpen || !insumo) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Fornecedores e Preços</h2>
              <p className="text-gray-600">{insumo.nome}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Botão para adicionar novo fornecedor */}
          {!showForm && fornecedoresDisponiveis.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Adicionar Fornecedor
              </button>
            </div>
          )}

          {/* Formulário */}
          {showForm && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingPreco ? 'Editar Preço' : 'Novo Fornecedor'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fornecedor *
                    </label>
                    <select
                      required
                      value={formData.fornecedorId}
                      onChange={(e) => setFormData({...formData, fornecedorId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!!editingPreco}
                    >
                      <option value="">Selecione o fornecedor</option>
                      {(editingPreco ? fornecedores : fornecedoresDisponiveis).map(fornecedor => (
                        <option key={fornecedor.id} value={fornecedor.id}>
                          {fornecedor.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Bruto (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      required
                      value={formData.precoBruto}
                      onChange={(e) => setFormData({...formData, precoBruto: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Final (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      required
                      value={formData.precoComDesconto}
                      onChange={(e) => setFormData({...formData, precoComDesconto: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unidade
                    </label>
                    <select
                      value={formData.unidade}
                      onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {UNIDADES_MEDIDA.map(unidade => (
                        <option key={unidade.value} value={unidade.value}>
                          {unidade.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantidade Mínima
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantidadeMinima}
                      onChange={(e) => setFormData({...formData, quantidadeMinima: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prazo de Entrega (dias)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.tempoEntregaDias}
                      onChange={(e) => setFormData({...formData, tempoEntregaDias: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.ativo}
                      onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">Ativo</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.padrao}
                      onChange={(e) => setFormData({...formData, padrao: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">Usar como padrão nos cálculos</span>
                  </label>
                </div>

                {formData.precoBruto && formData.precoComDesconto && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Análise de Preço</span>
                    </div>
                    <div className="text-sm text-green-700">
                      <div>Preço Final: R$ {parseFloat(formData.precoComDesconto || '0').toFixed(3)} / {formData.unidade}</div>
                      <div>Desconto: {calcularDesconto(parseFloat(formData.precoBruto || '0'), parseFloat(formData.precoComDesconto || '0')).toFixed(1)}%</div>
                      <div>Economia: R$ {(parseFloat(formData.precoBruto || '0') - parseFloat(formData.precoComDesconto || '0')).toFixed(3)}</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {editingPreco ? 'Atualizar' : 'Adicionar'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de preços */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Fornecedores Cadastrados ({precosDoInsumo.length})
            </h3>

            {precosDoInsumo.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Truck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum fornecedor</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Adicione fornecedores para este insumo.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fornecedor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço Bruto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Desconto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço Final
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prazo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {precosDoInsumo.map((preco) => (
                      <tr key={preco.id} className={preco.padrao ? 'bg-blue-50' : ''}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {preco.padrao && (
                              <Star className="h-4 w-4 text-yellow-500 mr-2" />
                            )}
                            <span className="text-sm font-medium text-gray-900">
                              {getFornecedorNome(preco.fornecedorId)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {preco.precoBruto.toFixed(3)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {calcularDesconto(preco.precoBruto, preco.precoComDesconto).toFixed(1)}%
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-green-600">
                            R$ {preco.precoComDesconto.toFixed(3)}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">/ {preco.unidade}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {preco.tempoEntregaDias ? `${preco.tempoEntregaDias} dias` : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              preco.ativo 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {preco.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                            {preco.padrao && (
                              <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                Padrão
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            {!preco.padrao && preco.ativo && (
                              <button
                                onClick={() => handleSetPadrao(preco.fornecedorId)}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                                title="Definir como padrão"
                              >
                                Tornar Padrão
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(preco)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(preco.id)}
                              className="text-red-600 hover:text-red-800"
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
            )}

            {/* Alerta se não há fornecedor padrão */}
            {precosDoInsumo.length > 0 && !precosDoInsumo.some(p => p.padrao && p.ativo) && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Nenhum fornecedor padrão definido
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Defina um fornecedor como padrão para que ele seja usado nos cálculos de custo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}