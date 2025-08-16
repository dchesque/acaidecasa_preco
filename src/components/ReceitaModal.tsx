'use client'

import { useState, useEffect, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Receita, ItemReceita, CustoDetalhadoReceita } from '@/types'
import { 
  Plus,
  Search,
  Trash2,
  X,
  Save,
  AlertTriangle,
  Package,
  User,
  Tag,
  Calculator,
  Clock,
  FileText,
  ChevronDown,
  ShoppingCart
} from 'lucide-react'

interface ReceitaModalProps {
  receita?: Receita | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

interface IngredienteSugerido {
  id: string
  nome: string
  categoria?: string
  fornecedor?: string
  precoPorGrama: number
  unidadeMedida: string
}

export default function ReceitaModal({ receita, isOpen, onClose, onSave }: ReceitaModalProps) {
  const { 
    addReceita, 
    updateReceita,
    categoriasReceita,
    addCategoriaReceita,
    insumos,
    fornecedores,
    categoriasInsumo,
    getInsumoPrecoAtivo,
    calcularCustoPorGrama,
    calcularCustoReceitaDetalhado
  } = useApp()

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoriaId: '',
    rendimento: 0,
    tempoPreparoMinutos: 0,
    modoPreparo: '',
    observacoes: '',
    ingredientes: [] as ItemReceita[]
  })

  const [buscarIngrediente, setBuscarIngrediente] = useState('')
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)
  const [novaCategoria, setNovaCategoria] = useState('')
  const [mostrarNovaCategoria, setMostrarNovaCategoria] = useState(false)
  const [erro, setErro] = useState('')

  // Resetar form quando receita mudar
  useEffect(() => {
    if (receita) {
      setFormData({
        nome: receita.nome,
        descricao: receita.descricao || '',
        categoriaId: receita.categoriaId || '',
        rendimento: receita.rendimento,
        tempoPreparoMinutos: receita.tempoPreparoMinutos || 0,
        modoPreparo: receita.modoPreparo || '',
        observacoes: receita.observacoes || '',
        ingredientes: receita.ingredientes
      })
    } else {
      setFormData({
        nome: '',
        descricao: '',
        categoriaId: '',
        rendimento: 0,
        tempoPreparoMinutos: 0,
        modoPreparo: '',
        observacoes: '',
        ingredientes: []
      })
    }
    setErro('')
  }, [receita])

  // Buscar ingredientes/insumos ativos
  const ingredientesSugeridos = useMemo((): IngredienteSugerido[] => {
    if (!buscarIngrediente.trim()) return []

    const insumosAtivos = insumos.filter(insumo => 
      insumo.ativo && 
      insumo.nome.toLowerCase().includes(buscarIngrediente.toLowerCase())
    )

    return insumosAtivos.map(insumo => {
      const precoAtivo = getInsumoPrecoAtivo(insumo.id)
      const categoria = insumo.categoriaId 
        ? categoriasInsumo.find(c => c.id === insumo.categoriaId)?.nome 
        : undefined
      
      const fornecedor = precoAtivo 
        ? fornecedores.find(f => f.id === precoAtivo.fornecedorId)?.nome 
        : undefined

      return {
        id: insumo.id,
        nome: insumo.nome,
        categoria,
        fornecedor,
        precoPorGrama: calcularCustoPorGrama(insumo.id),
        unidadeMedida: insumo.unidadeMedida
      }
    }).slice(0, 8) // Limitar a 8 sugestões
  }, [buscarIngrediente, insumos, getInsumoPrecoAtivo, categoriasInsumo, fornecedores, calcularCustoPorGrama])

  // Calcular custo em tempo real
  const custoDetalhado: CustoDetalhadoReceita = useMemo(() => {
    if (formData.ingredientes.length === 0 || formData.rendimento <= 0) {
      return {
        custoTotal: 0,
        custoPorGrama: 0,
        ingredientes: [],
        fornecedoresEnvolvidos: []
      }
    }
    return calcularCustoReceitaDetalhado(formData.ingredientes, formData.rendimento)
  }, [formData.ingredientes, formData.rendimento, calcularCustoReceitaDetalhado])

  if (!isOpen) return null

  const adicionarIngrediente = (ingredienteSugerido: IngredienteSugerido) => {
    // Verificar se já não está na lista
    const jaExiste = formData.ingredientes.some(ing => ing.insumoId === ingredienteSugerido.id)
    if (jaExiste) {
      setErro('Este ingrediente já foi adicionado à receita')
      return
    }

    const novoIngrediente: ItemReceita = {
      insumoId: ingredienteSugerido.id,
      quantidade: 50, // quantidade padrão
      observacao: ''
    }

    setFormData({
      ...formData,
      ingredientes: [...formData.ingredientes, novoIngrediente]
    })
    setBuscarIngrediente('')
    setMostrarSugestoes(false)
    setErro('')
  }

  const removerIngrediente = (index: number) => {
    const novosIngredientes = formData.ingredientes.filter((_, i) => i !== index)
    setFormData({ ...formData, ingredientes: novosIngredientes })
  }

  const atualizarQuantidadeIngrediente = (index: number, quantidade: number) => {
    const novosIngredientes = [...formData.ingredientes]
    novosIngredientes[index] = { ...novosIngredientes[index], quantidade }
    setFormData({ ...formData, ingredientes: novosIngredientes })
  }

  const criarNovaCategoria = () => {
    if (!novaCategoria.trim()) {
      setErro('Nome da categoria é obrigatório')
      return
    }

    try {
      addCategoriaReceita({ nome: novaCategoria.trim() })
      setNovaCategoria('')
      setMostrarNovaCategoria(false)
      setErro('')
    } catch (error) {
      setErro('Erro ao criar categoria')
    }
  }

  const handleSave = () => {
    // Validações
    if (!formData.nome.trim()) {
      setErro('Nome da receita é obrigatório')
      return
    }

    if (formData.ingredientes.length === 0) {
      setErro('Adicione pelo menos um ingrediente')
      return
    }

    if (formData.rendimento <= 0) {
      setErro('Rendimento deve ser maior que zero')
      return
    }

    // Verificar se todas as quantidades são válidas
    const quantidadesInvalidas = formData.ingredientes.some(ing => ing.quantidade <= 0)
    if (quantidadesInvalidas) {
      setErro('Todas as quantidades dos ingredientes devem ser maiores que zero')
      return
    }

    try {
      if (receita?.id) {
        updateReceita(receita.id, formData)
      } else {
        addReceita({
          ...formData,
          ativa: true
        })
      }
      onSave()
    } catch (error) {
      setErro('Erro ao salvar receita')
    }
  }

  const getIngredienteNome = (insumoId: string) => {
    return insumos.find(insumo => insumo.id === insumoId)?.nome || 'Ingrediente não encontrado'
  }

  const getIngredienteFornecedor = (insumoId: string) => {
    const precoAtivo = getInsumoPrecoAtivo(insumoId)
    if (!precoAtivo) return null
    return fornecedores.find(f => f.id === precoAtivo.fornecedorId)?.nome
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {receita?.id ? 'Editar Receita' : 'Nova Receita'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-700 text-sm">{erro}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna 1: Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações Básicas
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Receita *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Ex: Creme de Ninho Caseiro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 h-20 resize-none"
                  placeholder="Breve descrição da receita..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.categoriaId}
                    onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                    className="flex-1 border rounded-lg px-3 py-2"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categoriasReceita.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setMostrarNovaCategoria(!mostrarNovaCategoria)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {mostrarNovaCategoria && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={novaCategoria}
                      onChange={(e) => setNovaCategoria(e.target.value)}
                      className="flex-1 border rounded-lg px-3 py-2 text-sm"
                      placeholder="Nome da nova categoria"
                    />
                    <button
                      onClick={criarNovaCategoria}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm"
                    >
                      Criar
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rendimento (g) *
                  </label>
                  <input
                    type="number"
                    value={formData.rendimento}
                    onChange={(e) => setFormData({ ...formData, rendimento: Number(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tempo (min)
                  </label>
                  <input
                    type="number"
                    value={formData.tempoPreparoMinutos}
                    onChange={(e) => setFormData({ ...formData, tempoPreparoMinutos: Number(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 h-16 resize-none"
                  placeholder="Observações especiais..."
                />
              </div>
            </div>

            {/* Coluna 2: Ingredientes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Ingredientes
              </h3>

              {/* Busca de Ingredientes */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar Ingrediente
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={buscarIngrediente}
                    onChange={(e) => {
                      setBuscarIngrediente(e.target.value)
                      setMostrarSugestoes(e.target.value.length > 0)
                    }}
                    className="w-full border rounded-lg pl-10 pr-3 py-2"
                    placeholder="Digite o nome do ingrediente..."
                  />
                </div>

                {/* Sugestões */}
                {mostrarSugestoes && ingredientesSugeridos.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto">
                    {ingredientesSugeridos.map((ingrediente) => (
                      <div
                        key={ingrediente.id}
                        onClick={() => adicionarIngrediente(ingrediente)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{ingrediente.nome}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                          {ingrediente.categoria && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {ingrediente.categoria}
                            </span>
                          )}
                          {ingrediente.fornecedor && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {ingrediente.fornecedor}
                            </span>
                          )}
                          <span className="text-green-600 font-medium">
                            R$ {ingrediente.precoPorGrama.toFixed(3)}/g
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lista de Ingredientes Adicionados */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredientes Adicionados ({formData.ingredientes.length})
                </label>
                
                {formData.ingredientes.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 border rounded-lg">
                    <ShoppingCart className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm">Nenhum ingrediente adicionado</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {formData.ingredientes.map((ingrediente, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {getIngredienteNome(ingrediente.insumoId)}
                            </div>
                            {getIngredienteFornecedor(ingrediente.insumoId) && (
                              <div className="text-xs text-gray-600 flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {getIngredienteFornecedor(ingrediente.insumoId)}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removerIngrediente(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={ingrediente.quantidade}
                            onChange={(e) => atualizarQuantidadeIngrediente(index, Number(e.target.value))}
                            className="w-20 border rounded px-2 py-1 text-sm"
                            min="0.1"
                            step="0.1"
                          />
                          <span className="text-xs text-gray-600">gramas</span>
                          <span className="text-xs text-green-600 font-medium ml-auto">
                            R$ {(ingrediente.quantidade * calcularCustoPorGrama(ingrediente.insumoId)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Coluna 3: Cálculos e Modo de Preparo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Cálculos e Preparo
              </h3>

              {/* Cálculos em Tempo Real */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Resumo de Custos</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Custo Total:</span>
                    <span className="font-medium text-lg">R$ {custoDetalhado.custoTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Custo por Grama:</span>
                    <span className="font-medium text-green-600">R$ {custoDetalhado.custoPorGrama.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rendimento:</span>
                    <span className="font-medium">{formData.rendimento}g</span>
                  </div>
                </div>

                {custoDetalhado.fornecedoresEnvolvidos.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <h5 className="text-xs font-medium text-gray-700 mb-2">Fornecedores Envolvidos:</h5>
                    <div className="space-y-1">
                      {custoDetalhado.fornecedoresEnvolvidos.map((fornecedor, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          <span className="font-medium">{fornecedor.nome}</span>
                          <span className="text-gray-500"> ({fornecedor.itens.length} item{fornecedor.itens.length > 1 ? 's' : ''})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modo de Preparo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modo de Preparo
                </label>
                <textarea
                  value={formData.modoPreparo}
                  onChange={(e) => setFormData({ ...formData, modoPreparo: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 h-48 resize-none"
                  placeholder="Descreva o passo a passo do preparo..."
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.modoPreparo.length} caracteres
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {receita?.id ? 'Atualizar Receita' : 'Criar Receita'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}