'use client'

import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import MetricCard from '@/components/ui/MetricCard'
import Button from '@/components/ui/Button'
import { carregarDadosExemplo } from '@/data/exemplos'
import { formatCurrency, formatPercentage } from '@/utils/formatters'
import { 
  getMargemColor, 
  MargemBadge, 
  MargemProgressBar,
  classificarProdutoPorMargem 
} from '@/utils/margemUtils'
import { 
  Package, 
  Cherry, 
  TrendingUp,
  TrendingDown,
  Percent,
  Database,
  BookOpen,
  BarChart3,
  Truck,
  AlertTriangle,
  DollarSign,
  Star,
  Diamond,
  Target,
  Activity,
  ArrowRight
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

  // Produtos críticos e oportunidades
  const produtosCriticos = itensCardapioAtivos.filter(item => item.percentualMargem < 30)
  const produtosOportunidade = itensCardapioAtivos.filter(item => item.percentualMargem > 70)
  
  // Top 5 produtos por margem
  const top5MaioresMargens = [...itensCardapioAtivos]
    .sort((a, b) => b.percentualMargem - a.percentualMargem)
    .slice(0, 5)
  
  const top5MenoresMargens = [...itensCardapioAtivos]
    .sort((a, b) => a.percentualMargem - b.percentualMargem)
    .slice(0, 5)

  // Matriz de lucratividade
  const matrizLucratividade = {
    estrelas: itensCardapioAtivos.filter(item => item.percentualMargem >= 50 && item.precoVenda <= 30),
    premium: itensCardapioAtivos.filter(item => item.percentualMargem >= 50 && item.precoVenda > 30),
    revisar: itensCardapioAtivos.filter(item => item.percentualMargem < 30 && item.precoVenda <= 30),
    otimizar: itensCardapioAtivos.filter(item => item.percentualMargem < 30 && item.precoVenda > 30)
  }

  // Alertas
  const alertas = []
  if (produtosCriticos.length > 0) {
    alertas.push({
      tipo: 'danger',
      icon: AlertTriangle,
      mensagem: `${produtosCriticos.length} produtos com margem abaixo de 30%`
    })
  }
  if (economiaPotencial > 100) {
    alertas.push({
      tipo: 'success',
      icon: DollarSign,
      mensagem: `Economia de ${formatCurrency(economiaPotencial)} disponível com fornecedores`
    })
  }
  if (margemMediaCardapio < 40) {
    alertas.push({
      tipo: 'warning',
      icon: TrendingDown,
      mensagem: `Margem média geral abaixo do ideal (${margemMediaCardapio.toFixed(1)}%)`
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      <Navigation />
      
      <div className="md:pl-64">
        <main className="p-6">
          <div className="mb-8 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="heading-primary">Dashboard de Precificação</h1>
              <p className="body-text mt-2">Análise completa de margens e oportunidades</p>
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

          {/* Cards de Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Margem Média Geral</h3>
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-3">
                {margemMediaCardapio.toFixed(1)}%
              </div>
              <MargemProgressBar margem={margemMediaCardapio} />
              <div className="mt-3">
                <MargemBadge margem={margemMediaCardapio} />
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Produtos Críticos</h3>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">
                {produtosCriticos.length}
              </div>
              <p className="text-sm text-gray-500">Margem abaixo de 30%</p>
              {produtosCriticos.length > 0 && (
                <Button variant="ghost" size="sm" className="mt-3 text-red-600">
                  Revisar agora <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>

            <div className="glass-card rounded-xl p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Oportunidades</h3>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {produtosOportunidade.length}
              </div>
              <p className="text-sm text-gray-500">Margem acima de 70%</p>
              <div className="mt-3 text-xs text-green-600">
                Alto potencial de lucro
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Economia Potencial</h3>
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatCurrency(economiaPotencial)}
              </div>
              <p className="text-sm text-gray-500">Com otimização de fornecedores</p>
              {economiaPotencial > 0 && (
                <Button variant="ghost" size="sm" className="mt-3 text-purple-600">
                  Ver detalhes <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>

          {/* Seção de Alertas */}
          {alertas.length > 0 && (
            <div className="mb-8 space-y-3">
              <h3 className="heading-section mb-4">📊 Alertas e Notificações</h3>
              {alertas.map((alerta, index) => {
                const Icon = alerta.icon
                const bgColor = alerta.tipo === 'danger' ? 'bg-red-50 border-red-200' :
                              alerta.tipo === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                              'bg-green-50 border-green-200'
                const iconColor = alerta.tipo === 'danger' ? 'text-red-600' :
                                alerta.tipo === 'warning' ? 'text-yellow-600' :
                                'text-green-600'
                
                return (
                  <div key={index} className={`${bgColor} border rounded-lg p-4 flex items-center gap-3`}>
                    <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0`} />
                    <span className="text-sm font-medium text-gray-700">{alerta.mensagem}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Matriz de Lucratividade */}
          {itensCardapioAtivos.length > 0 && (
            <div className="mb-8">
              <h3 className="heading-section mb-4">💎 Matriz de Lucratividade</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <h4 className="font-semibold text-gray-800">Estrelas</h4>
                    <span className="text-sm text-gray-500">({matrizLucratividade.estrelas.length})</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Alta margem + Popular</p>
                  <div className="space-y-2">
                    {matrizLucratividade.estrelas.slice(0, 3).map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.nome}</span>
                        <MargemBadge margem={item.percentualMargem} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Diamond className="h-5 w-5 text-purple-500" />
                    <h4 className="font-semibold text-gray-800">Premium</h4>
                    <span className="text-sm text-gray-500">({matrizLucratividade.premium.length})</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Alta margem + Baixo volume</p>
                  <div className="space-y-2">
                    {matrizLucratividade.premium.slice(0, 3).map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.nome}</span>
                        <MargemBadge margem={item.percentualMargem} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="h-5 w-5 text-orange-500" />
                    <h4 className="font-semibold text-gray-800">Revisar</h4>
                    <span className="text-sm text-gray-500">({matrizLucratividade.revisar.length})</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Baixa margem + Popular</p>
                  <div className="space-y-2">
                    {matrizLucratividade.revisar.slice(0, 3).map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.nome}</span>
                        <MargemBadge margem={item.percentualMargem} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-red-50 to-pink-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-red-500" />
                    <h4 className="font-semibold text-gray-800">Otimizar</h4>
                    <span className="text-sm text-gray-500">({matrizLucratividade.otimizar.length})</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Baixa margem + Baixo volume</p>
                  <div className="space-y-2">
                    {matrizLucratividade.otimizar.slice(0, 3).map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.nome}</span>
                        <MargemBadge margem={item.percentualMargem} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top 5 Produtos */}
          {itensCardapioAtivos.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-xl p-6">
                <h3 className="heading-card mb-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Top 5 - Maiores Margens
                </h3>
                <div className="space-y-4">
                  {top5MaioresMargens.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                        <div>
                          <p className="font-medium text-gray-800">{item.nome}</p>
                          <p className="text-sm text-gray-500">
                            Lucro: {formatCurrency(item.markup)} por unidade
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <MargemBadge margem={item.percentualMargem} />
                        <p className="text-xs text-gray-500 mt-1">
                          {formatCurrency(item.precoVenda)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <h3 className="heading-card mb-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center mr-3">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  Top 5 - Menores Margens
                </h3>
                <div className="space-y-4">
                  {top5MenoresMargens.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                        <div>
                          <p className="font-medium text-gray-800">{item.nome}</p>
                          <p className="text-sm text-gray-500">
                            Lucro: {formatCurrency(item.markup)} por unidade
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <MargemBadge margem={item.percentualMargem} />
                        <p className="text-xs text-gray-500 mt-1">
                          {formatCurrency(item.precoVenda)}
                        </p>
                      </div>
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