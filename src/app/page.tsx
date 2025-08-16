'use client'

import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import MetricCard from '@/components/ui/MetricCard'
import Button from '@/components/ui/Button'
import { carregarDadosExemplo } from '@/data/exemplos'
import { formatCurrency, formatPercentage } from '@/utils/formatters'
import { 
  Package, 
  Cherry, 
  TrendingUp,
  TrendingDown,
  Percent,
  Database,
  BookOpen,
  BarChart3,
  Truck
} from 'lucide-react'

export default function Dashboard() {
  const { 
    embalagens, 
    insumos, 
    cardapio, 
    fornecedores,
    calcularEconomiaTotal
  } = useApp()

  // Calcular estatísticas
  const totalEmbalagens = embalagens.filter(e => e.ativa).length
  const totalInsumos = insumos.filter(i => i.ativo).length
  const totalItensCardapio = cardapio.filter(c => c.ativo).length
  const totalFornecedores = fornecedores.filter(f => f.ativo).length
  const economiaPotencial = calcularEconomiaTotal()


  // Estatísticas do cardápio
  const itensCardapioAtivos = cardapio.filter(c => c.ativo)
  const margemMediaCardapio = itensCardapioAtivos.length > 0
    ? itensCardapioAtivos.reduce((acc, c) => acc + c.percentualMargem, 0) / itensCardapioAtivos.length
    : 0
    
  const itemMaisLucrativoCardapio = itensCardapioAtivos.reduce((prev, current) => 
    (current.markup > prev.markup) ? current : prev
  , itensCardapioAtivos[0])

  const itemMenosLucrativoCardapio = itensCardapioAtivos.reduce((prev, current) => 
    (current.markup < prev.markup) ? current : prev
  , itensCardapioAtivos[0])

  // Contadores por categoria
  const categoriasCounts = itensCardapioAtivos.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + 1
    return acc
  }, {} as Record<string, number>)


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          <div className="mb-8 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="heading-primary">Dashboard</h1>
              <p className="body-text mt-2">Visão geral premium do seu negócio de açaí</p>
            </div>
            {(totalEmbalagens === 0 && totalInsumos === 0 && totalItensCardapio === 0) && (
              <Button
                onClick={carregarDadosExemplo}
                variant="primary"
                size="lg"
                className="btn-gradient-primary"
              >
                <Database className="h-5 w-5 mr-2" />
                Carregar Dados de Exemplo
              </Button>
            )}
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <MetricCard
              title="Embalagens Ativas"
              value={totalEmbalagens}
              icon={Package}
              variant="gradient"
            />

            <MetricCard
              title="Insumos Ativos"
              value={totalInsumos}
              icon={Cherry}
              variant="gradient"
            />

            <MetricCard
              title="Itens no Cardápio"
              value={totalItensCardapio}
              icon={BookOpen}
              variant="gradient"
            />

            <MetricCard
              title="Margem Média Cardápio"
              value={`${margemMediaCardapio.toFixed(1)}%`}
              icon={Percent}
              variant="highlight"
              trend={{
                value: formatPercentage(margemMediaCardapio),
                direction: margemMediaCardapio > 50 ? 'up' : margemMediaCardapio > 20 ? 'neutral' : 'down'
              }}
            />

            <MetricCard
              title="Fornecedores Ativos"
              value={totalFornecedores}
              icon={Truck}
              variant="gradient"
            />
          </div>

          {/* Card de Economia Potencial */}
          {economiaPotencial > 0 && (
            <div className="glass-highlight rounded-xl p-8 mb-8 border border-green-200/50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mr-6">
                    <TrendingDown className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="heading-card text-green-800">💰 Economia Potencial com Fornecedores</h3>
                    <p className="body-text text-green-700 mt-2">
                      Você pode economizar até <strong className="currency-large text-green-600">{formatCurrency(economiaPotencial)}</strong> otimizando os preços com seus fornecedores
                    </p>
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <div className="currency-large text-green-600 text-4xl font-bold">{formatCurrency(economiaPotencial)}</div>
                  <div className="body-secondary text-green-600 font-medium">por pedido</div>
                </div>
              </div>
            </div>
          )}

          {/* Análise de cardápio */}
          {itensCardapioAtivos.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="glass-card rounded-xl p-6 transition-all duration-300">
                <h3 className="heading-card mb-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Item Mais Lucrativo (Cardápio)
                </h3>
                <div className="space-y-4">
                  <p className="heading-section text-purple-900">{itemMaisLucrativoCardapio?.nome}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="body-text">Custo:</span>
                      <span className="currency-medium">{formatCurrency(itemMaisLucrativoCardapio?.custo || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="body-text">Preço:</span>
                      <span className="currency-medium">{formatCurrency(itemMaisLucrativoCardapio?.precoVenda || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="body-text">Markup:</span>
                      <span className="profit-positive">{formatCurrency(itemMaisLucrativoCardapio?.markup || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="body-text font-medium">Margem:</span>
                      <span className="profit-positive text-xl">{itemMaisLucrativoCardapio?.percentualMargem.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 transition-all duration-300">
                <h3 className="heading-card mb-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center mr-3">
                    <TrendingDown className="h-5 w-5 text-white" />
                  </div>
                  Item Menos Lucrativo (Cardápio)
                </h3>
                <div className="space-y-4">
                  <p className="heading-section text-purple-900">{itemMenosLucrativoCardapio?.nome}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="body-text">Custo:</span>
                      <span className="currency-medium">{formatCurrency(itemMenosLucrativoCardapio?.custo || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="body-text">Preço:</span>
                      <span className="currency-medium">{formatCurrency(itemMenosLucrativoCardapio?.precoVenda || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="body-text">Markup:</span>
                      <span className={`${(itemMenosLucrativoCardapio?.markup || 0) >= 0 ? 'profit-positive' : 'profit-negative'}`}>
                        {formatCurrency(itemMenosLucrativoCardapio?.markup || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="body-text font-medium">Margem:</span>
                      <span className={`text-xl ${(itemMenosLucrativoCardapio?.markup || 0) >= 0 ? 'profit-positive' : 'profit-negative'}`}>
                        {itemMenosLucrativoCardapio?.percentualMargem.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Distribuição por categorias do cardápio */}
          {itensCardapioAtivos.length > 0 && (
            <div className="glass-card rounded-xl mb-8">
              <div className="p-6 border-b border-purple-100">
                <h3 className="heading-card flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  Distribuição por Categoria (Cardápio)
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(categoriasCounts).map(([categoria, count]) => (
                    <div key={categoria} className="text-center p-4 glass-metric rounded-lg transition-all duration-200 hover:scale-105">
                      <p className="body-secondary capitalize mb-2">{categoria.replace('_', ' ')}</p>
                      <p className="currency-large text-purple-600">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
