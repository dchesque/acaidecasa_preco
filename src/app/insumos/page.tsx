'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import { Plus, Edit, Trash2, Cherry, Sparkles } from 'lucide-react'
import { Insumo } from '@/types'

export default function InsumosPage() {
  const { insumos, addInsumo, updateInsumo, deleteInsumo } = useApp()
  const [activeTab, setActiveTab] = useState<'acai' | 'complemento'>('acai')
  const [showForm, setShowForm] = useState(false)
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'acai' as 'acai' | 'complemento',
    quantidadeComprada: '',
    precoComDesconto: '',
    precoReal: '',
    ativo: true
  })

  const insumosAcai = insumos.filter(i => i.tipo === 'acai')
  const insumosComplemento = insumos.filter(i => i.tipo === 'complemento')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const insumoData = {
      nome: formData.nome,
      tipo: formData.tipo,
      quantidadeComprada: parseFloat(formData.quantidadeComprada),
      precoComDesconto: parseFloat(formData.precoComDesconto),
      precoReal: parseFloat(formData.precoReal),
      ativo: formData.ativo
    }

    if (editingInsumo) {
      updateInsumo(editingInsumo.id, insumoData)
    } else {
      addInsumo(insumoData)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: activeTab,
      quantidadeComprada: '',
      precoComDesconto: '',
      precoReal: '',
      ativo: true
    })
    setShowForm(false)
    setEditingInsumo(null)
  }

  const handleEdit = (insumo: Insumo) => {
    setEditingInsumo(insumo)
    setFormData({
      nome: insumo.nome,
      tipo: insumo.tipo,
      quantidadeComprada: insumo.quantidadeComprada.toString(),
      precoComDesconto: insumo.precoComDesconto.toString(),
      precoReal: insumo.precoReal.toString(),
      ativo: insumo.ativo
    })
    setActiveTab(insumo.tipo)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este insumo?')) {
      deleteInsumo(id)
    }
  }

  const toggleStatus = (insumo: Insumo) => {
    updateInsumo(insumo.id, { ativo: !insumo.ativo })
  }

  const renderInsumoCard = (insumo: Insumo) => (
    <div
      key={insumo.id}
      className={`bg-white rounded-lg shadow p-6 border-l-4 ${
        insumo.ativo ? 'border-l-green-500' : 'border-l-gray-400'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${
            insumo.ativo ? 
              (insumo.tipo === 'acai' ? 'bg-purple-100' : 'bg-yellow-100') : 
              'bg-gray-100'
          }`}>
            {insumo.tipo === 'acai' ? (
              <Cherry className={`h-6 w-6 ${
                insumo.ativo ? 'text-purple-600' : 'text-gray-400'
              }`} />
            ) : (
              <Sparkles className={`h-6 w-6 ${
                insumo.ativo ? 'text-yellow-600' : 'text-gray-400'
              }`} />
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {insumo.nome}
            </h3>
            <p className="text-sm text-gray-500">
              {insumo.quantidadeComprada}g comprados
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(insumo)}
            className="p-2 text-gray-400 hover:text-blue-600"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(insumo.id)}
            className="p-2 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Preço com desconto:</span>
          <span className="font-medium">R$ {insumo.precoComDesconto.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Preço real:</span>
          <span className="font-medium">R$ {insumo.precoReal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Preço por grama:</span>
          <span className="text-lg font-bold text-green-600">
            R$ {insumo.precoPorGrama.toFixed(4)}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          insumo.ativo 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {insumo.ativo ? 'Ativo' : 'Inativo'}
        </span>
        
        <button
          onClick={() => toggleStatus(insumo)}
          className={`text-xs px-3 py-1 rounded-md ${
            insumo.ativo 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {insumo.ativo ? 'Desativar' : 'Ativar'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Insumos</h1>
              <p className="text-gray-600 mt-2">Gerencie açaí e complementos com precificação por peso</p>
            </div>
            <button
              onClick={() => {
                setFormData({...formData, tipo: activeTab})
                setShowForm(true)
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Novo Insumo
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('acai')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'acai'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Cherry className="h-5 w-5" />
                  Açaí ({insumosAcai.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('complemento')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'complemento'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Complementos ({insumosComplemento.length})
                </div>
              </button>
            </nav>
          </div>

          {/* Formulário */}
          {showForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingInsumo ? 'Editar Insumo' : `Novo ${activeTab === 'acai' ? 'Açaí' : 'Complemento'}`}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Insumo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={activeTab === 'acai' ? 'Ex: Açaí Normal, Açaí Premium' : 'Ex: Chocolate, Granola, Leite Condensado'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo
                    </label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({...formData, tipo: e.target.value as 'acai' | 'complemento'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="acai">Açaí</option>
                      <option value="complemento">Complemento</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantidade Comprada (g)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.quantidadeComprada}
                      onChange={(e) => setFormData({...formData, quantidadeComprada: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço com Desconto (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.precoComDesconto}
                      onChange={(e) => setFormData({...formData, precoComDesconto: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="25.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Real (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.precoReal}
                      onChange={(e) => setFormData({...formData, precoReal: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="30.00"
                    />
                  </div>
                </div>

                {/* Preview do preço por grama */}
                {formData.quantidadeComprada && formData.precoReal && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <p className="text-sm text-green-800">
                      <strong>Preço por grama: R$ {
                        (parseFloat(formData.precoReal) / parseFloat(formData.quantidadeComprada)).toFixed(4)
                      }</strong>
                    </p>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
                    Insumo ativo
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    {editingInsumo ? 'Atualizar' : 'Salvar'}
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

          {/* Lista de insumos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'acai' 
              ? insumosAcai.map(renderInsumoCard)
              : insumosComplemento.map(renderInsumoCard)
            }
          </div>

          {((activeTab === 'acai' && insumosAcai.length === 0) || 
            (activeTab === 'complemento' && insumosComplemento.length === 0)) && (
            <div className="text-center py-12">
              {activeTab === 'acai' ? (
                <Cherry className="mx-auto h-12 w-12 text-gray-400" />
              ) : (
                <Sparkles className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum {activeTab === 'acai' ? 'açaí' : 'complemento'} cadastrado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando seu primeiro {activeTab === 'acai' ? 'açaí' : 'complemento'}.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}