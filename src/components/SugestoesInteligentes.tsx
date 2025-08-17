'use client'

import { useState, useEffect, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { formatCurrency } from '@/utils/formatters'
import { calcularPrecoComMargem, calcularMargem } from '@/utils/margemUtils'
import { ItemCardapio } from '@/types'
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  TrendingDown,
  Target,
  DollarSign,
  Percent,
  Star,
  Crown,
  Zap,
  Users,
  Award,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Calculator
} from 'lucide-react'

export interface SugestaoPreco {
  id: string
  tipo: 'psicologico' | 'competitivo' | 'margem_ideal' | 'volume' | 'premium'
  valor: number
  confianca: number // 0-100
  justificativa: string
  impactoEstimado: {
    vendas: number
    margem: number
    lucro: number
  }
  aplicavel: boolean
}

// Configurações por categoria para margem ideal
const MARGEM_IDEAL_POR_CATEGORIA: Record<string, number> = {
  chocolates: 60,
  mousses: 55,
  sorvetes: 50,
  coberturas: 70,
  cremes_premium: 65,
  frutas: 45,
  complementos: 55,
  receitas: 50,
  copos: 45,
  combinados: 55
}

class MotorSugestoes {
  analisarProduto(produto: ItemCardapio, cardapio: ItemCardapio[]): SugestaoPreco[] {
    const sugestoes: SugestaoPreco[] = []
    
    // 1. Preço Psicológico
    const psicologico = this.calcularPrecoPsicologico(produto)
    if (Math.abs(psicologico - produto.precoVenda) > 0.5) {
      sugestoes.push({
        id: 'psicologico',
        tipo: 'psicologico',
        valor: psicologico,
        confianca: 85,
        justificativa: 'Preços terminados em .90 ou .99 têm maior taxa de conversão (+15% vendas)',
        impactoEstimado: {
          vendas: 15,
          margem: psicologico > produto.precoVenda ? 2 : -2,
          lucro: 12
        },
        aplicavel: true
      })
    }
    
    // 2. Baseado em Margem Ideal
    const margemIdeal = MARGEM_IDEAL_POR_CATEGORIA[produto.categoria] || 50
    const precoMargemIdeal = calcularPrecoComMargem(produto.custo, margemIdeal)
    if (Math.abs(produto.percentualMargem - margemIdeal) > 5) {
      sugestoes.push({
        id: 'margem_ideal',
        tipo: 'margem_ideal',
        valor: precoMargemIdeal,
        confianca: 90,
        justificativa: `Margem de ${margemIdeal}% é ideal para a categoria ${produto.categoria}`,
        impactoEstimado: {
          vendas: produto.percentualMargem < margemIdeal ? -5 : 0,
          margem: margemIdeal - produto.percentualMargem,
          lucro: 10
        },
        aplicavel: true
      })
    }
    
    // 3. Análise Competitiva (simulada)
    const competitivo = this.analisarConcorrencia(produto, cardapio)
    if (competitivo) {
      sugestoes.push(competitivo)
    }
    
    // 4. Estratégia Premium
    if (this.isProdutoPremium(produto)) {
      const premium = this.calcularPrecoPremium(produto)
      if (premium > produto.precoVenda) {
        sugestoes.push({
          id: 'premium',
          tipo: 'premium',
          valor: premium,
          confianca: 75,
          justificativa: 'Produto premium pode sustentar preço mais alto (+25% margem)',
          impactoEstimado: {
            vendas: -10,
            margem: 25,
            lucro: 12
          },
          aplicavel: produto.percentualMargem < 60
        })
      }
    }
    
    // 5. Estratégia de Volume
    if (this.isProdutoVolume(produto)) {
      const volume = this.calcularPrecoVolume(produto)
      if (volume < produto.precoVenda) {
        sugestoes.push({
          id: 'volume',
          tipo: 'volume',
          valor: volume,
          confianca: 80,
          justificativa: 'Preço mais baixo pode aumentar volume de vendas (+30%)',
          impactoEstimado: {
            vendas: 30,
            margem: -8,
            lucro: 18
          },
          aplicavel: produto.percentualMargem > 35
        })
      }
    }
    
    return sugestoes
      .filter(s => s.aplicavel)
      .sort((a, b) => b.confianca - a.confianca)
      .slice(0, 4) // Máximo 4 sugestões
  }
  
  private calcularPrecoPsicologico(produto: ItemCardapio): number {
    const precoAtual = produto.precoVenda
    const margemMinima = 30
    
    // Opções de preços psicológicos
    const opcoes = [
      Math.floor(precoAtual) + 0.90,
      Math.floor(precoAtual) + 0.99,
      Math.ceil(precoAtual) - 0.10,
      Math.ceil(precoAtual) - 0.01,
      Math.floor(precoAtual + 1) + 0.90,
      Math.floor(precoAtual + 1) + 0.99
    ]
    
    // Escolher o mais próximo que mantém margem mínima
    const precoValido = opcoes.find(preco => {
      const margem = calcularMargem(produto.custo, preco)
      return margem >= margemMinima && Math.abs(preco - precoAtual) <= 2
    })
    
    return precoValido || precoAtual
  }
  
  private analisarConcorrencia(produto: ItemCardapio, cardapio: ItemCardapio[]): SugestaoPreco | null {
    // Simular análise competitiva baseada em produtos similares
    const produtosSimilares = cardapio.filter(p => 
      p.categoria === produto.categoria && 
      p.id !== produto.id &&
      p.ativo
    )
    
    if (produtosSimilares.length === 0) return null
    
    const precoMedio = produtosSimilares.reduce((acc, p) => acc + p.precoVenda, 0) / produtosSimilares.length
    const diferenca = Math.abs(produto.precoVenda - precoMedio)
    
    if (diferenca < 1) return null
    
    const precoSugerido = precoMedio * 0.95 // 5% abaixo da média para ser competitivo
    
    return {
      id: 'competitivo',
      tipo: 'competitivo',
      valor: precoSugerido,
      confianca: 70,
      justificativa: `Baseado na média de ${produtosSimilares.length} produtos similares no cardápio`,
      impactoEstimado: {
        vendas: produto.precoVenda > precoMedio ? 20 : -5,
        margem: calcularMargem(produto.custo, precoSugerido) - produto.percentualMargem,
        lucro: 14
      },
      aplicavel: Math.abs(precoSugerido - produto.precoVenda) > 0.5
    }
  }
  
  private isProdutoPremium(produto: ItemCardapio): boolean {
    return produto.categoria === 'cremes_premium' || 
           produto.nome.toLowerCase().includes('premium') ||
           produto.nome.toLowerCase().includes('especial') ||
           produto.custo > 8 // Produtos com custo alto
  }
  
  private isProdutoVolume(produto: ItemCardapio): boolean {
    return produto.categoria === 'copos' ||
           produto.categoria === 'complementos' ||
           produto.nome.toLowerCase().includes('tradicional')
  }
  
  private calcularPrecoPremium(produto: ItemCardapio): number {
    return calcularPrecoComMargem(produto.custo, 65) // 65% de margem premium
  }
  
  private calcularPrecoVolume(produto: ItemCardapio): number {
    return calcularPrecoComMargem(produto.custo, 35) // 35% de margem para volume
  }
}

interface BadgeTipoSugestaoProps {
  tipo: SugestaoPreco['tipo']
}

function BadgeTipoSugestao({ tipo }: BadgeTipoSugestaoProps) {
  const config = {
    psicologico: { 
      icon: Brain, 
      label: 'Psicológico', 
      color: 'bg-purple-100 text-purple-800' 
    },
    margem_ideal: { 
      icon: Target, 
      label: 'Margem Ideal', 
      color: 'bg-blue-100 text-blue-800' 
    },
    competitivo: { 
      icon: BarChart3, 
      label: 'Competitivo', 
      color: 'bg-orange-100 text-orange-800' 
    },
    premium: { 
      icon: Crown, 
      label: 'Premium', 
      color: 'bg-yellow-100 text-yellow-800' 
    },
    volume: { 
      icon: Users, 
      label: 'Volume', 
      color: 'bg-green-100 text-green-800' 
    }
  }
  
  const { icon: Icon, label, color } = config[tipo]
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

interface ConfiancaIndicatorProps {
  valor: number
}

function ConfiancaIndicator({ valor }: ConfiancaIndicatorProps) {
  const getColor = (confianca: number) => {
    if (confianca >= 80) return 'from-green-400 to-green-500'
    if (confianca >= 60) return 'from-yellow-400 to-yellow-500'
    return 'from-red-400 to-red-500'
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-gray-200 rounded-full h-2">
        <div 
          className={`bg-gradient-to-r ${getColor(valor)} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${valor}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 min-w-[35px]">{valor}%</span>
    </div>
  )
}

interface CardSugestaoProps {
  sugestao: SugestaoPreco
  produto: ItemCardapio
  onAplicar: () => void
}

function CardSugestao({ sugestao, produto, onAplicar }: CardSugestaoProps) {
  const diferencaPreco = sugestao.valor - produto.precoVenda
  const novaMaragem = calcularMargem(produto.custo, sugestao.valor)
  
  return (
    <div className="bg-white rounded-lg border hover:shadow-lg transition-all duration-200 p-4 hover:border-purple-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BadgeTipoSugestao tipo={sugestao.tipo} />
            <ConfiancaIndicator valor={sugestao.confianca} />
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(sugestao.valor)}
            </p>
            <div className={`flex items-center gap-1 text-sm ${
              diferencaPreco > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {diferencaPreco > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>
                {diferencaPreco > 0 ? '+' : ''}{formatCurrency(diferencaPreco)}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            {sugestao.justificativa}
          </p>
          
          {/* Impacto Estimado */}
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-1">
              <TrendingUp className={`h-3 w-3 ${
                sugestao.impactoEstimado.vendas > 0 ? 'text-green-500' : 'text-red-500'
              }`} />
              <span className="text-gray-600">Vendas:</span>
              <span className={`font-medium ${
                sugestao.impactoEstimado.vendas > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {sugestao.impactoEstimado.vendas > 0 ? '+' : ''}{sugestao.impactoEstimado.vendas}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Percent className={`h-3 w-3 ${
                sugestao.impactoEstimado.margem > 0 ? 'text-green-500' : 'text-red-500'
              }`} />
              <span className="text-gray-600">Margem:</span>
              <span className={`font-medium ${
                sugestao.impactoEstimado.margem > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {sugestao.impactoEstimado.margem > 0 ? '+' : ''}{sugestao.impactoEstimado.margem.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className={`h-3 w-3 ${
                sugestao.impactoEstimado.lucro > 0 ? 'text-green-500' : 'text-red-500'
              }`} />
              <span className="text-gray-600">Lucro:</span>
              <span className={`font-medium ${
                sugestao.impactoEstimado.lucro > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {sugestao.impactoEstimado.lucro > 0 ? '+' : ''}{sugestao.impactoEstimado.lucro}%
              </span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onAplicar}
          className="ml-4 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Aplicar
        </button>
      </div>
    </div>
  )
}

interface ComparacaoPrecosProps {
  atual: number
  sugestoes: SugestaoPreco[]
  custo: number
}

function ComparacaoPrecos({ atual, sugestoes, custo }: ComparacaoPrecosProps) {
  const margemAtual = calcularMargem(custo, atual)
  
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium mb-3 text-gray-900">Comparação com Preço Atual</h4>
      
      <div className="space-y-3">
        {/* Preço Atual */}
        <div className="flex items-center justify-between p-2 bg-white rounded border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="font-medium text-gray-900">Preço Atual</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-gray-900">{formatCurrency(atual)}</div>
            <div className="text-xs text-gray-500">{margemAtual.toFixed(1)}% margem</div>
          </div>
        </div>
        
        {/* Sugestões */}
        {sugestoes.slice(0, 2).map(sugestao => {
          const novaMargem = calcularMargem(custo, sugestao.valor)
          const diferenca = sugestao.valor - atual
          
          return (
            <div key={sugestao.id} className="flex items-center justify-between p-2 bg-white rounded border">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  sugestao.tipo === 'psicologico' ? 'bg-purple-400' :
                  sugestao.tipo === 'margem_ideal' ? 'bg-blue-400' :
                  sugestao.tipo === 'competitivo' ? 'bg-orange-400' :
                  sugestao.tipo === 'premium' ? 'bg-yellow-400' :
                  'bg-green-400'
                }`}></div>
                <span className="font-medium text-gray-900 capitalize">
                  {sugestao.tipo.replace('_', ' ')}
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{formatCurrency(sugestao.valor)}</span>
                  <span className={`text-xs ${diferenca > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({diferenca > 0 ? '+' : ''}{formatCurrency(diferenca)})
                  </span>
                </div>
                <div className="text-xs text-gray-500">{novaMargem.toFixed(1)}% margem</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface SugestoesInteligentesProps {
  produto: ItemCardapio
}

export default function SugestoesInteligentes({ produto }: SugestoesInteligentesProps) {
  const { cardapio, updateItemCardapio } = useApp()
  const [sugestoes, setSugestoes] = useState<SugestaoPreco[]>([])
  const [analisando, setAnalisando] = useState(false)
  const [motor] = useState(() => new MotorSugestoes())

  const analisarProduto = async () => {
    setAnalisando(true)
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const novasSugestoes = motor.analisarProduto(produto, cardapio)
    setSugestoes(novasSugestoes)
    setAnalisando(false)
  }

  const reanalisar = () => {
    setSugestoes([])
    analisarProduto()
  }

  const aplicarSugestao = (sugestao: SugestaoPreco) => {
    const novaMargem = calcularMargem(produto.custo, sugestao.valor)
    const novoMarkup = sugestao.valor - produto.custo
    
    updateItemCardapio(produto.id, {
      precoVenda: sugestao.valor,
      percentualMargem: novaMargem,
      markup: novoMarkup
    })
    
    // Reanalisar após aplicar
    setTimeout(() => {
      reanalisar()
    }, 500)
  }

  useEffect(() => {
    analisarProduto()
  }, [produto.id])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Sugestões Inteligentes de Preço
        </h3>
        <button 
          onClick={reanalisar}
          disabled={analisando}
          className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${analisando ? 'animate-spin' : ''}`} />
          Reanalisar
        </button>
      </div>
      
      {analisando ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            <p className="text-gray-600">Analisando oportunidades de precificação...</p>
          </div>
        </div>
      ) : sugestoes.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Preço Otimizado!
          </h4>
          <p className="text-gray-600">
            Não encontramos oportunidades significativas de melhoria para este produto.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sugestoes.map(sugestao => (
            <CardSugestao
              key={sugestao.id}
              sugestao={sugestao}
              produto={produto}
              onAplicar={() => aplicarSugestao(sugestao)}
            />
          ))}
          
          {/* Análise Comparativa */}
          <ComparacaoPrecos
            atual={produto.precoVenda}
            sugestoes={sugestoes}
            custo={produto.custo}
          />
        </div>
      )}
    </div>
  )
}

// Componente Dashboard de Inteligência para visão geral
interface InsightCardProps {
  tipo: 'oportunidade' | 'alerta' | 'sugestao'
  mensagem: string
  acao: string
  onClick?: () => void
}

function InsightCard({ tipo, mensagem, acao, onClick }: InsightCardProps) {
  const config = {
    oportunidade: {
      icon: TrendingUp,
      color: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-600'
    },
    alerta: {
      icon: AlertTriangle,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    sugestao: {
      icon: Lightbulb,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      iconColor: 'text-blue-600'
    }
  }
  
  const { icon: Icon, color, iconColor } = config[tipo]
  
  return (
    <div className={`p-3 rounded-lg border ${color}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 ${iconColor} mt-0.5`} />
        <div className="flex-1">
          <p className="text-sm font-medium mb-1">{mensagem}</p>
          <button 
            onClick={onClick}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {acao} →
          </button>
        </div>
      </div>
    </div>
  )
}

export function DashboardInteligencia() {
  const { cardapio } = useApp()
  const [motor] = useState(() => new MotorSugestoes())
  
  const insights = useMemo(() => {
    const todasSugestoes = cardapio
      .filter(p => p.ativo)
      .map(produto => ({
        produto,
        sugestoes: motor.analisarProduto(produto, cardapio)
      }))
      .filter(item => item.sugestoes.length > 0)

    const oportunidades = todasSugestoes
      .filter(item => item.sugestoes.some(s => s.impactoEstimado.lucro > 10))
      .sort((a, b) => {
        const maxLucroA = Math.max(...a.sugestoes.map(s => s.impactoEstimado.lucro))
        const maxLucroB = Math.max(...b.sugestoes.map(s => s.impactoEstimado.lucro))
        return maxLucroB - maxLucroA
      })
      .slice(0, 5)

    const margemBaixa = cardapio.filter(p => p.ativo && p.percentualMargem < 35)
    
    return {
      totalComOportunidades: todasSugestoes.length,
      margemBaixa: margemBaixa.length,
      oportunidades,
      scoreGeral: Math.max(20, 100 - (todasSugestoes.length * 2) - (margemBaixa.length * 3))
    }
  }, [cardapio, motor])

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Insights Gerais */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Insights do Cardápio
        </h3>
        <div className="space-y-3">
          <InsightCard
            tipo="oportunidade"
            mensagem={`${insights.totalComOportunidades} produtos podem ter preços otimizados`}
            acao="Ver produtos"
          />
          <InsightCard
            tipo="alerta"
            mensagem={`${insights.margemBaixa} produtos com margem abaixo de 35%`}
            acao="Revisar"
          />
          <InsightCard
            tipo="sugestao"
            mensagem="Considere criar combos com produtos de alta margem"
            acao="Criar combo"
          />
        </div>
      </div>
      
      {/* Produtos com Melhor Oportunidade */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold mb-4">Maiores Oportunidades</h3>
        <div className="space-y-2">
          {insights.oportunidades.map(({ produto, sugestoes }) => {
            const melhorSugestao = sugestoes[0]
            const lucroAdicional = melhorSugestao.impactoEstimado.lucro
            
            return (
              <div key={produto.id} className="flex justify-between items-center py-2">
                <div>
                  <span className="text-sm font-medium">{produto.nome}</span>
                  <div className="text-xs text-gray-500">
                    {melhorSugestao.tipo.replace('_', ' ')}
                  </div>
                </div>
                <span className="text-green-600 font-bold text-sm">
                  +{lucroAdicional}% lucro
                </span>
              </div>
            )
          })}
          {insights.oportunidades.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Parabéns! Não há oportunidades críticas
            </p>
          )}
        </div>
      </div>
      
      {/* Score de Precificação */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold mb-4">Score de Precificação</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg className="w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="#e5e5e5"
                strokeWidth="8"
              />
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="8"
                strokeDasharray={`${insights.scoreGeral * 3.77} 377`}
                transform="rotate(-90 64 64)"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{insights.scoreGeral}</span>
            </div>
          </div>
        </div>
        <p className="text-center mt-4 text-sm text-gray-600">
          Seu cardápio está {insights.scoreGeral >= 80 ? 'otimizado' : 'com oportunidades de melhoria'}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-bold text-green-600">{cardapio.filter(p => p.percentualMargem >= 50).length}</div>
            <div className="text-gray-500">Alta margem</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-yellow-600">{cardapio.filter(p => p.percentualMargem >= 35 && p.percentualMargem < 50).length}</div>
            <div className="text-gray-500">Margem média</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-red-600">{insights.margemBaixa}</div>
            <div className="text-gray-500">Baixa margem</div>
          </div>
        </div>
      </div>
    </div>
  )
}