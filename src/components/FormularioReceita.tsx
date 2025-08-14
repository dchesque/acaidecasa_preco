'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Receita, ItemReceita } from '@/types'
import SeletorInsumo from './SeletorInsumo'
import LinhaIngrediente from './LinhaIngrediente'
import CalculadoraCusto from './CalculadoraCusto'
import { Plus, Save, X } from 'lucide-react'

interface FormularioReceitaProps {
  receita?: Receita | null
  onSave: () => void
  onCancel: () => void
}

const categorias = [
  { value: 'creme', label: 'Creme' },
  { value: 'mousse', label: 'Mousse' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'outro', label: 'Outro' }
] as const

export default function FormularioReceita({ receita, onSave, onCancel }: FormularioReceitaProps) {
  const { insumos, addReceita, updateReceita } = useApp()
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: 'creme' as const,
    rendimento: 0,
    modoPreparo: '',
    tempoPreparoMinutos: 0,
    ativa: true
  })
  
  const [ingredientes, setIngredientes] = useState<ItemReceita[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Carregar dados da receita para edição
  useEffect(() => {
    if (receita) {
      setFormData({
        nome: receita.nome,
        descricao: receita.descricao || '',
        categoria: receita.categoria,
        rendimento: receita.rendimento,
        modoPreparo: receita.modoPreparo || '',
        tempoPreparoMinutos: receita.tempoPreparoMinutos || 0,
        ativa: receita.ativa
      })
      setIngredientes(receita.ingredientes)
    }
  }, [receita])

  // Filtrar insumos para matérias-primas e ingredientes básicos
  const insumosFiltrados = insumos.filter(insumo => 
    insumo.ativo && ['materia_prima', 'complemento', 'fruta'].includes(insumo.tipo)
  )

  const adicionarIngrediente = (insumoId: string) => {
    // Verificar se o insumo já foi adicionado
    if (ingredientes.find(item => item.insumoId === insumoId)) {
      setErrors({ ingredientes: 'Este insumo já foi adicionado à receita' })
      return
    }

    const novoIngrediente: ItemReceita = {
      insumoId,
      quantidade: 0,
      observacao: ''
    }

    setIngredientes([...ingredientes, novoIngrediente])
    setErrors({ ...errors, ingredientes: '' })
  }

  const atualizarIngrediente = (index: number, ingredienteAtualizado: ItemReceita) => {
    const novosIngredientes = [...ingredientes]
    novosIngredientes[index] = ingredienteAtualizado
    setIngredientes(novosIngredientes)
  }

  const removerIngrediente = (index: number) => {
    setIngredientes(ingredientes.filter((_, i) => i !== index))
  }

  const validarFormulario = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da receita é obrigatório'
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres'
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória'
    }

    if (ingredientes.length === 0) {
      newErrors.ingredientes = 'Adicione pelo menos um ingrediente'
    }

    const ingredientesValidos = ingredientes.filter(item => item.quantidade > 0)
    if (ingredientesValidos.length === 0 && ingredientes.length > 0) {
      newErrors.ingredientes = 'Informe quantidades válidas para os ingredientes'
    }

    if (formData.rendimento <= 0) {
      newErrors.rendimento = 'Rendimento deve ser maior que zero'
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
      const receitaData = {
        ...formData,
        ingredientes: ingredientes.filter(item => item.quantidade > 0)
      }

      if (receita?.id) {
        updateReceita(receita.id, receitaData)
      } else {
        addReceita(receitaData)
      }

      onSave()
    } catch (error) {
      console.error('Erro ao salvar receita:', error)
      setErrors({ submit: 'Erro ao salvar receita. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Seção 1: Informações Básicas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Receita *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ex: Creme Ninho Caseiro"
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
              className={`w-full border rounded-lg px-3 py-2 ${errors.categoria ? 'border-red-500' : 'border-gray-300'}`}
            >
              {categorias.map((categoria) => (
                <option key={categoria.value} value={categoria.value}>
                  {categoria.label}
                </option>
              ))}
            </select>
            {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            rows={3}
            placeholder="Descreva brevemente sua receita..."
          />
        </div>
      </div>

      {/* Seção 2: Ingredientes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredientes</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adicionar Ingrediente
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <SeletorInsumo
                insumos={insumosFiltrados}
                onSelect={adicionarIngrediente}
                placeholder="Busque por insumos..."
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const seletor = document.querySelector('input[placeholder="Busque por insumos..."]') as HTMLInputElement
                if (seletor) seletor.focus()
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </button>
          </div>
          {errors.ingredientes && <p className="text-red-500 text-xs mt-1">{errors.ingredientes}</p>}
        </div>

        <div className="space-y-3">
          {ingredientes.map((item, index) => {
            const insumo = insumos.find(i => i.id === item.insumoId)
            if (!insumo) return null

            return (
              <LinhaIngrediente
                key={`${item.insumoId}-${index}`}
                item={item}
                insumo={insumo}
                onChange={(ingredienteAtualizado) => atualizarIngrediente(index, ingredienteAtualizado)}
                onRemove={() => removerIngrediente(index)}
              />
            )
          })}
        </div>

        {ingredientes.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Nenhum ingrediente adicionado ainda</p>
            <p className="text-sm text-gray-400 mt-1">Use o campo acima para buscar e adicionar ingredientes</p>
          </div>
        )}
      </div>

      {/* Seção 3: Produção */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Produção</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rendimento (gramas) *
            </label>
            <input
              type="number"
              min="1"
              value={formData.rendimento}
              onChange={(e) => setFormData({ ...formData, rendimento: parseInt(e.target.value) || 0 })}
              className={`w-full border rounded-lg px-3 py-2 ${errors.rendimento ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ex: 350"
            />
            {errors.rendimento && <p className="text-red-500 text-xs mt-1">{errors.rendimento}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tempo de Preparo (minutos)
            </label>
            <input
              type="number"
              min="0"
              value={formData.tempoPreparoMinutos}
              onChange={(e) => setFormData({ ...formData, tempoPreparoMinutos: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Ex: 15"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modo de Preparo
          </label>
          <textarea
            value={formData.modoPreparo}
            onChange={(e) => setFormData({ ...formData, modoPreparo: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            rows={4}
            placeholder="Descreva o passo a passo do preparo..."
          />
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.ativa}
              onChange={(e) => setFormData({ ...formData, ativa: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Receita ativa</span>
          </label>
        </div>
      </div>

      {/* Seção 4: Resumo de Custos */}
      <CalculadoraCusto
        ingredientes={ingredientes}
        insumos={insumos}
        rendimento={formData.rendimento}
      />

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
          {isSubmitting ? 'Salvando...' : (receita?.id ? 'Atualizar' : 'Criar Receita')}
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