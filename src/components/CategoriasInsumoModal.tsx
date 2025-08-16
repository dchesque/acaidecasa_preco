'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { X, Plus, Edit, Trash2, Tag, Palette, AlertCircle } from 'lucide-react'
import { getTextColor } from '@/utils/colorGenerator'

interface CategoriasInsumoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CategoriasInsumoModal({ isOpen, onClose }: CategoriasInsumoModalProps) {
  const { 
    categoriasInsumo, 
    insumos,
    addCategoriaInsumo, 
    updateCategoriaInsumo, 
    deleteCategoriaInsumo 
  } = useApp()
  
  const [showForm, setShowForm] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: ''
  })

  const resetForm = () => {
    setFormData({ nome: '', descricao: '' })
    setShowForm(false)
    setEditingCategoria(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCategoria) {
      updateCategoriaInsumo(editingCategoria, {
        nome: formData.nome,
        descricao: formData.descricao || undefined
      })
    } else {
      addCategoriaInsumo({
        nome: formData.nome,
        descricao: formData.descricao || undefined
      })
    }
    
    resetForm()
  }

  const handleEdit = (categoria: { id: string; nome: string; descricao?: string }) => {
    setEditingCategoria(categoria.id)
    setFormData({
      nome: categoria.nome,
      descricao: categoria.descricao || ''
    })
    setShowForm(true)
  }

  const handleDelete = (categoriaId: string) => {
    try {
      deleteCategoriaInsumo(categoriaId)
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Erro ao excluir categoria')
    }
  }

  // Contar insumos por categoria
  const getInsumoCount = (categoriaId: string) => {
    return insumos.filter(insumo => insumo.categoriaId === categoriaId).length
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <Tag className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Categorias</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Botão para adicionar nova categoria */}
          {!showForm && (
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Nova Categoria
              </button>
            </div>
          )}

          {/* Formulário */}
          {showForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Categoria *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Açaí, Complementos, Frutas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição (opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.descricao}
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Breve descrição da categoria"
                    />
                  </div>
                </div>

                {/* Preview da cor */}
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    A cor será gerada automaticamente quando a categoria for criada
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {editingCategoria ? 'Atualizar' : 'Criar'}
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

          {/* Lista de categorias */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Categorias Existentes ({categoriasInsumo.length})
            </h3>

            {categoriasInsumo.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Tag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma categoria</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Crie sua primeira categoria de insumos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoriasInsumo.map((categoria) => {
                  const insumoCount = getInsumoCount(categoria.id)
                  const textColor = getTextColor(categoria.cor)
                  
                  return (
                    <div
                      key={categoria.id}
                      className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Header da categoria */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: categoria.cor }}
                          >
                            <Tag 
                              className="h-4 w-4" 
                              style={{ color: textColor }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {categoria.nome}
                            </h4>
                            {categoria.descricao && (
                              <p className="text-sm text-gray-600 truncate">
                                {categoria.descricao}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(categoria)}
                            className="p-1.5 text-gray-400 hover:text-blue-600"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(categoria.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Informações da categoria */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Insumos:</span>
                          <span className="text-sm font-medium">
                            {insumoCount} {insumoCount === 1 ? 'item' : 'itens'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Criada em:</span>
                          <span className="text-sm text-gray-500">
                            {new Date(categoria.dataCriacao).toLocaleDateString('pt-BR')}
                          </span>
                        </div>

                        {insumoCount > 0 && (
                          <div className="flex items-start gap-2 mt-3 p-2 bg-yellow-50 rounded">
                            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <span className="text-xs text-yellow-800">
                              Esta categoria possui {insumoCount} insumo(s) associado(s)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}