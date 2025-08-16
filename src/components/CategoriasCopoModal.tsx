'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { CategoriaCopo } from '@/types'
import { 
  X, 
  Plus, 
  Edit2, 
  Trash2, 
  Coffee,
  Palette,
  Calendar
} from 'lucide-react'

interface CategoriasCopoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CategoriasCopoModal({ isOpen, onClose }: CategoriasCopoModalProps) {
  const { 
    categoriasCopo, 
    copos,
    addCategoriaCopo, 
    updateCategoriaCopo, 
    deleteCategoriaCopo 
  } = useApp()

  const [editingCategoria, setEditingCategoria] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: ''
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCategoria) {
      updateCategoriaCopo(editingCategoria, formData)
    } else {
      addCategoriaCopo(formData)
    }
    
    setFormData({ nome: '', descricao: '' })
    setEditingCategoria(null)
    setShowForm(false)
  }

  const handleEdit = (categoria: CategoriaCopo) => {
    setEditingCategoria(categoria.id)
    setFormData({
      nome: categoria.nome,
      descricao: categoria.descricao || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    try {
      if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        deleteCategoriaCopo(id)
      }
    } catch (error) {
      alert((error as Error).message)
    }
  }

  const getCopoCount = (categoriaId: string) => {
    return copos.filter(c => c.categoriaId === categoriaId).length
  }

  const handleNewCategory = () => {
    setFormData({ nome: '', descricao: '' })
    setEditingCategoria(null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingCategoria(null)
    setFormData({ nome: '', descricao: '' })
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl bg-white shadow-lg rounded-lg">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gestão de Categorias de Copo</h3>
              <p className="text-sm text-gray-600 mt-1">Organize seus copos por categorias</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {!showForm ? (
          <div>
            {/* Header com botão adicionar */}
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {categoriasCopo.length} categoria{categoriasCopo.length !== 1 ? 's' : ''} cadastrada{categoriasCopo.length !== 1 ? 's' : ''}
              </div>
              <button
                onClick={handleNewCategory}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Categoria
              </button>
            </div>

            {/* Lista de categorias */}
            {categoriasCopo.length === 0 ? (
              <div className="text-center py-12">
                <Coffee className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-semibold text-gray-900">Nenhuma categoria cadastrada</h3>
                <p className="mt-1 text-gray-500">Comece criando sua primeira categoria de copo.</p>
                <button
                  onClick={handleNewCategory}
                  className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Criar Primeira Categoria
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoriasCopo.map((categoria) => (
                  <div key={categoria.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                          style={{ backgroundColor: categoria.cor }}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{categoria.nome}</h4>
                          {categoria.descricao && (
                            <p className="text-sm text-gray-600 mt-1">{categoria.descricao}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEdit(categoria)}
                          className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(categoria.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <Coffee className="h-4 w-4 mr-1" />
                          Copos:
                        </span>
                        <span className="font-medium">{getCopoCount(categoria.id)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Criada em:
                        </span>
                        <span className="text-gray-500">
                          {new Date(categoria.dataCriacao).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Formulário */}
            <div className="mb-4">
              <button
                onClick={closeForm}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <span className="mr-2">←</span>
                Voltar para lista
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Tradicionais, Especiais, Gourmet..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Descreva brevemente esta categoria..."
                />
              </div>

              {editingCategoria && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Palette className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-purple-800">
                      A cor da categoria é gerada automaticamente e não pode ser alterada
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingCategoria ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}