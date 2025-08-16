'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Receita, CustoDetalhadoReceita } from '@/types'
import { 
  X,
  Clock,
  Weight,
  DollarSign,
  Package,
  User,
  FileText,
  Calculator,
  Copy,
  RotateCcw,
  Edit,
  Tag,
  TrendingUp,
  Layers
} from 'lucide-react'

interface ReceitaDetalhadaModalProps {
  receita: Receita | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (receita: Receita) => void
  onDuplicate?: (receita: Receita) => void
  onScale?: (receita: Receita, fator: number) => void
}

export default function ReceitaDetalhadaModal({ 
  receita, 
  isOpen, 
  onClose, 
  onEdit, 
  onDuplicate, 
  onScale 
}: ReceitaDetalhadaModalProps) {
  const { 
    categoriasReceita,
    insumos,
    fornecedores,
    categoriasInsumo,
    getInsumoPrecoAtivo,
    calcularCustoPorGrama,
    calcularCustoReceitaDetalhado
  } = useApp()

  const [fatorEscala, setFatorEscala] = useState(2)
  const [mostrarEscala, setMostrarEscala] = useState(false)

  // Calcular detalhes de custo
  const custoDetalhado: CustoDetalhadoReceita = useMemo(() => {
    if (!receita) {
      return {
        custoTotal: 0,
        custoPorGrama: 0,
        ingredientes: [],
        fornecedoresEnvolvidos: []
      }
    }
    return calcularCustoReceitaDetalhado(receita.ingredientes, receita.rendimento)
  }, [receita, calcularCustoReceitaDetalhado])

  if (!isOpen || !receita) return null

  // Obter categoria
  const categoria = receita.categoriaId 
    ? categoriasReceita.find(c => c.id === receita.categoriaId)
    : null

  const getIngredienteInfo = (insumoId: string) => {
    const insumo = insumos.find(i => i.id === insumoId)
    const precoAtivo = getInsumoPrecoAtivo(insumoId)
    const categoria = insumo?.categoriaId 
      ? categoriasInsumo.find(c => c.id === insumo.categoriaId)?.nome 
      : undefined
    const fornecedor = precoAtivo 
      ? fornecedores.find(f => f.id === precoAtivo.fornecedorId)?.nome 
      : undefined

    return {
      nome: insumo?.nome || 'Insumo não encontrado',
      categoria,
      fornecedor,
      unidadeMedida: insumo?.unidadeMedida || 'g',
      precoPorGrama: calcularCustoPorGrama(insumoId)
    }
  }

  const handleScale = () => {
    if (onScale && fatorEscala > 0) {
      onScale(receita, fatorEscala)
      setMostrarEscala(false)
      onClose()
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{receita.nome}</h2>
              {categoria && (
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: categoria.cor }}
                >
                  {categoria.nome}
                </span>
              )}
            </div>
            {receita.descricao && (
              <p className="text-gray-600">{receita.descricao}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(receita)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Editar receita"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(receita)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                title="Duplicar receita"
              >
                <Copy className="h-5 w-5" />
              </button>
            )}
            {onScale && (
              <button
                onClick={() => setMostrarEscala(!mostrarEscala)}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                title="Escalar receita"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Modal de Escala */}
          {mostrarEscala && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Escalar Receita
              </h4>
              <div className="flex items-center gap-3">
                <label className="text-sm text-purple-700">Fator de escala:</label>
                <input
                  type="number"
                  value={fatorEscala}
                  onChange={(e) => setFatorEscala(Number(e.target.value))}
                  className="w-20 border rounded px-2 py-1 text-sm"
                  min="0.1"
                  step="0.1"
                />
                <span className="text-sm text-purple-600">
                  (Rendimento final: {(receita.rendimento * fatorEscala).toFixed(0)}g)
                </span>
                <button
                  onClick={handleScale}
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                >
                  Criar Receita Escalada
                </button>
                <button
                  onClick={() => setMostrarEscala(false)}
                  className="text-purple-600 text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna 1: Informações Gerais */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informações Gerais
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Weight className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Rendimento</p>
                      <p className="font-medium">{receita.rendimento}g</p>
                    </div>
                  </div>

                  {receita.tempoPreparoMinutos && receita.tempoPreparoMinutos > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Tempo de Preparo</p>
                        <p className="font-medium">{receita.tempoPreparoMinutos} minutos</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Custo por Grama</p>
                      <p className="font-medium text-lg">R$ {receita.custoPorGrama.toFixed(3)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calculator className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Custo Total</p>
                      <p className="font-medium text-lg">R$ {receita.custoTotal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {receita.observacoes && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                    <p className="text-gray-600 text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      {receita.observacoes}
                    </p>
                  </div>
                )}

                <div className="text-xs text-gray-500 space-y-1 mt-6">
                  <p>Criada em: {formatDate(receita.dataCriacao)}</p>
                  <p>Atualizada em: {formatDate(receita.dataAtualizacao)}</p>
                </div>
              </div>
            </div>

            {/* Coluna 2: Ingredientes Detalhados */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Ingredientes ({receita.ingredientes.length})
                </h3>

                <div className="space-y-3">
                  {custoDetalhado.ingredientes.map((ingrediente, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{ingrediente.nome}</h4>
                          {ingrediente.categoria && (
                            <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mt-1">
                              {ingrediente.categoria}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">R$ {ingrediente.subtotal.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Quantidade:</span>
                          <span className="font-medium">{ingrediente.quantidade}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Preço/g:</span>
                          <span>R$ {ingrediente.precoPorGrama.toFixed(3)}</span>
                        </div>
                        {ingrediente.fornecedor && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <User className="h-3 w-3" />
                            <span className="text-xs">{ingrediente.fornecedor}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumo dos Ingredientes */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Resumo dos Ingredientes</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div className="flex justify-between">
                      <span>Total de ingredientes:</span>
                      <span className="font-medium">{receita.ingredientes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Custo total dos ingredientes:</span>
                      <span className="font-medium">R$ {custoDetalhado.custoTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peso total dos ingredientes:</span>
                      <span className="font-medium">
                        {receita.ingredientes.reduce((total, ing) => total + ing.quantidade, 0)}g
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna 3: Análises e Modo de Preparo */}
            <div className="space-y-6">
              {/* Fornecedores Envolvidos */}
              {custoDetalhado.fornecedoresEnvolvidos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Fornecedores ({custoDetalhado.fornecedoresEnvolvidos.length})
                  </h3>
                  
                  <div className="space-y-3">
                    {custoDetalhado.fornecedoresEnvolvidos.map((fornecedor, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-green-50">
                        <h4 className="font-medium text-green-900 mb-1">{fornecedor.nome}</h4>
                        <div className="text-sm text-green-700">
                          <p className="mb-1">{fornecedor.itens.length} ingrediente{fornecedor.itens.length > 1 ? 's' : ''}:</p>
                          <ul className="text-xs space-y-0.5">
                            {fornecedor.itens.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-green-600">• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Análise de Rentabilidade */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Análise de Rentabilidade
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Simulação de Venda (100g)</h4>
                    <div className="text-sm text-yellow-800 space-y-1">
                      <div className="flex justify-between">
                        <span>Custo:</span>
                        <span>R$ {(receita.custoPorGrama * 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Preço sugerido (100% markup):</span>
                        <span className="font-medium">R$ {(receita.custoPorGrama * 100 * 2).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Preço sugerido (150% markup):</span>
                        <span className="font-medium">R$ {(receita.custoPorGrama * 100 * 2.5).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Comparativo de Eficiência</h4>
                    <div className="text-sm text-purple-800 space-y-1">
                      <div className="flex justify-between">
                        <span>Custo por 50g (porção típica):</span>
                        <span>R$ {(receita.custoPorGrama * 50).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rendimento da receita:</span>
                        <span>{Math.floor(receita.rendimento / 50)} porções de 50g</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modo de Preparo */}
              {receita.modoPreparo && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Modo de Preparo
                  </h3>
                  
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <div className="whitespace-pre-wrap text-sm text-gray-700">
                      {receita.modoPreparo}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Status: <span className={`font-medium ${receita.ativa ? 'text-green-600' : 'text-red-600'}`}>
                {receita.ativa ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}