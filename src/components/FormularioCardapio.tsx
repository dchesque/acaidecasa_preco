'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { ItemCardapio, ComposicaoItem } from '@/types'
import { Plus, Save, X, Trash2 } from 'lucide-react'

interface FormularioCardapioProps {
  item?: ItemCardapio | null
  onSave: () => void
  onCancel: () => void
}

const categorias = {
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

const tipos = [
  { value: 'complemento', label: '🍫 Complemento', desc: 'Insumo individual vendido separadamente' },
  { value: 'receita', label: '📝 Receita', desc: 'Receita caseira pronta para venda' },
  { value: 'copo', label: '🥤 Copo', desc: 'Produto completo de açaí' },
  { value: 'combinado', label: '🎯 Combinado', desc: 'Agrupamento de múltiplos itens' }
]

export default function FormularioCardapio({ item, onSave, onCancel }: FormularioCardapioProps) {
  const { insumos, receitas, produtos, addItemCardapio, updateItemCardapio, calcularCustoItemCardapio } = useApp()
  
  const [formData, setFormData] = useState({
    nome: '',
    categoria: 'complementos' as keyof typeof categorias,
    tipo: 'complemento' as 'complemento' | 'copo' | 'receita' | 'combinado',
    insumoId: '',
    receitaId: '',
    produtoId: '',
    precoVenda: 0,
    ativo: true,
    observacoes: ''
  })
  
  const [composicao, setComposicao] = useState<ComposicaoItem[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (item) {
      setFormData({
        nome: item.nome,
        categoria: item.categoria,
        tipo: item.tipo,
        insumoId: item.insumoId || '',
        receitaId: item.receitaId || '',
        produtoId: item.produtoId || '',
        precoVenda: item.precoVenda,
        ativo: item.ativo,
        observacoes: item.observacoes || ''
      })
      setComposicao(item.composicao || [])
    }
  }, [item])

  const custoCalculado = calcularCustoItemCardapio({ 
    ...formData, 
    composicao: formData.tipo === 'combinado' ? composicao : undefined 
  })

  const validarFormulario = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (formData.precoVenda <= 0) {
      newErrors.precoVenda = 'Preço de venda deve ser maior que zero'
    }

    // Validações específicas por tipo
    switch (formData.tipo) {
      case 'complemento':
        if (!formData.insumoId) {
          newErrors.insumoId = 'Selecione um insumo'
        }
        break
      case 'receita':
        if (!formData.receitaId) {
          newErrors.receitaId = 'Selecione uma receita'
        }
        break
      case 'copo':
        if (!formData.produtoId) {
          newErrors.produtoId = 'Selecione um produto'
        }
        break
      case 'combinado':
        if (composicao.length === 0) {
          newErrors.composicao = 'Adicione pelo menos um item à composição'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }

    setIsSubmitting(true)

    try {
      const itemData = {
        ...formData,
        composicao: formData.tipo === 'combinado' ? composicao : undefined
      }

      if (item?.id) {
        updateItemCardapio(item.id, itemData)
      } else {
        addItemCardapio(itemData)
      }

      onSave()
    } catch (error) {
      console.error('Erro ao salvar item:', error)
      setErrors({ submit: 'Erro ao salvar item. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const adicionarComposicao = () => {
    setComposicao([...composicao, {
      tipo: 'insumo',
      quantidade: 0
    }])
  }

  const atualizarComposicao = (index: number, comp: ComposicaoItem) => {
    const nova = [...composicao]
    nova[index] = comp
    setComposicao(nova)
  }

  const removerComposicao = (index: number) => {
    setComposicao(composicao.filter((_, i) => i !== index))
  }

  // Filtrar opções baseadas no tipo
  const insumosDisponiveis = insumos.filter(i => i.ativo)
  const receitasDisponiveis = receitas.filter(r => r.ativa)
  const produtosDisponiveis = produtos.filter(p => p.ativo)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Seção 1: Informações Básicas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Item *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ex: Nutella 50g"
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value as any })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {Object.entries(categorias).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Item *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tipos.map((tipo) => (
              <label key={tipo.value} className="relative">
                <input
                  type="radio"
                  name="tipo"
                  value={tipo.value}
                  checked={formData.tipo === tipo.value}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                  className="sr-only"
                />
                <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  formData.tipo === tipo.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="font-medium text-gray-900">{tipo.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{tipo.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Seção 2: Configuração baseada no tipo */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuração</h3>
        
        {formData.tipo === 'complemento' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insumo Base *
            </label>
            <select
              value={formData.insumoId}
              onChange={(e) => setFormData({ ...formData, insumoId: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 ${errors.insumoId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecione um insumo</option>
              {insumosDisponiveis.map((insumo) => (
                <option key={insumo.id} value={insumo.id}>
                  {insumo.nome} - R$ {insumo.precoPorGrama.toFixed(4)}/g
                </option>
              ))}
            </select>
            {errors.insumoId && <p className="text-red-500 text-xs mt-1">{errors.insumoId}</p>}
          </div>
        )}

        {formData.tipo === 'receita' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Receita Base *
            </label>
            <select
              value={formData.receitaId}
              onChange={(e) => setFormData({ ...formData, receitaId: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 ${errors.receitaId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecione uma receita</option>
              {receitasDisponiveis.map((receita) => (
                <option key={receita.id} value={receita.id}>
                  {receita.nome} - R$ {receita.custoPorGrama.toFixed(4)}/g
                </option>
              ))}
            </select>
            {errors.receitaId && <p className="text-red-500 text-xs mt-1">{errors.receitaId}</p>}
          </div>
        )}

        {formData.tipo === 'copo' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produto Base *
            </label>
            <select
              value={formData.produtoId}
              onChange={(e) => setFormData({ ...formData, produtoId: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 ${errors.produtoId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecione um produto</option>
              {produtosDisponiveis.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} - R$ {produto.custoTotal.toFixed(2)}
                </option>
              ))}
            </select>
            {errors.produtoId && <p className="text-red-500 text-xs mt-1">{errors.produtoId}</p>}
          </div>
        )}

        {formData.tipo === 'combinado' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Composição do Combinado *
              </label>
              <button
                type="button"
                onClick={adicionarComposicao}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Adicionar Item
              </button>
            </div>
            
            {composicao.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">Nenhum item adicionado</p>
                <p className="text-sm text-gray-400 mt-1">Clique em "Adicionar Item" para começar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {composicao.map((comp, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select
                          value={comp.tipo}
                          onChange={(e) => atualizarComposicao(index, {
                            ...comp,
                            tipo: e.target.value as any,
                            insumoId: undefined,
                            receitaId: undefined,
                            produtoId: undefined
                          })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="insumo">Insumo</option>
                          <option value="receita">Receita</option>
                          <option value="produto">Produto</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                        <select
                          value={comp.insumoId || comp.receitaId || comp.produtoId || ''}
                          onChange={(e) => {
                            const updates: Partial<ComposicaoItem> = { quantidade: comp.quantidade }
                            if (comp.tipo === 'insumo') updates.insumoId = e.target.value
                            else if (comp.tipo === 'receita') updates.receitaId = e.target.value
                            else if (comp.tipo === 'produto') updates.produtoId = e.target.value
                            atualizarComposicao(index, { ...comp, ...updates })
                          }}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="">Selecione...</option>
                          {comp.tipo === 'insumo' && insumosDisponiveis.map((insumo) => (
                            <option key={insumo.id} value={insumo.id}>{insumo.nome}</option>
                          ))}
                          {comp.tipo === 'receita' && receitasDisponiveis.map((receita) => (
                            <option key={receita.id} value={receita.id}>{receita.nome}</option>
                          ))}
                          {comp.tipo === 'produto' && produtosDisponiveis.map((produto) => (
                            <option key={produto.id} value={produto.id}>{produto.nome}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantidade {comp.tipo === 'produto' ? '(un)' : '(g)'}
                        </label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={comp.quantidade}
                          onChange={(e) => atualizarComposicao(index, {
                            ...comp,
                            quantidade: parseFloat(e.target.value) || 0
                          })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                      
                      <div>
                        <button
                          type="button"
                          onClick={() => removerComposicao(index)}
                          className="w-full bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 flex items-center justify-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {errors.composicao && <p className="text-red-500 text-xs mt-1">{errors.composicao}</p>}
          </div>
        )}
      </div>

      {/* Seção 3: Precificação */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Precificação</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custo Calculado
            </label>
            <div className="bg-gray-100 border rounded-lg px-3 py-2 text-gray-700">
              R$ {custoCalculado.toFixed(2)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço de Venda *
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={formData.precoVenda}
              onChange={(e) => setFormData({ ...formData, precoVenda: parseFloat(e.target.value) || 0 })}
              className={`w-full border rounded-lg px-3 py-2 ${errors.precoVenda ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="0.00"
            />
            {errors.precoVenda && <p className="text-red-500 text-xs mt-1">{errors.precoVenda}</p>}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Markup:</span>
              <span className="font-medium ml-2">R$ {(formData.precoVenda - custoCalculado).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Margem:</span>
              <span className="font-medium ml-2">
                {custoCalculado > 0 ? ((formData.precoVenda - custoCalculado) / custoCalculado * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Lucro:</span>
              <span className="font-medium ml-2 text-green-600">R$ {(formData.precoVenda - custoCalculado).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção 4: Outras informações */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows={3}
              placeholder="Informações adicionais..."
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.ativo}
                onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Item ativo no cardápio</span>
            </label>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Salvando...' : (item?.id ? 'Atualizar' : 'Criar Item')}
        </button>
      </div>

      {errors.submit && (
        <div className="text-red-500 text-center text-sm">
          {errors.submit}
        </div>
      )}
    </form>
  )
}