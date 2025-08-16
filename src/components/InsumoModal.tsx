'use client'

import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { X, Upload, Plus, Package, Truck, Calculator, Trash2, Edit, Star } from 'lucide-react'
import { Insumo } from '@/types'

interface InsumoModalProps {
  isOpen: boolean
  onClose: () => void
  editingInsumo?: Insumo | null
}

const UNIDADES_MEDIDA = [
  { value: 'g', label: 'Gramas (g)' },
  { value: 'kg', label: 'Quilogramas (kg)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'unidade', label: 'Unidade' }
]

interface FornecedorPreco {
  id?: string
  fornecedorId: string
  precoBruto: string
  precoComDesconto: string
  unidade: string
  quantidadeMinima: string
  tempoEntregaDias: string
  ativo: boolean
  padrao: boolean
}

export default function InsumoModal({ isOpen, onClose, editingInsumo }: InsumoModalProps) {
  const { 
    addInsumo, 
    updateInsumo, 
    categoriasInsumo, 
    addCategoriaInsumo,
    fornecedores,
    addFornecedor,
    precosInsumoFornecedor,
    addPrecoInsumoFornecedor,
    updatePrecoInsumoFornecedor,
    deletePrecoInsumoFornecedor
  } = useApp()

  const [formData, setFormData] = useState({
    nome: '',
    categoriaId: '',
    unidadeMedida: 'g',
    imagemUrl: '',
    observacoes: '',
    ativo: true
  })

  const [fornecedoresPrecos, setFornecedoresPrecos] = useState<FornecedorPreco[]>([])
  const [showCategoriaForm, setShowCategoriaForm] = useState(false)
  const [showFornecedorForm, setShowFornecedorForm] = useState(false)
  const [newCategoria, setNewCategoria] = useState({ nome: '', descricao: '' })
  const [newFornecedor, setNewFornecedor] = useState({
    nome: '',
    telefone: '',
    email: ''
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingInsumo) {
      setFormData({
        nome: editingInsumo.nome,
        categoriaId: editingInsumo.categoriaId || '',
        unidadeMedida: editingInsumo.unidadeMedida,
        imagemUrl: editingInsumo.imagemUrl || '',
        observacoes: editingInsumo.observacoes || '',
        ativo: editingInsumo.ativo
      })
      setPreviewImage(editingInsumo.imagemUrl || null)

      // Carregar preços existentes do insumo
      const precosExistentes = precosInsumoFornecedor
        .filter(p => p.insumoId === editingInsumo.id)
        .map(p => ({
          id: p.id,
          fornecedorId: p.fornecedorId,
          precoBruto: p.precoBruto.toString(),
          precoComDesconto: p.precoComDesconto.toString(),
          unidade: p.unidade,
          quantidadeMinima: p.quantidadeMinima?.toString() || '',
          tempoEntregaDias: p.tempoEntregaDias?.toString() || '',
          ativo: p.ativo,
          padrao: p.padrao
        }))
      setFornecedoresPrecos(precosExistentes)
    } else {
      resetForm()
    }
  }, [editingInsumo, precosInsumoFornecedor])

  const resetForm = () => {
    setFormData({
      nome: '',
      categoriaId: '',
      unidadeMedida: 'g',
      imagemUrl: '',
      observacoes: '',
      ativo: true
    })
    setFornecedoresPrecos([])
    setPreviewImage(null)
    setShowCategoriaForm(false)
    setShowFornecedorForm(false)
    setNewCategoria({ nome: '', descricao: '' })
    setNewFornecedor({ nome: '', telefone: '', email: '' })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 500 * 1024) {
        alert('Imagem muito grande. Máximo 500KB.')
        return
      }

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

  const addFornecedorPreco = () => {
    const novoFornecedor: FornecedorPreco = {
      fornecedorId: '',
      precoBruto: '',
      precoComDesconto: '',
      unidade: formData.unidadeMedida,
      quantidadeMinima: '',
      tempoEntregaDias: '',
      ativo: true,
      padrao: fornecedoresPrecos.length === 0 // Primeiro é padrão automaticamente
    }
    setFornecedoresPrecos([...fornecedoresPrecos, novoFornecedor])
  }

  const updateFornecedorPreco = (index: number, field: keyof FornecedorPreco, value: any) => {
    const updated = [...fornecedoresPrecos]
    updated[index] = { ...updated[index], [field]: value }
    setFornecedoresPrecos(updated)
  }

  const removeFornecedorPreco = (index: number) => {
    const updated = fornecedoresPrecos.filter((_, i) => i !== index)
    // Se removeu o padrão e ainda tem fornecedores, o primeiro vira padrão
    if (fornecedoresPrecos[index].padrao && updated.length > 0) {
      updated[0].padrao = true
    }
    setFornecedoresPrecos(updated)
  }

  const setPadraoFornecedor = (index: number) => {
    const updated = fornecedoresPrecos.map((f, i) => ({
      ...f,
      padrao: i === index
    }))
    setFornecedoresPrecos(updated)
  }

  const calcularDesconto = (precoBruto: string, precoComDesconto: string) => {
    const bruto = parseFloat(precoBruto) || 0
    const desconto = parseFloat(precoComDesconto) || 0
    if (bruto === 0) return 0
    return ((bruto - desconto) / bruto * 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (!formData.nome.trim()) {
      alert('Nome do insumo é obrigatório')
      return
    }

    // Validar fornecedores
    for (let i = 0; i < fornecedoresPrecos.length; i++) {
      const f = fornecedoresPrecos[i]
      if (!f.fornecedorId) {
        alert(`Selecione um fornecedor para o item ${i + 1}`)
        return
      }
      if (!f.precoBruto || parseFloat(f.precoBruto) <= 0) {
        alert(`Preço bruto deve ser maior que zero para o item ${i + 1}`)
        return
      }
      if (!f.precoComDesconto || parseFloat(f.precoComDesconto) <= 0) {
        alert(`Preço com desconto deve ser maior que zero para o item ${i + 1}`)
        return
      }
    }

    const insumoData = {
      nome: formData.nome.trim(),
      categoriaId: formData.categoriaId || undefined,
      unidadeMedida: formData.unidadeMedida,
      imagemUrl: formData.imagemUrl || undefined,
      observacoes: formData.observacoes || undefined,
      ativo: formData.ativo
    }

    let insumoId: string

    if (editingInsumo) {
      updateInsumo(editingInsumo.id, insumoData)
      insumoId = editingInsumo.id

      // Remover preços antigos que não estão mais na lista
      const precosAtuais = precosInsumoFornecedor.filter(p => p.insumoId === editingInsumo.id)
      for (const precoAtual of precosAtuais) {
        const ainda_existe = fornecedoresPrecos.find(f => f.id === precoAtual.id)
        if (!ainda_existe) {
          deletePrecoInsumoFornecedor(precoAtual.id)
        }
      }
    } else {
      insumoId = Date.now().toString()
      addInsumo({ ...insumoData, id: insumoId })
    }

    // Salvar ou atualizar preços dos fornecedores
    for (const fornecedorPreco of fornecedoresPrecos) {
      if (!fornecedorPreco.fornecedorId) continue

      const precoData = {
        insumoId,
        fornecedorId: fornecedorPreco.fornecedorId,
        precoBruto: parseFloat(fornecedorPreco.precoBruto),
        precoComDesconto: parseFloat(fornecedorPreco.precoComDesconto),
        unidade: fornecedorPreco.unidade,
        quantidadeMinima: fornecedorPreco.quantidadeMinima ? parseInt(fornecedorPreco.quantidadeMinima) : undefined,
        tempoEntregaDias: fornecedorPreco.tempoEntregaDias ? parseInt(fornecedorPreco.tempoEntregaDias) : undefined,
        ativo: fornecedorPreco.ativo,
        padrao: fornecedorPreco.padrao
      }

      if (fornecedorPreco.id) {
        updatePrecoInsumoFornecedor(fornecedorPreco.id, precoData)
      } else {
        addPrecoInsumoFornecedor(precoData)
      }
    }

    resetForm()
    onClose()
  }

  const handleAddCategoria = () => {
    if (newCategoria.nome.trim()) {
      addCategoriaInsumo({
        nome: newCategoria.nome.trim(),
        descricao: newCategoria.descricao.trim() || undefined
      })
      setNewCategoria({ nome: '', descricao: '' })
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

  const fornecedoresDisponiveis = fornecedores.filter(f => f.ativo)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {editingInsumo ? 'Editar Insumo' : 'Novo Insumo'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informações Básicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Insumo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Açaí Tradicional, Leite Condensado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidade de Medida *
                </label>
                <select
                  value={formData.unidadeMedida}
                  onChange={(e) => setFormData({...formData, unidadeMedida: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {UNIDADES_MEDIDA.map(unidade => (
                    <option key={unidade.value} value={unidade.value}>
                      {unidade.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.categoriaId}
                    onChange={(e) => setFormData({...formData, categoriaId: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categoriasInsumo.map(categoria => (
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
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Nome da categoria *"
                        value={newCategoria.nome}
                        onChange={(e) => setNewCategoria({...newCategoria, nome: e.target.value})}
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                      <input
                        type="text"
                        placeholder="Descrição (opcional)"
                        value={newCategoria.descricao}
                        onChange={(e) => setNewCategoria({...newCategoria, descricao: e.target.value})}
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                      <div className="flex gap-2">
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
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upload de Imagem */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-4">Imagem do Insumo</h3>
            <div className="flex gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
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
                  Faça upload de uma imagem do insumo (opcional)
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

          {/* Fornecedores e Preços */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Fornecedores e Preços
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFornecedorForm(true)}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 text-sm"
                >
                  + Novo Fornecedor
                </button>
                <button
                  type="button"
                  onClick={addFornecedorPreco}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {showFornecedorForm && (
              <div className="mb-4 p-3 border rounded-md bg-blue-100">
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

            <div className="space-y-4">
              {fornecedoresPrecos.map((fornecedorPreco, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fornecedor *
                      </label>
                      <select
                        required
                        value={fornecedorPreco.fornecedorId}
                        onChange={(e) => updateFornecedorPreco(index, 'fornecedorId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione o fornecedor</option>
                        {fornecedoresDisponiveis.map(fornecedor => (
                          <option key={fornecedor.id} value={fornecedor.id}>
                            {fornecedor.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço Bruto (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        required
                        value={fornecedorPreco.precoBruto}
                        onChange={(e) => updateFornecedorPreco(index, 'precoBruto', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço Final (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        required
                        value={fornecedorPreco.precoComDesconto}
                        onChange={(e) => updateFornecedorPreco(index, 'precoComDesconto', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unidade
                      </label>
                      <select
                        value={fornecedorPreco.unidade}
                        onChange={(e) => updateFornecedorPreco(index, 'unidade', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {UNIDADES_MEDIDA.map(unidade => (
                          <option key={unidade.value} value={unidade.value}>
                            {unidade.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qtd. Mínima
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={fornecedorPreco.quantidadeMinima}
                        onChange={(e) => updateFornecedorPreco(index, 'quantidadeMinima', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prazo (dias)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={fornecedorPreco.tempoEntregaDias}
                        onChange={(e) => updateFornecedorPreco(index, 'tempoEntregaDias', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>

                    {/* Calculadora e desconto */}
                    {fornecedorPreco.precoBruto && fornecedorPreco.precoComDesconto && (
                      <div className="lg:col-span-2">
                        <div className="bg-green-50 border border-green-200 rounded-md p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Calculator className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Análise</span>
                          </div>
                          <div className="text-sm text-green-700">
                            <div>Desconto: {calcularDesconto(fornecedorPreco.precoBruto, fornecedorPreco.precoComDesconto).toFixed(1)}%</div>
                            <div>Economia: R$ {(parseFloat(fornecedorPreco.precoBruto || '0') - parseFloat(fornecedorPreco.precoComDesconto || '0')).toFixed(3)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controles do fornecedor */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={fornecedorPreco.ativo}
                          onChange={(e) => updateFornecedorPreco(index, 'ativo', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Ativo</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={fornecedorPreco.padrao}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPadraoFornecedor(index)
                            }
                          }}
                          className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900 flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          Usar nos cálculos
                        </span>
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFornecedorPreco(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Remover fornecedor"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {fornecedoresPrecos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Truck className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">Nenhum fornecedor adicionado</p>
                  <p className="text-sm">Clique em + para adicionar fornecedores</p>
                </div>
              )}
            </div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Informações adicionais sobre o insumo..."
            />
          </div>

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativo"
              checked={formData.ativo}
              onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
              Insumo ativo
            </label>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium"
            >
              {editingInsumo ? 'Atualizar' : 'Salvar'}
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