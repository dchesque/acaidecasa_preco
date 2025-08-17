'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { formatCurrency } from '@/utils/formatters'
import { calcularPrecoComMargem } from '@/utils/margemUtils'
import { 
  Plus, 
  Star, 
  Edit, 
  Trash2, 
  Users,
  Package,
  Settings,
  RefreshCw,
  Target,
  TrendingUp,
  CheckCircle,
  X,
  Save,
  AlertTriangle,
  Layers
} from 'lucide-react'

export interface GrupoPrecificacao {
  id: string
  nome: string
  descricao: string
  tipo: 'proporcional' | 'escalonado' | 'fixo'
  produtos: ProdutoGrupo[]
  regras: RegraGrupo
  ativo: boolean
  dataCriacao: Date
}

export interface ProdutoGrupo {
  produtoId: string
  papel: 'base' | 'derivado'
  multiplicador?: number // Para tipo proporcional
  adicional?: number // Para tipo escalonado
}

export interface RegraGrupo {
  manterProporcao: boolean
  arredondamento: 'nenhum' | '0.50' | '0.90' | '0.99'
  margemMinima: number
  margemMaxima: number
  ajusteAutomatico: boolean
}

interface ModalCriarGrupoProps {
  isOpen: boolean
  grupo?: GrupoPrecificacao
  onSave: (grupo: Omit<GrupoPrecificacao, 'id' | 'dataCriacao'>) => void
  onClose: () => void
}

function ModalCriarGrupo({ isOpen, grupo, onSave, onClose }: ModalCriarGrupoProps) {
  const { cardapio } = useApp()
  const [formData, setFormData] = useState({
    nome: grupo?.nome || '',
    descricao: grupo?.descricao || '',
    tipo: grupo?.tipo || 'proporcional' as const,
    produtosSelecionados: grupo?.produtos.map(p => p.produtoId) || [],
    produtoBase: grupo?.produtos.find(p => p.papel === 'base')?.produtoId || '',
    manterProporcao: grupo?.regras.manterProporcao ?? true,
    arredondamento: grupo?.regras.arredondamento || 'nenhum' as const,
    margemMinima: grupo?.regras.margemMinima || 30,
    margemMaxima: grupo?.regras.margemMaxima || 80,
    ajusteAutomatico: grupo?.regras.ajusteAutomatico ?? false
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.produtosSelecionados.length < 2) {
      alert('Selecione pelo menos 2 produtos para criar um grupo')
      return
    }

    if (!formData.produtoBase) {
      alert('Selecione um produto base')
      return
    }

    const produtos: ProdutoGrupo[] = formData.produtosSelecionados.map(produtoId => ({
      produtoId,
      papel: produtoId === formData.produtoBase ? 'base' : 'derivado',
      multiplicador: formData.tipo === 'proporcional' ? (produtoId === formData.produtoBase ? 1 : 0.7) : undefined,
      adicional: formData.tipo === 'escalonado' ? (produtoId === formData.produtoBase ? 0 : 3) : undefined
    }))

    onSave({
      nome: formData.nome,
      descricao: formData.descricao,
      tipo: formData.tipo,
      produtos,
      regras: {
        manterProporcao: formData.manterProporcao,
        arredondamento: formData.arredondamento,
        margemMinima: formData.margemMinima,
        margemMaxima: formData.margemMaxima,
        ajusteAutomatico: formData.ajusteAutomatico
      },
      ativo: true
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {grupo ? 'Editar Grupo' : 'Criar Novo Grupo'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Grupo
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ex: Açaís Tradicionais"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Relacionamento
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="proporcional">Proporcional</option>
                <option value="escalonado">Escalonado</option>
                <option value="fixo">Margem Fixa</option>
              </select>
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
              placeholder="Descreva o grupo e sua estratégia de precificação..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Produtos
            </label>
            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
              {cardapio.filter(p => p.ativo).map(produto => (
                <label key={produto.id} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={formData.produtosSelecionados.includes(produto.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          produtosSelecionados: [...formData.produtosSelecionados, produto.id]
                        })
                      } else {
                        setFormData({
                          ...formData,
                          produtosSelecionados: formData.produtosSelecionados.filter(id => id !== produto.id),
                          produtoBase: formData.produtoBase === produto.id ? '' : formData.produtoBase
                        })
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="flex-1">{produto.nome}</span>
                  {formData.produtosSelecionados.includes(produto.id) && (
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="produtoBase"
                          checked={formData.produtoBase === produto.id}
                          onChange={() => setFormData({ ...formData, produtoBase: produto.id })}
                          className="text-purple-600"
                        />
                        <span className="text-xs text-purple-600">Base</span>
                      </label>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arredondamento
            </label>
            <select
              value={formData.arredondamento}
              onChange={(e) => setFormData({ ...formData, arredondamento: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="nenhum">Sem arredondamento</option>
              <option value="0.50">Terminar em .50</option>
              <option value="0.90">Terminar em .90</option>
              <option value="0.99">Terminar em .99</option>
            </select>
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
              {grupo ? 'Atualizar' : 'Criar'} Grupo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface CardGrupoProps {
  grupo: GrupoPrecificacao
  onEdit: () => void
  onDelete: () => void
  onSync: () => void
}

function CardGrupo({ grupo, onEdit, onDelete, onSync }: CardGrupoProps) {
  const { cardapio } = useApp()
  const [novoPrecoBase, setNovoPrecoBase] = useState('')
  const [simulacao, setSimulacao] = useState<any>(null)

  const produtoBase = useMemo(() => {
    const produtoBaseInfo = grupo.produtos.find(p => p.papel === 'base')
    return produtoBaseInfo ? cardapio.find(p => p.id === produtoBaseInfo.produtoId) : null
  }, [grupo, cardapio])

  const produtosGrupo = useMemo(() => {
    return grupo.produtos.map(prodGrupo => {
      const produto = cardapio.find(p => p.id === prodGrupo.produtoId)
      return produto ? { ...produto, ...prodGrupo } : null
    }).filter(Boolean)
  }, [grupo, cardapio])

  const simularAjuste = () => {
    if (!novoPrecoBase || !produtoBase) return

    const novoPreco = Number(novoPrecoBase)
    const simulacaoResultado = produtosGrupo.map(produto => {
      if (!produto) return null

      let precoCalculado = novoPreco

      if (produto.papel === 'derivado') {
        switch (grupo.tipo) {
          case 'proporcional':
            precoCalculado = novoPreco * (produto.multiplicador || 1)
            break
          case 'escalonado':
            precoCalculado = novoPreco + (produto.adicional || 0)
            break
          case 'fixo':
            // Mantém a margem atual
            precoCalculado = calcularPrecoComMargem(produto.custo, produto.percentualMargem)
            break
        }
      }

      // Aplicar arredondamento
      if (grupo.regras.arredondamento !== 'nenhum') {
        const valor = Number(grupo.regras.arredondamento)
        precoCalculado = Math.floor(precoCalculado) + valor
      }

      return {
        id: produto.id,
        nome: produto.nome,
        precoAntes: produto.precoVenda,
        precoDepois: precoCalculado
      }
    }).filter(Boolean)

    setSimulacao(simulacaoResultado)
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'proporcional': return <Target className="h-4 w-4" />
      case 'escalonado': return <TrendingUp className="h-4 w-4" />
      case 'fixo': return <Package className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'proporcional': return 'from-purple-500 to-purple-600'
      case 'escalonado': return 'from-blue-500 to-blue-600'
      case 'fixo': return 'from-green-500 to-green-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'proporcional': return 'Proporcional'
      case 'escalonado': return 'Escalonado'
      case 'fixo': return 'Margem Fixa'
      default: return tipo
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header do Grupo */}
      <div className={`bg-gradient-to-r ${getTipoColor(grupo.tipo)} p-4 text-white`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{grupo.nome}</h3>
            <p className="text-white/90 text-sm">{grupo.descricao}</p>
          </div>
          <div className="flex items-center gap-2">
            {getTipoIcon(grupo.tipo)}
            <span className="px-2 py-1 bg-white/20 rounded text-xs">
              {getTipoLabel(grupo.tipo)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Produtos do Grupo */}
      <div className="p-4">
        <div className="space-y-2">
          {produtosGrupo.map(produto => {
            if (!produto) return null
            
            return (
              <div 
                key={produto.id}
                className={`flex items-center justify-between p-2 rounded ${
                  produto.papel === 'base' 
                    ? 'bg-purple-50 border border-purple-200' 
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {produto.papel === 'base' && (
                    <Star className="h-4 w-4 text-purple-500" />
                  )}
                  <span className="font-medium">{produto.nome}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {formatCurrency(produto.precoVenda)}
                  </span>
                  {produto.multiplicador && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      ×{produto.multiplicador}
                    </span>
                  )}
                  {produto.adicional && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      +{formatCurrency(produto.adicional)}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Simulador de Ajuste */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-700">
            Simular ajuste no produto base:
          </label>
          <div className="flex items-center gap-2 mt-2">
            <input 
              type="number"
              step="0.01"
              placeholder={`Atual: ${produtoBase ? formatCurrency(produtoBase.precoVenda) : 'N/A'}`}
              value={novoPrecoBase}
              onChange={(e) => setNovoPrecoBase(e.target.value)}
              className="flex-1 rounded-lg border-gray-300"
            />
            <button 
              onClick={simularAjuste}
              disabled={!novoPrecoBase}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              Ver Impacto
            </button>
          </div>
          
          {/* Preview do Impacto */}
          {simulacao && (
            <div className="mt-3 space-y-1 text-sm">
              <p className="font-medium">Novos preços:</p>
              {simulacao.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.nome}:</span>
                  <span className="font-medium">
                    {formatCurrency(item.precoAntes)} → {formatCurrency(item.precoDepois)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Ações */}
      <div className="p-4 border-t flex justify-between">
        <button 
          onClick={onEdit}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          <Edit className="h-4 w-4" />
          Editar Grupo
        </button>
        <div className="flex gap-2">
          <button 
            onClick={onSync}
            className="text-green-600 hover:text-green-800 flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Sincronizar
          </button>
          <button 
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GruposPrecificacao() {
  const [grupos, setGrupos] = useState<GrupoPrecificacao[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingGrupo, setEditingGrupo] = useState<GrupoPrecificacao | undefined>()

  const criarNovoGrupo = () => {
    setEditingGrupo(undefined)
    setShowModal(true)
  }

  const editarGrupo = (grupo: GrupoPrecificacao) => {
    setEditingGrupo(grupo)
    setShowModal(true)
  }

  const salvarGrupo = (grupoData: Omit<GrupoPrecificacao, 'id' | 'dataCriacao'>) => {
    const novoGrupo: GrupoPrecificacao = {
      ...grupoData,
      id: editingGrupo?.id || Date.now().toString(),
      dataCriacao: editingGrupo?.dataCriacao || new Date()
    }

    if (editingGrupo) {
      setGrupos(grupos.map(g => g.id === editingGrupo.id ? novoGrupo : g))
    } else {
      setGrupos([...grupos, novoGrupo])
    }

    setShowModal(false)
    setEditingGrupo(undefined)
  }

  const excluirGrupo = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este grupo?')) {
      setGrupos(grupos.filter(g => g.id !== id))
    }
  }

  const sincronizarGrupo = (id: string) => {
    const grupo = grupos.find(g => g.id === id)
    if (grupo) {
      // Aqui seria implementada a lógica de sincronização real
      alert('Preços sincronizados com sucesso!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="h-6 w-6 text-purple-600" />
            Grupos de Precificação
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie produtos com precificação sincronizada
          </p>
        </div>
        <button 
          onClick={criarNovoGrupo}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Grupo
        </button>
      </div>
      
      {/* Lista de Grupos */}
      {grupos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-semibold text-gray-900">Nenhum grupo criado</h3>
          <p className="mt-1 text-gray-500">
            Crie grupos para sincronizar preços entre produtos relacionados
          </p>
          <button
            onClick={criarNovoGrupo}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Criar Primeiro Grupo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {grupos.map(grupo => (
            <CardGrupo 
              key={grupo.id} 
              grupo={grupo}
              onEdit={() => editarGrupo(grupo)}
              onDelete={() => excluirGrupo(grupo.id)}
              onSync={() => sincronizarGrupo(grupo.id)}
            />
          ))}
        </div>
      )}

      <ModalCriarGrupo
        isOpen={showModal}
        grupo={editingGrupo}
        onSave={salvarGrupo}
        onClose={() => {
          setShowModal(false)
          setEditingGrupo(undefined)
        }}
      />
    </div>
  )
}