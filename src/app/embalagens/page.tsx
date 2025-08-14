'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import { Embalagem } from '@/types'

export default function EmbalagensPage() {
  const { embalagens, addEmbalagem, updateEmbalagem, deleteEmbalagem } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editingEmbalagem, setEditingEmbalagem] = useState<Embalagem | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    precoUnitario: '',
    ativa: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const embalagemData = {
      nome: formData.nome,
      precoUnitario: parseFloat(formData.precoUnitario),
      ativa: formData.ativa
    }

    if (editingEmbalagem) {
      updateEmbalagem(editingEmbalagem.id, embalagemData)
    } else {
      addEmbalagem(embalagemData)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      precoUnitario: '',
      ativa: true
    })
    setShowForm(false)
    setEditingEmbalagem(null)
  }

  const handleEdit = (embalagem: Embalagem) => {
    setEditingEmbalagem(embalagem)
    setFormData({
      nome: embalagem.nome,
      precoUnitario: embalagem.precoUnitario.toString(),
      ativa: embalagem.ativa
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta embalagem?')) {
      deleteEmbalagem(id)
    }
  }

  const toggleStatus = (embalagem: Embalagem) => {
    updateEmbalagem(embalagem.id, { ativa: !embalagem.ativa })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Embalagens</h1>
              <p className="text-gray-600 mt-2">Gerencie as embalagens utilizadas nos produtos</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nova Embalagem
            </button>
          </div>

          {/* Formulário */}
          {showForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingEmbalagem ? 'Editar Embalagem' : 'Nova Embalagem'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Embalagem
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
                      Preço Unitário (R$)
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
                </div>

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

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    {editingEmbalagem ? 'Atualizar' : 'Salvar'}
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

          {/* Lista de embalagens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {embalagens.map((embalagem) => (
              <div
                key={embalagem.id}
                className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                  embalagem.ativa ? 'border-l-green-500' : 'border-l-gray-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${
                      embalagem.ativa ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Package className={`h-6 w-6 ${
                        embalagem.ativa ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {embalagem.nome}
                      </h3>
                      <p className="text-2xl font-bold text-purple-600">
                        R$ {embalagem.precoUnitario.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(embalagem)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(embalagem.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    embalagem.ativa 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {embalagem.ativa ? 'Ativa' : 'Inativa'}
                  </span>
                  
                  <button
                    onClick={() => toggleStatus(embalagem)}
                    className={`text-xs px-3 py-1 rounded-md ${
                      embalagem.ativa 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {embalagem.ativa ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {embalagens.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma embalagem cadastrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando sua primeira embalagem.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}