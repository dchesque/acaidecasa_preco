'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import AnaliseWhatIf from '@/components/AnaliseWhatIf'
import GruposPrecificacao from '@/components/GruposPrecificacao'
import ExportacaoProfissional from '@/components/ExportacaoProfissional'
import SugestoesInteligentes, { DashboardInteligencia } from '@/components/SugestoesInteligentes'
import { useApp } from '@/contexts/AppContext'
import { 
  Brain, 
  Sparkles, 
  Users, 
  Download,
  Zap,
  Target
} from 'lucide-react'

type TabAtivo = 'dashboard' | 'whatif' | 'grupos' | 'sugestoes' | 'exportacao'

export default function AvancadoPage() {
  const { cardapio } = useApp()
  const [tabAtivo, setTabAtivo] = useState<TabAtivo>('dashboard')
  const [produtoSelecionado, setProdutoSelecionado] = useState(cardapio.find(p => p.ativo)?.id || '')

  const tabs = [
    {
      id: 'dashboard' as const,
      nome: 'Dashboard IA',
      icon: Brain,
      descricao: 'Visão geral inteligente do cardápio'
    },
    {
      id: 'whatif' as const,
      nome: 'Análise What-If',
      icon: Sparkles,
      descricao: 'Simule mudanças antes de aplicar'
    },
    {
      id: 'grupos' as const,
      nome: 'Grupos Sincronizados',
      icon: Users,
      descricao: 'Precificação sincronizada'
    },
    {
      id: 'sugestoes' as const,
      nome: 'Sugestões IA',
      icon: Zap,
      descricao: 'Recomendações inteligentes'
    },
    {
      id: 'exportacao' as const,
      nome: 'Exportação Pro',
      icon: Download,
      descricao: 'Documentos profissionais'
    }
  ]

  const produtoAtual = cardapio.find(p => p.id === produtoSelecionado)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Brain className="h-8 w-8 text-purple-600" />
                  Precificação Avançada
                </h1>
                <p className="text-gray-600 mt-2">
                  Ferramentas de inteligência artificial e análise avançada para precificação estratégica
                </p>
              </div>
              
              {/* Badge Fase 3 */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">Fase 3 - IA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navegação por Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTabAtivo(tab.id)}
                    className={`flex-1 min-w-0 px-6 py-4 border-b-2 transition-colors ${
                      tabAtivo === tab.id
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium hidden sm:inline">{tab.nome}</span>
                    </div>
                    <p className="text-xs mt-1 hidden lg:block">
                      {tab.descricao}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Conteúdo das Tabs */}
          <div className="min-h-[500px]">
            {tabAtivo === 'dashboard' && (
              <div className="space-y-6">
                <DashboardInteligencia />
                
                {/* Ações Rápidas */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Ações Rápidas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setTabAtivo('whatif')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="h-6 w-6 text-purple-600" />
                        <span className="font-medium">Simular Mudanças</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Teste cenários antes de aplicar
                      </p>
                    </button>
                    
                    <button
                      onClick={() => setTabAtivo('grupos')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="h-6 w-6 text-blue-600" />
                        <span className="font-medium">Criar Grupos</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Sincronize preços relacionados
                      </p>
                    </button>
                    
                    <button
                      onClick={() => setTabAtivo('exportacao')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Download className="h-6 w-6 text-green-600" />
                        <span className="font-medium">Exportar Cardápio</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Gere documentos profissionais
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tabAtivo === 'whatif' && <AnaliseWhatIf />}

            {tabAtivo === 'grupos' && <GruposPrecificacao />}

            {tabAtivo === 'sugestoes' && (
              <div className="space-y-6">
                {/* Seletor de Produto */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Analisar Produto Específico
                  </h3>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">
                      Produto:
                    </label>
                    <select
                      value={produtoSelecionado}
                      onChange={(e) => setProdutoSelecionado(e.target.value)}
                      className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Selecione um produto</option>
                      {cardapio.filter(p => p.ativo).map(produto => (
                        <option key={produto.id} value={produto.id}>
                          {produto.nome} - {produto.categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sugestões para o produto selecionado */}
                {produtoAtual ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {produtoAtual.nome}
                        </h3>
                        <p className="text-gray-600">
                          Preço atual: <span className="font-medium">R$ {produtoAtual.precoVenda.toFixed(2)}</span> | 
                          Margem: <span className="font-medium">{produtoAtual.percentualMargem.toFixed(1)}%</span>
                        </p>
                      </div>
                    </div>
                    
                    <SugestoesInteligentes produto={produtoAtual} />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Selecione um Produto
                    </h3>
                    <p className="text-gray-600">
                      Escolha um produto acima para ver sugestões inteligentes de precificação
                    </p>
                  </div>
                )}
              </div>
            )}

            {tabAtivo === 'exportacao' && <ExportacaoProfissional />}
          </div>
        </main>
      </div>
    </div>
  )
}