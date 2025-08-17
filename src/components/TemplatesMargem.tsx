'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { formatCurrency } from '@/utils/formatters'
import { calcularPrecoComMargem, MargemBadge } from '@/utils/margemUtils'
import { 
  Crown, 
  Users, 
  Tag, 
  Zap,
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Target,
  TrendingUp,
  Check,
  X,
  Settings,
  Save,
  Package
} from 'lucide-react'

export interface TemplateMargem {
  id: string
  nome: string
  descricao: string
  icon: string
  cor: string
  regras: {
    categoria?: string[]
    margemMinima: number
    margemMaxima: number
    margemIdeal: number
    ajusteAutomatico: boolean
  }
  isDefault: boolean
  createdAt: Date
}

interface TemplateEditorProps {
  isOpen: boolean
  template?: TemplateMargem
  onSave: (template: Omit<TemplateMargem, 'id' | 'createdAt'>) => void
  onClose: () => void
}

function TemplateEditor({ isOpen, template, onSave, onClose }: TemplateEditorProps) {
  const [formData, setFormData] = useState({
    nome: template?.nome || '',
    descricao: template?.descricao || '',
    icon: template?.icon || 'Star',
    cor: template?.cor || 'purple',
    margemMinima: template?.regras.margemMinima || 20,
    margemIdeal: template?.regras.margemIdeal || 50,
    margemMaxima: template?.regras.margemMaxima || 80,
    categorias: template?.regras.categoria || [],
    ajusteAutomatico: template?.regras.ajusteAutomatico || false
  })

  const cores = [
    { name: 'purple', label: 'Roxo', class: 'bg-purple-500' },
    { name: 'blue', label: 'Azul', class: 'bg-blue-500' },
    { name: 'green', label: 'Verde', class: 'bg-green-500' },
    { name: 'yellow', label: 'Amarelo', class: 'bg-yellow-500' },
    { name: 'red', label: 'Vermelho', class: 'bg-red-500' },
    { name: 'indigo', label: 'Índigo', class: 'bg-indigo-500' },
    { name: 'pink', label: 'Rosa', class: 'bg-pink-500' },
    { name: 'gray', label: 'Cinza', class: 'bg-gray-500' }
  ]

  const icones = [
    { name: 'Star', component: Star },
    { name: 'Crown', component: Crown },
    { name: 'Users', component: Users },
    { name: 'Tag', component: Tag },
    { name: 'Zap', component: Zap },
    { name: 'Target', component: Target },
    { name: 'TrendingUp', component: TrendingUp },
    { name: 'Package', component: Package }
  ]

  const categorias = [
    'chocolates', 'mousses', 'sorvetes', 'coberturas', 
    'cremes_premium', 'frutas', 'complementos', 'receitas', 'copos', 'combinados'
  ]

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onSave({
      nome: formData.nome,
      descricao: formData.descricao,
      icon: formData.icon,
      cor: formData.cor,
      regras: {
        categoria: formData.categorias,
        margemMinima: formData.margemMinima,
        margemMaxima: formData.margemMaxima,
        margemIdeal: formData.margemIdeal,
        ajusteAutomatico: formData.ajusteAutomatico
      },
      isDefault: false
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {template ? 'Editar Template' : 'Criar Novo Template'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Template
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ex: Premium, Popular, Promocional"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor do Template
              </label>
              <div className="flex flex-wrap gap-2">
                {cores.map(cor => (
                  <button
                    key={cor.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, cor: cor.name })}
                    className={`w-8 h-8 rounded-full ${cor.class} ${
                      formData.cor === cor.name ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                    title={cor.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="Descreva quando usar este template..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ícone
            </label>
            <div className="flex flex-wrap gap-2">
              {icones.map(icone => {
                const IconComponent = icone.component
                return (
                  <button
                    key={icone.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: icone.name })}
                    className={`p-2 border-2 rounded-lg ${
                      formData.icon === icone.name
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Margem Mínima (%)
              </label>
              <input
                type="number"
                value={formData.margemMinima}
                onChange={(e) => setFormData({ ...formData, margemMinima: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                max="100"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Margem Ideal (%)
              </label>
              <input
                type="number"
                value={formData.margemIdeal}
                onChange={(e) => setFormData({ ...formData, margemIdeal: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                max="100"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Margem Máxima (%)
              </label>
              <input
                type="number"
                value={formData.margemMaxima}
                onChange={(e) => setFormData({ ...formData, margemMaxima: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                max="100"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aplicar a categorias (opcional):
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categorias.map(categoria => (
                <label key={categoria} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.categorias.includes(categoria)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          categorias: [...formData.categorias, categoria]
                        })
                      } else {
                        setFormData({
                          ...formData,
                          categorias: formData.categorias.filter(c => c !== categoria)
                        })
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm capitalize">
                    {categoria.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.ajusteAutomatico}
                onChange={(e) => setFormData({ ...formData, ajusteAutomatico: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Ajustar automaticamente quando custos mudarem
              </span>
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {template ? 'Atualizar' : 'Criar'} Template
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface TemplatesMargemProps {
  onApplyTemplate: (template: TemplateMargem) => void
}

export default function TemplatesMargem({ onApplyTemplate }: TemplatesMargemProps) {
  const { cardapio } = useApp()
  const [templates, setTemplates] = useState<TemplateMargem[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<TemplateMargem | undefined>()

  // Templates padrão
  const templatesDefault: TemplateMargem[] = useMemo(() => [
    {
      id: 'premium',
      nome: 'Premium',
      descricao: 'Para produtos exclusivos e diferenciados',
      icon: 'Crown',
      cor: 'purple',
      regras: {
        margemMinima: 60,
        margemMaxima: 90,
        margemIdeal: 75,
        ajusteAutomatico: true
      },
      isDefault: true,
      createdAt: new Date()
    },
    {
      id: 'popular',
      nome: 'Popular',
      descricao: 'Produtos de alta rotatividade',
      icon: 'Users',
      cor: 'blue',
      regras: {
        margemMinima: 35,
        margemMaxima: 50,
        margemIdeal: 42,
        ajusteAutomatico: true
      },
      isDefault: true,
      createdAt: new Date()
    },
    {
      id: 'promocional',
      nome: 'Promocional',
      descricao: 'Para combos e ofertas especiais',
      icon: 'Tag',
      cor: 'green',
      regras: {
        margemMinima: 25,
        margemMaxima: 40,
        margemIdeal: 32,
        ajusteAutomatico: false
      },
      isDefault: true,
      createdAt: new Date()
    },
    {
      id: 'express',
      nome: 'Express',
      descricao: 'Margem alta para produtos rápidos',
      icon: 'Zap',
      cor: 'yellow',
      regras: {
        margemMinima: 45,
        margemMaxima: 65,
        margemIdeal: 55,
        ajusteAutomatico: true
      },
      isDefault: true,
      createdAt: new Date()
    }
  ], [])

  const todosTemplates = useMemo(() => {
    return [...templatesDefault, ...templates]
  }, [templatesDefault, templates])

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      Crown, Users, Tag, Zap, Star, Target, TrendingUp, Package
    }
    return iconMap[iconName] || Star
  }

  const handleSaveTemplate = (templateData: Omit<TemplateMargem, 'id' | 'createdAt'>) => {
    const newTemplate: TemplateMargem = {
      ...templateData,
      id: editingTemplate?.id || Date.now().toString(),
      createdAt: editingTemplate?.createdAt || new Date()
    }

    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? newTemplate : t))
    } else {
      setTemplates([...templates, newTemplate])
    }

    setShowEditor(false)
    setEditingTemplate(undefined)
  }

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este template?')) {
      setTemplates(templates.filter(t => t.id !== id))
    }
  }

  const calcularImpactoTemplate = (template: TemplateMargem) => {
    const produtosFiltrados = template.regras.categoria && template.regras.categoria.length > 0
      ? cardapio.filter(p => p.ativo && template.regras.categoria!.includes(p.categoria))
      : cardapio.filter(p => p.ativo)

    if (produtosFiltrados.length === 0) return { produtos: 0, impactoMedio: 0 }

    const impactoTotal = produtosFiltrados.reduce((acc, produto) => {
      const novoPreco = calcularPrecoComMargem(produto.custo, template.regras.margemIdeal)
      return acc + (novoPreco - produto.precoVenda)
    }, 0)

    return {
      produtos: produtosFiltrados.length,
      impactoMedio: impactoTotal / produtosFiltrados.length
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Templates de Margem</h2>
          <p className="text-gray-600 mt-1">
            Aplique configurações de margem predefinidas para diferentes tipos de produto
          </p>
        </div>
        <button
          onClick={() => setShowEditor(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {todosTemplates.map(template => {
          const IconComponent = getIconComponent(template.icon)
          const impacto = calcularImpactoTemplate(template)
          
          return (
            <div
              key={template.id}
              className={`relative group rounded-xl p-6 border-2 transition-all duration-200 hover:scale-105 cursor-pointer bg-gradient-to-br from-${template.cor}-50 to-${template.cor}-100 border-${template.cor}-200 hover:border-${template.cor}-300`}
            >
              {/* Ações do template */}
              {!template.isDefault && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingTemplate(template)
                      setShowEditor(true)
                    }}
                    className="p-1 bg-white rounded shadow hover:bg-gray-50"
                  >
                    <Edit className="h-3 w-3 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteTemplate(template.id)
                    }}
                    className="p-1 bg-white rounded shadow hover:bg-gray-50"
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 bg-${template.cor}-100 rounded-lg border border-${template.cor}-200`}>
                  <IconComponent className={`h-6 w-6 text-${template.cor}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{template.nome}</h3>
                  {template.isDefault && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      Padrão
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                {template.descricao}
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Margem Ideal:</span>
                  <MargemBadge margem={template.regras.margemIdeal} />
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Range:</span>
                  <span className="font-medium">
                    {template.regras.margemMinima}% - {template.regras.margemMaxima}%
                  </span>
                </div>

                {template.regras.categoria && template.regras.categoria.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categorias:</span>
                    <span className="font-medium text-xs">
                      {template.regras.categoria.length} selecionadas
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Produtos afetados:</span>
                  <span className="font-medium">{impacto.produtos}</span>
                </div>

                {impacto.produtos > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Impacto médio:</span>
                    <span className={`font-medium ${
                      impacto.impactoMedio >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {impacto.impactoMedio >= 0 ? '+' : ''}{formatCurrency(impacto.impactoMedio)}
                    </span>
                  </div>
                )}

                {template.regras.ajusteAutomatico && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Settings className="h-4 w-4" />
                    <span className="text-xs">Ajuste automático</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => onApplyTemplate(template)}
                className={`w-full mt-4 py-2 bg-${template.cor}-600 text-white rounded-lg hover:bg-${template.cor}-700 transition-colors flex items-center justify-center gap-2 font-medium`}
                disabled={impacto.produtos === 0}
              >
                <Check className="h-4 w-4" />
                Aplicar Template
              </button>
            </div>
          )
        })}
      </div>

      <TemplateEditor
        isOpen={showEditor}
        template={editingTemplate}
        onSave={handleSaveTemplate}
        onClose={() => {
          setShowEditor(false)
          setEditingTemplate(undefined)
        }}
      />
    </div>
  )
}