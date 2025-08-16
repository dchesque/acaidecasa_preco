'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { CategoriaReceita } from '@/types'
import { 
  Plus,
  Trash2,
  Edit3,
  Palette,
  Tag,
  X,
  Save,
  AlertTriangle
} from 'lucide-react'

interface CategoriasReceitaModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CategoriasReceitaModal({ isOpen, onClose }: CategoriasReceitaModalProps) {
  const { 
    categoriasReceita, 
    receitas,
    addCategoriaReceita, 
    updateCategoriaReceita, 
    deleteCategoriaReceita 
  } = useApp()
  
  const [novaCategoria, setNovaCategoria] = useState({ nome: '', descricao: '' })
  const [categoriaEditando, setCategoriaEditando] = useState<CategoriaReceita | null>(null)
  const [erro, setErro] = useState('')

  if (!isOpen) return null

  // Contar receitas por categoria
  const contarReceitasPorCategoria = (categoriaId: string) => {
    return receitas.filter(receita => receita.categoriaId === categoriaId).length
  }

  const handleAdicionarCategoria = () => {
    if (!novaCategoria.nome.trim()) {
      setErro('Nome da categoria é obrigatório')
      return
    }

    try {
      addCategoriaReceita({
        nome: novaCategoria.nome.trim(),
        descricao: novaCategoria.descricao.trim() || undefined
      })
      setNovaCategoria({ nome: '', descricao: '' })
      setErro('')
    } catch (error) {
      setErro('Erro ao criar categoria')
    }
  }

  const handleEditarCategoria = (categoria: CategoriaReceita) => {
    setCategoriaEditando(categoria)
  }

  const handleSalvarEdicao = () => {
    if (!categoriaEditando || !categoriaEditando.nome.trim()) {
      setErro('Nome da categoria é obrigatório')
      return
    }

    try {
      updateCategoriaReceita(categoriaEditando.id, {
        nome: categoriaEditando.nome.trim(),
        descricao: categoriaEditando.descricao?.trim() || undefined
      })
      setCategoriaEditando(null)
      setErro('')
    } catch (error) {
      setErro('Erro ao atualizar categoria')
    }
  }

  const handleExcluirCategoria = (categoriaId: string) => {
    const quantidade = contarReceitasPorCategoria(categoriaId)
    if (quantidade > 0) {
      setErro(`Não é possível excluir a categoria. ${quantidade} receita(s) ainda está(ão) usando esta categoria.`)
      return
    }

    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        deleteCategoriaReceita(categoriaId)
        setErro('')
      } catch (error: any) {
        setErro(error.message || 'Erro ao excluir categoria')
      }
    }
  }

  const gerarNovaCor = (categoriaId: string) => {
    const cores = [
      '#EF4444', '#F97316', '#EAB308', '#22C55E', '#10B981', 
      '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7',
      '#EC4899', '#F43F5E', '#84CC16', '#06B6D4', '#8B5CF6'
    ]
    const novaCor = cores[Math.floor(Math.random() * cores.length)]
    updateCategoriaReceita(categoriaId, { cor: novaCor })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Gerenciar Categorias de Receita</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-red-700 text-sm">{erro}</span>
          </div>
        )}

        {/* Criar Nova Categoria */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Nova Categoria
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Categoria *
              </label>
              <input
                type="text"
                value={novaCategoria.nome}
                onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ex: Cremes, Mousses, Coberturas..."
                maxLength={50}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição (opcional)
              </label>
              <input
                type="text"
                value={novaCategoria.descricao}
                onChange={(e) => setNovaCategoria({ ...novaCategoria, descricao: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Breve descrição da categoria..."
                maxLength={100}
              />
            </div>
          </div>
          
          <button
            onClick={handleAdicionarCategoria}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Criar Categoria
          </button>
        </div>

        {/* Lista de Categorias Existentes */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categorias Existentes ({categoriasReceita.length})
          </h3>

          {categoriasReceita.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Tag className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p>Nenhuma categoria criada ainda</p>
              <p className="text-sm">Crie sua primeira categoria acima</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoriasReceita.map((categoria) => (
                <div key={categoria.id} className="border rounded-lg p-4">
                  {categoriaEditando?.id === categoria.id ? (
                    // Modo de edição
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={categoriaEditando.nome}
                        onChange={(e) => setCategoriaEditando({ 
                          ...categoriaEditando, 
                          nome: e.target.value 
                        })}
                        className="w-full border rounded-lg px-3 py-2 font-medium"
                        maxLength={50}
                      />
                      <input
                        type="text"
                        value={categoriaEditando.descricao || ''}
                        onChange={(e) => setCategoriaEditando({ 
                          ...categoriaEditando, 
                          descricao: e.target.value 
                        })}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="Descrição (opcional)"
                        maxLength={100}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSalvarEdicao}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                        >
                          <Save className="h-3 w-3" />
                          Salvar
                        </button>
                        <button
                          onClick={() => setCategoriaEditando(null)}
                          className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Modo de visualização
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: categoria.cor }}
                          />
                          <h4 className="font-medium text-gray-900">{categoria.nome}</h4>
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => gerarNovaCor(categoria.id)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="Gerar nova cor"
                          >
                            <Palette className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditarCategoria(categoria)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="Editar categoria"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleExcluirCategoria(categoria.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Excluir categoria"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {categoria.descricao && (
                        <p className="text-sm text-gray-600 mb-2">{categoria.descricao}</p>
                      )}
                      
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{contarReceitasPorCategoria(categoria.id)} receitas</span>
                        <span>Criada em {new Date(categoria.dataCriacao).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}