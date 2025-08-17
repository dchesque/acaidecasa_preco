'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import CategoriaSelector, { CategoriaBadge } from '@/components/ui/CategoriaSelector'
import { useCategoriaIntegration } from '@/utils/categoriaIntegration'
import { useFornecedorIntegration } from '@/utils/fornecedorIntegration'
import { useApp } from '@/contexts/AppContext'
import { 
  CATEGORIAS_GLOBAIS,
  getCategoriaStyle,
  getCategoriasModulo
} from '@/config/categorias'
import {
  Sparkles,
  Package,
  Cherry,
  Building2,
  ChefHat,
  Coffee,
  BookOpen,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react'

export default function IntegracaoPage() {
  const { cardapio, insumos, embalagens, fornecedores, produtosFornecedores } = useApp()
  const [selectedModule, setSelectedModule] = useState<keyof typeof CATEGORIAS_GLOBAIS>('CARDAPIO')
  const [selectedCategory, setSelectedCategory] = useState('')
  
  const { getEstatisticas } = useCategoriaIntegration(selectedModule)
  const { gerarRelatorio } = useFornecedorIntegration()

  // Estatísticas por módulo
  const getDataForModule = () => {
    switch (selectedModule) {
      case 'CARDAPIO':
        return cardapio.map(item => ({ categoria: item.categoria }))
      case 'INSUMOS':
        return insumos.map(item => ({ categoria: item.categoriaId }))
      case 'EMBALAGENS':
        return embalagens.map(item => ({ categoria: item.categoriaId }))
      default:
        return []
    }
  }

  const estatisticas = getEstatisticas(getDataForModule())
  const relatorioFornecedores = gerarRelatorio(produtosFornecedores)

  const moduleIcons = {
    CARDAPIO: BookOpen,
    INSUMOS: Cherry,
    EMBALAGENS: Package,
    RECEITAS: ChefHat,
    COPOS: Coffee
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sistema de Integração</h1>
                <p className="text-gray-600">Demonstração do sistema centralizado de categorias e integração de fornecedores</p>
              </div>
            </div>

            {/* Status da Integração */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categorias Integradas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Object.keys(CATEGORIAS_GLOBAIS).length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fornecedores Ativos</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {relatorioFornecedores.fornecedoresAtivos}
                    </p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Economia Potencial</p>
                    <p className="text-2xl font-bold text-purple-600">
                      R$ {relatorioFornecedores.economiaTotal.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Demonstração de Categorias */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            {/* Seletor de Módulo e Categoria */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Sistema Centralizado de Categorias
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Módulo:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(CATEGORIAS_GLOBAIS).map((modulo) => {
                      const Icon = moduleIcons[modulo as keyof typeof moduleIcons]
                      return (
                        <button
                          key={modulo}
                          onClick={() => {
                            setSelectedModule(modulo as keyof typeof CATEGORIAS_GLOBAIS)
                            setSelectedCategory('')
                          }}
                          className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                            selectedModule === modulo
                              ? 'bg-purple-50 border-purple-500 text-purple-700'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{modulo}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria:
                  </label>
                  <CategoriaSelector
                    modulo={selectedModule}
                    value={selectedCategory as any}
                    onChange={setSelectedCategory}
                    placeholder="Selecione uma categoria"
                    className="w-full"
                  />
                </div>

                {selectedCategory && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Categoria Selecionada:</h4>
                    <CategoriaBadge 
                      modulo={selectedModule}
                      categoria={selectedCategory as any}
                      size="lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Estatísticas de Categorias */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Distribuição por Categoria - {selectedModule}
              </h3>
              
              <div className="space-y-3">
                {estatisticas.map((stat) => (
                  <div key={stat.categoria} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CategoriaBadge 
                        modulo={selectedModule}
                        categoria={stat.categoria}
                        size="sm"
                      />
                      <span className="text-sm text-gray-600">
                        {stat.count} itens
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-10 text-right">
                        {stat.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Demonstração de Todas as Categorias */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Todas as Categorias Disponíveis
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <RefreshCw className="h-4 w-4" />
                <span>Sistema Centralizado</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.entries(CATEGORIAS_GLOBAIS).map(([modulo, categorias]) => {
                const Icon = moduleIcons[modulo as keyof typeof moduleIcons]
                return (
                  <div key={modulo} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">{modulo}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categorias.map((categoria) => (
                        <CategoriaBadge
                          key={categoria}
                          modulo={modulo as keyof typeof CATEGORIAS_GLOBAIS}
                          categoria={categoria as any}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Integração com Fornecedores */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Integração de Fornecedores
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Total de Produtos</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {relatorioFornecedores.totalProdutos}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Fornecedores</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {relatorioFornecedores.fornecedoresAtivos}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Economia Total</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  R$ {relatorioFornecedores.economiaTotal.toFixed(2)}
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-900">Integração</span>
                </div>
                <p className="text-lg font-bold text-orange-600">
                  100% Ativa
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}