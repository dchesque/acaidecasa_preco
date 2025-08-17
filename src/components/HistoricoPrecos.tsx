'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { formatCurrency } from '@/utils/formatters'
import { MargemBadge } from '@/utils/margemUtils'
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  User,
  Package,
  X,
  Eye,
  Table
} from 'lucide-react'

export interface HistoricoPreco {
  id: string
  produtoId: string
  produtoNome: string
  data: Date
  custoAnterior: number
  custoNovo: number
  precoAnterior: number
  precoNovo: number
  margemAnterior: number
  margemNova: number
  motivo?: string
  usuario?: string
  fornecedorAfetado?: string
  tipo: 'manual' | 'automatico' | 'lote' | 'template'
}

interface HistoricoPrecosProps {
  produtoId?: string
  isOpen: boolean
  onClose: () => void
}

interface TimelineEventoProps {
  evento: HistoricoPreco
  isFirst: boolean
}

interface GraficoEvolucaoProps {
  dados: HistoricoPreco[]
  produtoNome: string
}

function VariacaoIndicator({ 
  valor, 
  percentual, 
  tipo = 'preco' 
}: { 
  valor: number
  percentual: number
  tipo?: 'preco' | 'margem' 
}) {
  const isPositivo = valor > 0
  const isNeutro = Math.abs(valor) < 0.01
  
  if (isNeutro) {
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <Minus className="h-4 w-4" />
        <span className="text-sm">Sem alteração</span>
      </div>
    )
  }
  
  return (
    <div className={`flex items-center gap-1 ${
      isPositivo ? 'text-green-600' : 'text-red-600'
    }`}>
      {isPositivo ? (
        <ArrowUpRight className="h-4 w-4" />
      ) : (
        <ArrowDownRight className="h-4 w-4" />
      )}
      <div className="text-sm">
        <span className="font-medium">
          {isPositivo ? '+' : ''}{tipo === 'preco' ? formatCurrency(valor) : `${valor.toFixed(1)}%`}
        </span>
        <span className="text-xs ml-1">
          ({isPositivo ? '+' : ''}{percentual.toFixed(1)}%)
        </span>
      </div>
    </div>
  )
}

function TimelineEvento({ evento, isFirst }: TimelineEventoProps) {
  const diferencaPreco = evento.precoNovo - evento.precoAnterior
  const diferencaMargem = evento.margemNova - evento.margemAnterior
  const percentualPreco = evento.precoAnterior > 0 
    ? (diferencaPreco / evento.precoAnterior) * 100 
    : 0

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'manual': return 'bg-blue-500'
      case 'automatico': return 'bg-green-500'
      case 'lote': return 'bg-purple-500'
      case 'template': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'manual': return 'Ajuste Manual'
      case 'automatico': return 'Ajuste Automático'
      case 'lote': return 'Alteração em Lote'
      case 'template': return 'Aplicação de Template'
      default: return 'Ajuste'
    }
  }

  return (
    <div className="flex gap-4 mb-6 relative">
      {/* Círculo no timeline */}
      <div className="relative">
        <div className={`
          w-4 h-4 rounded-full z-10 mt-1.5 border-2 border-white shadow-md
          ${isFirst ? getTipoColor(evento.tipo) : 'bg-gray-400'}
        `} />
        {!isFirst && (
          <div className="absolute top-0 left-1/2 -translate-x-0.5 w-0.5 h-6 bg-gray-300 -mt-6" />
        )}
      </div>
      
      {/* Card do evento */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-gray-500">
                {evento.data.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getTipoColor(evento.tipo)}`}>
                {getTipoLabel(evento.tipo)}
              </span>
            </div>
            <p className="font-semibold text-gray-900">
              {evento.motivo || 'Ajuste de preço'}
            </p>
            {evento.usuario && (
              <div className="flex items-center gap-1 mt-1">
                <User className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">{evento.usuario}</span>
              </div>
            )}
            {evento.fornecedorAfetado && (
              <div className="flex items-center gap-1 mt-1">
                <Package className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  Fornecedor: {evento.fornecedorAfetado}
                </span>
              </div>
            )}
          </div>
          
          <VariacaoIndicator 
            valor={diferencaPreco}
            percentual={percentualPreco}
            tipo="preco"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-gray-600 text-xs font-medium">CUSTO</span>
            <div className="mt-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Anterior:</span>
                <span className="font-medium">{formatCurrency(evento.custoAnterior)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Novo:</span>
                <span className="font-medium">{formatCurrency(evento.custoNovo)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <span className="text-green-700 text-xs font-medium">PREÇO</span>
            <div className="mt-1">
              <div className="flex items-center justify-between">
                <span className="text-green-600">Anterior:</span>
                <span className="font-medium">{formatCurrency(evento.precoAnterior)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-600">Novo:</span>
                <span className="font-bold text-green-700">{formatCurrency(evento.precoNovo)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3">
            <span className="text-purple-700 text-xs font-medium">MARGEM</span>
            <div className="mt-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-purple-600">Anterior:</span>
                <MargemBadge margem={evento.margemAnterior} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-600">Nova:</span>
                <MargemBadge margem={evento.margemNova} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GraficoEvolucao({ dados, produtoNome }: GraficoEvolucaoProps) {
  const [viewMode, setViewMode] = useState<'line' | 'bar'>('line')
  
  const dadosOrdenados = useMemo(() => {
    return dados.sort((a, b) => a.data.getTime() - b.data.getTime())
  }, [dados])

  const maxPreco = Math.max(...dadosOrdenados.map(d => Math.max(d.precoAnterior, d.precoNovo)))
  const minPreco = Math.min(...dadosOrdenados.map(d => Math.min(d.precoAnterior, d.precoNovo)))
  const rangePreco = maxPreco - minPreco

  // Gerar pontos para o SVG
  const pontosCusto = dadosOrdenados.map((d, i) => {
    const x = (i / (dadosOrdenados.length - 1)) * 100
    const y = ((maxPreco - d.custoNovo) / rangePreco) * 80 + 10
    return `${x},${y}`
  }).join(' ')

  const pontosPreco = dadosOrdenados.map((d, i) => {
    const x = (i / (dadosOrdenados.length - 1)) * 100
    const y = ((maxPreco - d.precoNovo) / rangePreco) * 80 + 10
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">
          Evolução de Preços - {produtoNome}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'line' ? 'bar' : 'line')}
            className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <BarChart3 className="h-4 w-4" />
            {viewMode === 'line' ? 'Ver Barras' : 'Ver Linha'}
          </button>
        </div>
      </div>
      
      <div className="relative h-64">
        {/* Eixo Y - Valores */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>{formatCurrency(maxPreco)}</span>
          <span>{formatCurrency(maxPreco * 0.75 + minPreco * 0.25)}</span>
          <span>{formatCurrency(maxPreco * 0.5 + minPreco * 0.5)}</span>
          <span>{formatCurrency(maxPreco * 0.25 + minPreco * 0.75)}</span>
          <span>{formatCurrency(minPreco)}</span>
        </div>
        
        {/* Área do gráfico */}
        <div className="ml-12 h-full relative">
          {viewMode === 'line' ? (
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="25" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
              
              {/* Área de margem (entre custo e preço) */}
              <polygon
                points={`${pontosCusto} ${pontosPreco.split(' ').reverse().join(' ')}`}
                fill="rgba(34, 197, 94, 0.1)"
                stroke="none"
              />
              
              {/* Linha de custo */}
              <polyline
                points={pontosCusto}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              
              {/* Linha de preço */}
              <polyline
                points={pontosPreco}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              
              {/* Pontos de dados */}
              {dadosOrdenados.map((d, i) => {
                const x = (i / (dadosOrdenados.length - 1)) * 100
                const yPreco = ((maxPreco - d.precoNovo) / rangePreco) * 80 + 10
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={yPreco}
                    r="3"
                    fill="#fff"
                    stroke="#10b981"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                )
              })}
            </svg>
          ) : (
            <div className="flex items-end justify-between h-full gap-2">
              {dadosOrdenados.map((d, i) => {
                const alturaCusto = ((d.custoNovo - minPreco) / rangePreco) * 100
                const alturaPreco = ((d.precoNovo - minPreco) / rangePreco) * 100
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full relative">
                      <div 
                        className="w-full bg-red-400 rounded-t"
                        style={{ height: `${alturaCusto}%` }}
                      />
                      <div 
                        className="w-full bg-green-400 rounded-t"
                        style={{ height: `${alturaPreco - alturaCusto}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 transform -rotate-45 origin-bottom-left">
                      {d.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        
        {/* Eixo X - Datas */}
        {viewMode === 'line' && (
          <div className="flex justify-between mt-2 text-xs text-gray-500 ml-12">
            {dadosOrdenados.map((d, i) => (
              <span key={i}>
                {d.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Legenda */}
      <div className="flex gap-4 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-sm">Custo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-sm">Preço de Venda</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-3 bg-green-100 border border-green-300" />
          <span className="text-sm">Margem</span>
        </div>
      </div>
    </div>
  )
}

export default function HistoricoPrecos({ produtoId, isOpen, onClose }: HistoricoPrecosProps) {
  const { cardapio } = useApp()
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroPeriodo, setFiltroPeriodo] = useState<number>(30)
  const [viewMode, setViewMode] = useState<'timeline' | 'grafico'>('timeline')
  
  // Mock de dados de histórico para demonstração
  const historicoMock: HistoricoPreco[] = useMemo(() => {
    if (!produtoId) return []
    
    const produto = cardapio.find(p => p.id === produtoId)
    if (!produto) return []
    
    const eventos: HistoricoPreco[] = []
    const agora = new Date()
    
    // Gerar eventos históricos simulados
    for (let i = 0; i < 8; i++) {
      const data = new Date(agora.getTime() - (i * 7 * 24 * 60 * 60 * 1000)) // Semanalmente
      const variacao = (Math.random() - 0.5) * 0.2 // ±10%
      const precoBase = produto.precoVenda * (1 + variacao)
      
      eventos.push({
        id: `hist_${i}`,
        produtoId: produto.id,
        produtoNome: produto.nome,
        data,
        custoAnterior: produto.custo * 0.95,
        custoNovo: produto.custo,
        precoAnterior: precoBase * 0.95,
        precoNovo: precoBase,
        margemAnterior: 45 + Math.random() * 10,
        margemNova: produto.percentualMargem + (Math.random() - 0.5) * 10,
        motivo: i === 0 ? 'Ajuste manual de preço' :
               i === 1 ? 'Aplicação de template Premium' :
               i === 2 ? 'Aumento de custo do fornecedor' :
               i === 3 ? 'Alteração em lote' :
               `Ajuste automático ${i}`,
        usuario: i % 2 === 0 ? 'Admin' : 'Gerente',
        fornecedorAfetado: i === 2 ? 'Fornecedor A' : undefined,
        tipo: i === 0 ? 'manual' :
              i === 1 ? 'template' :
              i === 2 ? 'automatico' :
              i === 3 ? 'lote' : 'manual'
      })
    }
    
    return eventos.sort((a, b) => b.data.getTime() - a.data.getTime())
  }, [produtoId, cardapio])
  
  const historicoFiltrado = useMemo(() => {
    let filtrado = historicoMock
    
    // Filtro por tipo
    if (filtroTipo !== 'todos') {
      filtrado = filtrado.filter(h => h.tipo === filtroTipo)
    }
    
    // Filtro por período
    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() - filtroPeriodo)
    filtrado = filtrado.filter(h => h.data >= dataLimite)
    
    return filtrado
  }, [historicoMock, filtroTipo, filtroPeriodo])
  
  const produto = cardapio.find(p => p.id === produtoId)
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Histórico de Preços
            </h2>
            {produto && (
              <p className="text-gray-600 mt-1">
                {produto.nome} - {formatCurrency(produto.precoVenda)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-gray-300">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-2 text-sm rounded-l-lg flex items-center gap-2 ${
                  viewMode === 'timeline' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Clock className="h-4 w-4" />
                Timeline
              </button>
              <button
                onClick={() => setViewMode('grafico')}
                className={`px-3 py-2 text-sm rounded-r-lg flex items-center gap-2 ${
                  viewMode === 'grafico' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Gráfico
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Filtros */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="todos">Todos os tipos</option>
              <option value="manual">Manual</option>
              <option value="automatico">Automático</option>
              <option value="lote">Em lote</option>
              <option value="template">Template</option>
            </select>
            
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={7}>Última semana</option>
              <option value={30}>Último mês</option>
              <option value={90}>Últimos 3 meses</option>
              <option value={180}>Últimos 6 meses</option>
              <option value={365}>Último ano</option>
            </select>
            
            <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              <Download className="h-4 w-4" />
              Exportar
            </button>
            
            <div className="ml-auto text-sm text-gray-500">
              {historicoFiltrado.length} eventos encontrados
            </div>
          </div>
        </div>
        
        {/* Conteúdo */}
        <div className="flex-1 overflow-auto p-6">
          {historicoFiltrado.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum histórico encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Não há eventos de alteração de preço para os filtros selecionados.
              </p>
            </div>
          ) : viewMode === 'timeline' ? (
            <div className="relative">
              {/* Linha vertical conectando eventos */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />
              
              {historicoFiltrado.map((evento, index) => (
                <TimelineEvento
                  key={evento.id}
                  evento={evento}
                  isFirst={index === 0}
                />
              ))}
            </div>
          ) : (
            produto && <GraficoEvolucao dados={historicoFiltrado} produtoNome={produto.nome} />
          )}
        </div>
      </div>
    </div>
  )
}