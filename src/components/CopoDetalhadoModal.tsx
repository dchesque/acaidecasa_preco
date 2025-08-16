'use client'

import { useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Copo } from '@/types'
import { 
  X, 
  Coffee,
  Package,
  ChefHat,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  Copy,
  Edit,
  Eye,
  FileText
} from 'lucide-react'

interface CopoDetalhadoModalProps {
  isOpen: boolean
  onClose: () => void
  copo: Copo | null
  onEdit?: () => void
  onDuplicate?: () => void
}

export default function CopoDetalhadoModal({ 
  isOpen, 
  onClose, 
  copo, 
  onEdit, 
  onDuplicate 
}: CopoDetalhadoModalProps) {
  const { 
    categoriasCopo,
    calcularCustoDetalheCopo
  } = useApp()

  const custoDetalhe = useMemo(() => {
    if (!copo) return null
    return calcularCustoDetalheCopo(copo)
  }, [copo, calcularCustoDetalheCopo])

  const categoria = useMemo(() => {
    if (!copo?.categoriaId) return null
    return categoriasCopo.find(c => c.id === copo.categoriaId)
  }, [copo?.categoriaId, categoriasCopo])

  if (!isOpen || !copo || !custoDetalhe) return null

  const percentualInsumos = custoDetalhe.custoTotal > 0 
    ? (custoDetalhe.custoInsumos / custoDetalhe.custoTotal) * 100 
    : 0

  const percentualEmbalagens = custoDetalhe.custoTotal > 0 
    ? (custoDetalhe.custoEmbalagens / custoDetalhe.custoTotal) * 100 
    : 0

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-5xl bg-white shadow-lg rounded-lg max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Coffee className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{copo.nome}</h3>
                {copo.descricao && (
                  <p className="text-gray-600 mt-1">{copo.descricao}</p>
                )}
                <div className="flex items-center mt-2 space-x-4">
                  {categoria && (
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: categoria.cor }}
                      />
                      <span className="text-sm text-gray-600">{categoria.nome}</span>
                    </div>
                  )}
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    copo.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {copo.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                  title="Editar"
                >
                  <Edit className="h-5 w-5" />
                </button>
              )}
              {onDuplicate && (
                <button
                  onClick={onDuplicate}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Duplicar"
                >
                  <Copy className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Composição */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seção de Insumos */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                <ChefHat className="h-5 w-5 mr-2" />
                Insumos ({custoDetalhe.insumos.length})
              </h4>
              
              {custoDetalhe.insumos.length === 0 ? (
                <p className="text-blue-700 text-sm">Nenhum insumo adicionado</p>
              ) : (
                <div className="space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          <th className="pb-2">Insumo</th>
                          <th className="pb-2">Fornecedor</th>
                          <th className="pb-2 text-right">Quantidade</th>
                          <th className="pb-2 text-right">Preço/g</th>
                          <th className="pb-2 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-200">
                        {custoDetalhe.insumos.map((item) => (
                          <tr key={item.insumoId} className="text-sm">
                            <td className="py-2 font-medium text-blue-900">{item.nome}</td>
                            <td className="py-2 text-blue-700">{item.fornecedor || '-'}</td>
                            <td className="py-2 text-right text-blue-700">{item.quantidade}g</td>
                            <td className="py-2 text-right text-blue-700">
                              R$ {item.precoPorGrama.toFixed(4)}
                            </td>
                            <td className="py-2 text-right font-medium text-blue-900">
                              R$ {item.subtotal.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-blue-300">
                          <td colSpan={4} className="py-2 font-semibold text-blue-900">Total de Insumos:</td>
                          <td className="py-2 text-right font-bold text-blue-900">
                            R$ {custoDetalhe.custoInsumos.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Seção de Embalagens */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Embalagens ({custoDetalhe.embalagens.length})
              </h4>
              
              {custoDetalhe.embalagens.length === 0 ? (
                <p className="text-green-700 text-sm">Nenhuma embalagem adicionada</p>
              ) : (
                <div className="space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                          <th className="pb-2">Embalagem</th>
                          <th className="pb-2">Fornecedor</th>
                          <th className="pb-2 text-right">Quantidade</th>
                          <th className="pb-2 text-right">Preço Unit</th>
                          <th className="pb-2 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-green-200">
                        {custoDetalhe.embalagens.map((item) => (
                          <tr key={item.embalagemId} className="text-sm">
                            <td className="py-2 font-medium text-green-900">{item.nome}</td>
                            <td className="py-2 text-green-700">{item.fornecedor || '-'}</td>
                            <td className="py-2 text-right text-green-700">{item.quantidade}</td>
                            <td className="py-2 text-right text-green-700">
                              R$ {item.precoUnitario.toFixed(2)}
                            </td>
                            <td className="py-2 text-right font-medium text-green-900">
                              R$ {item.subtotal.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-green-300">
                          <td colSpan={4} className="py-2 font-semibold text-green-900">Total de Embalagens:</td>
                          <td className="py-2 text-right font-bold text-green-900">
                            R$ {custoDetalhe.custoEmbalagens.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Fornecedores Envolvidos */}
            {custoDetalhe.fornecedoresEnvolvidos.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Fornecedores Envolvidos ({custoDetalhe.fornecedoresEnvolvidos.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {custoDetalhe.fornecedoresEnvolvidos.map((fornecedor, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="font-medium text-gray-900 mb-2">{fornecedor.nome}</div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{fornecedor.itens.length} item{fornecedor.itens.length !== 1 ? 's' : ''}:</span>
                        <div className="mt-1">
                          {fornecedor.itens.map((item, itemIndex) => (
                            <span key={itemIndex} className="inline-block mr-2 mb-1">
                              <span className="px-2 py-1 bg-gray-100 text-xs rounded">{item}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Coluna Lateral - Resumo e Informações */}
          <div className="space-y-6">
            {/* Resumo de Custos */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Resumo Financeiro
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-700">Custo Insumos:</span>
                  <span className="font-medium text-purple-900">R$ {custoDetalhe.custoInsumos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-700">Custo Embalagens:</span>
                  <span className="font-medium text-purple-900">R$ {custoDetalhe.custoEmbalagens.toFixed(2)}</span>
                </div>
                <div className="border-t border-purple-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-purple-900">Custo Total:</span>
                    <span className="font-bold text-xl text-purple-900">R$ {custoDetalhe.custoTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribuição de Custos */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Distribuição de Custos
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Insumos</span>
                    <span className="text-sm font-medium text-gray-900">{percentualInsumos.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentualInsumos}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Embalagens</span>
                    <span className="text-sm font-medium text-gray-900">{percentualEmbalagens.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentualEmbalagens}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Gerais */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Informações Gerais
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${copo.ativo ? 'text-green-600' : 'text-red-600'}`}>
                    {copo.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoria:</span>
                  <span className="font-medium text-gray-900">
                    {categoria?.nome || 'Sem categoria'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Insumos:</span>
                  <span className="font-medium text-gray-900">{custoDetalhe.insumos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Embalagens:</span>
                  <span className="font-medium text-gray-900">{custoDetalhe.embalagens.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Criado em:
                  </span>
                  <span className="font-medium text-gray-900">
                    {new Date(copo.dataCriacao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Atualizado em:
                  </span>
                  <span className="font-medium text-gray-900">
                    {new Date(copo.dataAtualizacao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Observações */}
            {copo.observacoes && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Observações
                </h4>
                <p className="text-yellow-800 text-sm">{copo.observacoes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}