'use client'

import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { X, Upload, Plus, DollarSign, Package } from 'lucide-react'
import { Embalagem } from '@/types'

interface EmbalagensModalProps {
  isOpen: boolean
  onClose: () => void
  editingEmbalagem?: Embalagem | null
}

export default function EmbalagensModal({ isOpen, onClose, editingEmbalagem }: EmbalagensModalProps) {
  const { 
    addEmbalagem, 
    updateEmbalagem, 
    categoriasEmbalagem, 
    addCategoriaEmbalagem,
    fornecedores,
    addFornecedor,
    calcularPrecoUnitario
  } = useApp()

  const [formData, setFormData] = useState({
    nome: '',
    tipoPrecificacao: 'unitario' as 'unitario' | 'lote',
    precoUnitario: '',
    precoLote: '',
    quantidadeLote: '',
    fornecedorId: '',
    categoriaId: '',
    imagemUrl: '',
    observacoes: '',
    ativa: true
  })

  const [showCategoriaForm, setShowCategoriaForm] = useState(false)
  const [showFornecedorForm, setShowFornecedorForm] = useState(false)
  const [newCategoria, setNewCategoria] = useState('')
  const [newFornecedor, setNewFornecedor] = useState({
    nome: '',
    telefone: '',
    email: ''
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingEmbalagem) {
      setFormData({
        nome: editingEmbalagem.nome,
        tipoPrecificacao: editingEmbalagem.tipoPrecificacao || 'unitario',
        precoUnitario: editingEmbalagem.precoUnitario?.toString() || '',
        precoLote: editingEmbalagem.precoLote?.toString() || '',
        quantidadeLote: editingEmbalagem.quantidadeLote?.toString() || '',
        fornecedorId: editingEmbalagem.fornecedorId || '',
        categoriaId: editingEmbalagem.categoriaId || '',
        imagemUrl: editingEmbalagem.imagemUrl || '',
        observacoes: editingEmbalagem.observacoes || '',
        ativa: editingEmbalagem.ativa
      })
      setPreviewImage(editingEmbalagem.imagemUrl || null)
    }
  }, [editingEmbalagem])

  const resetForm = () => {
    setFormData({
      nome: '',
      tipoPrecificacao: 'unitario',
      precoUnitario: '',
      precoLote: '',
      quantidadeLote: '',
      fornecedorId: '',
      categoriaId: '',
      imagemUrl: '',
      observacoes: '',
      ativa: true
    })
    setPreviewImage(null)
    setShowCategoriaForm(false)
    setShowFornecedorForm(false)
    setNewCategoria('')
    setNewFornecedor({ nome: '', telefone: '', email: '' })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tamanho (max 500KB)
      if (file.size > 500 * 1024) {
        alert('Imagem muito grande. Máximo 500KB.')
        return
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Arquivo deve ser uma imagem.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormData(prev => ({ ...prev, imagemUrl: result }))
        setPreviewImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações específicas por tipo
    if (formData.tipoPrecificacao === 'lote') {
      if (!formData.precoLote || !formData.quantidadeLote) {
        alert('Para precificação em lote, informe o preço do lote e a quantidade.')
        return
      }
    } else {
      if (!formData.precoUnitario) {
        alert('Para precificação unitária, informe o preço unitário.')
        return
      }
    }

    const embalagemData = {
      nome: formData.nome,
      tipoPrecificacao: formData.tipoPrecificacao,
      precoUnitario: formData.tipoPrecificacao === 'unitario' ? parseFloat(formData.precoUnitario) : 0,
      precoLote: formData.tipoPrecificacao === 'lote' ? parseFloat(formData.precoLote) : undefined,
      quantidadeLote: formData.tipoPrecificacao === 'lote' ? parseInt(formData.quantidadeLote) : undefined,
      fornecedorId: formData.fornecedorId || undefined,
      categoriaId: formData.categoriaId || undefined,
      imagemUrl: formData.imagemUrl || undefined,
      observacoes: formData.observacoes || undefined,
      ativa: formData.ativa
    }

    if (editingEmbalagem) {
      updateEmbalagem(editingEmbalagem.id, embalagemData)
    } else {
      addEmbalagem(embalagemData)
    }

    resetForm()
    onClose()
  }

  const handleAddCategoria = () => {
    if (newCategoria.trim()) {
      addCategoriaEmbalagem({ nome: newCategoria.trim() })
      setNewCategoria('')
      setShowCategoriaForm(false)
    }
  }

  const handleAddFornecedor = () => {
    if (newFornecedor.nome.trim()) {
      addFornecedor({
        nome: newFornecedor.nome.trim(),
        contato: {
          telefone: newFornecedor.telefone || undefined,
          email: newFornecedor.email || undefined
        },
        ativo: true
      })
      setNewFornecedor({ nome: '', telefone: '', email: '' })
      setShowFornecedorForm(false)
    }
  }

  // Calcular preço unitário em tempo real para lote
  const precoUnitarioCalculado = calcularPrecoUnitario({
    tipoPrecificacao: formData.tipoPrecificacao,
    precoUnitario: parseFloat(formData.precoUnitario) || 0,
    precoLote: parseFloat(formData.precoLote) || 0,
    quantidadeLote: parseInt(formData.quantidadeLote) || 0
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingEmbalagem ? 'Editar Embalagem' : 'Nova Embalagem'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nome e Tipo de Precificação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Embalagem *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: Copo 400ml, Tampa, Colher"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Precificação
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="unitario"
                    checked={formData.tipoPrecificacao === 'unitario'}
                    onChange={(e) => setFormData({...formData, tipoPrecificacao: e.target.value as 'unitario' | 'lote'})}
                    className="mr-2"
                  />
                  <DollarSign className="h-4 w-4 mr-1" />
                  Valor Unitário
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="lote"
                    checked={formData.tipoPrecificacao === 'lote'}
                    onChange={(e) => setFormData({...formData, tipoPrecificacao: e.target.value as 'unitario' | 'lote'})}
                    className="mr-2"
                  />
                  <Package className="h-4 w-4 mr-1" />
                  Valor em Lote
                </label>
              </div>
            </div>
          </div>

          {/* Precificação */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-4">Precificação</h3>
            
            {formData.tipoPrecificacao === 'unitario' ? (
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço Unitário (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.precoUnitario}
                  onChange={(e) => setFormData({...formData, precoUnitario: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço do Lote (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.precoLote}
                    onChange={(e) => setFormData({...formData, precoLote: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade no Lote *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantidadeLote}
                    onChange={(e) => setFormData({...formData, quantidadeLote: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço Unitário Calculado
                  </label>
                  <div className="w-full px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                    <span className="text-green-800 font-medium">
                      R$ {precoUnitarioCalculado.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fornecedor e Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fornecedor
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.fornecedorId}
                  onChange={(e) => setFormData({...formData, fornecedorId: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecione um fornecedor</option>
                  {fornecedores.filter(f => f.ativo).map(fornecedor => (
                    <option key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowFornecedorForm(true)}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {showFornecedorForm && (
                <div className="mt-3 p-3 border rounded-md bg-blue-50">
                  <h4 className="font-medium text-blue-900 mb-2">Novo Fornecedor</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Nome do fornecedor *"
                      value={newFornecedor.nome}
                      onChange={(e) => setNewFornecedor({...newFornecedor, nome: e.target.value})}
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                    <input
                      type="tel"
                      placeholder="Telefone"
                      value={newFornecedor.telefone}
                      onChange={(e) => setNewFornecedor({...newFornecedor, telefone: e.target.value})}
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newFornecedor.email}
                      onChange={(e) => setNewFornecedor({...newFornecedor, email: e.target.value})}
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddFornecedor}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Criar
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowFornecedorForm(false)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.categoriaId}
                  onChange={(e) => setFormData({...formData, categoriaId: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecione uma categoria</option>
                  {categoriasEmbalagem.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCategoriaForm(true)}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {showCategoriaForm && (
                <div className="mt-3 p-3 border rounded-md bg-green-50">
                  <h4 className="font-medium text-green-900 mb-2">Nova Categoria</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nome da categoria"
                      value={newCategoria}
                      onChange={(e) => setNewCategoria(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border rounded"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategoria}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Criar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCategoriaForm(false)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload de Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem da Embalagem
            </label>
            <div className="flex gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      Clique para<br />fazer upload
                    </span>
                  </>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Faça upload de uma imagem da embalagem (opcional)
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Formatos aceitos: JPG, PNG</li>
                  <li>• Tamanho máximo: 500KB</li>
                  <li>• Recomendado: 300x300px</li>
                </ul>
                {previewImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null)
                      setFormData(prev => ({ ...prev, imagemUrl: '' }))
                    }}
                    className="mt-2 text-xs text-red-600 hover:text-red-800"
                  >
                    Remover imagem
                  </button>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Informações adicionais sobre a embalagem..."
            />
          </div>

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativa"
              checked={formData.ativa}
              onChange={(e) => setFormData({...formData, ativa: e.target.checked})}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="ativa" className="ml-2 block text-sm text-gray-900">
              Embalagem ativa
            </label>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 font-medium"
            >
              {editingEmbalagem ? 'Atualizar' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm()
                onClose()
              }}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}