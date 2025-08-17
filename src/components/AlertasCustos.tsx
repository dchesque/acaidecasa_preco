'use client'

import { useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { formatCurrency } from '@/utils/formatters'
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Bell,
  ArrowRight,
  X,
  Info,
  Target,
  Zap
} from 'lucide-react'

export interface AlertaCusto {
  id: string
  tipo: 'aumento' | 'reducao' | 'oportunidade' | 'margem_critica'
  severidade: 'baixa' | 'media' | 'alta'
  titulo: string
  descricao: string
  produtos_afetados: string[]
  valor_impacto?: number
  acao_sugerida: string
  data: Date
}

interface AlertaItemProps {
  alerta: AlertaCusto
  onDismiss?: (id: string) => void
  onAction?: (alerta: AlertaCusto) => void
}

function AlertaItem({ alerta, onDismiss, onAction }: AlertaItemProps) {
  const getAlertConfig = () => {
    switch (alerta.tipo) {
      case 'aumento':
        return {
          icon: TrendingUp,
          bgColor: 'bg-red-50 border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          accentColor: 'text-red-600'
        }
      case 'reducao':
        return {
          icon: TrendingDown,
          bgColor: 'bg-green-50 border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          accentColor: 'text-green-600'
        }
      case 'oportunidade':
        return {
          icon: DollarSign,
          bgColor: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          accentColor: 'text-blue-600'
        }
      case 'margem_critica':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-orange-50 border-orange-200',
          iconColor: 'text-orange-600',
          titleColor: 'text-orange-800',
          accentColor: 'text-orange-600'
        }
      default:
        return {
          icon: Info,
          bgColor: 'bg-gray-50 border-gray-200',
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-800',
          accentColor: 'text-gray-600'
        }
    }
  }

  const config = getAlertConfig()
  const Icon = config.icon

  const getSeveridadeBadge = () => {
    const badges = {
      alta: 'bg-red-100 text-red-700 border-red-200',
      media: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      baixa: 'bg-green-100 text-green-700 border-green-200'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${badges[alerta.severidade]}`}>
        {alerta.severidade.charAt(0).toUpperCase() + alerta.severidade.slice(1)}
      </span>
    )
  }

  return (
    <div className={`${config.bgColor} border rounded-lg p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 p-2 rounded-lg bg-white border ${config.iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-semibold ${config.titleColor}`}>
              {alerta.titulo}
            </h4>
            <div className="flex items-center gap-2">
              {getSeveridadeBadge()}
              {onDismiss && (
                <button
                  onClick={() => onDismiss(alerta.id)}
                  className="p-1 rounded-full hover:bg-white/50 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            {alerta.descricao}
          </p>
          
          {alerta.produtos_afetados.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">
                Produtos afetados ({alerta.produtos_afetados.length}):
              </p>
              <div className="flex flex-wrap gap-1">
                {alerta.produtos_afetados.slice(0, 3).map((produto, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/60 rounded-md text-xs text-gray-700"
                  >
                    {produto}
                  </span>
                ))}
                {alerta.produtos_afetados.length > 3 && (
                  <span className="px-2 py-1 bg-white/60 rounded-md text-xs text-gray-500">
                    +{alerta.produtos_afetados.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          )}
          
          {alerta.valor_impacto && (
            <div className="mb-3">
              <span className="text-xs text-gray-500">Impacto estimado: </span>
              <span className={`font-bold ${config.accentColor}`}>
                {formatCurrency(Math.abs(alerta.valor_impacto))}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {alerta.data.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            
            {onAction && (
              <button
                onClick={() => onAction(alerta)}
                className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md bg-white/80 hover:bg-white transition-colors ${config.accentColor}`}
              >
                {alerta.acao_sugerida}
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AlertasCustos() {
  const { cardapio, insumos, fornecedores } = useApp()

  // Gerar alertas baseados nos dados atuais
  const alertas: AlertaCusto[] = useMemo(() => {
    const alertasGerados: AlertaCusto[] = []
    
    // Produtos com margem crítica (abaixo de 30%)
    const produtosCriticos = cardapio.filter(item => 
      item.ativo && item.percentualMargem < 30
    )
    
    if (produtosCriticos.length > 0) {
      alertasGerados.push({
        id: 'margem-critica-' + Date.now(),
        tipo: 'margem_critica',
        severidade: produtosCriticos.length > 5 ? 'alta' : 'media',
        titulo: `${produtosCriticos.length} produtos com margem crítica`,
        descricao: `Produtos com margem abaixo de 30% precisam de revisão urgente de preços`,
        produtos_afetados: produtosCriticos.map(p => p.nome),
        valor_impacto: produtosCriticos.reduce((acc, p) => acc + (p.precoVenda * 0.3 - p.custo), 0),
        acao_sugerida: 'Revisar preços',
        data: new Date()
      })
    }

    // Oportunidades de economia com fornecedores
    const insumosComFornecedores = insumos.filter(insumo => 
      insumo.ativo && insumo.fornecedores && insumo.fornecedores.length > 1
    )
    
    let economiaTotal = 0
    const produtosComEconomia: string[] = []
    
    insumosComFornecedores.forEach(insumo => {
      const precos = insumo.fornecedores?.map(f => f.preco) || []
      const menorPreco = Math.min(...precos)
      const precoAtual = insumo.precoPorGrama
      
      if (precoAtual > menorPreco * 1.1) { // 10% de diferença
        const economia = (precoAtual - menorPreco) * (insumo.quantidadeCompra || 1000)
        economiaTotal += economia
        produtosComEconomia.push(insumo.nome)
      }
    })
    
    if (economiaTotal > 50) {
      alertasGerados.push({
        id: 'oportunidade-fornecedores-' + Date.now(),
        tipo: 'oportunidade',
        severidade: economiaTotal > 200 ? 'alta' : 'media',
        titulo: `Economia de ${formatCurrency(economiaTotal)} disponível`,
        descricao: `Otimize seus fornecedores para reduzir custos significativamente`,
        produtos_afetados: produtosComEconomia,
        valor_impacto: economiaTotal,
        acao_sugerida: 'Ver fornecedores',
        data: new Date()
      })
    }

    // Produtos com alto potencial (margem > 70%)
    const produtosOportunidade = cardapio.filter(item => 
      item.ativo && item.percentualMargem > 70
    )
    
    if (produtosOportunidade.length > 0) {
      alertasGerados.push({
        id: 'alto-potencial-' + Date.now(),
        tipo: 'oportunidade',
        severidade: 'baixa',
        titulo: `${produtosOportunidade.length} produtos com alto potencial`,
        descricao: `Produtos com excelente margem podem ser destacados no marketing`,
        produtos_afetados: produtosOportunidade.map(p => p.nome),
        acao_sugerida: 'Promover produtos',
        data: new Date()
      })
    }

    // Simular variação de custos (aumentos)
    const insumosCaros = insumos.filter(insumo => 
      insumo.ativo && insumo.precoPorGrama > 0.5
    )
    
    if (insumosCaros.length > 0) {
      const produtosAfetados = cardapio.filter(item => 
        item.composicao?.some(comp => 
          insumosCaros.some(insumo => insumo.id === comp.id)
        )
      )
      
      if (produtosAfetados.length > 0) {
        alertasGerados.push({
          id: 'custos-altos-' + Date.now(),
          tipo: 'aumento',
          severidade: 'media',
          titulo: `Monitorar custos de insumos premium`,
          descricao: `Insumos com custo elevado podem impactar ${produtosAfetados.length} produtos`,
          produtos_afetados: produtosAfetados.map(p => p.nome),
          acao_sugerida: 'Monitorar preços',
          data: new Date()
        })
      }
    }

    return alertasGerados
  }, [cardapio, insumos, fornecedores])

  const alertasPorSeveridade = useMemo(() => {
    return {
      alta: alertas.filter(a => a.severidade === 'alta'),
      media: alertas.filter(a => a.severidade === 'media'),
      baixa: alertas.filter(a => a.severidade === 'baixa')
    }
  }, [alertas])

  const handleDismissAlert = (id: string) => {
    // Em uma implementação real, isso salvaria no estado/localStorage
    console.log('Dismissing alert:', id)
  }

  const handleActionAlert = (alerta: AlertaCusto) => {
    // Em uma implementação real, isso redirecionaria para a ação apropriada
    console.log('Taking action on alert:', alerta)
  }

  if (alertas.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Tudo funcionando perfeitamente!
        </h3>
        <p className="text-gray-600">
          Não há alertas de custos ou margens no momento.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Alertas de Custos e Margens
            </h3>
            <p className="text-sm text-gray-500">
              {alertas.length} alertas ativos
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {alertasPorSeveridade.alta.length > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              {alertasPorSeveridade.alta.length} alta prioridade
            </span>
          )}
          {alertasPorSeveridade.media.length > 0 && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
              {alertasPorSeveridade.media.length} média prioridade
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Alertas de alta prioridade primeiro */}
        {alertasPorSeveridade.alta.map(alerta => (
          <AlertaItem
            key={alerta.id}
            alerta={alerta}
            onDismiss={handleDismissAlert}
            onAction={handleActionAlert}
          />
        ))}
        
        {/* Alertas de média prioridade */}
        {alertasPorSeveridade.media.map(alerta => (
          <AlertaItem
            key={alerta.id}
            alerta={alerta}
            onDismiss={handleDismissAlert}
            onAction={handleActionAlert}
          />
        ))}
        
        {/* Alertas de baixa prioridade */}
        {alertasPorSeveridade.baixa.map(alerta => (
          <AlertaItem
            key={alerta.id}
            alerta={alerta}
            onDismiss={handleDismissAlert}
            onAction={handleActionAlert}
          />
        ))}
      </div>
    </div>
  )
}